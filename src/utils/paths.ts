import { createI18nCollection, i18nPropsAndParams, resolvePath as originalResolvePath } from "astro-loader-i18n";
import { C, localeSlugs } from "../configuration";
import { getEntry, type CollectionKey, type DataEntryMap } from "astro:content";

const PROTOCOL_DELIMITER = "://";

export const defaultPropsAndParamsOptions = {
  defaultLocale: C.DEFAULT_LOCALE,
  segmentTranslations: C.SEGMENT_TRANSLATIONS,
}

export const resolvePath = (...path: Array<string | number | undefined>) => {
  return originalResolvePath(import.meta.env.BASE_URL ,...path);
}

export const generateGetStaticIndexPaths = (routePattern: string) => {
  return async () => {
    const collection = createI18nCollection({ locales: localeSlugs, routePattern });
    return i18nPropsAndParams(collection, {
      ...defaultPropsAndParamsOptions,
      routePattern
    })
  }
}

export const prepareNavigation = async <E extends keyof DataEntryMap["navigation"] | (string & {})>(id: E) => {
  const navigation = await getEntry("navigation", id);

  if (!navigation) throw new Error(`Navigation entry not found`);

  return Array.isArray(navigation.data.entries)
    ? await Promise.all(navigation.data.entries.map(async (item) => {
      const { title, path, icon } = item;
      return {
        title,
        icon,
        path: await convertReferenceToPath(path),
      };
    }))
    : [];
}

export const convertReferenceToPath = async (path: string) => {
  if (!path.includes(PROTOCOL_DELIMITER)) return path;
  if (path.includes(PROTOCOL_DELIMITER) && path.startsWith("http")) return path;

  const [collection, reference] = path.split(PROTOCOL_DELIMITER);
  if (!collection || !reference) throw new Error("Invalid path");

  const collectionName = collection as CollectionKey;
  const entry = await getEntry(collectionName, reference);

  if (!entry) throw new Error("Entry not found");
  if (!('locale' in entry.data)) throw new Error("Entry has no locale");
  if (!('path' in entry.data)) throw new Error("Entry has no path");
  if (typeof entry.data.path !== "string") throw new Error("Entry title is not a string");

  const localeSlug = entry.data.locale === C.DEFAULT_LOCALE ? undefined : entry.data.locale;

  return originalResolvePath(localeSlug, entry.data.contentPath, entry.data.path);
}
