import { getEntry, type CollectionEntry, type ContentEntryMap, type DataEntryMap, type ValidContentEntrySlug } from 'astro:content';
import { C, type Locale } from '../configuration';
import { dirname, getRelativePath, joinPath } from './path';
import slug from "limax";
import { getLocaleSlug } from './slugs';

const IETF_BCP_47_LOCALE_PATTERN = /^\/?(\w{2}(?!\w)(-\w{1,})*)\/?/;
const SINGLE_LEADING_SLASH_PATTERN = /^\/(?=\/)/;
const REMOVE_LEADING_SLASH_PATTERN = /^\/+/;

export function parseLocaleTagFromPath(path: string) {
  const match = path.match(IETF_BCP_47_LOCALE_PATTERN);
  return match ? match[1] : undefined;
}

export function splitLocaleAndPath(path: string) {
  const locale = parseLocaleTagFromPath(path);
  if (!locale) return undefined;

  const p = path.replace(locale, "").replace(path.startsWith("/") ? SINGLE_LEADING_SLASH_PATTERN : REMOVE_LEADING_SLASH_PATTERN, "");
  return { locale, path: p };
}

export function getNameFromLocale(locale?: string) {
  const l = parseLocale(locale);
  return C.MESSAGES[l].language;
}

export function getLocaleFromUrl(url: URL) {
  let path = url.pathname;

  if (url.pathname.startsWith(import.meta.env.BASE_URL)) path = url.pathname.slice(import.meta.env.BASE_URL.length);

  const locale = parseLocaleTagFromPath(path);

  return parseLocale(locale);
}

export function parseLocale(locale?: string) {
  return locale && locale in C.LOCALES ? locale as keyof typeof C.LOCALES : C.DEFAULT_LOCALE;
}

export function getMessage(key: string, locale: Locale) {
  if (!(locale in C.MESSAGES)) throw new Error(`Invalid locale: ${locale}`);
  if (!(key in C.MESSAGES[locale])) throw new Error(`Invalid message key: ${key}`);

  const k = key as keyof typeof C.MESSAGES[typeof locale];

  return C.MESSAGES[locale][k];
}

export async function getContentEntryPath<
  C extends keyof ContentEntryMap,
  E extends ValidContentEntrySlug<C> | (string & {}),
>(
  collection: C,
  entrySlug: E
) {
  const e = await getEntry(collection, entrySlug);
  if (!e) throw new Error(`Content entry not found: ${collection}/${entrySlug}`);

  const split = splitLocaleAndPath(e.slug);
  if (!split) throw new Error(`Entry has no international path: ${collection}/${entrySlug}`);

  let pageSlug = split.path;
  if ('path' in e.data) pageSlug = e.data.path;
  if ('title' in e.data) pageSlug = joinPath(dirname(pageSlug), slug(e.data.title));

  return getTranslatedPath(parseLocale(split.locale), collection, pageSlug);
}

export async function getDataEntryPath<
  C extends keyof DataEntryMap,
  E extends keyof DataEntryMap[C]
>(
  collection: C,
  entryId: E,
  locale: Locale
) {
  const e = await getEntry(collection, entryId) as CollectionEntry<C> | undefined;
  if (!e) throw new Error(`Data entry not found: ${collection}/${String(entryId)}`);

  let pageSlug = dirname(e.id);
  if (e.data.title) {
    const folders = pageSlug.split('/').slice(1, -1);
    pageSlug = joinPath(...folders, slug(e.data.title[locale] || e.data.title[C.DEFAULT_LOCALE]));
  }

  return getTranslatedPath(locale, collection, pageSlug);
}

function getTranslatedPath(locale: Locale, collection: string, pageSlug: string) {
  const localeSlug = getLocaleSlug(locale);
  const collectionSlug = collection === 'pages' ? undefined : getMessage(`slugs.${collection}`, locale);

  return getRelativePath(`/${[localeSlug, collectionSlug, pageSlug].filter(Boolean).join('/')}`);
}

export async function makeMenu(
  locale: keyof typeof C.LOCALES,
  items: { title: string, path: ((locale: keyof typeof C.LOCALES) => Promise<string>) | string }[]
) {
  return Promise.all(items.map(async (item) => {
    const urlLocale = locale === C.DEFAULT_LOCALE ? '' : locale;
    const path = typeof item.path === 'string'
      ? getRelativePath(`/${[urlLocale, item.path].filter(Boolean).join('/')}`)
      : await item.path(locale);
    return {
      title: item.title,
      path,
    };
  }));
}

export function useTranslations(locale: keyof typeof C.MESSAGES) {
  return function t(key: keyof typeof C.MESSAGES[typeof C.DEFAULT_LOCALE]) {
    return C.MESSAGES[locale][key] || C.MESSAGES[C.DEFAULT_LOCALE][key];
  }
}
