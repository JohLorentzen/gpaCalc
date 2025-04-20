"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useTranslations } from 'next-intl';

interface NotFoundProps {
  locale?: string;
}

const NotFound = ({ locale = 'en' }: NotFoundProps) => {
  const pathname = usePathname();
  const t = useTranslations('errors');

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      pathname
    );
  }, [pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-foreground">404</h1>
        <p className="text-xl text-foreground/80 mb-4">{t('pageNotFound')}</p>
        <Link href={`/${locale}`} className="text-primary hover:text-primary-hover underline">
          {t('backToHome')}
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
