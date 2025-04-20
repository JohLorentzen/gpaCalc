'use client';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import ContactForm from '@/components/ContactForm';

// Client component for the page content
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