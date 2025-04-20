'use client';

import { useEffect } from 'react';

/**
 * ClientGradientStyles
 * 
 * This component injects the necessary CSS for gradient styles.
 * It's marked with 'use client' to ensure it only runs on the client side.
 */
export function ClientGradientStyles() {
  useEffect(() => {
    // Set the gradient button style variable
    document.documentElement.style.setProperty(
      '--gradient-button-style', 
      'linear-gradient(var(--gradient-angle), hsl(var(--gradient-start)), hsl(var(--gradient-end)))'
    );
    
    // Check if our style already exists to avoid duplicates
    if (!document.getElementById('gradient-styles')) {
      const style = document.createElement('style');
      style.id = 'gradient-styles';
      style.textContent = `
        .gradient-button {
          background-image: var(--gradient-button-style);
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  return null;
} 