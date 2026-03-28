# Interactive Room Display - Implementation Plan

## Overview
This plan outlines the implementation of an interactive room display feature for the DormVibe application, including 3D effects, AI-based product identification, and TTS audio generation. The implementation will replace the existing MoodBoard component with an InteractiveRoomDisplay component that provides a more engaging user experience.

## Current State Analysis
- ✅ AudioPlayer component already exists
- ✅ TTS service already exists
- ✅ ResultsPage structure already in place
- ❌ InteractiveRoomDisplay component missing
- ❌ AI-based product identification missing
- ❌ 3D perspective effects missing
- ❌ Product positioning functionality missing

## Tasks

### [x] Task 1: Extend Type Definitions
- **Priority**: P0
- **Depends On**: None
- **Description**: Extend the Product interface in shared/types.ts to include position, size, and confidence properties for AI-identified products.
- **Success Criteria**: Product interface includes all required properties for AI positioning
- **Test Requirements**:
  - `programmatic` TR-1.1: TypeScript compilation passes without errors
  - `programmatic` TR-1.2: Interface matches the required structure for AI integration

### [x] Task 2: Create InteractiveRoomDisplay Component
- **Priority**: P0
- **Depends On**: Task 1
- **Description**: Create the main InteractiveRoomDisplay component with 3D perspective effects, mouse tracking, and product interaction functionality.
- **Success Criteria**: Component renders with 3D effects and interactive product elements
- **Test Requirements**:
  - `programmatic` TR-2.1: Component renders without errors
  - `human-judgment` TR-2.2: 3D perspective responds smoothly to mouse movement
  - `human-judgment` TR-2.3: Product items are clickable and show popup information

### [x] Task 3: Create InteractiveRoomDisplay CSS
- **Priority**: P0
- **Depends On**: Task 2
- **Description**: Create the CSS file for InteractiveRoomDisplay with 3D perspective styles, animations, and responsive design.
- **Success Criteria**: Component has proper styling with 3D effects and animations
- **Test Requirements**:
  - `human-judgment` TR-3.1: 3D perspective effects are visually appealing
  - `human-judgment` TR-3.2: Responsive design works on different screen sizes
  - `human-judgment` TR-3.3: Animations are smooth and enhance user experience

### [x] Task 4: Implement AI Product Identification Service
- **Priority**: P1
- **Depends On**: Task 1
- **Description**: Create the productIdentification.ts service that uses MiniMax AI to analyze room images and identify product positions.
- **Success Criteria**: Service returns valid product positions with confidence scores
- **Test Requirements**:
  - `programmatic` TR-4.1: Service handles API requests correctly
  - `programmatic` TR-4.2: Fallback grid positioning works when AI fails
  - `programmatic` TR-4.3: Returns properly formatted response with position data

### [x] Task 5: Create Identify Products API Route
- **Priority**: P1
- **Depends On**: Task 4
- **Description**: Create the identifyProducts.ts API route that exposes the product identification service.
- **Success Criteria**: API endpoint is accessible and returns valid responses
- **Test Requirements**:
  - `programmatic` TR-5.1: API endpoint responds to POST requests
  - `programmatic` TR-5.2: Returns 200 status code for valid requests
  - `programmatic` TR-5.3: Returns proper error responses for invalid requests

### [x] Task 6: Update ResultsPage Integration
- **Priority**: P0
- **Depends On**: Task 2, Task 5
- **Description**: Update ResultsPage.tsx to replace MoodBoard with InteractiveRoomDisplay and integrate the AI product identification functionality.
- **Success Criteria**: ResultsPage displays InteractiveRoomDisplay instead of MoodBoard
- **Test Requirements**:
  - `programmatic` TR-6.1: Page renders without errors
  - `human-judgment` TR-6.2: InteractiveRoomDisplay appears correctly on the results page
  - `programmatic` TR-6.3: AI product identification is called when page loads

### [x] Task 7: Register API Routes
- **Priority**: P1
- **Depends On**: Task 5
- **Description**: Update api/app.ts to register the new identify-products route.
- **Success Criteria**: API route is properly registered and accessible
- **Test Requirements**:
  - `programmatic` TR-7.1: API route is registered in app.ts
  - `programmatic` TR-7.2: Route is accessible via /api/identify-products

### [x] Task 8: Test Integration and Performance
- **Priority**: P2
- **Depends On**: All previous tasks
- **Description**: Test the complete integration of all components and services, including performance testing and error handling.
- **Success Criteria**: All components work together seamlessly with good performance
- **Test Requirements**:
  - `programmatic` TR-8.1: No console errors or warnings
  - `human-judgment` TR-8.2: 3D effects are smooth at 60fps
  - `programmatic` TR-8.3: AI analysis completes within reasonable time
  - `human-judgment` TR-8.4: Overall user experience is engaging and responsive

## Technical Implementation Details

### 3D Perspective Effect
- Uses CSS `transform-style: preserve-3d` for 3D context
- Mouse movement tracked via `requestAnimationFrame`
- Rotation calculated based on mouse position relative to viewport center
- Rotation range: -5deg to 5deg on X-axis, -10deg to 10deg on Y-axis

### Product Positioning
- AI positions are converted to CSS percentages
- Fallback to 3-column grid layout if AI fails
- Grid positions: 20%, 45%, 70% horizontally; 25%, 55%, 85% vertically

### AI Integration
- Uses MiniMax AI (MiniMax-M2.5 model) to analyze room images
- Identifies product positions as percentages (x, y coordinates)
- Returns size information (width, height) and confidence scores
- Filters results by confidence (>50%)

### Dependencies
- **Frontend**: React (hooks), Framer Motion (animations), Lucide React (icons)
- **Backend**: Express.js, MiniMax API client, File system operations
- **Environment Variables**: MINIMAX_API_KEY (required)

## Success Criteria
- Interactive 3D room display with mouse-responsive perspective effects
- AI-identified product positions with fallback grid layout
- Smooth animations and transitions
- Responsive design for different screen sizes
- Integration with existing TTS audio generation
- No breaking changes to existing functionality

## Implementation Steps
1. Extend type definitions to support product positioning
2. Create InteractiveRoomDisplay component with 3D effects
3. Implement CSS for 3D perspective and animations
4. Create AI product identification service
5. Set up API route for product identification
6. Update ResultsPage to use InteractiveRoomDisplay
7. Register API routes in app.ts
8. Test complete integration and performance

## Estimated Timeline
- Task 1: 30 minutes
- Task 2: 2 hours
- Task 3: 1 hour
- Task 4: 2 hours
- Task 5: 30 minutes
- Task 6: 1 hour
- Task 7: 15 minutes
- Task 8: 1 hour

Total estimated time: 8 hours 15 minutes