'use client';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useParams } from 'next/navigation';

// Client component for the page content
export default function PrivacyPage() {
  const t = useTranslations('navigation');
  const privacyT = useTranslations('privacy');
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
        <h2 className="text-2xl font-medium tracking-tight">{privacyT('title')}</h2>
        <p className="text-muted-foreground">{privacyT('lastUpdated')}</p>
        
        <h3>{privacyT('introduction.title')}</h3>
        <p>
          {privacyT('introduction.content')}
        </p>
        
        <h3>{privacyT('dataCollection.title')}</h3>
        <p>
          {privacyT('dataCollection.content')}
        </p>
        <ul>
          {privacyT.raw('dataCollection.items').map((item: string, index: number) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
        
        <h3>{privacyT('dataUsage.title')}</h3>
        <p>
          {privacyT('dataUsage.content')}
        </p>
        <ul>
          {privacyT.raw('dataUsage.items').map((item: string, index: number) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
        
        <h3>{privacyT('security.title')}</h3>
        <p>
          {privacyT('security.content')}
        </p>
        
        <h3>{privacyT('rights.title')}</h3>
        <p>
          {privacyT('rights.content')}
        </p>
        <ul>
          {privacyT.raw('rights.items').map((item: string, index: number) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
        
        <h3>{privacyT('contact.title')}</h3>
        <p>
          {privacyT('contact.content')}
          <Link href={`/${locale}/kontakt`} className="text-primary hover:underline">
            {" "}contact form
          </Link>.
        </p>
      </div>
    </main>
  );
} 