import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Sockt is an AI-native workforce platform that deploys preconfigured employee swarms into Slack with persistent memory, loop prevention, and credential isolation.',
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: 'About Sockt',
    description:
      'Learn how Sockt helps lean teams deploy reliable AI-native departments that remember context and compound in intelligence over time.',
    url: '/about',
    type: 'website',
  },
  twitter: {
    title: 'About Sockt',
    description:
      'Sockt: AI-native workforce infrastructure for Slack-native departments with memory and loop prevention.',
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
