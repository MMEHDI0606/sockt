import type { MetadataRoute } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sockt.dev';

const routes: { path: string; lastModified: string }[] = [
  { path: '/',            lastModified: '2026-07-23' },
  { path: '/departments', lastModified: '2026-07-10' },
  { path: '/install',     lastModified: '2026-07-23' },
  { path: '/pricing',     lastModified: '2026-07-10' },
  { path: '/docs',        lastModified: '2026-07-10' },
  { path: '/about',       lastModified: '2026-07-10' },
  { path: '/terms',       lastModified: '2026-07-10' },
  { path: '/privacy',     lastModified: '2026-07-10' },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map(({ path, lastModified }) => ({
    url: `${siteUrl}${path}`,
    lastModified,
  }));
}
