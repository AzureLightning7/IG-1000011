import { minimaxClient } from './minimaxClient.js';
import { Product, IdentifiedProduct } from '../../shared/types.js';

interface IdentifyProductsRequest {
  imageUrl: string;
  products: Product[];
}

interface IdentifyProductsResponse {
  products: IdentifiedProduct[];
  roomType: string;
  style: string;
}

export const identifyProducts = async (data: IdentifyProductsRequest): Promise<IdentifyProductsResponse> => {
  const { imageUrl, products } = data;
  const client = minimaxClient();

  try {
    // Prepare the prompt for MiniMax AI
    const prompt = `
You are an AI assistant specialized in interior design and product identification. 

Your task is to analyze the room image at the following URL and identify the positions of the provided products:

Image URL: ${imageUrl}

Products to identify:
${products.map((product, index) => `${index + 1}. ${product.name} (${product.category})`).join('\n')}

For each product, provide:
1. Precise position as percentages (x, y coordinates) where the product is located in the image
2. Size as percentages (width, height) of the product in the image
3. Confidence score (0-100%) for your identification
4. Brief description of the product as it appears in the image

Return the results in JSON format with the following structure:
{
  "products": [
    {
      "name": "Product name",
      "category": "Product category",
      "priceRange": "Price range",
      "searchQuery": "Search query",
      "position": { "x": 0-100, "y": 0-100 },
      "size": { "width": 0-100, "height": 0-100 },
      "confidence": 0-100,
      "description": "Brief description"
    }
  ],
  "roomType": "Type of room (e.g., bedroom, living room)",
  "style": "Design style (e.g., modern, minimalist, bohemian)"
}

Ensure all positions are valid percentages (0-100) and that the JSON is properly formatted.
Only include products you can confidently identify (confidence > 50%).
If you can't identify a product, omit it from the results.
    `;

    // Call MiniMax AI
    const response = await client.post('/chat/completions', {
      model: 'MiniMax-M2.5',
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 2000
    });

    // Process the response
    const aiResponse = response.data;
    const statusCode = aiResponse?.base_resp?.status_code;
    
    if (typeof statusCode === 'number' && statusCode !== 0) {
      throw new Error(aiResponse?.base_resp?.status_msg ?? 'AI request failed');
    }

    const aiContent = aiResponse?.data?.choices?.[0]?.message?.content;
    
    if (!aiContent) {
      throw new Error('No content returned from AI');
    }

    // Extract JSON from the response
    const jsonMatch = aiContent.match(/```json[\s\S]*?```/);
    const jsonString = jsonMatch ? jsonMatch[0].replace(/```json|```/g, '') : aiContent;

    let parsedResponse: IdentifyProductsResponse;
    
    try {
      parsedResponse = JSON.parse(jsonString);
    } catch {
      throw new Error('Invalid JSON response from AI');
    }

    // Validate and filter results
    const validProducts = (parsedResponse.products || []).filter((product) => {
      return (
        product.position?.x !== undefined &&
        product.position?.y !== undefined &&
        product.size?.width !== undefined &&
        product.size?.height !== undefined &&
        product.confidence !== undefined &&
        product.confidence > 50 &&
        product.position.x >= 0 &&
        product.position.x <= 100 &&
        product.position.y >= 0 &&
        product.position.y <= 100 &&
        product.size.width > 0 &&
        product.size.width <= 100 &&
        product.size.height > 0 &&
        product.size.height <= 100
      );
    });

    // If no products were identified, use fallback positions
    if (validProducts.length === 0) {
      return {
        products: getFallbackPositions(products),
        roomType: parsedResponse.roomType || 'Unknown',
        style: parsedResponse.style || 'Unknown'
      };
    }

    return {
      products: validProducts,
      roomType: parsedResponse.roomType || 'Unknown',
      style: parsedResponse.style || 'Unknown'
    };
  } catch (error) {
    console.error('Product identification error:', error);
    // Return fallback positions on error
    return {
      products: getFallbackPositions(products),
      roomType: 'Unknown',
      style: 'Unknown'
    };
  }
};

// Fallback grid positioning
const getFallbackPositions = (products: Product[]): IdentifiedProduct[] => {
  const positions = [
    { x: 20, y: 25 },
    { x: 45, y: 25 },
    { x: 70, y: 25 },
    { x: 20, y: 55 },
    { x: 45, y: 55 },
    { x: 70, y: 55 },
    { x: 20, y: 85 },
    { x: 45, y: 85 },
    { x: 70, y: 85 }
  ];

  return products.map((product, index) => ({
    ...product,
    position: positions[index % positions.length],
    size: { width: 15, height: 15 },
    confidence: 100,
    description: product.name
  }));
};