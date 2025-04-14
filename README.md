# GPA Calculator with OCR Grade Extraction

This project includes a GPA calculator and tools to extract course data from NTNU grade papers using OCR (Optical Character Recognition).

## Grade Paper Extraction

The project includes tools to extract course data from NTNU grade papers using Tesseract.js OCR:

```
# Save a transcript image (interactive)
node scripts/save-transcript-image.js

# Extract grades from the saved image
node scripts/extract-grades-from-image.js

# For demonstration, load example data from the grade paper
node scripts/preload-transcript-data.js
```

For more details, see the [scripts README](scripts/README.md).

## Example Extracted Data

From the example grade paper, the following courses were extracted:

```
HMS0002 - HMS-kurs for 1. årsstudenter (2022 høst): Bestått, 0 credits
IDATT1001 - Programmering 1 (2022 høst): B, 10 credits
IMAT1001 - Matematiske metoder 1 (2022 høst): A, 10 credits
INGT1001 - Ingeniørfaglig innføringsemne (2022 høst): Bestått, 10 credits
IDATT1002 - Systemutvikling (2023 vår): C, 10 credits
IDATT2001 - Programmering 2 (2023 vår): C, 10 credits
IMAT2021 - Matematiske metoder 2 for Dataingeniør (2023 vår): C, 10 credits
```

## Requirements

- Node.js
- Tesseract.js (included in dependencies)
- Next.js (for the web application)

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

## Build

```bash
npm run build
```

## License

This project is licensed under the MIT License.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
