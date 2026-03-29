# Image Customization Update - Implementation Plan

## Overview
This plan addresses the issue where the "Further customization" option returns images that look completely different from the original. The solution involves using image-to-image generation and improving the preservation instructions in the prompt.

## Analysis of Current Issues
1. **No image reference**: The current API call doesn't include the original image as a reference
2. **Weak preservation instructions**: The current prompt doesn't strongly emphasize preserving the original room
3. **Prompt optimizer enabled**: The optimizer may be rewriting preservation instructions

## Implementation Tasks

### [ ] Task 1: Update image customization prompt in minimaxPrompts.ts
- **Priority**: P0
- **Depends On**: None
- **Description**: 
  - Replace the current image customization prompt with the enhanced version from Claude
  - Include strong preservation instructions and clear structure
- **Success Criteria**: 
  - The prompt includes detailed preservation instructions
  - The prompt follows the structure recommended by Claude
- **Test Requirements**: 
  - `programmatic` TR-1.1: The prompt string contains all preservation elements
  - `human-judgement` TR-1.2: The prompt clearly emphasizes preserving the original room
- **Notes**: Use the exact prompt structure from Claude for best results

### [ ] Task 2: Update API call in imageCustomization.ts to use image-to-image generation
- **Priority**: P0
- **Depends On**: Task 1
- **Description**: 
  - Add `subject_reference` parameter with the original image URL
  - Set `prompt_optimizer` to false
  - Ensure the API call structure matches the recommended format
- **Success Criteria**: 
  - The API call includes `subject_reference` parameter
  - `prompt_optimizer` is set to false
  - The call structure matches the recommended format
- **Test Requirements**: 
  - `programmatic` TR-2.1: API request includes `subject_reference` field
  - `programmatic` TR-2.2: `prompt_optimizer` is false in the request
- **Notes**: The `subject_reference` parameter is crucial for image-to-image generation

### [ ] Task 3: Test the updated image customization functionality
- **Priority**: P1
- **Depends On**: Task 2
- **Description**: 
  - Run TypeScript compilation to ensure no errors
  - Test the endpoint with a sample request
  - Verify the output image maintains the original room layout
- **Success Criteria**: 
  - TypeScript compilation passes
  - API call succeeds
  - Output image preserves original room elements
- **Test Requirements**: 
  - `programmatic` TR-3.1: `npx tsc --noEmit` passes without errors
  - `human-judgement` TR-3.2: Output image closely matches original room layout
- **Notes**: Test with a simple customization request to verify preservation

## Detailed Changes

### Task 1: Update image customization prompt
**File**: `api/services/minimaxPrompts.ts`
**Change**: Replace the `customization` prompt in the `image` section with:
```typescript
customization: (basePrompt: string, customizationPrompt: string) => `Maintain the exact same room layout, furniture arrangement, color scheme, lighting, and overall aesthetic of the reference image. Keep every existing element unchanged. Additionally, add the following: ${customizationPrompt}. The additions should blend naturally with the existing room style and color palette. Do not remove, rearrange, or alter any existing items.

Original room description for context: ${basePrompt}`
```

### Task 2: Update API call
**File**: `api/services/imageCustomization.ts`
**Changes**:
1. Add `subject_reference: originalImageUrl` to the request body
2. Change `prompt_optimizer: true` to `prompt_optimizer: false`

### Task 3: Testing
**Commands**:
- `npx tsc --noEmit` - Verify TypeScript compilation
- Test the `/api/customize-image` endpoint with a sample request

## Expected Outcome
After implementing these changes, the "Further customization" option should:
1. Generate images that maintain the exact same room layout and elements
2. Only add the requested changes without altering existing items
3. Produce results that are visually consistent with the original image

## Risk Assessment
- **API Compatibility**: The `subject_reference` parameter must be supported by MiniMax API
- **Prompt Length**: The new prompt is longer, but should be within API limits
- **Performance**: Image-to-image generation may take slightly longer than text-to-image

## Success Metrics
- The output image should be visually indistinguishable from the original except for the requested changes
- No TypeScript compilation errors
- API calls succeed without errors
