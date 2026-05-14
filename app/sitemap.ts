import type { MetadataRoute } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sockt.dev';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    '/',
    '/docs',
    '/pricing',
    '/privacy',
    '/sdk',
    '/stack',
    '/terms',
    '/use-cases',
    '/flow',
    '/login',
    '/signup',
  ];

  const now = new Date();

  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: now,
    changeFrequency: route === '/' ? 'daily' : 'weekly',
    priority: route === '/' ? 1 : 0.7,
  }));
}
