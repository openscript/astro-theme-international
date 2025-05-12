import { describe, it, expect, vi } from "vitest";
import {
  joinPath,
  resolvePath,
} from "../utils/path";

describe("joinPath", () => {
  it("should join paths", () => {
    expect(joinPath("en-US", "docs", "getting-started")).toBe(
      "en-US/docs/getting-started",
    );
  });
  it("should join paths with undefined", () => {
    expect(joinPath("en-US", undefined, "getting-started")).toBe(
      "en-US/getting-started",
    );
  });
});

describe("resolvePath", () => {
  it("should resolve path by joining an making it relative", () => {
    vi.stubEnv("DEV", false);
    expect(resolvePath("en-US", "docs", "getting-started")).toBe(
      "/en-US/docs/getting-started",
    );
  });

  it("should resolve path by joining an making it relative", () => {
    vi.stubEnv("DEV", true);
    expect(resolvePath("en-US", undefined, "getting-started")).toBe(
      "/en-US/getting-started",
    );
  });
});
