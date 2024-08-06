import type { GetStaticPaths } from 'astro';
import { localeSlugs, type Locale } from '../configuration';
import { getLocaleSlug, getMessage } from '../utils/i18n';
import { resolvePath } from '../utils/path';

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



