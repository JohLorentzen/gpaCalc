"use client"

import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { routing } from '@/i18n/routing';
import { useEffect, useState } from 'react';

// Define language names and flags for all supported languages
const languages = {
  en: { name: 'English', flag: '🇬🇧' },
  no: { name: 'Norsk', flag: '🇳🇴' },
  es: { name: 'Español', flag: '🇪🇸' },
  fr: { name: 'Français', flag: '🇫🇷' },
  de: { name: 'Deutsch', flag: '🇩🇪' },
  pl: { name: 'Polski', flag: '🇵🇱' },
  zh: { name: '中文', flag: '🇨🇳' },
  ar: { name: 'العربية', flag: '🇸🇦' },
};

interface LanguageSwitcherProps {
  currentLocale: string;
}

export default function LanguageSwitcher({ currentLocale }: LanguageSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [activeLocale, setActiveLocale] = useState(currentLocale);

  // Update active locale whenever the currentLocale prop changes
  useEffect(() => {
    if (currentLocale !== activeLocale) {
      setActiveLocale(currentLocale);
      console.log("Updated activeLocale to:", currentLocale);
    }
  }, [currentLocale, activeLocale]);

  const switchToLocale = (locale: string) => {
    if (locale === currentLocale) return;
    
    // Get the current path without the locale
    const currentPath = window.location.pathname;
    const pathWithoutLocale = currentPath
      .replace(new RegExp(`^/(${routing.locales.join('|')})`), '') // Remove locale from path
      .replace(/^\/+/, '/'); // Ensure path starts with a single slash
    
    // Set the active locale immediately for better UI feedback
    setActiveLocale(locale);

    // Construct the new URL
    const newPath = `/${locale}${pathWithoutLocale}`;
    
    // Force a hard navigation by reloading the page
    window.location.href = newPath;
  };

  // Get current language name and flag based on the actual currentLocale prop
  const currentLanguage = languages[currentLocale as keyof typeof languages] || languages.en;

  // Filter languages to only include supported locales defined in routing.ts
  const supportedLanguages = Object.entries(languages)
    .filter(([code]) => routing.locales.includes(code as any))
    .map(([code, language]) => ({ code, ...language }));

  return (
    <div className="flex items-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 px-3 gap-2">
            <span>{currentLanguage.flag}</span>
            <span className="hidden sm:inline">{currentLanguage.name}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-[160px] backdrop-blur-md bg-opacity-90 border border-border">
          {supportedLanguages.map((language) => (
            <DropdownMenuItem
              key={language.code}
              className="flex items-center justify-between cursor-pointer"
              onClick={() => switchToLocale(language.code)}
            >
              <div className="flex items-center">
                <span className="mr-2">{language.flag}</span>
                <span>{language.name}</span>
              </div>
              {currentLocale === language.code && (
                <Check className="h-4 w-4 text-primary" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
} 