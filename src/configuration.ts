export const C = {
  LOCALES: { 'en': 'en-US', 'de': 'de-CH' },
  DEFAULT_LOCALE: 'en' as const,
  MESSAGES: {
    'en': {
      'language': 'English',
      'head.title': 'Astro Theme: International',
      'site.title': '<span>Astro Theme:</span> International',
      'site.license': 'MIT License',
      'slugs.blog': 'blog',
      'search.placeholder': 'Type to search...',
    },
    'de': {
      'language': 'Deutsch',
      'head.title': 'Astro Theme: International',
      'site.title': '<span>Astro Theme:</span> International',
      'site.license': 'MIT Lizenz',
      'slugs.blog': 'blog',
      'search.placeholder': 'Schreibe um zu suchen...',
    }
  },
  MENUS: {
    header: [],
    footer: [],
  }
} as const;
