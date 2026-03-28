import { QuizData, GeneratedContent } from '../../common/types.js';
import { minimaxClient } from './minimaxClient.js';

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
        max_tokens: 2000,
        temperature: 0.8,
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
    throw new Error(`MiniMax text generation failed${status ? ` (${status})` : ''}: ${detail}`);
  }

  try {
    const content = response.data.choices[0].message.content;
    return parseJsonFromModelContent(content) as GeneratedContent;
  } catch (error) {
    console.error('Error parsing MiniMax text generation response:', error);
    throw new Error('Failed to parse text generation results');
  }
};
