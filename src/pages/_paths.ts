import type { GetStaticPaths } from 'astro';
import { C, localeSlugs, type Locale } from '../configuration';
import { getMessage, parseLocale, splitLocaleAndPath } from '../utils/i18n';
import { resolvePath } from '../utils/path';
import { getCollection, type CollectionEntry, type ContentEntryMap } from 'astro:content';
import { getCollectionSlug, getEntrySlug, getLocaleSlug } from '../utils/slugs';
import slug from 'limax';

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

export const entryPaths = <C extends keyof ContentEntryMap>(collection: C, slugName?: string) => {
  return (async () => {
    const entries = await getCollection(collection);
    return entries.map((entry) => {
      const split = splitLocaleAndPath(entry.slug);
      if (!split) throw new Error(`Invalid entry slug: ${entry.slug}`);

      const translations = entries.reduce((acc, curr) => {
        const s = splitLocaleAndPath(curr.slug);
        if (!s) throw new Error(`Invalid entry slug: ${curr.slug}`);

        const l = parseLocale(s.locale);
        const localeSlug = getLocaleSlug(l);
        const pageSlug = getEntrySlug(curr);
        const collectionSlug = collection === 'pages' ? undefined : getMessage(`slugs.${collection}`, l);

        if (s.path === split.path) acc[l] = resolvePath(localeSlug, collectionSlug, pageSlug);

        return acc;
      }, {} as Record<Locale, string>);

      const locale = parseLocale(split.locale);
      const localeSlug = getLocaleSlug(locale);
      const pageSlug = getEntrySlug(entry);

      if (slugName && collection !== 'pages') {
        const collectionSlug = getMessage(`slugs.${collection}`, locale);
        return { params: { locale: localeSlug, [collection]: collectionSlug, [slugName]: pageSlug }, props: { ...entry, locale, translations } };
      } else {
        return { params: { locale: localeSlug, pages: pageSlug }, props: { ...entry, locale, translations } };
      }
    });
  }) satisfies GetStaticPaths;
};

export const galleryCategoryPaths = (async () => {
  const categories = await getCollection("gallery");
  return categories.flatMap((category) => {
    const pages = localeSlugs.map((l) => {
      const locale = parseLocale(l);
      const localeSlug = getLocaleSlug(locale);
      const gallerySlug = getCollectionSlug(category.collection, locale);
      const categorySlug = slug(category.data.title[locale] ?? category.data.title[C.DEFAULT_LOCALE]);
      return {
        params: {
          locale: localeSlug,
          gallery: gallerySlug,
          category: categorySlug,
        },
        props: { locale, page: category.data },
      };
    });

    return pages.map((p) => ({
      ...p,
      props: {
        ...p.props,
        translations: pages.reduce(
          (acc, pp) => ({
            ...acc,
            [pp.props.locale]: resolvePath(
              pp.params.locale,
              pp.params.gallery,
              pp.params.category,
            ),
          }),
          {} as Record<string, string>,
        ),
      },
    }));
  });
}) satisfies GetStaticPaths;

export const galleryCategoryItemPaths = (async () => {
  const categories = await getCollection("gallery");
  return categories.flatMap((category) => {
    const pages = localeSlugs.flatMap((l) => {
      const locale = parseLocale(l);
      const localeSlug = getLocaleSlug(locale);
      const gallerySlug = getCollectionSlug(category.collection, locale);
      const categorySlug = slug(category.data.title[locale] ?? category.data.title[C.DEFAULT_LOCALE]);
      return category.data.images.map((image, index) => {
        return {
          params: {
            locale: localeSlug,
            gallery: gallerySlug,
            category: categorySlug,
            item: index.toString(),
          },
          props: {
            locale,
            page: image,
            prev: category.data.images[index - 1]
              ? (index - 1).toString()
              : undefined,
            next: category.data.images[index + 1]
              ? (index + 1).toString()
              : undefined,
          },
        };
      });
    });

    return pages.map((p) => ({
      ...p,
      props: {
        ...p.props,
        translations: pages.reduce(
          (acc, pp) => ({
            ...acc,
            [pp.props.locale]: resolvePath(
              pp.params.locale,
              pp.params.gallery,
              pp.params.category,
            ),
          }),
          {} as Record<string, string>,
        ),
      },
    }));
  });
}) satisfies GetStaticPaths;

export const blogPagePaths = (async ({ paginate }) => {
  const pages = (await getCollection("blog")).reverse();
  const groupedPageSlug = pages.reduce<Record<string, CollectionEntry<"blog">[]>>((acc, page) => {
    const split = splitLocaleAndPath(page.slug);
    if (split) {
      const locales = acc[split.path] || [];
      locales.push(page);
      acc[split.path] = locales;
    }
    return acc;
  }, {});

  const translations = localeSlugs.reduce<Record<string, string>>((acc, l) => {
    const localeSlug = getLocaleSlug(l);
    const collectionSlug = getCollectionSlug("blog", l);
    acc[l] = resolvePath(localeSlug, collectionSlug);
    return acc;
  }, {});

  return localeSlugs.flatMap((l) => {
    const filteredPages = Object.entries(groupedPageSlug).reduce<CollectionEntry<"blog">[]>((acc, [, pages]) => {
      if (pages.length === 1) {
        acc.push(...pages);
      } else {
        let page = pages.find((p) => {
          const split = splitLocaleAndPath(p.slug);
          return split && split.locale === l;
        });
        if (!page) {
          page = pages.find((p) => {
            const split = splitLocaleAndPath(p.slug);
            return split && split.locale === C.DEFAULT_LOCALE;
          });
        }
        if (!page) {
          page = pages[0];
        }
        if (page) {
          acc.push(page);
        }
      }
      return acc;
    }, []);
    const collectionSlug = getCollectionSlug("blog", l);
    return paginate(filteredPages, {
      pageSize: C.SETTINGS.BLOG.PAGE_SIZE,
      params: { locale: getLocaleSlug(l), blog: collectionSlug },
      props: { locale: l, translations },
    });
  });
}) satisfies GetStaticPaths

export const blogTagPagePaths = (async ({ paginate }) => {
  const pages = (await getCollection("blog")).reverse();
  const groupedPages = pages.reduce<Record<string, CollectionEntry<'blog'>[]>>((acc, page) => {
    page.data.tags.forEach((tag) => {
      const tagSlug = slug(tag);
      if (!acc[tagSlug]) {
        acc[tagSlug] = [];
      }
      acc[tagSlug].push(page);
    });
    return acc;
  }, {});
  return localeSlugs.flatMap((l) => {
    return Object.entries(groupedPages).flatMap(([tag, pages]) => {
      const translations = localeSlugs.reduce<Record<string, string>>(
        (acc, l) => {
          const localeSlug = getLocaleSlug(l);
          const collectionSlug = getCollectionSlug("blog", l);
          acc[l] = resolvePath(localeSlug, collectionSlug, slug(tag));
          return acc;
        },
        {},
      );
      const collectionSlug = getCollectionSlug("blog", l);
      return paginate(pages, {
        pageSize: C.SETTINGS.BLOG.PAGE_SIZE,
        params: { locale: getLocaleSlug(l), blog: collectionSlug, tag },
        props: { locale: l, translations, tag },
      });
    });
  });
}) satisfies GetStaticPaths;
