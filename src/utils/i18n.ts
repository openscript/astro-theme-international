import {
  type CollectionEntry,
  type CollectionKey,
} from "astro:content";
import { C, type Locale } from "../configuration";
import { dirname, joinPath } from "./path";
import slug from "limax";

const PATH_LOCALE_PATTERN = /^\/?(?<locale>\w{2}(?!\w)(-\w{1,})*)\/?(?<path>.*)?/;
const FILE_LOCALE_PATTERN = /^(?<path>.*)\.(?<locale>\w{2}(?!\w)(-\w{1,})*)\./;
const LOCALE_PATTERNS = [PATH_LOCALE_PATTERN, FILE_LOCALE_PATTERN];
export const PROTOCOL_DELIMITER = "://";

export function splitLocaleAndPath(path: string) {
  const pattern = LOCALE_PATTERNS.find((p) => path.match(p));
  if (!pattern) return undefined;

  const match = path.match(pattern);
  if (!match || !match.groups || !match.groups.locale || !match.groups.path) return undefined;

  const l = match.groups.locale;
  let p = match.groups.path;
  if (path.startsWith("/") && !p.startsWith("/")) p = `/${p}`;

  return { locale: l, path: p };
}

export function splitCollectionAndSlug(path: string) {
  const split = path.split(PROTOCOL_DELIMITER);

  if (!split[0] || !split[1]) throw new Error("Couldn't split path.");

  return { collection: split[0], slug: split[1] };
}

export function getNameFromLocale(locale?: string) {
  const l = parseLocale(locale);
  return C.MESSAGES[l].language;
}

export function getLocaleFromUrl(url: URL) {
  let path = url.pathname;

  if (url.pathname.startsWith(import.meta.env.BASE_URL))
    path = url.pathname.slice(import.meta.env.BASE_URL.length);

  const locale = parseLocaleFromPath(path);

  return parseLocale(locale);
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

export async function makeMenu(
  locale: keyof typeof C.LOCALES,
  items: {
    title: string;
    path: ((locale: keyof typeof C.LOCALES) => Promise<string>) | string;
  }[],
) {
  return Promise.all(
    items.map(async (item) => {
      const urlLocale = locale === C.DEFAULT_LOCALE ? "" : locale;
      const path = typeof item.path === "string"
          ? `/${[urlLocale, item.path].filter(Boolean).join("/")}`
          : await item.path(locale);
      return {
        title: item.title,
        path,
      };
    }),
  );
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
