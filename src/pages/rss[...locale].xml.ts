import rss from '@astrojs/rss';
import type { APIRoute, GetStaticPaths, InferGetStaticParamsType, InferGetStaticPropsType } from 'astro';
import { C, localeSlugs } from '../configuration';
import { parseLocale } from '../utils/i18n';
import { getCollection } from 'astro:content';
import { i18nPropsAndParams } from 'astro-loader-i18n';
import { defaultPropsAndParamsOptions } from '../utils/paths';

export const getStaticPaths = (async () => {
  const versions = [undefined, ...localeSlugs];
  return versions.map((l) => ({ params: { locale: l ? `-${l}` : undefined }, props: { locale: l } }));
}) satisfies GetStaticPaths;

type Props = InferGetStaticPropsType<typeof getStaticPaths>;
type Params = InferGetStaticParamsType<typeof getStaticPaths>;

export const GET: APIRoute<Props, Params> = async (context) => {
  const locale = parseLocale(context.props.locale);
  const blogs = await getCollection(
    "blog",
    (entry) =>
      entry.data.locale === locale
  );

  const routePattern = "[...locale]/[blog]/[...slug]";
  const propsAndParams = i18nPropsAndParams(blogs, {
    ...defaultPropsAndParamsOptions,
    routePattern,
  });

  return rss({
    title: C.MESSAGES[locale]['head.title'],
    description: C.MESSAGES[locale]['site.description'],
    site: context.site || 'http://localhost:4321',
    items: propsAndParams.map(({props: blog}) => ({
      title: blog.data.title,
      pubDate: blog.data.publishedAt,
      link: blog.translatedPath,
    })),
    customData: `<language>${C.LOCALES[locale]}</language>`,
  });
}
