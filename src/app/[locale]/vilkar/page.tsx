'use client';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useParams } from 'next/navigation';

// Client component for the page content
export default function TermsPage() {
  const t = useTranslations('navigation');
  const termsT = useTranslations('terms');
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
        <h2 className="text-2xl font-medium tracking-tight">{termsT('title')}</h2>
        <p className="text-muted-foreground">{termsT('lastUpdated')}</p>
        
        <h3>{termsT('acceptance.title')}</h3>
        <p>
          {termsT('acceptance.content')}
        </p>
        
        <h3>{termsT('description.title')}</h3>
        <p>
          {termsT('description.content')}
        </p>
        
        <h3>{termsT('responsibilities.title')}</h3>
        <p>
          {termsT('responsibilities.content')}
        </p>
        <ul>
          {termsT.raw('responsibilities.items').map((item: string, index: number) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
        
        <h3>{termsT('intellectual.title')}</h3>
        <p>
          {termsT('intellectual.content')}
        </p>
        
        <h3>{termsT('disclaimer.title')}</h3>
        <p>
          {termsT('disclaimer.content')}
        </p>
        
        <h3>{termsT('limitation.title')}</h3>
        <p>
          {termsT('limitation.content')}
        </p>
        
        <h3>{termsT('changes.title')}</h3>
        <p>
          {termsT('changes.content')}
        </p>
        
        <h3>{termsT('contact.title')}</h3>
        <p>
          {termsT('contact.content')}
          <Link href={`/${locale}/kontakt`} className="text-primary hover:underline">
            {" "}contact form
          </Link>.
        </p>
      </div>
    </main>
  );
} 