import { C } from './configuration';

export function getLocaleFromUrl(url: URL) {
  const [, lang] = url.pathname.split('/');
  if (lang && lang in C.MESSAGES) return lang as keyof typeof C.MESSAGES;
  return C.DEFAULT_LOCALE;
}

export function useTranslations(lang: keyof typeof C.MESSAGES) {
  return function t(key: keyof typeof C.MESSAGES[typeof C.DEFAULT_LOCALE]) {
    return C.MESSAGES[lang][key] || C.MESSAGES[C.DEFAULT_LOCALE][key];
  }
}
