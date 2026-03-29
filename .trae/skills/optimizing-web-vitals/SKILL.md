---
name: "optimizing-web-vitals"
description: "Optimizes Core Web Vitals (LCP, FID/INP, CLS) for better performance and SEO. Invoke when improving page load speed, fixing layout shifts, or optimizing React app performance."
---

# Optimizing Web Vitals

## Core Web Vitals Overview

| Metric | Target | Description |
|--------|--------|-------------|
| **LCP** | < 2.5s | Largest Contentful Paint |
| **INP** | < 200ms | Interaction to Next Paint |
| **CLS** | < 0.1 | Cumulative Layout Shift |
| **FCP** | < 1.8s | First Contentful Paint |
| **TTFB** | < 800ms | Time to First Byte |

## LCP Optimization

### Image Optimization
```tsx
// Use proper image sizing
<img
  src="/mood-board.webp"
  width={800}
  height={600}
  alt="Dorm room mood board"
  loading="eager" // For above-fold images
  fetchPriority="high"
/>

// Use srcset for responsive images
<img
  srcSet="
    /image-400.webp 400w,
    /image-800.webp 800w,
    /image-1200.webp 1200w
  "
  sizes="(max-width: 600px) 400px, (max-width: 1000px) 800px, 1200px"
  src="/image-800.webp"
  alt="Description"
/>
```

### Preload Critical Resources
```html
<!-- In index.html -->
<link rel="preconnect" href="https://api.minimaxi.com" />
<link rel="dns-prefetch" href="https://api.minimaxi.com" />
<link rel="preload" href="/fonts/main.woff2" as="font" type="font/woff2" crossorigin />
```

### Lazy Load Below-Fold Content
```tsx
import { lazy, Suspense } from 'react';

const ResultsPage = lazy(() => import('./pages/ResultsPage'));

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ResultsPage />
    </Suspense>
  );
}
```

## CLS Optimization

### Reserve Space for Images
```tsx
// Always include width/height to prevent layout shift
<div className="aspect-video">
  <img
    src={imageUrl}
    width={1920}
    height={1080}
    className="w-full h-full object-cover"
    alt="Description"
  />
</div>

// Or use aspect-ratio
<div className="relative aspect-[16/9]">
  <img
    src={imageUrl}
    className="absolute inset-0 w-full h-full object-cover"
    alt="Description"
  />
</div>
```

### Avoid Dynamic Content Shifts
```tsx
// Bad - content pushes down when loaded
{data && <div className="results">{data}</div>}

// Good - reserve space
<div className="min-h-[400px]">
  {data ? (
    <div className="results">{data}</div>
  ) : (
    <Skeleton height={400} />
  )}
</div>
```

## INP Optimization

### Debounce Input Handlers
```tsx
import { useCallback } from 'react';
import { debounce } from 'lodash-es';

function SearchInput() {
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      performSearch(query);
    }, 300),
    []
  );

  return (
    <input
      onChange={(e) => debouncedSearch(e.target.value)}
      placeholder="Search..."
    />
  );
}
```

### Use CSS Transforms for Animations
```css
/* Good - GPU accelerated */
.animate {
  transform: translateX(0);
  transition: transform 0.3s ease;
}

/* Bad - triggers layout */
.animate-bad {
  left: 0;
  transition: left 0.3s ease;
}
```

### Virtualize Long Lists
```tsx
import { useVirtualizer } from '@tanstack/react-virtual';

function ProductList({ items }) {
  const parentRef = useRef<HTMLDivElement>(null);
  
  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 80,
  });

  return (
    <div ref={parentRef} className="h-[600px] overflow-auto">
      <div style={{ height: `${virtualizer.getTotalSize()}px` }}>
        {virtualizer.getVirtualItems().map((virtualItem) => (
          <div
            key={virtualItem.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${virtualItem.size}px`,
              transform: `translateY(${virtualItem.start}px)`,
            }}
          >
            <ProductCard item={items[virtualItem.index]} />
          </div>
        ))}
      </div>
    </div>
  );
}
```

## Code Splitting

```tsx
// Vite dynamic imports
const MoodBoard = lazy(() => import('./components/MoodBoard'));

// Prefetch on hover
const handleMouseEnter = () => {
  import('./components/MoodBoard');
};
```

## Performance Monitoring

```tsx
// Report Web Vitals
import { onCLS, onINP, onLCP, onFCP, onTTFB } from 'web-vitals';

onCLS(console.log);
onINP(console.log);
onLCP(console.log);
onFCP(console.log);
onTTFB(console.log);
```

## Best Practices
- Use WebP/AVIF images with fallbacks
- Implement skeleton screens for loading states
- Minimize third-party scripts
- Use `will-change` sparingly
- Keep bundles small with code splitting
