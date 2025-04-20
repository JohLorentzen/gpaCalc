export const locales = ['en', 'no', 'es', 'fr', 'de'] as const;

export const defaultLocale = 'en' as const;

export type Locale = typeof locales[number];

export const routing = {
  locales,
  defaultLocale,
  localePrefix: 'as-needed'
};