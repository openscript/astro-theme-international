import type { AstroUserConfig } from 'astro';

export default {
  i18n: {
    defaultLocale: "en",
    locales: ["de", "en"]
  },
} satisfies Pick<AstroUserConfig, 'i18n'>
