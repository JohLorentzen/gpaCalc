/**
 * Theme Constants
 * 
 * This file defines the core values and design variables used throughout the application.
 * By centralizing these values, we make it easier to maintain consistent styling.
 */

export const themeColors = {
  // Brand colors
  primary: 'hsl(var(--primary))',
  secondary: 'hsl(var(--secondary))',
  accent: 'hsl(var(--accent))',
  
  // UI colors
  background: 'hsl(var(--background))',
  foreground: 'hsl(var(--foreground))',
  card: 'hsl(var(--card))',
  popover: 'hsl(var(--popover))',
  muted: 'hsl(var(--muted))',
  
  // Semantic colors
  destructive: 'hsl(var(--destructive))',
  confirmation: 'hsl(var(--confirmation))',
  
  // Border and input colors
  border: 'hsl(var(--border))',
  input: 'hsl(var(--input))',
  ring: 'hsl(var(--ring))',
};

export const gradientStyles = {
  // Standard gradient
  primary: 'linear-gradient(var(--gradient-angle), hsl(var(--gradient-start)), hsl(var(--gradient-end)))',
  
  // Specialized gradients
  confirmation: 'linear-gradient(var(--gradient-angle), hsl(var(--confirmation)), hsl(var(--confirmation), 0.7))',
  destructive: 'linear-gradient(var(--gradient-angle), hsl(var(--destructive)), hsl(var(--destructive), 0.7))',
};

export const themeUtilities = {
  // Border radius
  radius: 'var(--radius)',
  radiusSm: 'calc(var(--radius) - 4px)',
  radiusMd: 'calc(var(--radius) - 2px)',
  radiusLg: 'var(--radius)',
  radiusXl: 'calc(var(--radius) + 4px)',
  
  // Shadow values
  shadowSm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  shadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  shadowMd: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  shadowLg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
};

/**
 * Usage guide:
 * 
 * Text gradient: 
 * Use the gradient-text utility class from @layer utilities
 * 
 * <span className="gradient-text">Gradient Text</span>
 * 
 * Border gradient:
 * Use the gradient-border utility class from @layer utilities
 * 
 * <div className="gradient-border">Gradient Border</div>
 * 
 * Gradient button: 
 * Use the Button component with variant="gradient"
 * 
 * <Button variant="gradient">Gradient Button</Button>
 * 
 * Animated gradient: 
 * Use the animate-gradient-x class
 * 
 * <div className="animate-gradient-x">Animated Gradient</div>
 * 
 * Custom elements:
 * Apply the gradient directly using CSS
 * 
 * .my-element {
 *   background-image: linear-gradient(var(--gradient-angle), hsl(var(--gradient-start)), hsl(var(--gradient-end)));
 * }
 */ 