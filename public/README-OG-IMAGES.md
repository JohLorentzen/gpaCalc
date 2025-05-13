# Open Graph Images for UniGPACalc

## Current Setup

The site is currently using a Supabase-hosted image for all Open Graph images:

```
https://xauigkarhbwvuzweekbi.supabase.co/storage/v1/object/public/images//Screenshot%202025-05-13%20at%2012.43.58.png
```

This image is used across all languages and page types for consistent branding.

## Image Specifications

The Open Graph image should follow these specifications:

- Size: 1200 × 630 pixels (aspect ratio 1.91:1)
- File type: JPG or PNG
- File size: Less than 8MB
- Quality: High resolution, visually appealing

## Content Guidelines

- Include site logo
- Use readable typography
- Include a brief value proposition
- Consider creating language-specific versions in the future
- Maintain brand consistency with website colors

## Testing

Use these tools to test your Open Graph image implementation:
- Facebook Sharing Debugger: https://developers.facebook.com/tools/debug/
- Twitter Card Validator: https://cards-dev.twitter.com/validator
- LinkedIn Post Inspector: https://www.linkedin.com/post-inspector/

## Future Improvements

In the future, you might want to create language-specific Open Graph images. If you decide to do this:

1. Create and upload individual images to Supabase storage
2. Update the `metadata.ts` file to use different image URLs based on locale
3. Test the implementation with the tools mentioned above 