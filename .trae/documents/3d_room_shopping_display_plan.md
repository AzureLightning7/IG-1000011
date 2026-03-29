# 3D Room Shopping Display - Implementation Plan

## Overview
Implement a 3D interactive room shopping display on the Purchase Page, following the reference effect at https://tympanus.net/Development/RoomDisplay/. The feature will display the user's customized room image in a CSS 3D perspective view with clickable product hotspot markers.

## Current State Analysis

### Existing Files
- `src/pages/PurchasePage.tsx` - Shopping page with tabs (Essentials, Marketplace, Freecycling)
- `src/components/ShoppingList.tsx` - Grid display of products with search/filter
- `src/store/useStore.ts` - Global state including `customImageUrl`, `mediaContent.imageUrl`, `generatedContent.products`
- `shared/types.ts` - Product type definition (needs hotspot field)

### Data Flow
1. User generates room → `mediaContent.imageUrl` (original)
2. User customizes → `customImageUrl` (customized version)
3. Purchase page currently shows shopping list only
4. Need to add: 3D room display with hotspots on the final image

---

## Implementation Steps

### Phase 1: Type Definitions

#### 1.1 Update Product Type with Hotspot
**File:** `shared/types.ts`

Add hotspot field to Product interface:
```typescript
export interface Product {
  name: string;
  category: 'Lighting' | 'Bedding' | 'Desk' | 'Wall Decor' | 'Storage' | 'Plants' | 'Textiles' | 'Tech';
  priceRange: string;
  searchQuery: string;
  hotspot?: {
    x: number;  // 0-100, percentage from left
    y: number;  // 0-100, percentage from top
  };
}
```

---

### Phase 2: New Components

#### 2.1 Create RoomShoppingDisplay Component
**File:** `src/components/RoomShoppingDisplay.tsx`

**Props Interface:**
```typescript
interface RoomShoppingDisplayProps {
  roomImageUrl: string;
  products: Product[];
  vibeName: string;
  onBack: () => void;
}
```

**Component Structure:**
- Full-screen dark background wrapper
- Header with vibe name and back button
- 3D scene container with perspective
- Room image with floating hotspot markers
- Product detail panel (slides up when hotspot clicked)

**Features:**
- Mouse parallax rotation (±5deg on Y, ±2.5deg on X)
- Animated ping rings on hotspots
- Click to expand product panel
- Shopping links to Amazon, IKEA, Taobao

#### 2.2 Create HotspotMarker Sub-component
**File:** Inside `RoomShoppingDisplay.tsx` or separate

**Features:**
- Positioned absolutely using percentage-based coordinates
- Animated ping ring (CSS animation)
- Center dot with hover scale effect
- Label on hover
- translateZ(30px) for 3D float effect

#### 2.3 Create ProductPanel Sub-component
**File:** Inside `RoomShoppingDisplay.tsx` or separate

**Features:**
- Fixed position at bottom
- Slide-up animation
- Close button
- Product info (category, name, price)
- Shopping buttons (Amazon, IKEA, Taobao)

---

### Phase 3: CSS Styles

#### 3.1 Create RoomShoppingDisplay Styles
**File:** Add to `src/index.css` or create `src/components/RoomShoppingDisplay.css`

**Critical CSS Classes:**
- `.room-display-wrapper` - Full viewport, dark background
- `.room-scene` - perspective: 1200px
- `.room-box` - transform-style: preserve-3d
- `.room-image` - Container with overflow visible
- `.hotspot-marker` - Positioned with translateZ
- `.hotspot-ping` - Animated ring
- `.hotspot-dot` - Center indicator
- `.hotspot-label` - Tooltip on hover
- `.product-panel` - Fixed bottom panel

**Animations:**
- `@keyframes ping` - Expanding ring effect
- `@keyframes slideUp` - Panel entrance

**Mobile Fallback:**
- @media (max-width: 768px) - Disable 3D transforms

---

### Phase 4: Backend Updates

#### 4.1 Update Minimax Text Generation Prompt
**File:** `api/services/minimaxPrompts.ts` (or wherever prompts are defined)

Add hotspot position instructions to the product generation prompt:
```
For each product, also estimate where it would naturally appear in the room image.
Provide x,y coordinates as percentages (0-100) from the top-left corner.
Think about where each type of item typically sits in a dorm room:
- Desk lamp: around x:20-35, y:35-50 (desk area, upper portion)
- Bedding/blanket: around x:60-80, y:55-75 (bed area, middle-lower)
- Wall art/poster: around x:40-60, y:15-30 (wall, upper portion)
- Plant: around x:15-25, y:40-55 (corner or desk edge)
- String lights: around x:30-70, y:8-15 (along the top of wall)
- Storage/shelf: around x:75-90, y:30-50 (side area)
- Rug: around x:40-60, y:80-90 (floor area)
- Desk accessories: around x:25-40, y:45-55 (on desk surface)

Add a "hotspot" field to each product with x and y coordinates.
```

#### 4.2 Add Fallback Hotspot Distribution
**File:** `src/components/RoomShoppingDisplay.tsx`

Create utility function to auto-distribute hotspots if not provided:
```typescript
const autoDistributeHotspots = (products: Product[]): Product[] => {
  const defaultPositions = [
    { x: 25, y: 40 },   // desk area left
    { x: 70, y: 65 },   // bed area
    { x: 50, y: 20 },   // wall center upper
    { x: 15, y: 55 },   // left corner
    { x: 82, y: 38 },   // right shelf area
    { x: 45, y: 82 },   // floor area
    { x: 60, y: 12 },   // top wall (lights)
    { x: 35, y: 50 },   // desk surface
  ];

  return products.map((product, i) => ({
    ...product,
    hotspot: product.hotspot || defaultPositions[i % defaultPositions.length]
  }));
};
```

---

### Phase 5: Integration with PurchasePage

#### 5.1 Update PurchasePage.tsx

**Changes:**
1. Add state to toggle between list view and 3D room view
2. Add "Shop This Room" button to switch to 3D view
3. Import and use RoomShoppingDisplay component
4. Pass the correct image URL (customImageUrl || mediaContent.imageUrl)

**New State:**
```typescript
const [showRoomView, setShowRoomView] = useState(false);
```

**Image URL Logic:**
```typescript
const roomImageUrl = customImageUrl || mediaContent.imageUrl || '';
```

**Conditional Rendering:**
```typescript
{showRoomView ? (
  <RoomShoppingDisplay
    roomImageUrl={roomImageUrl}
    products={generatedContent.products}
    vibeName={generatedContent.vibeName}
    onBack={() => setShowRoomView(false)}
  />
) : (
  // Existing shopping tabs UI
)}
```

---

### Phase 6: Routing (Optional Enhancement)

#### 6.1 Add Route for 3D Room View
**File:** `src/App.tsx`

Add new route:
```typescript
<Route path="/shop-room" element={<RoomShoppingPage />} />
```

Or keep it as a state toggle within PurchasePage (simpler approach).

---

## File Changes Summary

### Modified Files:
1. `shared/types.ts` - Add hotspot field to Product
2. `api/services/minimaxPrompts.ts` - Add hotspot generation instructions
3. `src/pages/PurchasePage.tsx` - Add 3D view toggle and RoomShoppingDisplay
4. `src/index.css` - Add 3D room display styles

### New Files:
1. `src/components/RoomShoppingDisplay.tsx` - Main 3D room component

---

## Technical Specifications

### CSS 3D Requirements
- Parent: `perspective: 1200px`
- Scene: `transform-style: preserve-3d`
- Rotation: `rotateY(${mouseX}deg) rotateX(${mouseY}deg)`
- Hotspots: `transform: translate(-50%, -50%) translateZ(30px)`

### Mouse Parallax Logic
```typescript
const rotateY = ((clientX / innerWidth) - 0.5) * 10;  // -5 to +5
const rotateX = ((clientY / innerHeight) - 0.5) * -5;  // -2.5 to +2.5
```

### Color Scheme
- Background: #0a0a0a
- Cards: #1a1a1a
- Accent: #2dd4bf (teal)
- Text: white / #9ca3af (gray)

### Shopping Links
- Amazon: `https://www.amazon.com/s?k=${encodeURIComponent(searchQuery)}`
- IKEA: `https://www.ikea.com/us/en/search/?q=${encodeURIComponent(searchQuery)}`
- Taobao: `https://s.taobao.com/search?q=${encodeURIComponent(searchQuery)}`

---

## Testing Checklist

- [ ] 3D parallax effect works on mouse move
- [ ] Hotspots appear at correct positions
- [ ] Animated ping rings visible
- [ ] Clicking hotspot opens product panel
- [ ] Product panel slides up smoothly
- [ ] Shopping links open in new tabs
- [ ] Back button returns to list view
- [ ] Mobile fallback works (no 3D, flat view)
- [ ] Correct image displayed (customized or original)
- [ ] Fallback hotspot positions work if API doesn't provide them

---

## Notes

- Wait for teammate's Git update before implementing
- The feature should integrate seamlessly with existing shopping flow
- Keep the existing ShoppingList component for the list view
- The 3D view is an enhancement, not a replacement
- Consider adding a toggle button: "View as List" / "View in 3D Room"
