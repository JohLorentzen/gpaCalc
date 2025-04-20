import {NextIntlClientProvider, hasLocale} from 'next-intl';
import type { Metadata } from "next";
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';
import Script from "next/script";

import "../globals.css";
import { Analytics } from "@vercel/analytics/react"
import { Space_Grotesk } from "next/font/google";
import Providers from './providers';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"] });

export async function generateMetadata({
  params
}: {
  params: { locale: string } | Promise<{ locale: string }>
}): Promise<Metadata> {
  // Ensure params is awaited
  const resolvedParams = await Promise.resolve(params);
  const locale = resolvedParams.locale;
  
  // Ensure the locale is valid
  if (!hasLocale(routing.locales, locale)) {
    return {
      title: "GPA Calculator",
      description: "Calculate your GPA based on the Norwegian grading system",
    };
  }

  // Locale-specific metadata
  const metadataByLocale: Record<string, Metadata> = {
    en: {
      title: "GPA Calculator | Convert Norwegian Grades",
      description: "Free tool to calculate your GPA based on the Norwegian grading system. Upload transcripts or enter grades manually.",
      keywords: ["GPA calculator", "Norwegian grading", "grade conversion", "university grades", "academic calculator"],
      authors: [{ name: "UniGPACalc" }],
      openGraph: {
        title: "GPA Calculator | Norwegian Grading System",
        description: "Free tool to calculate your GPA based on the Norwegian grading system. Upload transcripts or enter grades manually.",
        url: `https://unigpacalc.com/${locale}`,
        siteName: "UniGPACalc",
        locale: locale,
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: "GPA Calculator | Norwegian Grading System",
        description: "Free tool to calculate your GPA based on the Norwegian grading system"
      },
      alternates: {
        canonical: `https://unigpacalc.com/${locale}`,
        languages: {
          'en': `https://unigpacalc.com/en`,
          'no': `https://unigpacalc.com/no`,
          'es': `https://unigpacalc.com/es`,
          'fr': `https://unigpacalc.com/fr`,
          'de': `https://unigpacalc.com/de`
        }
      }
    },
    no: {
      title: "Karakterkalkulator | Beregn ditt karaktersnitt",
      description: "Gratis verktøy for å beregne ditt karaktersnitt i det norske karaktersystemet. Last opp karakterutskrift eller legg inn karakterer manuelt.",
      keywords: ["karakterkalkulator", "snittkarakter", "norsk karaktersystem", "universitetskarakterer", "akademisk kalkulator"],
      authors: [{ name: "UniGPACalc" }],
      openGraph: {
        title: "Karakterkalkulator | Norsk Karaktersystem",
        description: "Gratis verktøy for å beregne ditt karaktersnitt i det norske karaktersystemet. Last opp karakterutskrift eller legg inn karakterer manuelt.",
        url: `https://unigpacalc.com/${locale}`,
        siteName: "UniGPACalc",
        locale: locale,
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: "Karakterkalkulator | Norsk Karaktersystem",
        description: "Gratis verktøy for å beregne ditt karaktersnitt i det norske karaktersystemet"
      },
      alternates: {
        canonical: `https://unigpacalc.com/${locale}`,
        languages: {
          'en': `https://unigpacalc.com/en`,
          'no': `https://unigpacalc.com/no`,
          'es': `https://unigpacalc.com/es`,
          'fr': `https://unigpacalc.com/fr`,
          'de': `https://unigpacalc.com/de`
        }
      }
    },
    es: {
      title: "Calculadora de GPA | Sistema de Calificación Noruego",
      description: "Herramienta gratuita para calcular tu promedio de calificaciones basado en el sistema noruego. Sube tus expedientes o ingresa calificaciones manualmente.",
      keywords: ["calculadora GPA", "calificaciones noruegas", "conversión de notas", "calificaciones universitarias", "calculadora académica"],
      authors: [{ name: "UniGPACalc" }],
      openGraph: {
        title: "Calculadora de GPA | Sistema Noruego",
        description: "Herramienta gratuita para calcular tu promedio de calificaciones basado en el sistema noruego. Sube tus expedientes o ingresa calificaciones manualmente.",
        url: `https://unigpacalc.com/${locale}`,
        siteName: "UniGPACalc",
        locale: locale,
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: "Calculadora de GPA | Sistema Noruego",
        description: "Herramienta gratuita para calcular tu promedio de calificaciones basado en el sistema noruego"
      },
      alternates: {
        canonical: `https://unigpacalc.com/${locale}`,
        languages: {
          'en': `https://unigpacalc.com/en`,
          'no': `https://unigpacalc.com/no`,
          'es': `https://unigpacalc.com/es`,
          'fr': `https://unigpacalc.com/fr`,
          'de': `https://unigpacalc.com/de`
        }
      }
    },
    fr: {
      title: "Calculateur de GPA | Système de Notation Norvégien",
      description: "Outil gratuit pour calculer votre moyenne selon le système de notation norvégien. Téléchargez vos relevés de notes ou entrez vos notes manuellement.",
      keywords: ["calculateur GPA", "notation norvégienne", "conversion de notes", "notes universitaires", "calculateur académique"],
      authors: [{ name: "UniGPACalc" }],
      openGraph: {
        title: "Calculateur de GPA | Système Norvégien",
        description: "Outil gratuit pour calculer votre moyenne selon le système de notation norvégien. Téléchargez vos relevés de notes ou entrez vos notes manuellement.",
        url: `https://unigpacalc.com/${locale}`,
        siteName: "UniGPACalc",
        locale: locale,
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: "Calculateur de GPA | Système Norvégien",
        description: "Outil gratuit pour calculer votre moyenne selon le système de notation norvégien"
      },
      alternates: {
        canonical: `https://unigpacalc.com/${locale}`,
        languages: {
          'en': `https://unigpacalc.com/en`,
          'no': `https://unigpacalc.com/no`,
          'es': `https://unigpacalc.com/es`,
          'fr': `https://unigpacalc.com/fr`,
          'de': `https://unigpacalc.com/de`
        }
      }
    },
    de: {
      title: "GPA-Rechner | Norwegisches Benotungssystem",
      description: "Kostenloses Tool zur Berechnung Ihres Notendurchschnitts basierend auf dem norwegischen Benotungssystem. Laden Sie Zeugnisse hoch oder geben Sie Noten manuell ein.",
      keywords: ["GPA-Rechner", "norwegische Benotung", "Notenumrechnung", "Universitätsnoten", "akademischer Rechner"],
      authors: [{ name: "UniGPACalc" }],
      openGraph: {
        title: "GPA-Rechner | Norwegisches Benotungssystem",
        description: "Kostenloses Tool zur Berechnung Ihres Notendurchschnitts basierend auf dem norwegischen Benotungssystem. Laden Sie Zeugnisse hoch oder geben Sie Noten manuell ein.",
        url: `https://unigpacalc.com/${locale}`,
        siteName: "UniGPACalc",
        locale: locale,
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: "GPA-Rechner | Norwegisches Benotungssystem",
        description: "Kostenloses Tool zur Berechnung Ihres Notendurchschnitts basierend auf dem norwegischen Benotungssystem"
      },
      alternates: {
        canonical: `https://unigpacalc.com/${locale}`,
        languages: {
          'en': `https://unigpacalc.com/en`,
          'no': `https://unigpacalc.com/no`,
          'es': `https://unigpacalc.com/es`,
          'fr': `https://unigpacalc.com/fr`,
          'de': `https://unigpacalc.com/de`
        }
      }
    }
  };

  // Return locale-specific metadata or fall back to English
  return metadataByLocale[locale] || metadataByLocale.en;
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
      <head />
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
        
        {/* Google AdSense script */}
        <Script
          async
          id="google-adsense"
          src="https://pagead.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7138448371398428"
          crossOrigin="anonymous"
          strategy="afterInteractive"
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



