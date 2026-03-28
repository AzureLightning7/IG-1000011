import { QuizData, GeneratedContent } from '../../shared/types.js';
import { minimaxClient } from './minimaxClient.js';

const isValidProduct = (product: unknown): boolean => {
  if (!product || typeof product !== 'object') return false;
  const p = product as Record<string, unknown>;
  return (
    typeof p.name === 'string' &&
    typeof p.category === 'string' &&
    typeof p.priceRange === 'string' &&
    typeof p.searchQuery === 'string'
  );
};

const isValidGeneratedContent = (content: unknown): content is GeneratedContent => {
  if (!content || typeof content !== 'object') return false;
  const c = content as Record<string, unknown>;
  
  if (typeof c.vibeName !== 'string') return false;
  if (typeof c.description !== 'string') return false;
  if (typeof c.narrationScript !== 'string') return false;
  if (typeof c.imagePrompt !== 'string') return false;
  
  if (!Array.isArray(c.layoutTips)) return false;
  if (!c.layoutTips.every((tip) => typeof tip === 'string')) return false;
  
  if (!Array.isArray(c.products)) return false;
  if (!c.products.every(isValidProduct)) return false;
  
  return true;
};

const parseJsonFromModelContent = (content: unknown) => {
  if (!content) {
    throw new Error('Empty model content');
  }

  if (typeof content === 'object') {
    if (!isValidGeneratedContent(content)) {
      throw new Error('Invalid content schema: object does not match GeneratedContent structure');
    }
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

  const tryParse = (candidate: string): unknown => {
    try {
      return JSON.parse(candidate);
    } catch (originalError) {
      console.log('JSON parse failed, attempting repair...');
      
      let repaired = candidate;
      
      repaired = repaired.replace(/,\s*}/g, '}');
      repaired = repaired.replace(/,\s*]/g, ']');
      
      const fixUnescapedQuotes = (str: string): string => {
        let result = '';
        let inString = false;
        let escapeNext = false;
        
        for (let i = 0; i < str.length; i++) {
          const char = str[i];
          
          if (escapeNext) {
            result += char;
            escapeNext = false;
            continue;
          }
          
          if (char === '\\') {
            result += char;
            escapeNext = true;
            continue;
          }
          
          if (char === '"') {
            if (inString) {
              const nextChar = str[i + 1];
              if (nextChar && !['}', ']', ',', ':'].includes(nextChar)) {
                result += '\\"';
              } else {
                result += char;
                inString = false;
              }
            } else {
              const prevChar = str[i - 1];
              if (prevChar && !['{', '}', ',', '[', ']', ':'].includes(prevChar)) {
                result += '\\"';
              } else {
                result += char;
                inString = true;
              }
            }
          } else {
            result += char;
          }
        }
        
        return result;
      };
      
      repaired = fixUnescapedQuotes(repaired);
      
      try {
        return JSON.parse(repaired);
      } catch {
        const lastBrace = repaired.lastIndexOf('}');
        const lastBracket = repaired.lastIndexOf(']');
        const lastValidEnd = Math.max(lastBrace, lastBracket);
        
        if (lastValidEnd > 0) {
          let truncated = repaired.slice(0, lastValidEnd + 1);
          
          let openBraces = 0;
          let openBrackets = 0;
          for (const char of truncated) {
            if (char === '{') openBraces++;
            if (char === '}') openBraces--;
            if (char === '[') openBrackets++;
            if (char === ']') openBrackets--;
          }
          
          while (openBrackets > 0) {
            truncated += ']';
            openBrackets--;
          }
          while (openBraces > 0) {
            truncated += '}';
            openBraces--;
          }
          
          try {
            return JSON.parse(truncated);
          } catch {
            // Continue to throw original error
          }
        }
        
        console.error('JSON repair failed. Content around error position:', repaired.slice(Math.max(0, 2200), 2300));
        throw originalError;
      }
    }
  };

  let parsed: unknown;

  if (text.startsWith('{') || text.startsWith('[')) {
    parsed = tryParse(text);
  } else {
    const firstObject = text.indexOf('{');
    const lastObject = text.lastIndexOf('}');
    if (firstObject !== -1 && lastObject !== -1 && lastObject > firstObject) {
      parsed = tryParse(text.slice(firstObject, lastObject + 1));
    } else {
      const firstArray = text.indexOf('[');
      const lastArray = text.lastIndexOf(']');
      if (firstArray !== -1 && lastArray !== -1 && lastArray > firstArray) {
        parsed = tryParse(text.slice(firstArray, lastArray + 1));
      } else {
        throw new Error(`Could not locate JSON in model output: ${text.slice(0, 200)}`);
      }
    }
  }

  if (!isValidGeneratedContent(parsed)) {
    console.error('Parsed content:', JSON.stringify(parsed, null, 2).slice(0, 500));
    throw new Error('Parsed content does not match expected schema');
  }

  return parsed;
};

export const generateText = async (quizData: QuizData): Promise<GeneratedContent> => {
  const { interests, colorPalette, budget, isInternational, country, priority } = quizData;
  const client = minimaxClient();

  let response;
  try {
    response = await client.post(
      '/chat/completions',
      {
        model: 'MiniMax-M2.5',
        messages: [
          {
            role: 'system',
            content:
              'You are DormVibe, a friendly dorm room styling expert for college students. You understand student budgets, dorm room constraints (small spaces, no painting walls, limited outlets), and current design trends for 18-22 year olds. For international students, account for starting from zero. Always respond in valid JSON only — no markdown, no backticks, no explanation outside the JSON.',
          },
          {
            role: 'user',
            content: `Generate a dorm room vibe guide for a student with these preferences:
- Interests: ${interests.join(', ')}
- Color palette: ${colorPalette}
- Budget: $${budget}
- Student type: ${isInternational ? 'International student from ' + country : 'Domestic student'}
- Priority: ${priority}

Respond ONLY with this exact JSON structure:
{
  "vibeName": "A creative 2-3 word name for this aesthetic",
  "description": "2-3 sentence overview of the vibe",
  "narrationScript": "A friendly 100-150 word audio walkthrough script. Start with 'Welcome to your DormVibe setup guide!' and walk through the room section by section. End with an encouraging sign-off.",
  "imagePrompt": "A detailed prompt for generating a mood board image of this dorm room. Include specific furniture, decorations, lighting, colors, textures, and camera angle. Be very descriptive.",
  "layoutTips": ["tip 1", "tip 2", "tip 3"],
  "products": [
    {
      "name": "Product name",
      "category": "Lighting|Bedding|Desk|Wall Decor|Storage|Plants|Textiles|Tech",
      "priceRange": "$XX-$XX",
      "searchQuery": "specific Amazon search query for this exact product"
    }
  ]
}

Include 6-8 products that fit within the $${budget} total budget. Make product search queries specific enough to find the right items on Amazon.`,
          },
        ],
        max_tokens: 4000,
        temperature: 0.8,
      }
    );
  } catch (error) {
    const err = error as any;
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
    throw new Error(`MiniMax text generation failed${status ? ` (${status})` : ''}: ${detail}`);
  }

  try {
    const aiResponse = response.data;
    
    console.log('MiniMax response structure:', JSON.stringify(aiResponse, null, 2).slice(0, 1000));
    
    const statusCode = aiResponse?.base_resp?.status_code;
    
    if (typeof statusCode === 'number' && statusCode !== 0) {
      throw new Error(aiResponse?.base_resp?.status_msg ?? 'AI request failed');
    }

    let content: unknown = null;
    
    if (aiResponse?.data?.choices?.[0]?.message?.content) {
      content = aiResponse.data.choices[0].message.content;
    } else if (aiResponse?.choices?.[0]?.message?.content) {
      content = aiResponse.choices[0].message.content;
    } else if (aiResponse?.content) {
      content = aiResponse.content;
    } else if (aiResponse?.text) {
      content = aiResponse.text;
    }
    
    if (!content) {
      console.error('Could not find content in response. Available keys:', Object.keys(aiResponse || {}));
      throw new Error('No content returned from AI');
    }
    
    console.log('Extracted content type:', typeof content);
    console.log('Content length:', typeof content === 'string' ? content.length : 'N/A');
    console.log('Content preview:', typeof content === 'string' ? content.slice(0, 200) : JSON.stringify(content).slice(0, 200));
    
    return parseJsonFromModelContent(content) as GeneratedContent;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Error parsing MiniMax text generation response:', error);
    throw new Error(`Failed to parse text generation results: ${errorMessage}`);
  }
};
