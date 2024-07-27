import { describe, it, expect } from "vitest";
import { parseLocaleTagFromPath, splitLocaleAndPath } from "./i18n";

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
