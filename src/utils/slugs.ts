import { C, type Locale } from "../configuration";
import { getMessage, splitLocaleAndPath } from "./i18n";
import { dirname, joinPath } from "./path";
import slug from "limax";

export function getLocaleSlug(locale: Locale) {
  return locale === C.DEFAULT_LOCALE ? undefined : locale;
}

export function getCollectionSlug(collection: string, locale: Locale) {
  return getMessage(`slugs.${collection}`, locale);
}

export function getEntrySlug(entry: {
  id: string;
  data?: { path?: string; title?: string | object } | object;
}) {
  const split = splitLocaleAndPath(entry.id);
  if (!split) throw new Error(`Entry has no international path: ${entry.id}`);

  let entrySlug = split.path;
  if (entry.data) {
    if ("title" in entry.data && entry.data.title && typeof entry.data.title === "string")
      entrySlug = joinPath(dirname(entrySlug), slug(entry.data.title));
    if ("path" in entry.data && entry.data.path) entrySlug = entry.data.path;
  }
  return entrySlug;
}
