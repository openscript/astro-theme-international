import rss from '@astrojs/rss';
import type { APIRoute, GetStaticPaths, InferGetStaticParamsType, InferGetStaticPropsType } from 'astro';
import { C } from '../configuration';
import { getTranslatedPath, parseLocale } from '../i18n';
import { getCollection } from 'astro:content';

export const getStaticPaths = (async () => {
  const versions = [undefined, ...Object.keys(C.LOCALES)];

  return versions.map((l) => ({params: {locale: l ? `-${l}` : undefined}, props: {locale: l}}));
}) satisfies GetStaticPaths;

type Props = InferGetStaticPropsType<typeof getStaticPaths>;
type Params = InferGetStaticParamsType<typeof getStaticPaths>;

export const GET: APIRoute<Props, Params> = async (context) => {
  const locale = parseLocale(context.props.locale);
  const blogs = await getCollection('blog', (entry) => !context.props.locale || entry.slug.startsWith(locale));

  return rss({
    title: C.MESSAGES[locale]['head.title'],
    description: C.MESSAGES[locale]['site.description'],
    site: context.site || 'http://localhost:4321',
    items: await Promise.all(blogs.map(async (blog) => ({
      title: blog.data.title,
      pubDate: blog.data.publishedAt,
      link: await getTranslatedPath("blog", blog.slug)
    }))),
    customData: `<language>${C.LOCALES[locale]}</language>`,
  });
}
