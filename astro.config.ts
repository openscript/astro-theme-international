import { defineConfig } from 'astro/config';

import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
  prefetch: true,
  i18n: {
    defaultLocale: "en",
    locales: ["de", "en"]
  },
  integrations: [mdx()]
});