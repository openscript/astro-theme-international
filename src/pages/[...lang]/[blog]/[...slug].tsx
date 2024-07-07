import type { InferGetStaticParamsType, InferGetStaticPropsType, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import { splitLocaleFromPath } from '@timelet/i18n';
import slugify from 'limax';
import config from '../../../../astro.config.mjs';
import DefaultLayout from '../../../layouts/DefaultLayout.astro';

export const getStaticPaths = (async () => {
  if(!config.i18n) throw new Error('i18n config is required');

  const pages = await getCollection('blog');

  const paths = pages.map(page => {
    const split = splitLocaleFromPath(page.slug);
    const locale = split && split.locale !== config.i18n?.defaultLocale ? split.locale : undefined;
    const path = slugify(page.data.title);
    const translations = pages.reduce((acc, p) => {
      const s = splitLocaleFromPath(p.slug);
      if(s && s.locale !== split?.locale && s.path === split?.path) {
        acc.push([s.locale !== config.i18n?.defaultLocale ? `/${s.locale}` : undefined, "blog", slugify(p.data.title)].join("/"));
      }
      return acc;
    }, new Array<string>);
    // it works well in TSX
    return { params: { lang: locale, slug: path, blog: "blog" }, props: {...page, translations} };
  });

  return paths;
}) satisfies GetStaticPaths;

type Params = InferGetStaticParamsType<typeof getStaticPaths>;
type Props = InferGetStaticPropsType<typeof getStaticPaths>;
const { lang, slug } = Astro.params as Params;
console.log(Astro.params);
const page = Astro.props as Props;

const { Content } = await page.render();
