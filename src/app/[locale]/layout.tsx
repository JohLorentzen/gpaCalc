import {NextIntlClientProvider, hasLocale} from 'next-intl';
import type { Metadata } from "next";
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';
import Script from "next/script";
import { generateLayoutMetadata } from '@/lib/metadata';

import "../globals.css";
import { Analytics } from "@vercel/analytics/react"
import { Space_Grotesk } from "next/font/google";
import Providers from './providers';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AdSense from '@/components/AdSense';
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"] });

export async function generateMetadata({
  params
}: {
  params: { locale: string }
}): Promise<Metadata> {
  // Get the locale parameter, ensuring it's awaited properly
  const { locale } = await params;
  
  // Use the centralized metadata generator
  return generateLayoutMetadata({ locale });
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  // Ensure that the incoming `locale` is valid
  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
 
  // Load messages from messages directory
  // Using relative path starting from project root
  let messages;
  try {
    messages = (await import(`../../../messages/${locale}.json`)).default;
  } catch (error) {
    console.error(`Error loading messages for locale ${locale}:`, error);
    // Fallback to English if message loading fails
    messages = (await import(`../../../messages/en.json`)).default;
  }
 
  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <AdSense pId="ca-pub-7138448371398428" />
      </head>
      <body className={spaceGrotesk.className}>
        {/* Theme script - runs before page load with strategy="beforeInteractive" */}
        <Script
          id="theme-script"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  // Get stored theme or default to system
                  const storedTheme = localStorage.getItem('theme') || 'system';
                  const theme = 
                    storedTheme === 'system' 
                      ? window.matchMedia('(prefers-color-scheme: dark)').matches 
                        ? 'dark' 
                        : 'light' 
                      : storedTheme;
                  
                  // Apply the theme class to <html> element
                  document.documentElement.classList.toggle('dark', theme === 'dark');
                } catch (e) {
                  console.error('Error setting theme:', e);
                }
              })();
            `,
          }}
        />
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers>
            <div className="flex flex-col min-h-screen">
              <Navbar locale={locale} />
              {children}
              <Footer locale={locale} />
            </div>
          </Providers>
          
          <Analytics />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}



