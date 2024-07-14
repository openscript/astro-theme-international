import { defineConfig } from 'astro/config';
import i18nConfig from './i18n.js';
import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
  prefetch: true,
  ...i18nConfig,
  integrations: [mdx()]
});