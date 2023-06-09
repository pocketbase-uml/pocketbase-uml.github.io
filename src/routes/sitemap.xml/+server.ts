import { PUBLIC_URL } from '$lib/config';
import type { RequestHandler } from './$types';

export const prerender = true;

const PATHS = ['/', '/connect', '/import'];

export const GET: RequestHandler = () => {
  const date = new Date().toISOString();
  return new Response(
    [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">',
      ...PATHS.map(
        (path) =>
          `<url><loc>${PUBLIC_URL}${
            path === '/' ? '' : path
          }</loc><lastmod>${date}</lastmod><changefreq>weekly</changefreq><priority>0.7</priority></url>`
      ),
      '</urlset>'
    ].join('\n')
  );
};
