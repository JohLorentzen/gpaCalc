'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

export default function AccountDeletedPage() {
  const t = useTranslations('accountDeleted');

  return (
    <div className="container mx-auto py-16 px-4 flex flex-col items-center">
      <div className="max-w-md w-full bg-card border border-border rounded-lg p-8 shadow-md text-center">
        <div className="flex justify-center mb-4">
          <AlertCircle className="h-12 w-12 text-destructive" />
        </div>
        
        <h1 className="text-2xl font-bold mb-4">{t('title')}</h1>
        
        <p className="mb-6 text-muted-foreground">
          {t('description')}
        </p>
        
        <div className="space-y-4">
          <Link href="/contact">
            <Button className="w-full" variant="default">
              {t('contactSupport')}
            </Button>
          </Link>
          
          <Link href="/">
            <Button className="w-full" variant="outline">
              {t('returnHome')}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
} 