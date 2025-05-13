import type { Metadata } from "next";
import { getTranslations } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { routing } from '@/i18n/routing';

// Define the OG image URL from Supabase
const OG_IMAGE_URL = "https://xauigkarhbwvuzweekbi.supabase.co/storage/v1/object/public/images//Screenshot%202025-05-13%20at%2012.43.58.png";

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
      openGraph: {
        images: [{ url: OG_IMAGE_URL }],
      },
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
        images: [{ url: OG_IMAGE_URL }],
      },
      twitter: {
        card: "summary_large_image",
        title: "GPA Calculator | Norwegian Grading System",
        description: "Free tool to calculate your GPA based on the Norwegian grading system",
        images: [{ url: OG_IMAGE_URL }],
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
        images: [{ url: OG_IMAGE_URL }],
      },
      twitter: {
        card: "summary_large_image",
        title: "Karakterkalkulator | Norsk Karaktersystem",
        description: "Gratis verktøy for å beregne ditt karaktersnitt i det norske karaktersystemet",
        images: [{ url: OG_IMAGE_URL }],
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
    // Additional languages metadata follows the same pattern
    es: {
      title: "Calculadora de GPA | Conversión Rápida y Gratuita de Notas Noruegas",
      description: "Calcula tu GPA con nuestra calculadora gratuita del sistema noruego. Sube tu expediente o ingresa calificaciones manualmente para conversión instantánea y análisis académico.",
      keywords: ["calculadora GPA", "sistema noruego de calificaciones", "conversión de notas", "calculadora académica", "análisis de expediente"],
      openGraph: {
        title: "Calculadora de GPA | Conversión de Notas Noruegas",
        description: "Calcula tu GPA con nuestra calculadora gratuita del sistema noruego. Sube tu expediente para resultados instantáneos.",
        images: [{ url: OG_IMAGE_URL }],
        url: `https://unigpacalc.com/${locale}`,
        type: "website"
      }
    },
    fr: {
      title: "Calculateur de GPA | Conversion Rapide et Gratuite de Notes Norvégiennes",
      description: "Calculez votre GPA avec notre calculateur gratuit du système norvégien. Téléchargez votre relevé de notes ou entrez vos notes manuellement pour une conversion instantanée et une analyse académique.",
      keywords: ["calculateur GPA", "système norvégien de notation", "conversion de notes", "calculateur académique", "analyse de relevé"],
      openGraph: {
        title: "Calculateur de GPA | Conversion de Notes Norvégiennes",
        description: "Calculez votre GPA avec notre calculateur gratuit du système norvégien. Téléchargez votre relevé pour des résultats instantánés.",
        images: [{ url: OG_IMAGE_URL }],
        url: `https://unigpacalc.com/${locale}`,
        type: "website"
      }
    },
    de: {
      title: "GPA-Rechner | Schnelle & Kostenlose Umrechnung Norwegischer Noten",
      description: "Berechnen Sie Ihren GPA mit unserem kostenlosen norwegischen Notenrechner. Laden Sie Ihr Zeugnis hoch oder geben Sie Noten manuell ein für sofortige Umrechnung und akademische Analyse.",
      keywords: ["GPA-Rechner", "norwegisches Benotungssystem", "Notenumrechnung", "akademischer Rechner", "Zeugnisanalyse"],
      openGraph: {
        title: "GPA-Rechner | Umrechnung Norwegischer Noten",
        description: "Berechnen Sie Ihren GPA mit unserem kostenlosen norwegischen Notenrechner. Laden Sie Ihr Zeugnis für sofortige Ergebnisse hoch.",
        images: [{ url: OG_IMAGE_URL }],
        url: `https://unigpacalc.com/${locale}`,
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
      title: "Karakterkalkulator | Rask og Gratis Karakterberegning",
      description: "Beregn ditt karaktersnitt med vår gratis norske karakterkalkulator. Last opp karakterutskrift eller legg inn karakterer manuelt for øyeblikkelig konvertering og akademisk analyse.",
      keywords: ["karakterkalkulator", "norsk karaktersystem", "karakterberegning", "akademisk kalkulator", "karakterutskrift"],
      openGraph: {
        title: "Karakterkalkulator | Norsk Karakterberegning",
        description: "Beregn ditt karaktersnitt med vår gratis norske karakterkalkulator. Last opp karakterutskrift for øyeblikkelige resultater.",
        images: [{ url: OG_IMAGE_URL }],
        url: `https://unigpacalc.com/no`,
        type: "website"
      }
    };
  }
  
  const metadataByLocale: Record<string, Metadata> = {
    en: {
      title: "GPA Calculator | Fast & Free Norwegian Grade Conversion",
      description: "Calculate your GPA with our free Norwegian grade calculator. Upload your transcript or enter grades manually for instant conversion and academic analytics.",
      keywords: ["GPA calculator", "Norwegian grading system", "grade conversion", "academic calculator", "transcript analysis"],
      openGraph: {
        title: "GPA Calculator | Norwegian Grade Conversion",
        description: "Calculate your GPA with our free Norwegian grade calculator. Upload your transcript for instant results.",
        images: [{ url: OG_IMAGE_URL }],
        url: `https://unigpacalc.com/${locale}`,
        type: "website"
      }
    },
    no: {
      title: "Karakterkalkulator | Rask og Gratis Karakterberegning",
      description: "Beregn ditt karaktersnitt med vår gratis norske karakterkalkulator. Last opp karakterutskrift eller legg inn karakterer manuelt for øyeblikkelig konvertering og akademisk analyse.",
      keywords: ["karakterkalkulator", "norsk karaktersystem", "karakterberegning", "akademisk kalkulator", "karakterutskrift"],
      openGraph: {
        title: "Karakterkalkulator | Norsk Karakterberegning",
        description: "Beregn ditt karaktersnitt med vår gratis norske karakterkalkulator. Last opp karakterutskrift for øyeblikkelige resultater.",
        images: [{ url: OG_IMAGE_URL }],
        url: `https://unigpacalc.com/${locale}`,
        type: "website"
      }
    },
    es: {
      title: "Calculadora de GPA | Conversión Rápida y Gratuita de Notas Noruegas",
      description: "Calcula tu GPA con nuestra calculadora gratuita del sistema noruego. Sube tu expediente o ingresa calificaciones manualmente para conversión instantánea y análisis académico.",
      keywords: ["calculadora GPA", "sistema noruego de calificaciones", "conversión de notas", "calculadora académica", "análisis de expediente"],
      openGraph: {
        title: "Calculadora de GPA | Conversión de Notas Noruegas",
        description: "Calcula tu GPA con nuestra calculadora gratuita del sistema noruego. Sube tu expediente para resultados instantáneos.",
        images: [{ url: OG_IMAGE_URL }],
        url: `https://unigpacalc.com/${locale}`,
        type: "website"
      }
    },
    fr: {
      title: "Calculateur de GPA | Conversion Rapide et Gratuite de Notes Norvégiennes",
      description: "Calculez votre GPA avec notre calculateur gratuit du système norvégien. Téléchargez votre relevé de notes ou entrez vos notes manuellement pour une conversion instantanée et une analyse académique.",
      keywords: ["calculateur GPA", "système norvégien de notation", "conversion de notes", "calculateur académique", "analyse de relevé"],
      openGraph: {
        title: "Calculateur de GPA | Conversion de Notes Norvégiennes",
        description: "Calculez votre GPA avec notre calculateur gratuit du système norvégien. Téléchargez votre relevé pour des résultats instantánés.",
        images: [{ url: OG_IMAGE_URL }],
        url: `https://unigpacalc.com/${locale}`,
        type: "website"
      }
    },
    de: {
      title: "GPA-Rechner | Schnelle & Kostenlose Umrechnung Norwegischer Noten",
      description: "Berechnen Sie Ihren GPA mit unserem kostenlosen norwegischen Notenrechner. Laden Sie Ihr Zeugnis hoch oder geben Sie Noten manuell ein für sofortige Umrechnung und akademische Analyse.",
      keywords: ["GPA-Rechner", "norwegisches Benotungssystem", "Notenumrechnung", "akademischer Rechner", "Zeugnisanalyse"],
      openGraph: {
        title: "GPA-Rechner | Umrechnung Norwegischer Noten",
        description: "Berechnen Sie Ihren GPA mit unserem kostenlosen norwegischen Notenrechner. Laden Sie Ihr Zeugnis für sofortige Ergebnisse hoch.",
        images: [{ url: OG_IMAGE_URL }],
        url: `https://unigpacalc.com/${locale}`,
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
  
  const metadataByLocale: Record<string, Metadata> = {
    en: {
      title: "Privacy Policy | GPA Calculator",
      description: "Our privacy policy explains how we handle your data when using our GPA calculator service based on the Norwegian grading system.",
      keywords: ["privacy policy", "GPA calculator privacy", "data protection", "Norwegian GPA"],
      openGraph: {
        title: "Privacy Policy | GPA Calculator",
        description: "Our privacy policy explains how we handle your data when using our GPA calculator service.",
        images: [{ url: OG_IMAGE_URL }],
        url: `https://unigpacalc.com/${locale}/personvern`,
        type: "article"
      }
    },
    no: {
      title: "Personvernerklæring | Karakterkalkulator",
      description: "Vår personvernerklæring forklarer hvordan vi håndterer dine data når du bruker vår karakterkalkulator basert på det norske karaktersystemet.",
      keywords: ["personvernerklæring", "personvern karakterkalkulator", "databeskyttelse", "norsk karakterkalkulator"],
      openGraph: {
        title: "Personvernerklæring | Karakterkalkulator",
        description: "Vår personvernerklæring forklarer hvordan vi håndterer dine data når du bruker vår karakterkalkulator.",
        images: [{ url: OG_IMAGE_URL }],
        url: `https://unigpacalc.com/${locale}/personvern`,
        type: "article"
      }
    },
    es: {
      title: "Política de Privacidad | Calculadora de GPA",
      description: "Nuestra política de privacidad explica cómo manejamos tus datos al usar nuestro servicio de calculadora de GPA basado en el sistema noruego.",
      keywords: ["política de privacidad", "privacidad calculadora GPA", "protección de datos", "GPA noruego"],
      openGraph: {
        title: "Política de Privacidad | Calculadora de GPA",
        description: "Nuestra política de privacidad explica cómo manejamos tus datos al usar nuestro servicio de calculadora de GPA.",
        images: [{ url: OG_IMAGE_URL }],
        url: `https://unigpacalc.com/${locale}/personvern`,
        type: "article"
      }
    },
    fr: {
      title: "Politique de Confidentialité | Calculateur de GPA",
      description: "Notre politique de confidentialité explique comment nous traitons vos données lors de l'utilisation de notre service de calculateur de GPA basé sur le système norvégien.",
      keywords: ["politique de confidentialité", "confidentialité calculateur GPA", "protection des données", "GPA norvégien"],
      openGraph: {
        title: "Politique de Confidentialité | Calculateur de GPA",
        description: "Notre politique de confidentialité explique comment nous traitons vos données lors de l'utilisation de notre service de calculateur de GPA.",
        images: [{ url: OG_IMAGE_URL }],
        url: `https://unigpacalc.com/${locale}/personvern`,
        type: "article"
      }
    },
    de: {
      title: "Datenschutzrichtlinie | GPA-Rechner",
      description: "Unsere Datenschutzrichtlinie erklärt, wie wir Ihre Daten bei der Nutzung unseres auf dem norwegischen System basierenden GPA-Rechners verarbeiten.",
      keywords: ["Datenschutzrichtlinie", "GPA-Rechner Datenschutz", "Datenschutz", "Norwegischer GPA"],
      openGraph: {
        title: "Datenschutzrichtlinie | GPA-Rechner",
        description: "Unsere Datenschutzrichtlinie erklärt, wie wir Ihre Daten bei der Nutzung unseres GPA-Rechners verarbeiten.",
        images: [{ url: OG_IMAGE_URL }],
        url: `https://unigpacalc.com/${locale}/personvern`,
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
  
  const metadataByLocale: Record<string, Metadata> = {
    en: {
      title: "Terms of Service | GPA Calculator",
      description: "Read our terms of service for using the GPA Calculator tool based on the Norwegian grading system.",
      keywords: ["terms of service", "GPA calculator terms", "user agreement", "Norwegian GPA calculator"],
      openGraph: {
        title: "Terms of Service | GPA Calculator",
        description: "Read our terms of service for using the GPA Calculator tool.",
        images: [{ url: OG_IMAGE_URL }],
        url: `https://unigpacalc.com/${locale}/vilkar`,
        type: "article"
      }
    },
    no: {
      title: "Vilkår for bruk | Karakterkalkulator",
      description: "Les våre vilkår for bruk av Karakterkalkulatoren basert på det norske karaktersystemet.",
      keywords: ["vilkår for bruk", "karakterkalkulator vilkår", "brukeravtale", "norsk karakterkalkulator"],
      openGraph: {
        title: "Vilkår for bruk | Karakterkalkulator",
        description: "Les våre vilkår for bruk av Karakterkalkulatoren.",
        images: [{ url: OG_IMAGE_URL }],
        url: `https://unigpacalc.com/${locale}/vilkar`,
        type: "article"
      }
    },
    es: {
      title: "Términos de Servicio | Calculadora de GPA",
      description: "Lea nuestros términos de servicio para usar la herramienta Calculadora de GPA basada en el sistema de calificación noruego.",
      keywords: ["términos de servicio", "términos calculadora GPA", "acuerdo de usuario", "calculadora GPA noruega"],
      openGraph: {
        title: "Términos de Servicio | Calculadora de GPA",
        description: "Lea nuestros términos de servicio para usar la herramienta Calculadora de GPA.",
        images: [{ url: OG_IMAGE_URL }],
        url: `https://unigpacalc.com/${locale}/vilkar`,
        type: "article"
      }
    },
    fr: {
      title: "Conditions d'Utilisation | Calculateur de GPA",
      description: "Lisez nos conditions d'utilisation pour utiliser l'outil Calculateur de GPA basé sur le système de notation norvégien.",
      keywords: ["conditions d'utilisation", "conditions calculateur GPA", "accord utilisateur", "calculateur GPA norvégien"],
      openGraph: {
        title: "Conditions d'Utilisation | Calculateur de GPA",
        description: "Lisez nos conditions d'utilisation pour utiliser l'outil Calculateur de GPA.",
        images: [{ url: OG_IMAGE_URL }],
        url: `https://unigpacalc.com/${locale}/vilkar`,
        type: "article"
      }
    },
    de: {
      title: "Nutzungsbedingungen | GPA-Rechner",
      description: "Lesen Sie unsere Nutzungsbedingungen für die Verwendung des GPA-Rechners basierend auf dem norwegischen Benotungssystem.",
      keywords: ["Nutzungsbedingungen", "GPA-Rechner Bedingungen", "Benutzervereinbarung", "Norwegischer GPA-Rechner"],
      openGraph: {
        title: "Nutzungsbedingungen | GPA-Rechner",
        description: "Lesen Sie unsere Nutzungsbedingungen für die Verwendung des GPA-Rechners.",
        images: [{ url: OG_IMAGE_URL }],
        url: `https://unigpacalc.com/${locale}/vilkar`,
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
  
  const metadataByLocale: Record<string, Metadata> = {
    en: {
      title: "Contact Us | GPA Calculator",
      description: "Get in touch with us about the GPA Calculator based on the Norwegian grading system. We're here to help with your questions and feedback.",
      keywords: ["contact", "GPA calculator help", "support", "feedback", "Norwegian grading"],
      openGraph: {
        title: "Contact Us | GPA Calculator",
        description: "Get in touch with us about the GPA Calculator. We're here to help with your questions and feedback.",
        images: [{ url: OG_IMAGE_URL }],
        url: `https://unigpacalc.com/${locale}/kontakt`,
        type: "website"
      }
    },
    no: {
      title: "Kontakt Oss | Karakterkalkulator",
      description: "Ta kontakt med oss angående Karakterkalkulatoren basert på det norske karaktersystemet. Vi er her for å hjelpe deg med dine spørsmål og tilbakemeldinger.",
      keywords: ["kontakt", "karakterkalkulator hjelp", "support", "tilbakemelding", "norsk karaktersystem"],
      openGraph: {
        title: "Kontakt Oss | Karakterkalkulator",
        description: "Ta kontakt med oss angående Karakterkalkulatoren. Vi er her for å hjelpe deg med dine spørsmål og tilbakemeldinger.",
        images: [{ url: OG_IMAGE_URL }],
        url: `https://unigpacalc.com/${locale}/kontakt`,
        type: "website"
      }
    },
    es: {
      title: "Contáctenos | Calculadora de GPA",
      description: "Póngase en contacto con nosotros sobre la Calculadora de GPA basada en el sistema de calificación noruego. Estamos aquí para ayudar con sus preguntas y comentarios.",
      keywords: ["contacto", "ayuda calculadora GPA", "soporte", "comentarios", "calificación noruega"],
      openGraph: {
        title: "Contáctenos | Calculadora de GPA",
        description: "Póngase en contacto con nosotros sobre la Calculadora de GPA. Estamos aquí para ayudar con sus preguntas y comentarios.",
        images: [{ url: OG_IMAGE_URL }],
        url: `https://unigpacalc.com/${locale}/kontakt`,
        type: "website"
      }
    },
    fr: {
      title: "Contactez-Nous | Calculateur de GPA",
      description: "Contactez-nous au sujet du Calculateur de GPA basé sur le système de notation norvégien. Nous sommes là pour vous aider avec vos questions et commentaires.",
      keywords: ["contact", "aide calculateur GPA", "support", "commentaires", "notation norvégienne"],
      openGraph: {
        title: "Contactez-Nous | Calculateur de GPA",
        description: "Contactez-nous au sujet du Calculateur de GPA. Nous sommes là pour vous aider avec vos questions et commentaires.",
        images: [{ url: OG_IMAGE_URL }],
        url: `https://unigpacalc.com/${locale}/kontakt`,
        type: "website"
      }
    },
    de: {
      title: "Kontaktieren Sie Uns | GPA-Rechner",
      description: "Nehmen Sie Kontakt mit uns auf bezüglich des GPA-Rechners basierend auf dem norwegischen Benotungssystem. Wir sind hier, um Ihnen bei Ihren Fragen und Rückmeldungen zu helfen.",
      keywords: ["Kontakt", "GPA-Rechner Hilfe", "Support", "Feedback", "Norwegische Benotung"],
      openGraph: {
        title: "Kontaktieren Sie Uns | GPA-Rechner",
        description: "Nehmen Sie Kontakt mit uns auf bezüglich des GPA-Rechners. Wir sind hier, um Ihnen bei Ihren Fragen und Rückmeldungen zu helfen.",
        images: [{ url: OG_IMAGE_URL }],
        url: `https://unigpacalc.com/${locale}/kontakt`,
        type: "website"
      }
    }
  };

  return metadataByLocale[locale] || metadataByLocale.en;
} 