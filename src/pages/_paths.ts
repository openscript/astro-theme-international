import type { GetStaticPaths } from 'astro';
import { localeSlugs, type Locale } from '../configuration';
import { getMessage, parseLocale, splitLocaleAndPath } from '../utils/i18n';
import { resolvePath } from '../utils/path';
import type { CollectionEntry, ContentEntryMap } from 'astro:content';
import { getEntrySlug, getLocaleSlug } from '../utils/slugs';

export const rssXmlPaths = (async () => {
  const versions = [undefined, ...localeSlugs];
  return versions.map((l) => ({ params: { locale: l ? `-${l}` : undefined }, props: { locale: l } }));
}) satisfies GetStaticPaths;

export const indexPaths = (kind?: string) => {
  return (async () => {
    const translations = localeSlugs.reduce((acc, curr) => {
      const collectionSlug = kind ? getMessage(`slugs.${kind}`, curr) : undefined;
      const localeSlug = getLocaleSlug(curr);
      acc[curr] = resolvePath(localeSlug, collectionSlug);
      return acc;
    }, {} as Record<Locale, string>);
    return localeSlugs.map((l) => {
      const localeSlug = getLocaleSlug(l);
      const path = { params: { locale: localeSlug }, props: { locale: l, translations } };
      return kind ? { ...path, params: { ...path.params, [kind]: getMessage(`slugs.${kind}`, l) } } : path;
    });
  }) satisfies GetStaticPaths;
};

export const entryPaths = <C extends keyof ContentEntryMap>(collection: C, entries: CollectionEntry<C>[]) => {
  return (async () => {
    return entries.map((entry) => {
      const split = splitLocaleAndPath(entry.slug);
      if (!split) throw new Error(`Invalid entry slug: ${entry.slug}`);

      const locale = parseLocale(split.locale);
      const translations = entries.reduce((acc, curr) => {
        const s = splitLocaleAndPath(curr.slug);
        if (!s) throw new Error(`Invalid entry slug: ${curr.slug}`);
        const l = parseLocale(s.locale);
        const localeSlug = getLocaleSlug(l);
        const collectionSlug = collection === 'pages' ? undefined : getMessage(`slugs.${collection}`, l);
        const pageSlug = getEntrySlug(curr);
        if (s.path === split.path) acc[l] = resolvePath(localeSlug, collectionSlug, pageSlug);

        return acc;
      }, {} as Record<string, string>);

      const localeSlug = getLocaleSlug(locale);
      return { params: { locale: localeSlug}, props: { locale, translations, page: entry } };
    });
  }) satisfies GetStaticPaths;
};

