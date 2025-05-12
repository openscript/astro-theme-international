import { describe, it, expect, vi } from "vitest";
import {
  getFullLocale,
  getMessage,
  getNameFromLocale,
  parseLocale,
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

describe("getNameFromLocale", () => {
  it("should return the name of the locale", () => {
    expect(getNameFromLocale("en")).toBe("English");
    expect(getNameFromLocale("de")).toBe("Deutsch");
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
