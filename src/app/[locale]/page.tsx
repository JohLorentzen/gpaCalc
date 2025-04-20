import type { Metadata } from "next";
import dynamic from 'next/dynamic';

// Import the client component (remove ssr:false from Server Component)
const PageContent = dynamic(() => import('./PageContent'));

export async function generateMetadata({
  params
}: {
  params: { locale: string } | Promise<{ locale: string }>
}): Promise<Metadata> {
  // Ensure params is awaited
  const resolvedParams = await Promise.resolve(params);
  const locale = resolvedParams.locale;
  
  const metadataByLocale: Record<string, Metadata> = {
    en: {
      title: "GPA Calculator | Fast & Free Norwegian Grade Conversion",
      description: "Calculate your GPA with our free Norwegian grade calculator. Upload your transcript or enter grades manually for instant conversion and academic analytics.",
      keywords: ["GPA calculator", "Norwegian grading system", "grade conversion", "academic calculator", "transcript analysis"],
      openGraph: {
        title: "GPA Calculator | Norwegian Grade Conversion",
        description: "Calculate your GPA with our free Norwegian grade calculator. Upload your transcript for instant results.",
        images: [{ url: '/og-image.jpg' }],
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
        images: [{ url: '/og-image.jpg' }],
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
        images: [{ url: '/og-image.jpg' }],
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
        description: "Calculez votre GPA avec notre calculateur gratuit du système norvégien. Téléchargez votre relevé pour des résultats instantanés.",
        images: [{ url: '/og-image.jpg' }],
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
        images: [{ url: '/og-image.jpg' }],
        url: `https://unigpacalc.com/${locale}`,
        type: "website"
      }
    }
  };

  return metadataByLocale[locale] || metadataByLocale.en;
}

export default function Page() {
  return <PageContent />;
} 