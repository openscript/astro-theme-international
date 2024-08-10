export const C = {
  // Key is the locale slug, value is the locale code
  LOCALES: { 'en': 'en-US', 'de': 'de-CH' },
  // Default locale referencing one of the keys in LOCALES
  DEFAULT_LOCALE: 'en' as const,
  // Static messages for each locale
  MESSAGES: {
    'en': {
      'language': 'English',
      'head.title': 'Astro Theme: International',
      'contact.phone.value': '+12065550100',
      'contact.phone.display': '(206) 555-0100',
      'contact.email.value': 'astro.theme@example.com',
      'contact.email.display': 'astro.theme@example.com',
      'site.title': '<span>Astro Theme:</span> International',
      'site.feed.title': 'Astro Theme: International RSS Feed',
      'site.feed.language': 'Astro Theme: International RSS Feed with only English articles',
      'site.description': 'A humble Astronauts guide to the international space station.',
      'site.author': 'Example Ltd.',
      'site.license': 'MIT License',
      'slugs.blog': 'blog',
      'slugs.gallery': 'gallery',
      'slugs.projects': 'projects',
      'search.placeholder': 'Type to search...',
    },
    'de': {
      'language': 'Deutsch',
      'head.title': 'Astro Theme: International',
      'contact.phone.value': '+491713920000',
      'contact.phone.display': '0171 392 0000',
      'contact.email.value': 'astro.theme@example.de',
      'contact.email.display': 'astro.theme@example.de',
      'site.title': '<span>Astro Theme:</span> International',
      'site.feed.title': 'Astro Theme: International RSS Feed',
      'site.feed.language': 'Astro Theme: International RSS Feed mit nur deutschen Artikeln',
      'site.description': 'Ein bescheidener Astronautenführer zur internationalen Raumstation.',
      'site.author': 'Beispiel GmbH',
      'site.license': 'MIT Lizenz',
      'slugs.blog': 'blog',
      'slugs.gallery': 'galerie',
      'slugs.projects': 'projekte',
      'search.placeholder': 'Schreibe um zu suchen...',
    }
  } satisfies { [key: string]: {[key: string]: string }},
  // Various settings
  SETTINGS: {
    BLOG: {
      PAGE_SIZE: 20
    }
  },
} as const;

// Configuration helpers
export type Locale = keyof typeof C.LOCALES;
export const localeSlugs = Object.keys(C.LOCALES) as Locale[];
