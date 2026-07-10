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

export default function DocsLayout({ children }: { children: ReactNode }) {
  return children;
}
