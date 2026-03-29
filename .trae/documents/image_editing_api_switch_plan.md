# DormVibe - Image Editing API Switch Plan

## Overview

This plan outlines the steps to switch the image editing API from Minimax to Replicate's interior-design model while maintaining Minimax for initial generation and vibe text regeneration.

## Tasks

### [x] Task 1: Install Replicate SDK and add API key
- **Priority**: P0
- **Depends On**: None
- **Description**: 
  - Install the Replicate SDK package
  - Add REPLICATE_API_TOKEN to environment variables
- **Success Criteria**: 
  - Replicate SDK is installed
  - REPLICATE_API_TOKEN is properly configured in .env file
- **Test Requirements**:
  - `programmatic` TR-1.1: npm install completes without errors
  - `programmatic` TR-1.2: .env file contains REPLICATE_API_TOKEN

### [x] Task 2: Create Replicate client service
- **Priority**: P0
- **Depends On**: Task 1
- **Description**: 
  - Create a new service file for Replicate client
  - Implement the client configuration and room redesign function
- **Success Criteria**:
  - Replicate client service exists
  - redesignRoom function is implemented according to the provided example
- **Test Requirements**:
  - `programmatic` TR-2.1: File exists and compiles without errors
  - `human-judgement` TR-2.2: Code follows existing patterns and conventions

### [x] Task 3: Modify imageCustomization service to use Replicate
- **Priority**: P0
- **Depends On**: Task 2
- **Description**:
  - Update customizeImage function to use Replicate instead of Minimax
  - Maintain the same function signature for compatibility
- **Success Criteria**:
  - customizeImage function uses Replicate API
  - Function returns the same format as before
- **Test Requirements**:
  - `programmatic` TR-3.1: Function compiles without errors
  - `programmatic` TR-3.2: Function returns expected URL format

### [x] Task 4: Test the new implementation
- **Priority**: P1
- **Depends On**: Task 3
- **Description**:
  - Run the application
  - Test the image customization flow
  - Verify the new API works correctly
- **Success Criteria**:
  - Application runs without errors
  - Image customization works with the new API
  - Initial generation still uses Minimax
- **Test Requirements**:
  - `programmatic` TR-4.1: Server starts without errors
  - `human-judgement` TR-4.2: Image customization completes successfully
  - `human-judgement` TR-4.3: Initial generation still works as before

### [x] Task 5: Update documentation
- **Priority**: P2
- **Depends On**: Task 4
- **Description**:
  - Update README.md to include Replicate API key requirement
  - Update any relevant documentation
- **Success Criteria**:
  - README.md includes Replicate API key information
  - Documentation is up to date
- **Test Requirements**:
  - `human-judgement` TR-5.1: README.md is updated with Replicate API key information
  - `human-judgement` TR-5.2: Documentation is clear and accurate

## Implementation Notes

1. **Maintain Minimax Usage**: Ensure that Minimax is still used for:
   - Initial image generation (`imageGen.ts`)
   - Vibe text regeneration

2. **Replicate Configuration**:
   - Use the provided code example for Replicate integration
   - Set appropriate parameters for interior design

3. **Error Handling**:
   - Implement proper error handling for Replicate API calls
   - Maintain consistent error responses for the frontend

4. **Testing**:
   - Test with various customization prompts
   - Verify both success and error scenarios

5. **Environment Variables**:
   - Add REPLICATE_API_TOKEN to .env file
   - Ensure existing Minimax variables are still present

## Expected Outcome

After implementing these changes, the application will:
- Continue using Minimax for initial image generation and vibe text regeneration
- Use Replicate's interior-design model for image editing/customization
- Provide the same user experience with improved image editing capabilities