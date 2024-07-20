export const C = {
  LOCALES: { 'en': 'English', 'de': 'Deutsch' },
  DEFAULT_LOCALE: 'en' as const,
  MESSAGES: {
    'en': {
      'head.title': 'Astro Theme: International',
      'site.title': '<span>Astro Theme:</span> International',
      'site.license': 'MIT License',
      'slugs.blog': 'blog',
      'search.placeholder': 'Type to search...',
    },
    'de': {
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
