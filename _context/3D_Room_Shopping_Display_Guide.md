# 3D Room Shopping Display — Implementation Guide for TRAE

Reference effect: https://tympanus.net/Development/RoomDisplay/

## What This Effect Is

A 3D interactive room display where:
1. The user's generated room image is displayed in a CSS 3D perspective view (as if looking into a room corner)
2. Clickable product hotspot markers float on top of the room image at specific positions
3. Clicking a hotspot expands a product card with image, name, price, and shopping links
4. Mouse movement causes subtle parallax rotation of the entire scene, creating depth
5. The room transitions in from the previous page with a smooth animation

## When This Happens in the DormVibe Flow

After the user generates and customizes their room mood board image, they click a "Shop This Room" button. The app transitions to the 3D room shopping view where:
- The generated room image becomes the room walls
- Each product from the shopping list becomes a floating hotspot marker
- Users can click hotspots to see product details and shop on Amazon/IKEA/Taobao

---

## Technical Implementation

### Stack Requirements
- React + TypeScript
- CSS 3D transforms (`transform-style: preserve-3d`, `perspective`)
- No external 3D libraries needed — pure CSS + JS mouse tracking

### Core CSS Concepts

The 3D effect works by:
1. A parent container with `perspective: 1200px`
2. A scene wrapper with `transform-style: preserve-3d` that rotates slightly on mouse move
3. The room image displayed flat (or split into two panels for a corner effect)
4. Hotspot markers positioned absolutely with `transform: translateZ()` to float above the image

---

## Component: RoomShoppingDisplay.tsx

Build this React component with these specifications:

### Props
```typescript
interface Product {
  name: string;
  category: string;
  priceRange: string;
  searchQuery: string;
  // Position of the hotspot on the image (percentage-based)
  hotspot: {
    x: number;  // 0-100, percentage from left
    y: number;  // 0-100, percentage from top
  };
}

interface RoomShoppingDisplayProps {
  roomImageUrl: string;       // The generated mood board image URL
  products: Product[];        // Products with hotspot positions
  vibeName: string;           // e.g. "Cozy Anime Den"
  onBack: () => void;         // Return to results page
}
```

### Structure

```tsx
<div className="room-display-wrapper">
  {/* Full screen dark background */}

  {/* Header: vibe name + back button */}
  <header>
    <button onClick={onBack}>← Back to results</button>
    <h2>Shop Your "{vibeName}"</h2>
    <p>Click the markers to explore products</p>
  </header>

  {/* 3D Scene Container */}
  <div className="room-scene"
       style={{ perspective: '1200px' }}
       onMouseMove={handleMouseMove}>

    {/* 3D rotating wrapper — this tilts on mouse move */}
    <div className="room-box"
         style={{
           transformStyle: 'preserve-3d',
           transform: `rotateY(${mouseX}deg) rotateX(${mouseY}deg)`
         }}>

      {/* Room image — the main visual */}
      <div className="room-image">
        <img src={roomImageUrl} alt={vibeName} />

        {/* Product hotspots overlaid on the image */}
        {products.map((product, index) => (
          <HotspotMarker
            key={index}
            product={product}
            index={index}
            isActive={activeHotspot === index}
            onClick={() => setActiveHotspot(activeHotspot === index ? null : index)}
          />
        ))}
      </div>
    </div>
  </div>

  {/* Product detail panel — slides up when a hotspot is clicked */}
  {activeHotspot !== null && (
    <ProductPanel
      product={products[activeHotspot]}
      onClose={() => setActiveHotspot(null)}
    />
  )}
</div>
```

### Mouse Parallax Logic

```typescript
const [mouseX, setMouseX] = useState(0);
const [mouseY, setMouseY] = useState(0);

const handleMouseMove = (e: React.MouseEvent) => {
  const { clientX, clientY } = e;
  const { innerWidth, innerHeight } = window;

  // Map mouse position to a small rotation range (-5deg to +5deg)
  const rotateY = ((clientX / innerWidth) - 0.5) * 10;  // -5 to +5
  const rotateX = ((clientY / innerHeight) - 0.5) * -5;  // -2.5 to +2.5

  setMouseX(rotateY);
  setMouseY(rotateX);
};
```

### HotspotMarker Component

```tsx
interface HotspotMarkerProps {
  product: Product;
  index: number;
  isActive: boolean;
  onClick: () => void;
}

const HotspotMarker: React.FC<HotspotMarkerProps> = ({
  product, index, isActive, onClick
}) => (
  <button
    className={`hotspot-marker ${isActive ? 'active' : ''}`}
    style={{
      position: 'absolute',
      left: `${product.hotspot.x}%`,
      top: `${product.hotspot.y}%`,
      transform: 'translate(-50%, -50%) translateZ(30px)',
      // translateZ pushes the marker toward the viewer in 3D space
    }}
    onClick={(e) => {
      e.stopPropagation();
      onClick();
    }}
  >
    <span className="hotspot-ping" /> {/* Animated ping ring */}
    <span className="hotspot-dot" />  {/* Center dot */}
    <span className="hotspot-label">{product.name}</span>
  </button>
);
```

### ProductPanel Component

```tsx
interface ProductPanelProps {
  product: Product;
  onClose: () => void;
}

const ProductPanel: React.FC<ProductPanelProps> = ({ product, onClose }) => (
  <div className="product-panel">
    <button className="close-btn" onClick={onClose}>✕</button>

    <div className="product-info">
      <span className="product-category">{product.category}</span>
      <h3>{product.name}</h3>
      <p className="product-price">{product.priceRange}</p>
    </div>

    <div className="product-actions">
      <a
        href={`https://www.amazon.com/s?k=${encodeURIComponent(product.searchQuery)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="shop-btn amazon"
      >
        Shop on Amazon ↗
      </a>
      <a
        href={`https://www.ikea.com/us/en/search/?q=${encodeURIComponent(product.searchQuery)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="shop-btn ikea"
      >
        Shop on IKEA ↗
      </a>
      <a
        href={`https://s.taobao.com/search?q=${encodeURIComponent(product.searchQuery)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="shop-btn taobao"
      >
        淘宝搜索 ↗
      </a>
    </div>
  </div>
);
```

---

## CSS Styling

### Critical styles for the 3D effect:

```css
/* Wrapper — full viewport, dark background */
.room-display-wrapper {
  min-height: 100vh;
  background: #0a0a0a;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
}

/* 3D scene container — sets the perspective for child elements */
.room-scene {
  perspective: 1200px;
  width: 100%;
  max-width: 900px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
}

/* The 3D box that rotates on mouse move */
.room-box {
  transform-style: preserve-3d;
  transition: transform 0.1s ease-out;
  position: relative;
  width: 100%;
}

/* Room image container */
.room-image {
  position: relative;
  width: 100%;
  border-radius: 16px;
  overflow: visible; /* allow hotspots to float above */
  box-shadow:
    0 25px 60px rgba(0, 0, 0, 0.5),
    0 0 120px rgba(45, 212, 191, 0.08);
}

.room-image img {
  width: 100%;
  height: auto;
  display: block;
  border-radius: 16px;
}

/* Hotspot marker — the clickable dots on the image */
.hotspot-marker {
  position: absolute;
  z-index: 10;
  cursor: pointer;
  background: none;
  border: none;
  padding: 0;
  transform: translate(-50%, -50%) translateZ(30px);
}

/* Animated ping ring */
.hotspot-ping {
  position: absolute;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid rgba(45, 212, 191, 0.6);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
}

@keyframes ping {
  0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
  75%, 100% { transform: translate(-50%, -50%) scale(2.2); opacity: 0; }
}

/* Center dot */
.hotspot-dot {
  display: block;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #2dd4bf;
  border: 2px solid #ffffff;
  box-shadow: 0 2px 8px rgba(45, 212, 191, 0.5);
  position: relative;
  z-index: 2;
  transition: transform 0.2s;
}

.hotspot-marker:hover .hotspot-dot {
  transform: scale(1.3);
}

.hotspot-marker.active .hotspot-dot {
  background: #ffffff;
  border-color: #2dd4bf;
}

/* Hotspot label — appears on hover */
.hotspot-label {
  position: absolute;
  bottom: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.85);
  color: white;
  font-size: 12px;
  padding: 4px 10px;
  border-radius: 6px;
  white-space: nowrap;
  opacity: 0;
  transition: opacity 0.2s;
  pointer-events: none;
}

.hotspot-marker:hover .hotspot-label {
  opacity: 1;
}

/* Product detail panel — slides up from bottom */
.product-panel {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #1a1a1a;
  border-top: 1px solid #2a2a2a;
  border-radius: 20px 20px 0 0;
  padding: 24px;
  z-index: 50;
  animation: slideUp 0.3s ease-out;
  max-width: 600px;
  margin: 0 auto;
}

@keyframes slideUp {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}

.close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  background: #2a2a2a;
  border: none;
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-category {
  display: inline-block;
  background: rgba(45, 212, 191, 0.15);
  color: #2dd4bf;
  font-size: 11px;
  padding: 3px 10px;
  border-radius: 20px;
  margin-bottom: 8px;
}

.product-info h3 {
  color: white;
  font-size: 20px;
  font-weight: 600;
  margin: 4px 0;
}

.product-price {
  color: #9ca3af;
  font-size: 16px;
  margin-bottom: 16px;
}

.product-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.shop-btn {
  flex: 1;
  min-width: 120px;
  padding: 10px 16px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 500;
  text-align: center;
  text-decoration: none;
  transition: opacity 0.2s;
}

.shop-btn:hover { opacity: 0.85; }

.shop-btn.amazon {
  background: #ff9900;
  color: #000;
}

.shop-btn.ikea {
  background: #0058a3;
  color: #fff;
}

.shop-btn.taobao {
  background: #ff4400;
  color: #fff;
}
```

---

## Generating Hotspot Positions with Minimax

The key challenge is knowing WHERE to place each hotspot on the room image. Since the image is AI-generated, we can ask Minimax to suggest positions when it recommends products.

### Add this to the Minimax text gen prompt:

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

Add a "hotspot" field to each product:
"products": [
  {
    "name": "Warm Clip Desk Lamp",
    "category": "Lighting",
    "priceRange": "$15-25",
    "searchQuery": "warm amber clip desk lamp USB",
    "hotspot": { "x": 28, "y": 42 }
  }
]
```

### Fallback: Auto-distribute hotspots

If Minimax doesn't return good hotspot positions, auto-distribute them:

```typescript
const autoDistributeHotspots = (products: Product[]): Product[] => {
  // Predefined positions that look natural for a room image
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

## Page Transition: Results → Shopping View

When the user clicks "Shop This Room" on the results page, animate the room image expanding to fill the 3D shopping view:

```typescript
// In ResultsPage.tsx
const [showShopping, setShowShopping] = useState(false);

// When transitioning:
if (showShopping) {
  return (
    <RoomShoppingDisplay
      roomImageUrl={moodBoardUrl}
      products={productsWithHotspots}
      vibeName={vibeData.vibeName}
      onBack={() => setShowShopping(false)}
    />
  );
}

// In the results page, the trigger button:
<button
  onClick={() => setShowShopping(true)}
  className="shop-room-btn"
>
  🛒 Shop This Room
</button>
```

---

## Mobile Fallback

The 3D effect requires a larger screen. On mobile (under 768px), fall back to a simpler layout:
- Show the room image flat (no 3D perspective)
- Display products as a scrollable list below the image
- Remove mouse parallax
- Hotspot markers still work but without translateZ

```css
@media (max-width: 768px) {
  .room-scene {
    perspective: none;
  }

  .room-box {
    transform: none !important;
    transform-style: flat;
  }

  .hotspot-marker {
    transform: translate(-50%, -50%);
    /* Remove translateZ on mobile */
  }
}
```

---

## Demo Tips

- The 3D parallax tilt on mouse move is the wow moment — make sure to move your mouse during the demo
- Click a hotspot to show the product panel sliding up — this shows the shopping flow works end-to-end
- The transition from results page to 3D shopping view is a strong visual moment
- For the demo, pre-set 4-5 hotspot positions that look good on your pre-generated room image

---

## TRAE Builder Prompt

When asking TRAE to build this, use:

"Build the RoomShoppingDisplay component following the 3D Room Shopping Display implementation guide. The component should:
1. Display the generated room image in a CSS 3D perspective container
2. Add subtle parallax rotation on mouse movement (max ±5 degrees)
3. Overlay clickable hotspot markers at the positions specified in each product's hotspot field
4. Show an animated ping ring on each hotspot
5. When a hotspot is clicked, slide up a product detail panel from the bottom with the product name, category, price, and shopping links to Amazon, IKEA, and Taobao
6. Include a mobile fallback that removes the 3D effect
7. Use the dark theme: background #0a0a0a, cards #1a1a1a, accent teal #2dd4bf
Follow the exact CSS and component structure from the guide."
