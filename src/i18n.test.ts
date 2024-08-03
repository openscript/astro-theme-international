import { describe, it, expect, vi } from "vitest";
import { getLocaleFromUrl, getNameFromLocale, parseLocale, parseLocaleTagFromPath, splitLocaleAndPath } from "./i18n";

vi.mock("./configuration", () => ({
  C: {
    LOCALES: { 'en': 'en-US', 'de': 'de-CH' },
    DEFAULT_LOCALE: 'en' as const,
    MESSAGES: {
      'en': {
        'language': 'English',
      },
      'de': {
        'language': 'Deutsch',
      }
    }
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
