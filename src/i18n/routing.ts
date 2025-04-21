export const locales = ['en', 'no', 'es', 'fr', 'de', 'pl', 'zh', 'ar'] as const;

export const defaultLocale = 'en' as const;

export type Locale = typeof locales[number];

export const routing = {
  locales,
  defaultLocale,
  localePrefix: 'as-needed',
  pathnames: {
    '/': '/',
    '/about': {
      en: '/about',
      es: '/acerca-de',
      fr: '/a-propos',
      de: '/uber-uns',
      no: '/om-oss',
      pl: '/o-nas',
      zh: '/关于我们',
      ar: '/حول'
    },
    '/contact': {
      en: '/contact',
      es: '/contacto',
      fr: '/contact',
      de: '/kontakt',
      no: '/kontakt',
      pl: '/kontakt',
      zh: '/联系我们',
      ar: '/اتصل'
    }
  }
};