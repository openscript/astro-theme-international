import { describe, it, expect } from "vitest";
import { C, localeSlugs } from "./configuration";

describe("configuration", () => {
  it("should have a default locale, that is included in locales", () => {
    expect(localeSlugs).toContain(C.DEFAULT_LOCALE);
  });

  it("should only define messages for existing locales", () => {
    const locales = Object.keys(C.MESSAGES);
    expect(locales).toEqual(expect.arrayContaining(localeSlugs));
  });

  it("every message should have a translation for every locale", () => {
    Object.entries(C.MESSAGES).forEach(([, messages]) => {
      Object.entries(C.MESSAGES).forEach(([, otherMessages]) => {
        expect(Object.keys(messages)).toEqual(expect.arrayContaining(Object.keys(otherMessages)));
      });
    });
  });
});
