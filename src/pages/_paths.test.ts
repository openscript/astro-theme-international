import { describe, expect, it, vi } from 'vitest';
import { entryPaths, indexPaths, rssXmlPaths } from './_paths';
import { getCollection } from 'astro:content';

vi.mock("../configuration", () => ({
  C: {
    LOCALES: { 'en': 'en-US', 'de': 'de-CH' },
    DEFAULT_LOCALE: 'en' as const,
    MESSAGES: {
      'en': {
        'language': 'English',
        'slugs.docs': 'docs',
        'slugs.data': 'data',
      },
      'de': {
        'language': 'Deutsch',
        'slugs.docs': 'doku',
        'slugs.data': 'daten',
      }
    }
  },
  localeSlugs: ['en', 'de']
}));

vi.mock("astro:content", () => ({
  getCollection: async (_: string) => {
    return [
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
    ]
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
  //it('generates entryPaths', async () => {
  //  const entries = (await getCollection('docs' as any)) as { slug: string }[];
  //  expect(await entryPaths('blog')()).toMatchSnapshot();
  //});
})
