import { minimaxClient } from './minimaxClient.js';
import fs from 'fs/promises';
import path from 'path';

export interface IdentifiedProduct {
  name: string;
  category: string;
  position: {
    x: number; // percentage from left (0-100)
    y: number; // percentage from top (0-100)
  };
  size: {
    width: number; // percentage of image width
    height: number; // percentage of image height
  };
  confidence: number; // 0-1
  description: string;
}

export interface ProductIdentificationResult {
  products: IdentifiedProduct[];
  roomType: string;
  style: string;
}

const parseJsonFromModelContent = (content: unknown) => {
  if (!content) {
    throw new Error('Empty model content');
  }

  if (typeof content === 'object') {
    return content;
  }

  if (typeof content !== 'string') {
    throw new Error(`Unexpected model content type: ${typeof content}`);
  }

  let text = content;

  text = text.replace(/<think>[\s\S]*?<\/think>/g, '');
  text = text.replace(/<\/?think>/g, '');
  text = text.replace(/```(?:json)?/gi, '');
  text = text.replace(/```/g, '');
  text = text.trim();

  const tryParse = (candidate: string) => {
    return JSON.parse(candidate);
  };

  if (text.startsWith('{') || text.startsWith('[')) {
    return tryParse(text);
  }

  const firstObject = text.indexOf('{');
  const lastObject = text.lastIndexOf('}');
  if (firstObject !== -1 && lastObject !== -1 && lastObject > firstObject) {
    return tryParse(text.slice(firstObject, lastObject + 1));
  }

  const firstArray = text.indexOf('[');
  const lastArray = text.lastIndexOf(']');
  if (firstArray !== -1 && lastArray !== -1 && lastArray > firstArray) {
    return tryParse(text.slice(firstArray, lastArray + 1));
  }

  throw new Error(`Could not locate JSON in model output: ${text.slice(0, 200)}`);
};

export const identifyProductsInImage = async (
  imageUrl: string,
  existingProducts: { name: string; category: string; priceRange: string; searchQuery: string }[]
): Promise<ProductIdentificationResult> => {
  const client = minimaxClient();

  // Read the image file and convert to base64
  const imagePath = path.join(process.cwd(), 'public', imageUrl);
  let imageBase64: string;
  
  try {
    const imageBuffer = await fs.readFile(imagePath);
    imageBase64 = imageBuffer.toString('base64');
  } catch (error) {
    // If local file doesn't exist, try to fetch from URL
    try {
      const response = await fetch(imageUrl);
      const arrayBuffer = await response.arrayBuffer();
      imageBase64 = Buffer.from(arrayBuffer).toString('base64');
    } catch (fetchError) {
      throw new Error(`Failed to load image: ${imageUrl}`);
    }
  }

  const existingProductsList = existingProducts.map(p => 
    `- ${p.name} (${p.category})`
  ).join('\n');

  let response;
  try {
    response = await client.post(
      '/chat/completions',
      {
        model: 'MiniMax-M2.5',
        messages: [
          {
            role: 'system',
            content: 'You are an expert in interior design and product identification. Analyze room images and identify furniture and decor items with their precise positions. Always respond in valid JSON only.',
          },
          {
            role: 'user',
            content: `Analyze this dorm room image and identify the following products with their exact positions:
${existingProductsList}

For each product, provide:
1. Exact position as percentage from left (x) and top (y) of the image
2. Size as percentage of image width and height
3. Confidence score (0-1)
4. Brief description of what you see

Also identify:
- Room type (bedroom, living room, etc.)
- Overall style of the room

Respond ONLY with this exact JSON structure:
{
  "products": [
    {
      "name": "Exact product name from the list above",
      "category": "Product category",
      "position": { "x": 45.5, "y": 30.2 },
      "size": { "width": 15.0, "height": 20.5 },
      "confidence": 0.92,
      "description": "Brief description of the item"
    }
  ],
  "roomType": "bedroom",
  "style": "modern minimalist"
}

Use coordinates 0-100 for percentages. Be as precise as possible with positions.`,
          },
        ],
        max_tokens: 2000,
        temperature: 0.3,
      }
    );
  } catch (error) {
    const err = error as {
      response?: {
        status?: number;
        data?: {
          message?: string;
          error?: string;
        };
      };
      message?: string;
    };
    const status = err?.response?.status;
    const rawDetail = err?.response?.data?.message ?? err?.response?.data?.error ?? err?.response?.data ?? err?.message;
    let detail: string;
    if (typeof rawDetail === 'string') {
      detail = rawDetail;
    } else {
      try {
        detail = JSON.stringify(rawDetail);
      } catch {
        detail = String(rawDetail);
      }
    }
    throw new Error(`MiniMax product identification failed${status ? ` (${status})` : ''}: ${detail}`);
  }

  try {
    const content = response.data.choices[0].message.content;
    const result = parseJsonFromModelContent(content) as ProductIdentificationResult;
    
    // Validate the result structure
    if (!result.products || !Array.isArray(result.products)) {
      throw new Error('Invalid response format: products array missing');
    }
    
    // Filter out low confidence results
    result.products = result.products.filter(p => p.confidence > 0.5);
    
    return result;
  } catch (error) {
    console.error('Error parsing product identification response:', error);
    throw new Error('Failed to parse product identification results');
  }
};

// Fallback function that positions products in a grid pattern if AI identification fails
export const getFallbackProductPositions = (
  products: { name: string; category: string; priceRange: string; searchQuery: string }[]
): ProductIdentificationResult => {
  const positions: IdentifiedProduct[] = products.map((product, index) => {
    // Create a grid layout
    const cols = 3;
    const row = Math.floor(index / cols);
    const col = index % cols;
    
    const x = 20 + (col * 25); // 20%, 45%, 70%
    const y = 25 + (row * 30); // 25%, 55%, 85%
    
    return {
      name: product.name,
      category: product.category,
      position: { x, y },
      size: { width: 15, height: 15 },
      confidence: 0.7,
      description: `${product.name} - ${product.category}`,
    };
  });

  return {
    products: positions,
    roomType: 'bedroom',
    style: 'college dorm',
  };
};
