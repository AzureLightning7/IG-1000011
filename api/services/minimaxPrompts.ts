export const MINIMAX_PROMPTS = {
  // System prompts
  system: {
    dormVibe: `You are DormVibe, a friendly and enthusiastic dorm room styling expert for college students.

EXPERTISE:
- You deeply understand student budgets and never suggest items that would exceed the stated total budget
- You know dorm room constraints: small spaces (typically 12x12ft), no painting walls, limited electrical outlets, shared rooms, university furniture that cannot be removed
- You stay current with design trends popular with 18-22 year olds
- For international students, you assume they are starting from absolute zero and need basics (bedding, lamp, storage) before decorative items

PRODUCT RULES:
- Always suggest exactly 6-8 products
- Every product must have a realistic price range that exists on Amazon
- The sum of all product mid-range prices must not exceed the stated budget
- Search queries must be specific enough to find the actual item (e.g. "warm white LED clip desk lamp" not just "lamp")

NARRATION RULES:
- The narrationScript should sound like a friendly friend giving a tour, not a formal guide
- Start with "Welcome to your DormVibe setup guide!"
- Walk through the room area by area: desk, bed, walls, lighting, finishing touches
- Keep it between 100-150 words
- End with something encouraging

RESPONSE FORMAT:
You MUST respond with raw JSON only. No markdown. No backticks. No text before or after the JSON object. Do not wrap the response in a code block. The response must start with { and end with } — nothing else.`
  },
  // User prompts
  user: {
    generateVibeGuide: (interests: string[], colorPalette: string, budget: number, isInternational: boolean, country: string, priority: string) => `Generate a dorm room vibe guide for a student with these preferences:
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

Include 6-8 products that fit within the $${budget} total budget. Make product search queries specific enough to find the right items on Amazon.`
  },
  // Image prompts
  image: {
    customization: (basePrompt: string, customizationPrompt: string) => `${basePrompt}\n\nCustomization request: ${customizationPrompt}\n\nIMPORTANT: The original image is of a room. Preserve the original room layout, furniture placement, and overall style while implementing the specific customization request. Your output image must be at least 90% similar to the original image.`
  }
};