export const C = {
  // Key is the locale slug, value is the locale code
  LOCALES: { 'en': 'en-US', 'de': 'de-CH' },
  // Default locale referencing one of the keys in LOCALES
  DEFAULT_LOCALE: 'en' as const,
  MESSAGES: {
    'en': {
      'language': 'English',
      'head.title': 'Astro Theme: International',
      'site.title': '<span>Astro Theme:</span> International',
      'site.feed.title': 'Astro Theme: International RSS Feed',
      'site.feed.language': 'Astro Theme: International RSS Feed with only English articles',
      'site.description': 'A humble Astronauts guide to the international space station.',
      'site.license': 'MIT License',
      'slugs.blog': 'blog',
      'slugs.gallery': 'gallery',
      'search.placeholder': 'Type to search...',
    },
    'de': {
      'language': 'Deutsch',
      'head.title': 'Astro Theme: International',
      'site.title': '<span>Astro Theme:</span> International',
      'site.feed.title': 'Astro Theme: International RSS Feed',
      'site.feed.language': 'Astro Theme: International RSS Feed mit nur deutschen Artikeln',
      'site.description': 'Ein bescheidener Astronautenführer zur internationalen Raumstation.',
      'site.license': 'MIT Lizenz',
      'slugs.blog': 'blog',
      'slugs.gallery': 'galerie',
      'search.placeholder': 'Schreibe um zu suchen...',
    }
  } satisfies { [key: string]: {[key: string]: string }},
  SETTINGS: {
    BLOG: {
      PAGE_SIZE: 20
    }
  },
} as const;

export type Locale = keyof typeof C.LOCALES;
