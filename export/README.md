# AIDORM Export - Loading Screen & Marketplace

This folder contains the extracted components from the AIDORM project:

## Contents

### 1. LoadingScreen.tsx
AI-powered loading screen that shows a step-by-step progress animation while generating dorm room designs.

**Features:**
- Animated step-by-step progress (6 steps)
- Progress bar with percentage
- Integration with Trae API for image generation
- Customizable navigation callback
- Generates mock content (vibe name, description, layout tips, products)

**Usage:**
```tsx
import LoadingScreen from './LoadingScreen'

// Basic usage
<LoadingScreen />

// With callbacks
<LoadingScreen 
  onComplete={(content, media) => console.log(content)}
  navigateTo="/results"
/>
```

### 2. Marketplace.tsx
Full-featured campus marketplace for buying and selling furniture.

**Features:**
- Product browsing with search and category filters
- Shopping cart functionality
- Add to cart with toast notifications
- Sell item functionality (upload images, set price/category)
- Eco-friendly ratings on products
- 24 pre-loaded products with categories
- Modal-based cart and sell forms

**Usage:**
```tsx
import Marketplace from './Marketplace'

// Basic usage
<Marketplace />

// With external cart management
<Marketplace 
  cartItems={myCart}
  onAddToCart={(product) => addToCart(product)}
  onRemoveFromCart={(id) => removeFromCart(id)}
  onNavigate={(path) => router.push(path)}
/>
```

### 3. Checkout.tsx
Multi-step checkout flow for campus deliveries.

**Features:**
- 3-step process: Delivery → Payment → Review
- Support for multiple payment methods (Card, Alipay, WeChat)
- Delivery to dorm buildings
- Order confirmation with order number
- Free delivery threshold ($200+)
- Order summary sidebar

**Usage:**
```tsx
import Checkout from './Checkout'

// Basic usage
<Checkout />

// With custom items and navigation
<Checkout 
  initialItems={cartItems}
  onNavigate={(path) => router.push(path)}
/>
```

### 4. ResultsPage.tsx
Results page displaying the generated dorm design with mood board, layout tips, and shopping list.

**Features:**
- Displays generated vibe name and description
- Shows AI-generated mood board image
- Layout tips section
- Product recommendations with price ranges
- Restart and share functionality

**Usage:**
```tsx
import ResultsPage from './ResultsPage'

// Basic usage (uses internal state)
<ResultsPage />

// With external content
<ResultsPage 
  content={generatedContent}
  media={mediaContent}
  onRestart={() => resetState()}
  onNavigate={(path) => router.push(path)}
/>
```

## Dependencies

These components use:
- React + TypeScript
- Tailwind CSS
- lucide-react (icons)
- sonner (toast notifications)
- react-router-dom (navigation)

## Integration

To use in your project:
1. Copy these files to your components folder
2. Install dependencies: `npm install lucide-react sonner`
3. Import and use the components

## API Integration

The LoadingScreen uses Trae API for image generation:
```
GET https://coreva-normal.trae.ai/api/ide/v1/text_to_image?prompt={encodedPrompt}&image_size=landscape_16_9
```

For MiniMax API integration (backend), see the backend/routes/generate.ts file in the main project.
