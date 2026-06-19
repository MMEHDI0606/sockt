import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Sockt is an AI workforce platform that deploys preconfigured employee swarms into Slack with persistent memory, loop prevention, and credential isolation.',
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: 'About Sockt',
    description:
      'Learn how Sockt helps lean teams deploy reliable AI departments that remember context and compound in intelligence over time.',
    url: '/about',
    type: 'website',
  },
  twitter: {
    title: 'About Sockt',
    description:
      'Sockt: AI workforce infrastructure for Slack-native departments with memory and loop prevention.',
  },
};

export default function AboutLayout({ children }: { children: ReactNode }) {
  return children;
}
