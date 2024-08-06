import type { GetStaticPathsItem, GetStaticPathsResult } from 'astro';
import { localeSlugs, type Locale } from '../configuration';
import { getLocaleSlug, getMessage, parseLocale } from './i18n';
import { resolvePath } from './path';

export type RouteLocale = { params: { locale: string | undefined }, props: { locale: Locale } }
export type RouteKind<T extends string> = { params: { [key in T]: string } }
export type RouteTranslations = { props: { translations: Record<string, string> } }

export function route() {
  return new RoutesBuilder();
}

class RoutesBuilder {
  private staticPaths: GetStaticPathsResult = [];
  private order: string[] = [];

  locale() {
    const locales = localeSlugs;

    if (this.staticPaths.length === 0) {
      this.staticPaths = locales.map((locale) => {
        return { params: { locale: getLocaleSlug(locale) }, props: { locale } }
      });
    } else {
      this.staticPaths = this.staticPaths.reduce<GetStaticPathsResult>((acc, curr) => {
        return [
          ...acc,
          ...locales.map((locale) => ({ params: { ...curr.params, locale: getLocaleSlug(locale) }, props: { ...curr.props, locale } }))
        ];
      }, []);
    }

    this.order.push('locale');

    return this;
  }

  kind(name: string) {
    if (this.staticPaths.length === 0) {
      this.staticPaths = [{ params: { [name]: name } }]
    } else {
      this.staticPaths = this.staticPaths.map((p) => {
        const locale = parseLocale(p.props?.locale as string);
        return { ...p, params: { ...p.params, [name]: getMessage(`slugs.${name}`, locale) } }
      });
    }

    this.order.push(name);

    return this;
  }

  build<T extends GetStaticPathsItem>(): T[] {
    this.buildTranslations();
    return this.staticPaths as T[];
  }

  private buildTranslations() {
    if (!this.order.includes('locale')) return;

    const translations = this.staticPaths.reduce<Record<string, string>>((a, p) => {
      const locale = parseLocale(p.props?.locale as string | undefined);
      const segments = this.order.map((o) => p.params[o]);

      a[locale] = resolvePath(...segments);

      return a;
    }, {});

    this.staticPaths = this.staticPaths.map((p) => ({ ...p, props: { ...p.props, translations } }));
  }
}


