import { describe, it, expect, vi } from "vitest";
import { getEntry } from "astro:content";
import {
  getContentEntryPath,
  getFullLocale,
  getLocaleFromUrl,
  getMessage,
  getNameFromLocale,
  makeMenu,
  parseLocale,
  parseLocaleFromPath,
  splitCollectionAndSlug,
  splitLocaleAndPath,
  useTranslations,
} from "../utils/i18n";

vi.mock("../configuration", () => ({
  C: {
    LOCALES: { en: "en-US", de: "de-CH" },
    DEFAULT_LOCALE: "en" as const,
    MESSAGES: {
      en: {
        language: "English",
        "slugs.docs": "docs",
        "slugs.data": "data",
        substitution: "{one} of {two}",
      },
      de: {
        language: "Deutsch",
        "slugs.docs": "doku",
        "slugs.data": "daten",
        substitution: "{one} von {two}",
      },
    },
  },
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
        },
      };
    }
    if (collection === "docs" && entrySlug === "root") {
      return {
        id: "de/test-article.md",
        slug: "de/test-article",
        collection: "docs",
        data: {
          title: "Test Article",
        },
      };
    }
    if (collection === "docs" && entrySlug === "no-international-path") {
      return {
        id: "2020/09/11/test-article.md",
        slug: "2020/09/11/test-article",
        collection: "docs",
        data: {
          title: "Test Article",
        },
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
          },
        },
      };
    }
    if (collection === "docs" && entrySlug === "invalid") {
      return undefined;
    }
    return undefined;
  },
}));

describe("parseLocaleFromPath", () => {
  it("should parse the locale from a URL", () => {
    const locale = parseLocaleFromPath("/en-US/docs/getting-started");
    expect(locale).toBe("en-US");
  });

  it("should parse the locale from a URL without leading slash", () => {
    const locale = parseLocaleFromPath("en-US/docs/getting-started");
    expect(locale).toBe("en-US");
  });

  it("should parse the locale from a URL with trailing slash", () => {
    const locale = parseLocaleFromPath("/en-US/");
    expect(locale).toBe("en-US");
  });

  it("should parse the locale from a URL without trailing slashes", () => {
    const locale = parseLocaleFromPath("/en-US");
    expect(locale).toBe("en-US");
  });

  it("should parse the short form locale from a URL", () => {
    const locale = parseLocaleFromPath("/en");
    expect(locale).toBe("en");
  });

  it("should return undefined if no locale was found in URL", () => {
    const locale = parseLocaleFromPath("/");
    expect(locale).toBe(undefined);
  });

  it("shouldn't work on non locales", () => {
    const locale = parseLocaleFromPath("/docs");
    expect(locale).toBe(undefined);
  });

  it("shouldn't work on locales in file names", () => {
    const locale = parseLocaleFromPath("/some/path/example.en-US.md");
    expect(locale).toBe("en-US");
  });

  it("should parse the locale from a file name", () => {
    const locale = parseLocaleFromPath("example.en.md");
    expect(locale).toBe("en");
  });

  it("should parse the locale from a file name with dialect", () => {
    const locale = parseLocaleFromPath("example.en-US.md");
    expect(locale).toBe("en-US");
  });

  it("should parse the locale from a file with path", () => {
    const locale = parseLocaleFromPath("/some/path/example.en-US.md");
    expect(locale).toBe("en-US");
  });

  it("should parse the locale from a file with relative path", () => {
    const locale = parseLocaleFromPath("../example.en-US.md");
    expect(locale).toBe("en-US");
  });

  it("should undefined if no locale was found in file name", () => {
    const locale = parseLocaleFromPath("example.md");
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

  it("should split the locale from file path", () => {
    const splitPath = splitLocaleAndPath("/docs/getting-started.en-US.md");
    expect(splitPath?.locale).toBe("en-US");
    expect(splitPath?.path).toBe("/docs/getting-started");
  });
});

describe("splitCollectionAndSlug", () => {
  it("should split the collection from slug", () => {
    const splitPath = splitCollectionAndSlug("pages://en/data-protection");
    expect(splitPath.collection).toMatchInlineSnapshot(`"pages"`);
    expect(splitPath.slug).toMatchInlineSnapshot(`"en/data-protection"`);
  });

  it("should split the locale from path without leading slash", () => {
    expect(() =>
      splitCollectionAndSlug("somethingElse"),
    ).toThrowErrorMatchingInlineSnapshot(`[Error: Couldn't split path.]`);
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

describe("getFullLocale", () => {
  it("should return the full locale", () => {
    expect(getFullLocale()).toBe("en-US");
    expect(getFullLocale("de")).toBe("de-CH");
  });
});

describe("getMessage", () => {
  it("should throw an error if locale is invalid", () => {
    expect(() => getMessage("language", "es" as any)).toThrow(
      "Invalid locale: es",
    );
  });
  it("should throw an error if message key is invalid", () => {
    expect(() => getMessage("invalid", "en")).toThrow(
      "Invalid message key: invalid",
    );
  });
  it("should return the message", () => {
    expect(getMessage("language", "en")).toBe("English");
  });
});

describe("getContentEntryPath", () => {
  it("should throw an error if content entry not found", async () => {
    const entry = await getEntry("docs" as any, "invalid");
    expect(() => getContentEntryPath(entry)).toThrow(
      "Entry not found",
    );
  });
  it("should throw an error if entry has no international path", async () => {
    const entry = await getEntry("docs" as any, "no-international-path");
    expect(() => getContentEntryPath(entry)).toThrow(
      "Entry has no international path: docs/2020/09/11/test-article.md",
    );
  });
  it("should return the content entry path", async () => {
    const entry = await getEntry("docs" as any, "getting-started")
    const path = getContentEntryPath(entry);
    expect(path).toMatchInlineSnapshot(`"/de/doku/2020/09/11/test-article"`);
  });
  it("should return the content entry path without double slug", async () => {
    const entry = await getEntry("docs" as any, "root");
    const path = getContentEntryPath(entry);
    expect(path).toMatchInlineSnapshot(`"/de/doku/test-article"`);
  });
});

describe("makeMenu", () => {
  it("should return the menu", async () => {
    const menu = await makeMenu("en", [
      {
        title: "License",
        path: async () => getContentEntryPath(await getEntry("docs" as any, "getting-started")),
      },
      { title: "Privacy", path: "privacy" },
      { title: "Terms", path: "terms" },
      { title: "Contact", path: "contact" },
    ]);
    expect(menu).toMatchInlineSnapshot(`
      [
        {
          "path": "/de/doku/2020/09/11/test-article",
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
});

describe("useTranslations", () => {
  it("should return the translations", () => {
    const t = useTranslations("en");
    expect(t("language")).toMatchInlineSnapshot(`"English"`);
  });
  it("should substitute placeholders", () => {
    const t = useTranslations("en");
    expect(
      t("substitution" as any, { one: "one", two: "two" }),
    ).toMatchInlineSnapshot(`"one of two"`);
  });
  it("should ignore missing placeholders", () => {
    const t = useTranslations("en");
    expect(t("substitution" as any, { one: "one" })).toMatchInlineSnapshot(
      `"one of {two}"`,
    );
  });
});
