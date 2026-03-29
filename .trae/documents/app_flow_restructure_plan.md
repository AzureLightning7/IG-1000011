# App Flow Restructure - Implementation Plan

## Overview
Restructure the app to operate in 3 clear stages: Survey Stage, Customization Stage, and Purchase Stage, with proper separation between stages 2 and 3.

## Current Flow Analysis
- **Survey Stage**: Implemented as `VibeQuiz` component ✅
- **Customization Stage**: Partially implemented in `ResultsPage` but mixed with purchase options ❌
- **Purchase Stage**: Implemented as `ShoppingList` component but on same page as customization ❌

Current flow: VibeQuiz → LoadingScreen → ResultsPage (combined customization + purchase) → CheckoutPage

## Implementation Plan

### [ ] Task 1: Create CustomizationPage Component
- **Priority**: P0
- **Depends On**: None
- **Description**: 
  - Create a new `CustomizationPage` component that focuses solely on room customization
  - Move the MoodBoard component from ResultsPage to this new page
  - Add customization options and tools
- **Success Criteria**:
  - New CustomizationPage exists and is accessible via routing
  - MoodBoard component is properly integrated
  - Page focuses on customization without purchase options
- **Test Requirements**:
  - `programmatic` TR-1.1: CustomizationPage loads successfully with generated content
  - `human-judgement` TR-1.2: Page layout is clean and focused on customization features
- **Notes**: Ensure proper navigation from LoadingScreen to CustomizationPage

### [ ] Task 2: Modify ResultsPage to become PurchasePage
- **Priority**: P0
- **Depends On**: Task 1
- **Description**:
  - Rename ResultsPage to PurchasePage
  - Remove MoodBoard component (moved to CustomizationPage)
  - Focus solely on purchase options: ShoppingList, marketplace, and checkout
- **Success Criteria**:
  - Page is renamed to PurchasePage
  - Only purchase-related components remain
  - Navigation to checkout works correctly
- **Test Requirements**:
  - `programmatic` TR-2.1: PurchasePage loads successfully with shopping list
  - `human-judgement` TR-2.2: Page layout is focused on purchase options
- **Notes**: Update all references to ResultsPage in the codebase

### [ ] Task 3: Update Routing Configuration
- **Priority**: P0
- **Depends On**: Task 1, Task 2
- **Description**:
  - Update App.tsx routing to include CustomizationPage
  - Update navigation flow to follow: VibeQuiz → LoadingScreen → CustomizationPage → PurchasePage → CheckoutPage
  - Update LoadingScreen to navigate to CustomizationPage instead of ResultsPage
- **Success Criteria**:
  - All routes are properly configured
  - Navigation between stages works correctly
  - Back button functionality is maintained
- **Test Requirements**:
  - `programmatic` TR-3.1: All routes load correctly
  - `programmatic` TR-3.2: Navigation flow follows the 3-stage structure
- **Notes**: Update any hardcoded navigation paths

### [ ] Task 4: Enhance Customization Features
- **Priority**: P1
- **Depends On**: Task 1
- **Description**:
  - Add more customization options to CustomizationPage
  - Implement image customization tools
  - Add layout adjustment features
- **Success Criteria**:
  - CustomizationPage has enhanced features
  - Users can modify room elements
  - Changes are reflected in the UI
- **Test Requirements**:
  - `programmatic` TR-4.1: Customization tools work without errors
  - `human-judgement` TR-4.2: Customization features are intuitive and easy to use
- **Notes**: Leverage existing image customization API endpoints if available

### [ ] Task 5: Improve Purchase Stage Experience
- **Priority**: P1
- **Depends On**: Task 2
- **Description**:
  - Enhance ShoppingList component with better filtering and sorting
  - Integrate marketplace features more prominently
  - Add affiliate link tracking
- **Success Criteria**:
  - PurchasePage has enhanced shopping features
  - Marketplace integration is seamless
  - Checkout process is streamlined
- **Test Requirements**:
  - `programmatic` TR-5.1: Shopping features work correctly
  - `human-judgement` TR-5.2: Purchase process is clear and straightforward
- **Notes**: Ensure all purchase options (affiliate, marketplace, freecycling) are clearly presented

### [ ] Task 6: Add Stage Navigation Indicators
- **Priority**: P2
- **Depends On**: Task 3
- **Description**:
  - Add visual indicators to show users their current stage
  - Implement progress tracking across stages
  - Add breadcrumb navigation
- **Success Criteria**:
  - Users can easily see their current stage
  - Navigation between stages is intuitive
  - Progress is clearly visualized
- **Test Requirements**:
  - `programmatic` TR-6.1: Navigation indicators update correctly
  - `human-judgement` TR-6.2: Stage indicators are clear and helpful
- **Notes**: Use consistent design language across all stages

### [ ] Task 7: Testing and Optimization
- **Priority**: P2
- **Depends On**: All previous tasks
- **Description**:
  - Test the entire flow from survey to purchase
  - Optimize performance across all stages
  - Fix any navigation or functionality issues
- **Success Criteria**:
  - Entire flow works smoothly
  - Performance is optimized
  - No broken links or navigation issues
- **Test Requirements**:
  - `programmatic` TR-7.1: All stages load within 3 seconds
  - `programmatic` TR-7.2: No console errors during navigation
- **Notes**: Test on different device sizes and browsers

## Expected Outcome
A clearly structured 3-stage app flow that provides a better user experience:
1. **Survey Stage**: Users answer questions to generate their vibe
2. **Customization Stage**: Users customize their room design
3. **Purchase Stage**: Users purchase items through various channels

This separation will make the app more intuitive and easier to use, with each stage focusing on its specific purpose.