---
name: "responsive-ui-tailwind"
description: "Creates responsive UI components using Tailwind CSS. Invoke when building layouts, making components mobile-friendly, or implementing responsive design patterns."
---

# Responsive UI with Tailwind CSS

## Breakpoint Reference
```
sm: 640px   - Small devices
md: 768px   - Tablets
lg: 1024px  - Laptops
xl: 1280px  - Desktops
2xl: 1536px - Large screens
```

## Mobile-First Approach
Always design for mobile first, then add breakpoints for larger screens.

```tsx
// Bad - desktop first
<div className="grid-cols-4 md:grid-cols-2 sm:grid-cols-1">

// Good - mobile first
<div className="grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
```

## Common Patterns

### Responsive Grid
```tsx
// Quiz form layout
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  <div className="col-span-1"> {/* Full width on mobile, half on tablet+ */}
    <Input />
  </div>
  <div className="col-span-1">
    <Select />
  </div>
</div>

// Mood board gallery
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
  {images.map(img => <ImageCard key={img.id} src={img.url} />)}
</div>
```

### Responsive Typography
```tsx
<h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">
  Welcome to DormVibe
</h1>
<p className="text-sm md:text-base lg:text-lg text-gray-600">
  Description text
</p>
```

### Responsive Padding/Margin
```tsx
<section className="px-4 py-6 md:px-8 md:py-12 lg:px-16 lg:py-20">
  {/* Content */}
</section>
```

### Responsive Navigation
```tsx
<nav className="flex items-center justify-between px-4 py-4 md:px-8">
  {/* Logo - always visible */}
  <Logo className="h-8 w-auto" />
  
  {/* Desktop nav */}
  <div className="hidden md:flex gap-6">
    <NavLink to="/">Home</NavLink>
    <NavLink to="/quiz">Quiz</NavLink>
    <NavLink to="/results">Results</NavLink>
  </div>
  
  {/* Mobile menu button */}
  <button className="md:hidden" onClick={toggleMenu}>
    <MenuIcon />
  </button>
</nav>

{/* Mobile menu overlay */}
{isMenuOpen && (
  <div className="fixed inset-0 bg-white z-50 md:hidden">
    {/* Mobile nav items */}
  </div>
)}
```

### Responsive Cards
```tsx
<div className="bg-white rounded-lg shadow-md p-4 md:p-6 lg:p-8">
  <h2 className="text-lg md:text-xl font-semibold mb-2 md:mb-4">
    Card Title
  </h2>
  <p className="text-sm md:text-base text-gray-600">
    Card content
  </p>
</div>
```

### Responsive Flex Direction
```tsx
// Stack on mobile, side-by-side on desktop
<div className="flex flex-col md:flex-row gap-4">
  <div className="w-full md:w-1/2">Left content</div>
  <div className="w-full md:w-1/2">Right content</div>
</div>
```

### Hide/Show Elements
```tsx
{/* Show only on mobile */}
<div className="md:hidden">Mobile only</div>

{/* Show only on desktop */}
<div className="hidden md:block">Desktop only</div>

{/* Different content per breakpoint */}
<div>
  <span className="md:hidden">Tap</span>
  <span className="hidden md:inline">Click</span>
</div>
```

## Container Pattern
```tsx
// Consistent max-width and padding
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  {/* Page content */}
</div>
```

## Responsive Images
```tsx
<img 
  src={imageUrl}
  className="w-full h-48 md:h-64 lg:h-80 object-cover rounded-lg"
  alt="Description"
/>
```

## Best Practices
- Use mobile-first approach (no prefix = mobile)
- Limit breakpoints to 2-3 per component
- Use `container` or `max-w-` for readable line lengths
- Test on actual devices, not just browser resizing
- Use `clamp()` for fluid typography when needed
