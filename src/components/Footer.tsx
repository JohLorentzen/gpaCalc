import React from 'react'
import { useTranslations } from 'next-intl';

interface FooterProps {
    locale: string;
}

const Footer = ({ locale }: FooterProps) => {
    const tFooter = useTranslations('footer');
    const tNav = useTranslations('navigation');
    const currentYear = new Date().getFullYear();
  return (
    <section>
        <footer className="py-8 px-6 bg-card text-card-foreground dark:bg-muted">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h2 className="text-xl font-bold text-gradient-text">Unigpacalc</h2>
              <p className="text-sm text-muted-foreground">
                {tFooter('copyright', { year: currentYear })}
              </p>
            </div>
            <div className="flex gap-6">
              <a href={`/${locale}/personvern`} className="text-foreground/80 hover:text-primary">{tNav('privacy')}</a>
              <a href={`/${locale}/vilkar`} className="text-foreground/80 hover:text-primary">{tNav('terms')}</a>
              <a href={`/${locale}/kontakt`} className="text-foreground/80 hover:text-primary">{tNav('contact')}</a>
            </div>
          </div>
        </div>
      </footer>
    </section>
  )
}

export default Footer