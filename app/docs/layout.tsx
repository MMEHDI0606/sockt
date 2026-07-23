import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Docs',
  description:
    'Sockt documentation for Slack setup, swarm onboarding, memory seeding, and BYOK model connection.',
  alternates: {
    canonical: '/docs',
  },
  openGraph: {
    title: 'Sockt Docs',
    description:
      'Learn how to connect Slack, seed memory, and activate preconfigured AI employee swarms.',
    url: '/docs',
    type: 'article',
  },
  twitter: {
    title: 'Sockt Docs',
    description:
      'Slack swarm setup docs for AI-native workforce deployments.',
  },
};

const breadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://sockt.dev' },
    { '@type': 'ListItem', position: 2, name: 'Docs', item: 'https://sockt.dev/docs' },
  ],
};

export default function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      {children}
    </>
  );
}
