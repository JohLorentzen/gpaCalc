import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import type { Metadata } from "next";
import { getTranslations } from 'next-intl/server';

// Generate metadata for privacy policy page
export async function generateMetadata({
  params
}: {
  params: { locale: string } | Promise<{ locale: string }>
}): Promise<Metadata> {
  // Ensure params is awaited
  const resolvedParams = await Promise.resolve(params);
  const locale = resolvedParams.locale;
  
  const t = await getTranslations({ locale, namespace: 'navigation' });
  
  const metadataByLocale: Record<string, Metadata> = {
    en: {
      title: "Privacy Policy | GPA Calculator",
      description: "Our privacy policy explains how we handle your data when using our GPA calculator service based on the Norwegian grading system.",
      keywords: ["privacy policy", "GPA calculator privacy", "data protection", "Norwegian GPA"],
      openGraph: {
        title: "Privacy Policy | GPA Calculator",
        description: "Our privacy policy explains how we handle your data when using our GPA calculator service.",
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
        url: `https://unigpacalc.com/${locale}/personvern`,
        type: "article"
      }
    }
  };

  return metadataByLocale[locale] || metadataByLocale.en;
}

// Client component for the page content
'use client';
export default function PrivacyPage() {
  const t = useTranslations('navigation');
  const { locale } = useParams();
  
  return (
    <main className="flex-1 container max-w-4xl mx-auto px-4 py-8 pt-20">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 tracking-tight">{t('privacy')}</h1>
        <nav className="flex mb-6 text-sm text-muted-foreground">
          <Link href={`/${locale}`} className="hover:text-primary">
            {t('home')}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">{t('privacy')}</span>
        </nav>
      </div>
      
      <div className="prose prose-lg dark:prose-invert max-w-none mb-8">
        <h2 className="text-2xl font-medium tracking-tight">Privacy Policy</h2>
        <p className="text-muted-foreground">Last updated: June 1, 2023</p>
        
        <h3>1. Introduction</h3>
        <p>
          Welcome to UniGPACalc. We respect your privacy and are committed to protecting your personal data. 
          This privacy policy will inform you about how we look after your personal data when you visit our website 
          and tell you about your privacy rights and how the law protects you.
        </p>
        
        <h3>2. The Data We Collect</h3>
        <p>
          When you use our GPA calculator, we may collect the following types of information:
        </p>
        <ul>
          <li>Course names and grades you enter manually</li>
          <li>Transcript images you upload for processing</li>
          <li>Usage statistics and interaction data</li>
        </ul>
        
        <h3>3. How We Use Your Data</h3>
        <p>
          We use your data in the following ways:
        </p>
        <ul>
          <li>To provide the GPA calculation service</li>
          <li>To improve our algorithms and text recognition</li>
          <li>To analyze usage patterns and improve our service</li>
        </ul>
        
        <h3>4. Data Security</h3>
        <p>
          We implement appropriate security measures to protect your personal data against accidental loss, 
          unauthorized access, or processing. Your transcript data is processed on our secure servers and 
          is not shared with third parties.
        </p>
        
        <h3>5. Your Rights</h3>
        <p>
          Under certain circumstances, you have rights under data protection laws in relation to your personal data, including:
        </p>
        <ul>
          <li>The right to request access to your personal data</li>
          <li>The right to request correction of your personal data</li>
          <li>The right to request erasure of your personal data</li>
          <li>The right to withdraw consent</li>
        </ul>
        
        <h3>6. Contact Us</h3>
        <p>
          If you have any questions about this privacy policy or our privacy practices, please contact us through our 
          <Link href={`/${locale}/kontakt`} className="text-primary hover:underline">
            {" "}contact form
          </Link>.
        </p>
      </div>
    </main>
  );
} 