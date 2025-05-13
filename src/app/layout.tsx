import Script from "next/script";
import "./globals.css";
import { Space_Grotesk } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { getTranslations } from 'next-intl/server';

// IMPORTANT: Do not create a route for favicon.ico in app/ directory
// The favicon should only exist in the public/ directory to avoid conflicts
// Keep favicon.ico in public/ directory only

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"] });

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'app' });
  
  return {
    title: `${t('title')} ${t('titleHighlight')}`,
    description: t('description'),
    icons: {
      icon: '/favicon.ico',
      shortcut: '/favicon.ico',
      apple: '/favicon.ico',
    },
  };
}

export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  return (
    <html lang={params.locale} suppressHydrationWarning>
        <head>
        <link rel="icon" href="/favicon.ico" sizes="any" type="image/x-icon" />
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
        <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID}`}
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        </head>
      <body className={spaceGrotesk.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
        {children}
        </ThemeProvider>
      </body>
    </html>
  );
} 