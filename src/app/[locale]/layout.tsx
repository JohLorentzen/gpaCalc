import {NextIntlClientProvider, hasLocale} from 'next-intl';
import type { Metadata } from "next";
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';
import { SpeedInsights } from "@vercel/speed-insights/next"
import { getMessages } from 'next-intl/server';

import { generateLayoutMetadata } from '@/lib/metadata';

import "../globals.css";
import { Analytics } from "@vercel/analytics/react"
import { Space_Grotesk } from "next/font/google";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"] });

// Use proper typings for Next.js App Router params
type Props = {
  params: {
    locale: string
  },
  children: React.ReactNode
}

// Using a more direct approach without destructuring params
export async function generateMetadata(props: Omit<Props, 'children'>): Promise<Metadata> {
  // Get the locale safely from the param object without destructuring
  const locale = await props.params?.locale;
  
  if (!locale) {
    return {}; // Default empty metadata if locale is not available
  }
  
  return generateLayoutMetadata({ locale });
}

// Using a more direct approach without destructuring params
export default async function LocaleLayout(props: Props) {
  // Get locale safely from the params object without destructuring
  const locale = await(props.params?.locale);

  // Ensure that the incoming `locale` is valid
  if (!locale || !hasLocale(routing.locales, locale)) {
    notFound();
  }
 
  const messages = await getMessages({ locale });
 
  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        {/* Open Graph image will be set by metadata */}
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" type="image/x-icon" />
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
        {/* Google AdSense Script */}
        
      </head>
      <body className={spaceGrotesk.className}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <div className="flex flex-col min-h-screen">
            <Navbar locale={locale} />
            <main className="flex-grow pt-20">
              {props.children}
            </main>
            <Footer locale={locale} />
          </div>
          <Analytics />
          <SpeedInsights />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}



