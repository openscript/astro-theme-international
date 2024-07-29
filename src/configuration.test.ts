import { describe, it, expect } from "vitest";
import { C } from "./configuration";

describe("configuration", () => {
  it("should have a default locale, that is included in locales", () => {
    expect(C.LOCALES).toContain(C.DEFAULT_LOCALE);
  });
});
