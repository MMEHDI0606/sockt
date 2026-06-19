import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'SDK',
  description:
    'Sockt docs for Slack setup, swarm onboarding, and AI workforce workflows.',
  alternates: {
    canonical: '/sdk',
  },
  openGraph: {
    title: 'Sockt SDK',
    description:
      'Read the setup flow for deploying preconfigured AI employee swarms.',
    url: '/sdk',
    type: 'article',
  },
  twitter: {
    title: 'Sockt SDK',
    description:
      'Setup docs for Sockt AI workforce deployments.',
  },
};

export default function SdkLayout({ children }: { children: ReactNode }) {
  return children;
}
