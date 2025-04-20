import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import type { Metadata } from "next";
import { getTranslations } from 'next-intl/server';
import ContactForm from '@/components/ContactForm';

// Generate metadata for contact page
export async function generateMetadata({
  params
}: {
  params: { locale: string } | Promise<{ locale: string }>
}): Promise<Metadata> {
  // Ensure params is awaited
  const resolvedParams = await Promise.resolve(params);
  const locale = resolvedParams.locale;
  
  const tNav = await getTranslations({ locale, namespace: 'navigation' });
  
  const metadataByLocale: Record<string, Metadata> = {
    en: {
      title: "Contact Us | GPA Calculator",
      description: "Get in touch with us about the GPA Calculator based on the Norwegian grading system. We're here to help with your questions and feedback.",
      keywords: ["contact", "GPA calculator help", "support", "feedback", "Norwegian grading"],
      openGraph: {
        title: "Contact Us | GPA Calculator",
        description: "Get in touch with us about the GPA Calculator. We're here to help with your questions and feedback.",
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
        url: `https://unigpacalc.com/${locale}/kontakt`,
        type: "website"
      }
    }
  };

  return metadataByLocale[locale] || metadataByLocale.en;
}

// Client component for the page content
'use client';
export default function ContactPage() {
  const tNav = useTranslations('navigation');
  const tContact = useTranslations('contact');
  const { locale } = useParams();
  
  return (
    <main className="flex-1 container max-w-4xl mx-auto px-4 py-8 pt-20">
      <div className="mb-6">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 tracking-tight">{tNav('contact')}</h1>
        <nav className="flex mb-6 text-sm text-muted-foreground">
          <Link href={`/${locale}`} className="hover:text-primary">
            {tNav('home')}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">{tNav('contact')}</span>
        </nav>
        <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
          {tContact('description')}
        </p>
      </div>
      
      <ContactForm />
    </main>
  );
} 