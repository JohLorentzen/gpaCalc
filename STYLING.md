# Styling System Documentation

This document explains the styling system used in the UniGPACalc application, including the gradient system, color variables, and utility classes.

## Core Concept

The styling system is built on Tailwind CSS and uses CSS variables for theming. The main improvements in this refactoring include:

1. Consistent gradient system with configurable angles and colors
2. Centralized theme variables for easy maintenance
3. Reusable utility classes for common styling patterns
4. Better dark mode support
5. Semantic color naming (confirmation, destructive, etc.)

## CSS Variables

The core variables are defined in `src/app/globals.css` and include:

### Main Colors

```css
--primary: 221.2 83.2% 53.3%;
--secondary: 210 40% 96.1%;
--background: 0 0% 100%;
--foreground: 222.2 84% 4.9%;
--confirmation: 142.1 76.2% 36.3%;
--destructive: 0 84.2% 60.2%;
```

### Gradient System

```css
--gradient-start: var(--primary);
--gradient-end: 262 83.3% 58.2%;
--gradient-angle: to right;
```

These variables control the gradient appearance throughout the application. To change the primary gradient, just modify these variables.

## Utility Classes

CSS utilities are defined in the `@layer utilities` section to ensure Tailwind can process them correctly.

### Gradient Text

```jsx
<span className="gradient-text">Gradient Text</span>
```

Creates text with a gradient background, visible through the text.

### Gradient Border

```jsx
<div className="gradient-border">Content with gradient border</div>
```

Creates an element with a gradient border while maintaining the normal background.

### Gradient Button Class

The `gradient-button` class is used by the Button component's gradient variant and is defined in two places:

1. In the CSS utilities layer as a fallback for server-side rendering
2. Dynamically via the `ClientGradientStyles` component for client-side enhancements

## Component Styles

For components that need gradient styling, we use direct CSS in the component classes rather than relying on utility classes:

```css
.btn-primary {
  @apply text-primary-foreground shadow-sm hover:shadow-md hover:-translate-y-[2px] transition-all;
  background-image: linear-gradient(var(--gradient-angle), hsl(var(--gradient-start)), hsl(var(--gradient-end)));
}
```

## Button Component

The Button component has been updated to include a gradient variant:

```jsx
<Button variant="gradient">Gradient Button</Button>
```

## Server-Side Rendering (SSR) Compatibility

To ensure our gradient styles work with server-side rendering:

1. We've added a `ClientGradientStyles` component that safely injects additional styles on the client
2. The component is marked with 'use client' directive to indicate it should only run on the client
3. Basic fallback styles are defined in the CSS for initial rendering

```jsx
// src/components/ui/gradient-styles.tsx
'use client';

export function ClientGradientStyles() {
  useEffect(() => {
    // Client-side style enhancements
    // ...
  }, []);
  
  return null;
}
```

## Best Practices

1. Put utility classes in the `@layer utilities` section - these can be used with `@apply`
2. For component styling that uses these utilities, use direct CSS properties instead of `@apply`
3. Use the CSS variables for consistent styling
4. Prefer semantic color names (confirmation instead of success/green)
5. When creating client-side only styles, use the 'use client' directive and useEffect
6. Always provide fallback CSS for server-rendered content

## Theme Constants

The `src/lib/theme-constants.ts` file provides documentation on how to use the gradient system and includes constant values for color variables:

```js
export const themeColors = {
  primary: 'hsl(var(--primary))',
  secondary: 'hsl(var(--secondary))',
  // ...
};

export const gradientStyles = {
  primary: 'linear-gradient(var(--gradient-angle), hsl(var(--gradient-start)), hsl(var(--gradient-end)))',
  // ...
};
```

## Dark Mode Support

Dark mode is supported through CSS variables with different values for dark mode. The theme-toggle component will switch between light and dark modes automatically. 