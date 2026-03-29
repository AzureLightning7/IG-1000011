# Plan: Implement Claude's Suggested System Prompt and Code Changes

## Overview
This plan analyzes Claude's suggested improvements and outlines the refactoring needed to implement them.

## Analysis of Suggested Changes

### 1. Enhanced System Prompt
**Current:** Basic system prompt with general instructions
**Suggested:** More detailed prompt with specific sections:
- EXPERTISE section (budget, constraints, trends, international students)
- PRODUCT RULES section (6-8 products, price validation, search queries)
- NARRATION RULES section (tone, structure, word count)
- RESPONSE FORMAT section (strict JSON requirements)

### 2. Code Changes
**Current:** Complex `parseJsonFromModelContent()` function with extensive JSON repair logic
**Suggested:** Simpler approach using regex to strip markdown code blocks before parsing

## Impact Assessment

### What Will Be Affected:
1. **api/services/textGen.ts** - System prompt and parsing logic will change
2. **api/services/minimaxPrompts.ts** - Will be recreated with the enhanced system prompt
3. **shared/types.ts** - No changes needed (schema remains compatible)
4. **Frontend components** - No changes needed (API response format unchanged)

### Benefits:
- Better AI responses with clearer guidelines
- Simpler, more maintainable parsing code
- More consistent product recommendations
- Better narration quality

### Risks:
- The simplified parsing might be less robust than current implementation
- May need to keep some repair logic as fallback

## Implementation Steps

### Step 1: Recreate minimaxPrompts.ts
- Create the centralized prompts file with the enhanced system prompt
- Keep the user prompt generator function
- Keep the image customization prompt

### Step 2: Update textGen.ts
- Import from minimaxPrompts.ts
- Replace hardcoded system prompt with imported one
- Simplify the `parseJsonFromModelContent()` function while keeping essential repair logic as fallback
- Update the content extraction to strip markdown code blocks

### Step 3: Update imageCustomization.ts
- Re-import from minimaxPrompts.ts (was removed when file was deleted)

### Step 4: Testing
- Run TypeScript compilation
- Verify no breaking changes

## Detailed Changes

### minimaxPrompts.ts Structure:
```typescript
export const MINIMAX_PROMPTS = {
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
  user: { /* existing generateVibeGuide function */ },
  image: { /* existing customization function */ }
};
```

### textGen.ts Changes:
1. Add import: `import { MINIMAX_PROMPTS } from './minimaxPrompts.js';`
2. Replace system prompt with `MINIMAX_PROMPTS.system.dormVibe`
3. Update content extraction to strip markdown:
   ```typescript
   let content = /* extracted content */;
   if (typeof content === 'string') {
     content = content.trim();
     if (content.startsWith('```')) {
       content = content.replace(/^```json?\n?/, '').replace(/\n?```$/, '');
     }
   }
   ```
4. Keep `parseJsonFromModelContent()` as fallback for edge cases

## Files to Modify:
1. `api/services/minimaxPrompts.ts` - Create new
2. `api/services/textGen.ts` - Update imports and logic
3. `api/services/imageCustomization.ts` - Re-add import

## No Changes Needed:
- `shared/types.ts` - Schema is compatible
- Frontend components - API contract unchanged
- Other API services
