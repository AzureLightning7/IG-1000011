export const MINIMAX_PROMPTS = {
  // System prompts
  system: {
    dormVibe: 'You are DormVibe, a friendly dorm room styling expert for college students. You understand student budgets, dorm room constraints (small spaces, no painting walls, limited outlets), and current design trends for 18-22 year olds. For international students, account for starting from zero. Always respond in valid JSON only — no markdown, no backticks, no explanation outside the JSON.'
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