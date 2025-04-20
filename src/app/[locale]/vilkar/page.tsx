import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import type { Metadata } from "next";
import { getTranslations } from 'next-intl/server';

// Generate metadata for terms page
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
      title: "Terms of Service | GPA Calculator",
      description: "Read our terms of service for using the GPA Calculator tool based on the Norwegian grading system.",
      keywords: ["terms of service", "GPA calculator terms", "user agreement", "Norwegian GPA calculator"],
      openGraph: {
        title: "Terms of Service | GPA Calculator",
        description: "Read our terms of service for using the GPA Calculator tool.",
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
        url: `https://unigpacalc.com/${locale}/vilkar`,
        type: "article"
      }
    }
  };

  return metadataByLocale[locale] || metadataByLocale.en;
}

// Client component for the page content
'use client';
export default function TermsPage() {
  const t = useTranslations('navigation');
  const { locale } = useParams();
  
  return (
    <main className="flex-1 container max-w-4xl mx-auto px-4 py-8 pt-20">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 tracking-tight">{t('terms')}</h1>
        <nav className="flex mb-6 text-sm text-muted-foreground">
          <Link href={`/${locale}`} className="hover:text-primary">
            {t('home')}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">{t('terms')}</span>
        </nav>
      </div>
      
      <div className="prose prose-lg dark:prose-invert max-w-none mb-8">
        <h2 className="text-2xl font-medium tracking-tight">Terms of Service</h2>
        <p className="text-muted-foreground">Last updated: June 1, 2023</p>
        
        <h3>1. Acceptance of Terms</h3>
        <p>
          By accessing or using UniGPACalc, you agree to be bound by these Terms of Service. If you do not agree to these terms, 
          please do not use our service.
        </p>
        
        <h3>2. Description of Service</h3>
        <p>
          UniGPACalc provides a web-based GPA calculation service that allows users to calculate their grade point average based on 
          the Norwegian grading system. The service includes manual grade entry and transcript image processing.
        </p>
        
        <h3>3. User Responsibilities</h3>
        <p>
          When using our service, you agree to:
        </p>
        <ul>
          <li>Provide accurate information when using the calculator</li>
          <li>Not use the service for any illegal or unauthorized purpose</li>
          <li>Not attempt to interfere with or disrupt the service or its servers</li>
          <li>Not try to access data that is not intended for you</li>
        </ul>
        
        <h3>4. Intellectual Property</h3>
        <p>
          All content, features, and functionality on UniGPACalc, including but not limited to text, graphics, logos, icons, 
          and software, are owned by or licensed to us and are protected by copyright, trademark, and other intellectual property laws.
        </p>
        
        <h3>5. Disclaimer of Warranties</h3>
        <p>
          The service is provided "as is" and "as available" without warranties of any kind, either express or implied. 
          We do not guarantee the accuracy of GPA calculations and recommend that users verify results through their educational institution.
        </p>
        
        <h3>6. Limitation of Liability</h3>
        <p>
          In no event shall UniGPACalc or its affiliates be liable for any indirect, incidental, special, consequential or punitive damages, 
          including but not limited to loss of profits, data, or other intangible losses, resulting from your use of or inability to use the service.
        </p>
        
        <h3>7. Changes to Terms</h3>
        <p>
          We reserve the right to modify these terms at any time. If we make changes, we will provide notice by updating the date at the top of these terms. 
          Your continued use of the service after such changes constitutes your acceptance of the new terms.
        </p>
        
        <h3>8. Contact Us</h3>
        <p>
          If you have any questions about these Terms, please contact us through our 
          <Link href={`/${locale}/kontakt`} className="text-primary hover:underline">
            {" "}contact form
          </Link>.
        </p>
      </div>
    </main>
  );
} 