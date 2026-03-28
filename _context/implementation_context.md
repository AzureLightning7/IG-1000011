# Interactive Room Display - Implementation Context

## Overview
This document captures the implementation of an interactive room display feature for the DormVibe application, including 3D effects, AI-based product identification, and TTS audio generation.

## Project Context
- **Branch**: Azure/feature/room-item-shopping
- **Base**: DormVibe - A dorm room styling application using MiniMax AI
- **Reference**: RoomDisplay-master (Codrops interactive room slideshow)

---

## Features Implemented

### 1. Interactive Room Display Component

**Files Created:**
- `src/components/InteractiveRoomDisplay.tsx`
- `src/components/InteractiveRoomDisplay.css`

**Key Features:**
- 3D perspective effect that responds to mouse movement
- Clickable product items with popup information
- Smooth animations and transitions
- Responsive design for different screen sizes
- Integration with AI-identified product positions

**Component Props:**
```typescript
interface InteractiveRoomDisplayProps {
  imageUrl?: string;
  vibeName: string;
  products?: Product[];
}

interface Product {
  name: string;
  category: string;
  priceRange: string;
  searchQuery: string;
}
```

**3D Effect Implementation:**
- Uses CSS `transform-style: preserve-3d` for 3D context
- Mouse movement tracked via `requestAnimationFrame`
- Rotation calculated based on mouse position relative to viewport center
- Rotation range: -5deg to 5deg on X-axis, -10deg to 10deg on Y-axis

**Item Interaction:**
- Products positioned absolutely on the room image
- Click to open popup with product details
- Close button to dismiss popup
- Other items fade when one is selected
- 3D tilt disabled when item is open

---

### 2. AI-Based Product Identification

**Files Created:**
- `api/services/productIdentification.ts`
- `api/routes/identifyProducts.ts`

**Service Features:**
- Uses MiniMax AI (MiniMax-M2.5 model) to analyze room images
- Identifies product positions as percentages (x, y coordinates)
- Returns size information (width, height)
- Provides confidence scores for each identification
- Includes fallback grid positioning if AI fails

**API Endpoint:**
```
POST /api/identify-products
Request: { imageUrl: string, products: Product[] }
Response: { products: IdentifiedProduct[], roomType: string, style: string }
```

**AI Prompt Strategy:**
- Provides existing product list to AI
- Requests precise positioning coordinates (0-100%)
- Asks for confidence scores
- Filters results by confidence (>50%)
- Graceful fallback to grid layout on failure

**IdentifiedProduct Interface:**
```typescript
interface IdentifiedProduct extends Product {
  position: { x: number; y: number };
  size: { width: number; height: number };
  confidence: number;
  description: string;
}
```

---

### 3. TTS Audio Generation

**Files:**
- `src/components/AudioPlayer.tsx` (existing, enhanced)
- `api/services/tts.ts` (existing)
- `api/routes/generateTTS.ts` (existing)

**Features:**
- Generate audio from narration script using MiniMax TTS
- Play/pause controls
- Mute/unmute toggle
- Visual progress indicator
- Error handling and retry capability

**API Endpoint:**
```
POST /api/generate-tts
Request: { narrationScript: string }
Response: { audioUrl: string }
```

**TTS Configuration:**
- Model: speech-2.8-hd
- Voice: English_expressive_narrator (configurable via env)
- Format: MP3, 32kHz, 128kbps
- Output saved to: public/generated/audio/

---

## Integration Steps

### 1. ResultsPage Integration

Replace MoodBoard with InteractiveRoomDisplay:

```typescript
import InteractiveRoomDisplay from '../components/InteractiveRoomDisplay';

// In JSX:
<InteractiveRoomDisplay 
  imageUrl={mediaContent.imageUrl} 
  vibeName={generatedContent.vibeName} 
  products={generatedContent.products} 
/>
```

### 2. API Routes Registration

Add to `api/app.ts`:

```typescript
import identifyProductsRoutes from './routes/identifyProducts.js';
import generateTTSRoutes from './routes/generateTTS.js';

app.use('/api/identify-products', identifyProductsRoutes);
app.use('/api/generate-tts', generateTTSRoutes);
```

### 3. CSS Integration

The InteractiveRoomDisplay.css includes:
- 3D perspective and transform styles
- Animation keyframes
- Responsive breakpoints
- Item popup styling
- Button styles

---

## Technical Details

### 3D Perspective Effect

```css
.slideshow {
  perspective: 1000px;
}

.scene {
  transform-style: preserve-3d;
  transition: transform 0.1s;
}
```

```typescript
const rotateSlide = (mousepos: { x: number; y: number }) => {
  const movement = { rotateX: 5, rotateY: 10 };
  const rotX = 2 * movement.rotateX / slideSizes.height * mousepos.y - movement.rotateX;
  const rotY = 2 * movement.rotateY / slideSizes.width * mousepos.x - movement.rotateY;
  
  sceneRef.current.style.transform = 
    `rotate3d(1,0,0,${rotX}deg) rotate3d(0,1,0,${rotY}deg)`;
};
```

### Product Positioning

AI positions are converted to CSS percentages:

```typescript
style={{
  position: 'absolute',
  left: `${product.position.x}%`,
  top: `${product.position.y}%`,
  width: `${product.size.width}%`,
  height: `${product.size.height}%`,
  transform: 'translate(-50%, -50%)',
}}
```

### State Management

Component state:
- `isItemOpen`: Tracks if any item is currently open
- `currentOpenItem`: Reference to currently open item
- `lockedTilt`: Disables 3D effect when item is open
- `identifiedProducts`: AI-identified product positions
- `isLoading`: Loading state for AI analysis

---

## Exported Files Location

All implementation files are exported to:
```
_exports/
├── src/
│   └── components/
│       ├── InteractiveRoomDisplay.tsx
│       ├── InteractiveRoomDisplay.css
│       └── AudioPlayer.tsx
└── api/
    ├── routes/
    │   ├── identifyProducts.ts
    │   └── generateTTS.ts
    └── services/
        ├── productIdentification.ts
        └── tts.ts
```

---

## Dependencies

**Frontend:**
- React (hooks: useRef, useEffect, useState)
- Framer Motion (for animations)
- Lucide React (icons)

**Backend:**
- Express.js
- MiniMax API client
- File system operations (fs/promises)
- Crypto (for session IDs)

**Environment Variables:**
- `MINIMAX_API_KEY` - Required for AI services
- `MINIMAX_BASE_URL` - Optional, defaults to MiniMax official API
- `MINIMAX_TTS_VOICE_ID` - Optional, defaults to English_expressive_narrator
- `MINIMAX_TTS_MODEL` - Optional, defaults to speech-2.8-hd

---

## Usage Flow

1. User completes vibe quiz
2. MiniMax generates room description, products, and image
3. Image displayed in InteractiveRoomDisplay
4. Component calls `/api/identify-products` to get AI positions
5. Products positioned on image based on AI analysis
6. User can:
   - Move mouse to see 3D perspective effect
   - Click products to see details
   - Generate audio walkthrough via AudioPlayer

---

## Fallback Behavior

If AI identification fails:
- Products arranged in 3-column grid layout
- Grid automatically adjusts for product count
- Positions: 20%, 45%, 70% horizontally; 25%, 55%, 85% vertically

---

## Performance Considerations

- `requestAnimationFrame` used for smooth mouse tracking
- Throttling could be added for resize events
- Images lazy-loaded by browser
- CSS transforms GPU-accelerated
- AI analysis happens once on image load

---

## Browser Compatibility

- Requires CSS `transform-style: preserve-3d` support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile: 3D effects may be disabled or simplified
- Responsive breakpoints at 768px

---

## Future Enhancements

1. **Manual Position Adjustment**: Allow users to drag and reposition items
2. **Save Positions**: Store AI positions to avoid re-analysis
3. **3D Models**: Replace 2D item images with 3D models
4. **Room Navigation**: Multiple room views (like original RoomDisplay)
5. **AR Integration**: View items in actual room via camera

---

## Implementation Notes

- Original MoodBoard component replaced entirely
- No breaking changes to existing data structures
- Product interface extended with position data
- Backward compatible with existing generated content
- Error boundaries recommended for production

---

## Testing Checklist

- [ ] Component renders without errors
- [ ] 3D perspective responds to mouse movement
- [ ] Items clickable and show product info
- [ ] AI identification API returns valid positions
- [ ] Fallback grid works when AI fails
- [ ] TTS generation creates playable audio
- [ ] Responsive design works on mobile
- [ ] Animations smooth at 60fps
- [ ] No memory leaks from event listeners

---

## Related Files (Original Project)

- `src/pages/ResultsPage.tsx` - Integration point
- `src/store/useStore.ts` - State management
- `common/types.ts` - Type definitions
- `api/app.ts` - Route registration
- `_contexts/RoomDisplay-master/` - Reference implementation

---

**Date**: March 28, 2026
**Branch**: Azure/feature/room-item-shopping
**Status**: Implementation complete, files exported to _exports/
