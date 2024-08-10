import { describe, it, expect, vi } from "vitest";
import { addTrailingSlash, dirname, getRelativePath, joinPath, resolvePath, trimExtension } from "../utils/path";

describe("getRelativePath", () => {
  it("should return an unchanged path in dev mode", () => {
    vi.stubEnv('DEV', true)
    const path = "/en-US/docs/getting-started";
    expect(getRelativePath(path)).toBe(path);
  });
  it("should return an unchanged path in dev mode", () => {
    vi.stubEnv('DEV', false)
    const path = "/en-US/docs/getting-started";
    expect(getRelativePath(path)).toBe("./en-US/docs/getting-started");
  });
});

describe("joinPath", () => {
  it("should join paths", () => {
    expect(joinPath("en-US", "docs", "getting-started")).toBe("en-US/docs/getting-started");
  });
  it("should join paths with undefined", () => {
    expect(joinPath("en-US", undefined, "getting-started")).toBe("en-US/getting-started");
  });
});

describe("resolvePath", () => {
  it("should resolve path by joining an making it relative", () => {
    vi.stubEnv('DEV', false)
    expect(resolvePath("en-US", "docs", "getting-started")).toBe("./en-US/docs/getting-started");
  });

  it("should resolve path by joining an making it relative", () => {
    vi.stubEnv('DEV', true)
    expect(resolvePath("en-US", undefined, "getting-started")).toBe("/en-US/getting-started");
  });

  it("should resolve path by joining an making it relative", () => {
    vi.stubEnv('DEV', false)
    expect(resolvePath("en-US", undefined, "getting-started")).toBe("./en-US/getting-started");
  });
});

describe("dirname", () => {
  it("should return the directory name of a path", () => {
    expect(dirname("/en-US/docs/getting-started")).toBe("/en-US/docs");
  });
  it("should return empty string if there is no directory", () => {
    expect(dirname("/en-US")).toBe("");
    expect(dirname("en-US")).toBe("");
  });
});

describe("trimExtension", () => {
  it("should trim the extension of a path", () => {
    expect(trimExtension("/en-US/docs/getting-started.html")).toBe("/en-US/docs/getting-started");
  });
});

describe("addTrailingSlash", () => {
  it("should add a trailing slash to a path", () => {
    expect(addTrailingSlash("/en-US/docs/getting-started")).toBe("/en-US/docs/getting-started/");
  });
  it("should not add a trailing slash to a path that already has one", () => {
    expect(addTrailingSlash("/en-US/docs/getting-started/")).toBe("/en-US/docs/getting-started/");
  });
});
