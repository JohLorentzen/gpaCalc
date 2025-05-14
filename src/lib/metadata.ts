import type { Metadata } from "next";
import { getTranslations } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { routing } from '@/i18n/routing';

// Define the OG image URL from Supabase
const OG_IMAGE_URL = "https://xauigkarhbwvuzweekbi.supabase.co/storage/v1/object/public/images//Screenshot%202025-05-13%20at%2012.43.58.png";

// Define shared icons configuration for all locales
const sharedIcons = {
  icon: [
    { url: '/favicon.ico', sizes: 'any' },
  ],
  shortcut: '/favicon.ico',
  apple: '/favicon.ico',
};

// Define Norwegian domain
const NORWEGIAN_DOMAIN = "https://snittkalk.no";
const INTERNATIONAL_DOMAIN = "https://unigpacalc.com";

/**
 * Creates metadata for the main layout
 */
export async function generateLayoutMetadata(params: { locale: string }): Promise<Metadata> {
  const { locale } = params;
  
  // Ensure the locale is valid
  if (!hasLocale(routing.locales, locale)) {
    // Default to Norwegian metadata if locale is invalid
    return {
      title: "Karakterkalkulator | Beregn ditt karaktersnitt",
      description: "Gratis verktøy for å beregne ditt karaktersnitt i det norske karaktersystemet. Last opp karakterutskrift eller legg inn karakterer manuelt.",
      icons: sharedIcons,
      openGraph: {
        images: [{ url: OG_IMAGE_URL }],
      },
    };
  }

  // Get domain based on locale
  const domain = locale === 'no' ? NORWEGIAN_DOMAIN : INTERNATIONAL_DOMAIN;

  // Locale-specific metadata
  const metadataByLocale: Record<string, Metadata> = {
    en: {
      title: "GPA Calculator | Convert Norwegian Grades",
      description: "Free tool to calculate your GPA based on the Norwegian grading system. Upload transcripts or enter grades manually.",
      keywords: ["GPA calculator", "Norwegian grading", "grade conversion", "university grades", "academic calculator"],
      authors: [{ name: "UniGPACalc" }],
      icons: sharedIcons,
      openGraph: {
        title: "GPA Calculator | Norwegian Grading System",
        description: "Free tool to calculate your GPA based on the Norwegian grading system. Upload transcripts or enter grades manually.",
        url: `${INTERNATIONAL_DOMAIN}/${locale}`,
        siteName: "UniGPACalc",
        locale: locale,
        type: "website",
        images: [{ url: OG_IMAGE_URL }],
      },
      twitter: {
        card: "summary_large_image",
        title: "GPA Calculator | Norwegian Grading System",
        description: "Free tool to calculate your GPA based on the Norwegian grading system",
        images: [{ url: OG_IMAGE_URL }],
      },
      alternates: {
        canonical: `${INTERNATIONAL_DOMAIN}/${locale}`,
        languages: {
          'en': `${INTERNATIONAL_DOMAIN}/en`,
          'no': `${NORWEGIAN_DOMAIN}`,
          'es': `${INTERNATIONAL_DOMAIN}/es`,
          'fr': `${INTERNATIONAL_DOMAIN}/fr`,
          'de': `${INTERNATIONAL_DOMAIN}/de`
        }
      }
    },
    no: {
      title: "Universitets snitt kalkulator | Beregn ditt snitt med AI",
      description: "Automatisk beregning av ditt universitets eller høyskole snitt. Last opp bilde av din karakterutskrift og få snittet ditt på sekunder.",
      keywords: ["karakterkalkulator", "snittkarakter", "norsk karaktersystem", "universitetskarakterer", "akademisk kalkulator", "høyskolekarakterer", "snittkalkulator", "snittkalk", "snittkalk.no"],
      authors: [{ name: "Snittkalk.no" }],
      icons: sharedIcons,
      openGraph: {
        title: "Universitets snitt kalkulator | Beregn ditt snitt med AI",
        description: "Automatisk beregning av ditt universitets eller høyskole snitt. Last opp bilde av din karakterutskrift og få snittet ditt på sekunder.",
        url: NORWEGIAN_DOMAIN,
        siteName: "SNITTKALK.NO",
        locale: locale,
        type: "website",
        images: [{ url: OG_IMAGE_URL }],
      },
      twitter: {
        card: "summary_large_image",
        title: "Universitets snitt kalkulator | Beregn ditt snitt med AI",
        description: "Automatisk beregning av ditt universitets eller høyskole snitt. Last opp bilde av din karakterutskrift og få snittet ditt på sekunder.",
        images: [{ url: OG_IMAGE_URL }],
      },
      alternates: {
        canonical: NORWEGIAN_DOMAIN,
        languages: {
          'en': `${INTERNATIONAL_DOMAIN}/en`,
          'no': NORWEGIAN_DOMAIN,
          'es': `${INTERNATIONAL_DOMAIN}/es`,
          'fr': `${INTERNATIONAL_DOMAIN}/fr`,
          'de': `${INTERNATIONAL_DOMAIN}/de`
        }
      }
    },
    // Additional languages metadata follows the same pattern
    es: {
      title: "Calculadora de GPA | Conversión Rápida y Gratuita de Notas Noruegas",
      description: "Calcula tu GPA con nuestra calculadora gratuita del sistema noruego. Sube tu expediente o ingresa calificaciones manualmente para conversión instantánea y análisis académico.",
      keywords: ["calculadora GPA", "sistema noruego de calificaciones", "conversión de notas", "calculadora académica", "análisis de expediente"],
      icons: sharedIcons,
      openGraph: {
        title: "Calculadora de GPA | Conversión de Notas Noruegas",
        description: "Calcula tu GPA con nuestra calculadora gratuita del sistema noruego. Sube tu expediente para resultados instantáneos.",
        images: [{ url: OG_IMAGE_URL }],
        url: `${INTERNATIONAL_DOMAIN}/${locale}`,
        type: "website"
      }
    },
    fr: {
      title: "Calculateur de GPA | Conversion Rapide et Gratuite de Notes Norvégiennes",
      description: "Calculez votre GPA avec notre calculateur gratuit du système norvégien. Téléchargez votre relevé de notes ou entrez vos notes manuellement pour une conversion instantanée et une analyse académique.",
      keywords: ["calculateur GPA", "système norvégien de notation", "conversion de notes", "calculateur académique", "analyse de relevé"],
      icons: sharedIcons,
      openGraph: {
        title: "Calculateur de GPA | Conversion de Notes Norvégiennes",
        description: "Calculez votre GPA avec notre calculateur gratuit du système norvégien. Téléchargez votre relevé pour des résultats instantánés.",
        images: [{ url: OG_IMAGE_URL }],
        url: `${INTERNATIONAL_DOMAIN}/${locale}`,
        type: "website"
      }
    },
    de: {
      title: "GPA-Rechner | Schnelle & Kostenlose Umrechnung Norwegischer Noten",
      description: "Berechnen Sie Ihren GPA mit unserem kostenlosen norwegischen Notenrechner. Laden Sie Ihr Zeugnis hoch oder geben Sie Noten manuell ein für sofortige Umrechnung und akademische Analyse.",
      keywords: ["GPA-Rechner", "norwegisches Benotungssystem", "Notenumrechnung", "akademischer Rechner", "Zeugnisanalyse"],
      icons: sharedIcons,
      openGraph: {
        title: "GPA-Rechner | Umrechnung Norwegischer Noten",
        description: "Berechnen Sie Ihren GPA mit unserem kostenlosen norwegischen Notenrechner. Laden Sie Ihr Zeugnis für sofortige Ergebnisse hoch.",
        images: [{ url: OG_IMAGE_URL }],
        url: `${INTERNATIONAL_DOMAIN}/${locale}`,
        type: "website"
      }
    }
  };

  // Return locale-specific metadata or fall back to English
  return metadataByLocale[locale] || metadataByLocale.en;
}

/**
 * Creates metadata for the home page
 */
export async function generateHomeMetadata(params: { locale: string }): Promise<Metadata> {
  const { locale } = params;
  
  // If locale is invalid, default to Norwegian
  if (!hasLocale(routing.locales, locale)) {
    return {
      title: "Karakterkalkulator | Norsk Karaktersystem",
      description: "Gratis verktøy for å beregne ditt karaktersnitt i det norske karaktersystemet. Last opp karakterutskrift eller legg inn karakterer manuelt.",
      keywords: ["karakterkalkulator", "norsk karaktersystem", "karakterberegning", "akademisk kalkulator", "karakterutskrift"],
      icons: sharedIcons,
      openGraph: {
        title: "Karakterkalkulator | Norsk Karaktersystem",
        description: "Gratis verktøy for å beregne ditt karaktersnitt i det norske karaktersystemet. Last opp karakterutskrift eller legg inn karakterer manuelt.",
        images: [{ url: OG_IMAGE_URL }],
        url: NORWEGIAN_DOMAIN,
        siteName: "SNITTKALK.NO",
        type: "website"
      }
    };
  }
  
  // Get domain based on locale
  const domain = locale === 'no' ? NORWEGIAN_DOMAIN : INTERNATIONAL_DOMAIN;
  
  const metadataByLocale: Record<string, Metadata> = {
    en: {
      title: "GPA Calculator | Fast & Free Norwegian Grade Conversion",
      description: "Calculate your GPA with our free Norwegian grade calculator. Upload your transcript or enter grades manually for instant conversion and academic analytics.",
      keywords: ["GPA calculator", "Norwegian grading system", "grade conversion", "academic calculator", "transcript analysis"],
      icons: sharedIcons,
      openGraph: {
        title: "GPA Calculator | Norwegian Grade Conversion",
        description: "Calculate your GPA with our free Norwegian grade calculator. Upload your transcript for instant results.",
        images: [{ url: OG_IMAGE_URL }],
        url: `${INTERNATIONAL_DOMAIN}/${locale}`,
        type: "website"
      }
    },
    no: {
      title: "Karakterkalkulator | Norsk Karaktersystem",
      description: "Gratis verktøy for å beregne ditt karaktersnitt i det norske karaktersystemet. Last opp karakterutskrift eller legg inn karakterer manuelt.",
      keywords: ["karakterkalkulator", "norsk karaktersystem", "karakterberegning", "akademisk kalkulator", "karakterutskrift"],
      icons: sharedIcons,
      openGraph: {
        title: "Karakterkalkulator | Norsk Karaktersystem",
        description: "Gratis verktøy for å beregne ditt karaktersnitt i det norske karaktersystemet. Last opp karakterutskrift eller legg inn karakterer manuelt.",
        images: [{ url: OG_IMAGE_URL }],
        url: NORWEGIAN_DOMAIN,
        siteName: "SNITTKALK.NO",
        type: "website"
      }
    },
    es: {
      title: "Calculadora de GPA | Conversión Rápida y Gratuita de Notas Noruegas",
      description: "Calcula tu GPA con nuestra calculadora gratuita del sistema noruego. Sube tu expediente o ingresa calificaciones manualmente para conversión instantánea y análisis académico.",
      keywords: ["calculadora GPA", "sistema noruego de calificaciones", "conversión de notas", "calculadora académica", "análisis de expediente"],
      icons: sharedIcons,
      openGraph: {
        title: "Calculadora de GPA | Conversión de Notas Noruegas",
        description: "Calcula tu GPA con nuestra calculadora gratuita del sistema noruego. Sube tu expediente para resultados instantáneos.",
        images: [{ url: OG_IMAGE_URL }],
        url: `${INTERNATIONAL_DOMAIN}/${locale}`,
        type: "website"
      }
    },
    fr: {
      title: "Calculateur de GPA | Conversion Rapide et Gratuite de Notes Norvégiennes",
      description: "Calculez votre GPA avec notre calculateur gratuit du système norvégien. Téléchargez votre relevé de notes ou entrez vos notes manuellement pour une conversion instantanée et une analyse académique.",
      keywords: ["calculateur GPA", "système norvégien de notation", "conversion de notes", "calculateur académique", "analyse de relevé"],
      icons: sharedIcons,
      openGraph: {
        title: "Calculateur de GPA | Conversion de Notes Norvégiennes",
        description: "Calculez votre GPA avec notre calculateur gratuit du système norvégien. Téléchargez votre relevé pour des résultats instantánés.",
        images: [{ url: OG_IMAGE_URL }],
        url: `${INTERNATIONAL_DOMAIN}/${locale}`,
        type: "website"
      }
    },
    de: {
      title: "GPA-Rechner | Schnelle & Kostenlose Umrechnung Norwegischer Noten",
      description: "Berechnen Sie Ihren GPA mit unserem kostenlosen norwegischen Notenrechner. Laden Sie Ihr Zeugnis hoch oder geben Sie Noten manuell ein für sofortige Umrechnung und akademische Analyse.",
      keywords: ["GPA-Rechner", "norwegisches Benotungssystem", "Notenumrechnung", "akademischer Rechner", "Zeugnisanalyse"],
      icons: sharedIcons,
      openGraph: {
        title: "GPA-Rechner | Umrechnung Norwegischer Noten",
        description: "Berechnen Sie Ihren GPA mit unserem kostenlosen norwegischen Notenrechner. Laden Sie Ihr Zeugnis für sofortige Ergebnisse hoch.",
        images: [{ url: OG_IMAGE_URL }],
        url: `${INTERNATIONAL_DOMAIN}/${locale}`,
        type: "website"
      }
    }
  };

  return metadataByLocale[locale] || metadataByLocale.en;
}

/**
 * Creates metadata for privacy policy page
 */
export async function generatePrivacyMetadata(params: { locale: string }): Promise<Metadata> {
  const { locale } = params;
  
  const t = await getTranslations({ locale, namespace: 'navigation' });
  
  // Get domain based on locale
  const domain = locale === 'no' ? NORWEGIAN_DOMAIN : INTERNATIONAL_DOMAIN;
  
  const metadataByLocale: Record<string, Metadata> = {
    en: {
      title: "Privacy Policy | GPA Calculator",
      description: "Our privacy policy explains how we handle your data when using our GPA calculator service based on the Norwegian grading system.",
      keywords: ["privacy policy", "GPA calculator privacy", "data protection", "Norwegian GPA"],
      icons: sharedIcons,
      openGraph: {
        title: "Privacy Policy | GPA Calculator",
        description: "Our privacy policy explains how we handle your data when using our GPA calculator service.",
        images: [{ url: OG_IMAGE_URL }],
        url: `${INTERNATIONAL_DOMAIN}/${locale}/personvern`,
        type: "article"
      }
    },
    no: {
      title: "Personvernerklæring | Karakterkalkulator",
      description: "Vår personvernerklæring forklarer hvordan vi håndterer dine data når du bruker vår karakterkalkulator basert på det norske karaktersystemet.",
      keywords: ["personvernerklæring", "personvern karakterkalkulator", "databeskyttelse", "norsk karakterkalkulator"],
      icons: sharedIcons,
      openGraph: {
        title: "Personvernerklæring | Karakterkalkulator",
        description: "Vår personvernerklæring forklarer hvordan vi håndterer dine data når du bruker vår karakterkalkulator.",
        images: [{ url: OG_IMAGE_URL }],
        url: `${NORWEGIAN_DOMAIN}/personvern`,
        siteName: "SNITTKALK.NO",
        type: "article"
      }
    },
    es: {
      title: "Política de Privacidad | Calculadora de GPA",
      description: "Nuestra política de privacidad explica cómo manejamos tus datos al usar nuestro servicio de calculadora de GPA basado en el sistema noruego.",
      keywords: ["política de privacidad", "privacidad calculadora GPA", "protección de datos", "GPA noruego"],
      icons: sharedIcons,
      openGraph: {
        title: "Política de Privacidad | Calculadora de GPA",
        description: "Nuestra política de privacidad explica cómo manejamos tus datos al usar nuestro servicio de calculadora de GPA.",
        images: [{ url: OG_IMAGE_URL }],
        url: `${INTERNATIONAL_DOMAIN}/${locale}/personvern`,
        type: "article"
      }
    },
    fr: {
      title: "Politique de Confidentialité | Calculateur de GPA",
      description: "Notre politique de confidentialité explique comment nous traitons vos données lors de l'utilisation de notre service de calculateur de GPA basé sur le système norvégien.",
      keywords: ["politique de confidentialité", "confidentialité calculateur GPA", "protection des données", "GPA norvégien"],
      icons: sharedIcons,
      openGraph: {
        title: "Politique de Confidentialité | Calculateur de GPA",
        description: "Notre politique de confidentialité explique comment nous traitons vos données lors de l'utilisation de notre service de calculateur de GPA.",
        images: [{ url: OG_IMAGE_URL }],
        url: `${INTERNATIONAL_DOMAIN}/${locale}/personvern`,
        type: "article"
      }
    },
    de: {
      title: "Datenschutzrichtlinie | GPA-Rechner",
      description: "Unsere Datenschutzrichtlinie erklärt, wie wir Ihre Daten bei der Nutzung unseres auf dem norwegischen System basierenden GPA-Rechners verarbeiten.",
      keywords: ["Datenschutzrichtlinie", "GPA-Rechner Datenschutz", "Datenschutz", "Norwegischer GPA"],
      icons: sharedIcons,
      openGraph: {
        title: "Datenschutzrichtlinie | GPA-Rechner",
        description: "Unsere Datenschutzrichtlinie erklärt, wie wir Ihre Daten bei der Nutzung unseres GPA-Rechners verarbeiten.",
        images: [{ url: OG_IMAGE_URL }],
        url: `${INTERNATIONAL_DOMAIN}/${locale}/personvern`,
        type: "article"
      }
    }
  };

  return metadataByLocale[locale] || metadataByLocale.en;
}

/**
 * Creates metadata for terms page
 */
export async function generateTermsMetadata(params: { locale: string }): Promise<Metadata> {
  const { locale } = params;
  
  const t = await getTranslations({ locale, namespace: 'navigation' });
  
  // Get domain based on locale
  const domain = locale === 'no' ? NORWEGIAN_DOMAIN : INTERNATIONAL_DOMAIN;
  
  const metadataByLocale: Record<string, Metadata> = {
    en: {
      title: "Terms of Service | GPA Calculator",
      description: "Read our terms of service for using the GPA Calculator tool based on the Norwegian grading system.",
      keywords: ["terms of service", "GPA calculator terms", "user agreement", "Norwegian GPA calculator"],
      icons: sharedIcons,
      openGraph: {
        title: "Terms of Service | GPA Calculator",
        description: "Read our terms of service for using the GPA Calculator tool.",
        images: [{ url: OG_IMAGE_URL }],
        url: `${INTERNATIONAL_DOMAIN}/${locale}/vilkar`,
        type: "article"
      }
    },
    no: {
      title: "Vilkår for bruk | Karakterkalkulator",
      description: "Les våre vilkår for bruk av Karakterkalkulatoren basert på det norske karaktersystemet.",
      keywords: ["vilkår for bruk", "karakterkalkulator vilkår", "brukeravtale", "norsk karakterkalkulator"],
      icons: sharedIcons,
      openGraph: {
        title: "Vilkår for bruk | Karakterkalkulator",
        description: "Les våre vilkår for bruk av Karakterkalkulatoren.",
        images: [{ url: OG_IMAGE_URL }],
        url: `${NORWEGIAN_DOMAIN}/vilkar`,
        siteName: "SNITTKALK.NO",
        type: "article"
      }
    },
    es: {
      title: "Términos de Servicio | Calculadora de GPA",
      description: "Lea nuestros términos de servicio para usar la herramienta Calculadora de GPA basada en el sistema de calificación noruego.",
      keywords: ["términos de servicio", "términos calculadora GPA", "acuerdo de usuario", "calculadora GPA noruega"],
      icons: sharedIcons,
      openGraph: {
        title: "Términos de Servicio | Calculadora de GPA",
        description: "Lea nuestros términos de servicio para usar la herramienta Calculadora de GPA.",
        images: [{ url: OG_IMAGE_URL }],
        url: `${INTERNATIONAL_DOMAIN}/${locale}/vilkar`,
        type: "article"
      }
    },
    fr: {
      title: "Conditions d'Utilisation | Calculateur de GPA",
      description: "Lisez nos conditions d'utilisation pour utiliser l'outil Calculateur de GPA basé sur le système de notation norvégien.",
      keywords: ["conditions d'utilisation", "conditions calculateur GPA", "accord utilisateur", "calculateur GPA norvégien"],
      icons: sharedIcons,
      openGraph: {
        title: "Conditions d'Utilisation | Calculateur de GPA",
        description: "Lisez nos conditions d'utilisation pour utiliser l'outil Calculateur de GPA.",
        images: [{ url: OG_IMAGE_URL }],
        url: `${INTERNATIONAL_DOMAIN}/${locale}/vilkar`,
        type: "article"
      }
    },
    de: {
      title: "Nutzungsbedingungen | GPA-Rechner",
      description: "Lesen Sie unsere Nutzungsbedingungen für die Verwendung des GPA-Rechners basierend auf dem norwegischen Benotungssystem.",
      keywords: ["Nutzungsbedingungen", "GPA-Rechner Bedingungen", "Benutzervereinbarung", "Norwegischer GPA-Rechner"],
      icons: sharedIcons,
      openGraph: {
        title: "Nutzungsbedingungen | GPA-Rechner",
        description: "Lesen Sie unsere Nutzungsbedingungen für die Verwendung des GPA-Rechners.",
        images: [{ url: OG_IMAGE_URL }],
        url: `${INTERNATIONAL_DOMAIN}/${locale}/vilkar`,
        type: "article"
      }
    }
  };

  return metadataByLocale[locale] || metadataByLocale.en;
}

/**
 * Creates metadata for contact page
 */
export async function generateContactMetadata(params: { locale: string }): Promise<Metadata> {
  const { locale } = params;
  
  const tNav = await getTranslations({ locale, namespace: 'navigation' });
  
  // Get domain based on locale
  const domain = locale === 'no' ? NORWEGIAN_DOMAIN : INTERNATIONAL_DOMAIN;
  
  const metadataByLocale: Record<string, Metadata> = {
    en: {
      title: "Contact Us | GPA Calculator",
      description: "Get in touch with us about the GPA Calculator based on the Norwegian grading system. We're here to help with your questions and feedback.",
      keywords: ["contact", "GPA calculator help", "support", "feedback", "Norwegian grading"],
      icons: sharedIcons,
      openGraph: {
        title: "Contact Us | GPA Calculator",
        description: "Get in touch with us about the GPA Calculator. We're here to help with your questions and feedback.",
        images: [{ url: OG_IMAGE_URL }],
        url: `${INTERNATIONAL_DOMAIN}/${locale}/kontakt`,
        type: "website"
      }
    },
    no: {
      title: "Kontakt Oss | Karakterkalkulator",
      description: "Ta kontakt med oss angående Karakterkalkulatoren basert på det norske karaktersystemet. Vi er her for å hjelpe deg med dine spørsmål og tilbakemeldinger.",
      keywords: ["kontakt", "karakterkalkulator hjelp", "support", "tilbakemelding", "norsk karaktersystem"],
      icons: sharedIcons,
      openGraph: {
        title: "Kontakt Oss | Karakterkalkulator",
        description: "Ta kontakt med oss angående Karakterkalkulatoren. Vi er her for å hjelpe deg med dine spørsmål og tilbakemeldinger.",
        images: [{ url: OG_IMAGE_URL }],
        url: `${NORWEGIAN_DOMAIN}/kontakt`,
        siteName: "SNITTKALK.NO",
        type: "website"
      }
    },
    es: {
      title: "Contáctenos | Calculadora de GPA",
      description: "Póngase en contacto con nosotros sobre la Calculadora de GPA basada en el sistema de calificación noruego. Estamos aquí para ayudar con sus preguntas y comentarios.",
      keywords: ["contacto", "ayuda calculadora GPA", "soporte", "comentarios", "calificación noruega"],
      icons: sharedIcons,
      openGraph: {
        title: "Contáctenos | Calculadora de GPA",
        description: "Póngase en contacto con nosotros sobre la Calculadora de GPA. Estamos aquí para ayudar con sus preguntas y comentarios.",
        images: [{ url: OG_IMAGE_URL }],
        url: `${INTERNATIONAL_DOMAIN}/${locale}/kontakt`,
        type: "website"
      }
    },
    fr: {
      title: "Contactez-Nous | Calculateur de GPA",
      description: "Contactez-nous au sujet du Calculateur de GPA basé sur le système de notation norvégien. Nous sommes là pour vous aider avec vos questions et commentaires.",
      keywords: ["contact", "aide calculateur GPA", "support", "commentaires", "notation norvégienne"],
      icons: sharedIcons,
      openGraph: {
        title: "Contactez-Nous | Calculateur de GPA",
        description: "Contactez-nous au sujet du Calculateur de GPA. Nous sommes là pour vous aider avec vos questions et commentaires.",
        images: [{ url: OG_IMAGE_URL }],
        url: `${INTERNATIONAL_DOMAIN}/${locale}/kontakt`,
        type: "website"
      }
    },
    de: {
      title: "Kontaktieren Sie Uns | GPA-Rechner",
      description: "Nehmen Sie Kontakt mit uns auf bezüglich des GPA-Rechners basierend auf dem norwegischen Benotungssystem. Wir sind hier, um Ihnen bei Ihren Fragen und Rückmeldungen zu helfen.",
      keywords: ["Kontakt", "GPA-Rechner Hilfe", "Support", "Feedback", "Norwegische Benotung"],
      icons: sharedIcons,
      openGraph: {
        title: "Kontaktieren Sie Uns | GPA-Rechner",
        description: "Nehmen Sie Kontakt mit uns auf bezüglich des GPA-Rechners. Wir sind hier, um Ihnen bei Ihren Fragen und Rückmeldungen zu helfen.",
        images: [{ url: OG_IMAGE_URL }],
        url: `${INTERNATIONAL_DOMAIN}/${locale}/kontakt`,
        type: "website"
      }
    }
  };

  return metadataByLocale[locale] || metadataByLocale.en;
} 