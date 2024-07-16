import { defineConfig } from 'astro/config';
import mdx from "@astrojs/mdx";
import { C } from './src/configuration';
import pagefind from 'astro-pagefind';

// https://astro.build/config
export default defineConfig({
  prefetch: true,
  build: {
    format: 'file'
  },
  i18n: {
    defaultLocale: C.DEFAULT_LOCALE,
    locales: Object.keys(C.LOCALES),
  },
  integrations: [mdx(), pagefind()]
});
