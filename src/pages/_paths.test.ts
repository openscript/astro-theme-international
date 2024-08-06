import { describe, expect, it, vi } from 'vitest';
import { indexPaths, rssXmlPaths } from './_paths';

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

describe('paths', () => {
  it('generates rssXmlPaths', async () => {
    expect(await rssXmlPaths()).toMatchSnapshot();
  });
  it('generates indexPaths', async () => {
    expect(await indexPaths()()).toMatchSnapshot();
  });
  it('generates indexPaths with kind', async () => {
    expect(await indexPaths('docs')()).toMatchSnapshot();
  });
})
