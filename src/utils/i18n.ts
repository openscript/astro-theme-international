import { C, type Locale } from "../configuration";

export function getNameFromLocale(locale?: string) {
  const l = parseLocale(locale);
  return C.MESSAGES[l].language;
}

export function parseLocale(locale?: string) {
  return locale && locale in C.LOCALES
    ? (locale as keyof typeof C.LOCALES)
    : C.DEFAULT_LOCALE;
}

export function getFullLocale(locale?: string) {
  return C.LOCALES[parseLocale(locale)];
}

export function getMessage(key: string, locale: Locale) {
  if (!(locale in C.MESSAGES)) throw new Error(`Invalid locale: ${locale}`);
  if (!(key in C.MESSAGES[locale]))
    throw new Error(`Invalid message key: ${key}`);

  const k = key as keyof (typeof C.MESSAGES)[typeof locale];

  return C.MESSAGES[locale][k];
}

export function useTranslations<L extends keyof typeof C.MESSAGES>(locale: L) {
  return function t(
    key: keyof (typeof C.MESSAGES)[L],
    substitutions?: Record<string, string | number>,
  ) {
    if (substitutions) {
      let message = C.MESSAGES[locale][key] as string;
      for (const key in substitutions) {
        const value = substitutions[key];
        if (!value) continue;
        message = message.replace(`{${key}}`, String(value));
      }
      return message;
    }
    return C.MESSAGES[locale][key];
  };
}
