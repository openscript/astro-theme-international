export const C = {
  LOCALES: { 'en': 'English', 'de': 'Deutsch' },
  DEFAULT_LOCALE: 'en' as const,
  MESSAGES: {
    'en': {
      'site.title': '<span>Astro Theme:</span> International',
      'site.license': 'MIT License',
    },
    'de': {
      'site.title': '<span>Astro Theme:</span> International',
      'site.license': 'MIT Lizenz',
    }
  },
  MENUS: {
    header: [],
    footer: [],
  }
} as const;
