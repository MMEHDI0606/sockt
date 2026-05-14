import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Sockt is autonomous AI infrastructure for agents that provision compute, pay per second in Bitcoin Lightning sats, execute tasks, and terminate automatically.',
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: 'About Sockt',
    description:
      'Learn how Sockt enables autonomous AI agents to provision and pay for compute using Bitcoin Lightning — per second, on demand.',
    url: '/about',
    type: 'website',
  },
  twitter: {
    title: 'About Sockt',
    description:
      'Sockt: autonomous AI compute infrastructure billed per second in sats. No subscriptions. No idle waste.',
  },
};

export default function AboutLayout({ children }: { children: ReactNode }) {
  return children;
}
