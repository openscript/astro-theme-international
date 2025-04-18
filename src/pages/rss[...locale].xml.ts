import rss from '@astrojs/rss';
import type { APIRoute, InferGetStaticParamsType, InferGetStaticPropsType } from 'astro';
import { C } from '../configuration';
import { getContentEntryPath, parseLocale, parseLocaleFromPath } from '../utils/i18n';
import { getCollection, getEntry } from 'astro:content';
import { rssXmlPaths } from './_paths';

export const getStaticPaths = rssXmlPaths;

type Props = InferGetStaticPropsType<typeof getStaticPaths>;
type Params = InferGetStaticParamsType<typeof getStaticPaths>;

export const GET: APIRoute<Props, Params> = async (context) => {
  const locale = parseLocale(context.props.locale);
  const blogs = await getCollection(
    "blog",
    (entry) =>
      !context.props.locale || parseLocaleFromPath(entry.id) === locale,
  );

  return rss({
    title: C.MESSAGES[locale]['head.title'],
    description: C.MESSAGES[locale]['site.description'],
    site: context.site || 'http://localhost:4321',
    items: await Promise.all(blogs.map(async (blog) => ({
      title: blog.data.title,
      pubDate: blog.data.publishedAt,
      link: getContentEntryPath(await getEntry("blog", blog.id)),
    }))),
    customData: `<language>${C.LOCALES[locale]}</language>`,
  });
}
