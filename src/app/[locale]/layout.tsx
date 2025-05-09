import {NextIntlClientProvider, hasLocale} from 'next-intl';
import type { Metadata } from "next";
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';
import { SpeedInsights } from "@vercel/speed-insights/next"

import { generateLayoutMetadata } from '@/lib/metadata';

import "../globals.css";
import { Analytics } from "@vercel/analytics/react"
import { Space_Grotesk } from "next/font/google";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
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
        {/* Google AdSense Script */}
        
      </head>
      <body className={spaceGrotesk.className}>
        <NextIntlClientProvider locale={locale} messages={messages}>
            <div className="flex flex-col min-h-screen">
              <Navbar locale={locale} />
              {children}
              <Footer locale={locale} />
            </div>
          <Analytics />
          <SpeedInsights />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}



