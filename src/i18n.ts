import { C } from './configuration';

export function getNameFromLocale(locale?: string) {
  if (locale && locale in C.LOCALES) return C.LOCALES[locale as keyof typeof C.LOCALES];
  return C.LOCALES[C.DEFAULT_LOCALE];
}

export function getLocaleFromUrl(url: URL) {
  const [, locale] = url.pathname.split('/');
  if (locale && locale in C.MESSAGES) return locale as keyof typeof C.MESSAGES;
  return C.DEFAULT_LOCALE;
}

export function useTranslations(locale: keyof typeof C.MESSAGES) {
  return function t(key: keyof typeof C.MESSAGES[typeof C.DEFAULT_LOCALE]) {
    return C.MESSAGES[locale][key] || C.MESSAGES[C.DEFAULT_LOCALE][key];
  }
}
