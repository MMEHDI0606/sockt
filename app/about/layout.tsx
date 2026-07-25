import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Sockt is a collaborative AI operations platform that deploys shared AI swarms into Slack where your entire team can steer them, see their progress, and compound together.',
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: 'About Sockt',
    description:
      'The shared command center where your team and AI operate as one workforce — persistent memory, loop prevention, and credential isolation.',
    url: '/about',
    type: 'website',
  },
  twitter: {
    title: 'About Sockt',
    description:
      'Sockt: Collaborative AI operations platform — deploy AI swarms into Slack and steer them as a team.',
  },
};

const breadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://sockt.dev' },
    { '@type': 'ListItem', position: 2, name: 'About', item: 'https://sockt.dev/about' },
  ],
};

export default function AboutLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      {children}
    </>
  );
}
