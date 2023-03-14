import { PUBLIC_URL } from '$lib/config';
import type { RequestHandler } from './$types';

export const prerender = true;

export const GET: RequestHandler = () => {
  return new Response(
    [
      'User-agent: *',
      'Allow: /',
      `Host: ${PUBLIC_URL}/`,
      `Sitemap: ${PUBLIC_URL}/sitemap.xml`
    ].join('\n')
  );
};
