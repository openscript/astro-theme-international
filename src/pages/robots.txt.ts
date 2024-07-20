import type { APIRoute } from 'astro';

const sitemapUrl = [
  import.meta.env.SITE,
  import.meta.env.BASE_URL !== '/' ? import.meta.env.BASE_URL : '',
  'sitemap-index.xml'
].filter(Boolean).join('/');

const robotsTxt = `
User-agent: *
Allow: /

Sitemap: ${sitemapUrl}
`.trim();

export const GET: APIRoute = () => {
  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
