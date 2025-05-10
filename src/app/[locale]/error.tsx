'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({ error, reset }: ErrorProps) {
  const { locale } = useParams();
  const t = useTranslations('error');
  
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Unhandled error:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center h-screen p-4">
      <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-destructive">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
      </div>
      <h1 className="text-4xl font-bold mb-2">{t('title')}</h1>
      <p className="text-lg text-muted-foreground text-center mb-6">
        {t('description')}
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button variant="outline" onClick={reset} className="min-w-32">
          {t('tryAgain')}
        </Button>
        <Button asChild variant="primary" className="text-white min-w-32">
          <Link href={`/${locale}/kontakt`}>{t('contactUs')}</Link>
        </Button>
      </div>
    </div>
  );
} 