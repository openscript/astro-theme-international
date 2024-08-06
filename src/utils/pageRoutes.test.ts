import { describe, expect, it, vi } from 'vitest';
import { buildPageRoute } from './pageRoutes';

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

describe("route", () => {
  it("should chain as route().locale().build()", () => {
    expect(buildPageRoute().locale().build()).toMatchInlineSnapshot(`
      [
        {
          "params": {
            "locale": undefined,
          },
          "props": {
            "locale": "en",
            "translations": {
              "de": "/de",
              "en": "/",
            },
          },
        },
        {
          "params": {
            "locale": "de",
          },
          "props": {
            "locale": "de",
            "translations": {
              "de": "/de",
              "en": "/",
            },
          },
        },
      ]
    `);
  });

  it("should chain as route().slug().build()", () => {
    expect(buildPageRoute().kind("test").build()).toMatchInlineSnapshot(`
      [
        {
          "params": {
            "test": "test",
          },
        },
      ]
    `);
  })

  it("should chain as route().locale().slug().build()", () => {
    expect(buildPageRoute().locale().kind("docs").build()).toMatchInlineSnapshot(`
      [
        {
          "params": {
            "docs": "docs",
            "locale": undefined,
          },
          "props": {
            "locale": "en",
            "translations": {
              "de": "/de/doku",
              "en": "/docs",
            },
          },
        },
        {
          "params": {
            "docs": "doku",
            "locale": "de",
          },
          "props": {
            "locale": "de",
            "translations": {
              "de": "/de/doku",
              "en": "/docs",
            },
          },
        },
      ]
    `);
  })
});
