export const C = {
  // Key is the locale slug, value is the locale code
  LOCALES: { 'en': 'en-US', 'de': 'de-CH' },
  // Default locale referencing one of the keys in LOCALES
  DEFAULT_LOCALE: 'en' as const,
  // Path segment translations
  SEGMENT_TRANSLATIONS: {
    'en': {
      'gallery': 'gallery',
      'projects': 'projects',
      'blog': 'blog',
    },
    'de': {
      'gallery': 'galerie',
      'projects': 'projekte',
      'blog': 'blog',
    }
  },
  // Static messages for each locale
  MESSAGES: {
    'en': {
      'language': 'English',
      'head.title': 'Astro Theme: International',
      'contact.phone.value': '+12065550100',
      'contact.phone.display': '(206) 555-0100',
      'contact.email.value': 'astro.theme@example.com',
      'contact.email.display': 'astro.theme@example.com',
      'label.gitInfo': 'Meta information',
      'label.author': 'Author',
      'label.lastUpdated': 'Last updated',
      'label.links': 'Links',
      'label.tags': 'Tags',
      'label.tableOfContents': 'Table of Contents',
      'label.history': 'History',
      'label.source': 'Source',
      'label.edit': 'Edit',
      'pages.blog': 'Blog',
      'pages.projects': 'Projects',
      'pages.gallery': 'Gallery',
      'pages.blog.tag': 'Tag "{tag}"',
      'pagination.pageOf': 'Page {current} of {total}',
      'pagination.previous': 'Previous',
      'pagination.next': 'Next',
      'site.title': '<span>Astro Theme:</span> International',
      'site.feed.title': 'Astro Theme: International RSS Feed',
      'site.feed.language': 'Astro Theme: International RSS Feed with only English articles',
      'site.description': 'A humble Astronauts guide to the international space station.',
      'site.author': 'Example Ltd.',
      'site.license': 'MIT License',
      'slugs.gallery': 'gallery',
      'search.placeholder': 'Type to search...',
      'sections.latestPosts': 'Latest posts',
    },
    'de': {
      'language': 'Deutsch',
      'head.title': 'Astro Theme: International',
      'contact.phone.value': '+491713920000',
      'contact.phone.display': '0171 392 0000',
      'contact.email.value': 'astro.theme@example.de',
      'contact.email.display': 'astro.theme@example.de',
      'pages.blog': 'Blog',
      'pages.projects': 'Projekte',
      'pages.gallery': 'Galerie',
      'pages.blog.tag': 'Kategorie "{tag}"',
      'pagination.pageOf': 'Seite {current} von {total}',
      'pagination.previous': 'Zurück',
      'pagination.next': 'Weiter',
      'label.gitInfo': 'Zusatzinformationen',
      'label.tableOfContents': 'Inhaltsverzeichnis',
      'label.author': 'Autor',
      'label.lastUpdated': 'Letzte Aktualisierung',
      'label.links': 'Links',
      'label.tags': 'Kategorien',
      'label.history': 'Versionen',
      'label.source': 'Quelle',
      'label.edit': 'Bearbeiten',
      'site.title': '<span>Astro Theme:</span> International',
      'site.feed.title': 'Astro Theme: International RSS Feed',
      'site.feed.language': 'Astro Theme: International RSS Feed mit nur deutschen Artikeln',
      'site.description': 'Ein bescheidener Astronautenführer zur internationalen Raumstation.',
      'site.author': 'Beispiel GmbH',
      'site.license': 'MIT Lizenz',
      'slugs.gallery': 'galerie',
      'search.placeholder': 'Schreibe um zu suchen...',
      'sections.latestPosts': 'Letzte Blogartikel',
    }
  } satisfies { [key: string]: {[key: string]: string }},
  // Various settings
  SETTINGS: {
    REMOTE: {
      BASE_URL: 'https://github.com/openscript/astro-theme-international',
    },
    BLOG: {
      PAGE_SIZE: 20,
    }
  },
} as const;

// Configuration helpers
export type Locale = keyof typeof C.LOCALES;
export const localeSlugs = Object.keys(C.LOCALES) as Locale[];
