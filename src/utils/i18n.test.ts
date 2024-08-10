import { describe, it, expect, vi } from "vitest";
import { getContentEntryPath, getDataEntryPath, getLocaleFromUrl, getMessage, getNameFromLocale, makeMenu, parseLocale, parseLocaleTagFromPath, splitLocaleAndPath, useTranslations } from "../utils/i18n";

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
        'slugs.docs': 'docs',
        'slugs.data': 'daten',
      }
    }
  }
}));

vi.mock("astro:content", () => ({
  getEntry: async (collection: string, entrySlug: string) => {
    if (collection === "docs" && entrySlug === "getting-started") {
      return {
        id: "de/2020/09/11/test-article.md",
        slug: "de/2020/09/11/test-article",
        collection: "docs",
        data: {
          title: "Test Article",
        }
      };
    }
    if (collection === "docs" && entrySlug === "root") {
      return {
        id: "de/test-article.md",
        slug: "de/test-article",
        collection: "docs",
        data: {
          title: "Test Article",
        }
      };
    }
    if (collection === "docs" && entrySlug === "no-international-path") {
      return {
        id: "2020/09/11/test-article.md",
        slug: "2020/09/11/test-article",
        collection: "docs",
        data: {
          title: "Test Article",
        }
      };
    }
    if (collection === "data" && entrySlug === "daten") {
      return {
        id: "de/2020/09/11/test-article.md",
        slug: "de/2020/09/11/test-article",
        collection: "docs",
        data: {
          title: {
            en: "Test Article",
            de: "Test Artikel",
          }
        }
      };
    }
    if (collection === "docs" && entrySlug === "invalid") {
      return undefined;
    }
    return undefined;
  }
}));

describe("parseLocaleTagFromPath", () => {
  it("should parse the locale from a URL", () => {
    const locale = parseLocaleTagFromPath("/en-US/docs/getting-started");
    expect(locale).toBe("en-US");
  });

  it("should parse the locale from a URL without leading slash", () => {
    const locale = parseLocaleTagFromPath("en-US/docs/getting-started");
    expect(locale).toBe("en-US");
  });

  it("should parse the locale from a URL with trailing slash", () => {
    const locale = parseLocaleTagFromPath("/en-US/");
    expect(locale).toBe("en-US");
  });

  it("should parse the locale from a URL without trailing slashes", () => {
    const locale = parseLocaleTagFromPath("/en-US");
    expect(locale).toBe("en-US");
  });

  it("should parse the short form locale from a URL", () => {
    const locale = parseLocaleTagFromPath("/en");
    expect(locale).toBe("en");
  });

  it("should return the default locale if no locale was found in URL", () => {
    const locale = parseLocaleTagFromPath("/");
    expect(locale).toBe(undefined);
  });

  it("shouldn't work on non locales", () => {
    const locale = parseLocaleTagFromPath("/docs");
    expect(locale).toBe(undefined);
  });
});

describe("splitLocaleAndPath", () => {
  it("should split the locale from path", () => {
    const splitPath = splitLocaleAndPath("/en-US/docs/getting-started");
    expect(splitPath?.locale).toBe("en-US");
    expect(splitPath?.path).toBe("/docs/getting-started");
  });

  it("should split the locale from path without leading slash", () => {
    const splitPath = splitLocaleAndPath("en-US/docs/getting-started");
    expect(splitPath?.locale).toBe("en-US");
    expect(splitPath?.path).toBe("docs/getting-started");
  });
});

describe("getNameFromLocale", () => {
  it("should return the name of the locale", () => {
    expect(getNameFromLocale("en")).toBe("English");
    expect(getNameFromLocale("de")).toBe("Deutsch");
  });
});

describe("getLocaleFromUrl", () => {
  it("should return the locale from a URL", () => {
    const url = new URL("https://example.com/en-US/docs/getting-started");
    expect(getLocaleFromUrl(url)).toBe("en");
  });
});

describe("parseLocale", () => {
  it("should parse the locale", () => {
    const locale = parseLocale("de");
    expect(locale).toBe("de");
  });
  it("should return default locale if unknown locale given", () => {
    const locale = parseLocale("es");
    expect(locale).toBe("en");
  });
});

describe("getMessage", () => {
 it("should throw an error if locale is invalid", () => {
   expect(() => getMessage("language", "es" as any)).toThrow("Invalid locale: es");
 });
 it("should throw an error if message key is invalid", () => {
   expect(() => getMessage("invalid", "en")).toThrow("Invalid message key: invalid");
 });
  it("should return the message", () => {
    expect(getMessage("language", "en")).toBe("English");
  });
});

describe("getContentEntryPath", () => {
  it("should throw an error if content entry not found", async () => {
    await expect(getContentEntryPath("docs" as any, "invalid")).rejects.toThrow("Content entry not found: docs/invalid");
  });
  it("should throw an error if entry has no international path", async () => {
    await expect(getContentEntryPath("docs" as any, "no-international-path")).rejects.toThrow("Entry has no international path: docs/no-international-path");
  });
  it("should return the content entry path", async () => {
    const path = await getContentEntryPath("docs" as any, "getting-started");
    expect(path).toMatchInlineSnapshot(`"/de/docs/2020/09/11/test-article"`);
  });
  it("should return the content entry path without double slug", async () => {
    const path = await getContentEntryPath("docs" as any, "root");
    expect(path).toMatchInlineSnapshot(`"/de/docs/test-article"`);
  })
});

describe("getDataEntryPath", () => {
  it("should throw an error if data entry not found", async () => {
    await expect(getDataEntryPath("docs" as any, "invalid", "en")).rejects.toThrow("Data entry not found: docs/invalid");
  });
  it("should return the data entry path", async () => {
    const path = await getDataEntryPath("data" as any, "daten", "en");
    expect(path).toMatchInlineSnapshot(`"/data/2020/09/test-article"`);
  });
})

describe("makeMenu", () => {
  it("should return the menu", async () => {
    const menu = await makeMenu('en', [
      { title: 'License', path: () => getContentEntryPath('docs' as any, "getting-started") },
      { title: 'Privacy', path: 'privacy' },
      { title: 'Terms', path: 'terms' },
      { title: 'Contact', path: 'contact' },
    ]);
    expect(menu).toMatchInlineSnapshot(`
      [
        {
          "path": "/de/docs/2020/09/11/test-article",
          "title": "License",
        },
        {
          "path": "/privacy",
          "title": "Privacy",
        },
        {
          "path": "/terms",
          "title": "Terms",
        },
        {
          "path": "/contact",
          "title": "Contact",
        },
      ]
    `);
  });
})

describe("useTranslations", () => {
  it("should return the translations", () => {
    const t = useTranslations('en');
    expect(t('language')).toMatchInlineSnapshot(`"English"`);
  });
})
