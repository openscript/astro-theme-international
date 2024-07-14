import { defineConfig } from 'astro/config';
import mdx from "@astrojs/mdx";
import { C } from './src/configuration';

// https://astro.build/config
export default defineConfig({
  prefetch: true,
  i18n: {
    defaultLocale: C.DEFAULT_LOCALE,
    locales: Object.keys(C.LOCALES),
  },
  integrations: [mdx()]
});
