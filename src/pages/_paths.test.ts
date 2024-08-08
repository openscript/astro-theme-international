import { describe, expect, it, vi } from 'vitest';
import { entryPaths, galleryCategoryItemPaths, galleryCategoryPaths, indexPaths, rssXmlPaths } from './_paths';

vi.mock("../configuration", () => ({
  C: {
    LOCALES: { 'en': 'en-US', 'de': 'de-CH' },
    DEFAULT_LOCALE: 'en' as const,
    MESSAGES: {
      'en': {
        'language': 'English',
        'slugs.docs': 'docs',
        'slugs.data': 'data',
        'slugs.gallery': 'gallery',
      },
      'de': {
        'language': 'Deutsch',
        'slugs.docs': 'doku',
        'slugs.data': 'daten',
        'slugs.gallery': 'galerie',
      }
    }
  },
  localeSlugs: ['en', 'de']
}));

const collectionMock = {
  pages: [
    {
      id: "de/2020/09/11/test-article.md",
      slug: "de/2020/09/11/test-article",
      collection: "pages",
      data: {
        title: "Testartikel",
      }
    },
    {
      id: "en/2020/09/11/test-article.md",
      slug: "en/2020/09/11/test-article",
      collection: "pages",
      data: {
        title: "Test Article",
      }
    },
  ],
  docs: [
    {
      id: "de/2020/09/11/test-article.md",
      slug: "de/2020/09/11/test-article",
      collection: "docs",
      data: {
        title: "Testartikel",
      }
    },
    {
      id: "en/2020/09/11/test-article.md",
      slug: "en/2020/09/11/test-article",
      collection: "docs",
      data: {
        title: "Test Article",
      }
    },
  ],
  gallery: [
    {
      id: "food/index",
      collection: "gallery",
      data: {
        title: {
          en: "Food",
          de: "Essen"
        },
        cover: "./food1.jpg",
        images: [
          {
            src: "./food1.jpg"
          },
          {
            src: "./food2.jpg"
          },
          {
            src: "./food3.jpg"
          }
        ]
      }
    },
    {
      id: "sea/index",
      collection: "gallery",
      data: {
        title: {
          en: "Sea",
          de: "Meer"
        },
        cover: "./sea1.jpg",
        images: [
          {
            src: "./sea1.jpg"
          },
          {
            src: "./sea2.jpg"
          },
          {
            src: "./sea3.jpg"
          },
          {
            src: "./sea4.jpg"
          }
        ]
      }
    },
    {
      id: "space/index",
      collection: "gallery",
      data: {
        title: {
          en: "Space",
          de: "Weltraum"
        },
        cover: "./space1.jpg",
        images: [
          {
            src: "./space1.jpg"
          },
          {
            src: "./space2.jpg"
          },
          {
            src: "./space3.jpg"
          },
          {
            src: "./space4.jpg"
          },
          {
            src: "./space5.jpg"
          }
        ]
      }
    }
  ]
}

vi.mock("astro:content", () => ({
  getCollection: async (mock: keyof typeof collectionMock) => {
    return collectionMock[mock];
  }
}));

describe('paths', () => {
  it('generates rssXmlPaths', async () => {
    expect(await rssXmlPaths()).toMatchSnapshot();
  });
  it('generates indexPaths', async () => {
    expect(await indexPaths()()).toMatchSnapshot();
  });
  it('generates indexPaths with kind', async () => {
    expect(await indexPaths('docs')()).toMatchSnapshot();
  });
  it('generates entryPaths', async () => {
    expect(await entryPaths('pages' as any, 'pages')()).toMatchSnapshot();
    expect(await entryPaths('docs' as any, 'slug')()).toMatchSnapshot();
  });
  it('generates galleryCategoryPaths', async () => {
    expect(await galleryCategoryPaths()).toMatchSnapshot();
  });
  it('generates galleryCategoryItemPaths', async () => {
    expect(await galleryCategoryItemPaths()).toMatchSnapshot();
  });
})
