export const C = {
  LOCALES: { 'en': 'English', 'de': 'Deutsch' },
  DEFAULT_LOCALE: 'en' as const,
  MESSAGES: {
    'en': {
      'site.title': 'Example Astro App',
    },
    'de': {
      'site.title': 'Beispiel Astro App',
    }
  }
} as const;
