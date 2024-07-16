import { getEntry, type ContentEntryMap, type ValidContentEntrySlug } from 'astro:content';
import { C } from './configuration';
import { splitLocaleFromPath } from '@timelet/i18n';
import { getRelativePath } from './path';

export function getNameFromLocale(locale?: string) {
  if (locale && locale in C.LOCALES) return C.LOCALES[locale as keyof typeof C.LOCALES];
  return C.LOCALES[C.DEFAULT_LOCALE];
}

export function getLocaleFromUrl(url: URL) {
  const [, locale] = url.pathname.split('/');
  return parseLocale(locale);
}

export function parseLocale(locale?: string) {
  return locale && locale in C.MESSAGES ? locale as keyof typeof C.MESSAGES : C.DEFAULT_LOCALE;
}

export async function getTranslatedPath<
  C extends keyof ContentEntryMap,
  E extends ValidContentEntrySlug<C> | (string & {}),
>(collection: C, slug: E){
  const e = await getEntry(collection, slug);

  if (!e) throw new Error(`Entry not found: ${collection}/${slug}`);
  if (!('path' in e.data)) throw new Error(`Entry has no path in its data: ${collection}/${slug}`);

  const split = splitLocaleFromPath(e.slug);
  const locale = parseLocale(split?.locale);
  const urlLocale = locale === C.DEFAULT_LOCALE ? '' : locale;
  const collectionSlugName = `slugs.${e.collection}` as keyof typeof C.MESSAGES[typeof locale];
  const collectionSlug = C.MESSAGES[locale][collectionSlugName] || '';

  return getRelativePath(`/${[urlLocale, collectionSlug, e.data.path].filter(Boolean).join('/')}`);
}

export function useTranslations(locale: keyof typeof C.MESSAGES) {
  return function t(key: keyof typeof C.MESSAGES[typeof C.DEFAULT_LOCALE]) {
    return C.MESSAGES[locale][key] || C.MESSAGES[C.DEFAULT_LOCALE][key];
  }
}
