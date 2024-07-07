import type { LocaleDetails } from "@timelet/i18n";

export const CONFIGURATION = {
  DEFAULT_LOCALE: 'en',
  LOCALE_DETAILS: [
    {
      key: "en",
      slug: "en",
      segments: {}
    },
    {
      key: "de",
      slug: "de",
      segments: {}
    }
  ] satisfies LocaleDetails[],
}
