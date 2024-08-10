import { describe, expect, it, vi } from 'vitest';
import { getCollectionSlug, getEntrySlug, getLocaleSlug } from './slugs';
import { getEntry } from 'astro:content';

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
  getEntry: async (collection: string, entrySlug: string) => {
    if (collection === "docs" && entrySlug === "with-title") {
      return {
        id: "de/2020/09/11/test-article.md",
        slug: "de/2020/09/11/test-article",
        collection: "docs",
        data: {
          title: "This is my first article",
        }
      };
    }
    if (collection === "docs" && entrySlug === "with-path") {
      return {
        id: "de/2020/09/11/test-article.md",
        slug: "de/2020/09/11/test-article",
        collection: "docs",
        data: {
          path: "this/is/the/path",
        }
      };
    }
    if (collection === "docs" && entrySlug === "without-data") {
      return {
        id: "de/2020/09/11/test-article.md",
        slug: "de/2020/09/11/test-article",
        collection: "docs",
      };
    }
    if (collection === "docs" && entrySlug === "at-root") {
      return {
        id: "de/test-article.md",
        slug: "de/test-article",
        collection: "docs",
        data: {
          title: "This is my first article",
        },
      };
    }
    return undefined;
  }
}));

describe("getLocaleSlug", () => {
  it("should return the locale slug", () => {
    expect(getLocaleSlug("en")).toBe(undefined);
    expect(getLocaleSlug("de")).toBe("de");
  });
})

describe('getCollectionSlug', () => {
  it('should return the collection slug', () => {
    expect(getCollectionSlug('docs', 'de')).toMatchInlineSnapshot(`"doku"`);
    expect(getCollectionSlug('data', 'en')).toMatchInlineSnapshot(`"data"`);
  });
});

describe("getEntrySlug", () => {
  it("should return the entry slug", async () => {
    const entryWithTitle = await getEntry('docs' as any, 'with-title') as { slug: string };
    expect(getEntrySlug(entryWithTitle)).toMatchInlineSnapshot(`"2020/09/11/this-is-my-first-article"`);
    const entryWithPath = await getEntry('docs' as any, 'with-path') as { slug: string };
    expect(getEntrySlug(entryWithPath)).toMatchInlineSnapshot(`"this/is/the/path"`);
    const entryWithoutData = await getEntry('docs' as any, 'without-data') as { slug: string };
    expect(getEntrySlug(entryWithoutData)).toMatchInlineSnapshot(`"2020/09/11/test-article"`);
    const entryAtRoot = await getEntry('docs' as any, 'at-root') as { slug: string };
    expect(getEntrySlug(entryAtRoot)).toMatchInlineSnapshot(`"this-is-my-first-article"`);
  });
})
