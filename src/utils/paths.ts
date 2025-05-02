import { createI18nCollection, i18nPropsAndParams } from "astro-loader-i18n";
import { C, localeSlugs } from "../configuration";

export const defaultPropsAndParamsOptions = {
  defaultLocale: C.DEFAULT_LOCALE,
  segmentTranslations: C.SEGMENT_TRANSLATIONS,
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
