import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Pricing',
  description:
    'Sockt pricing for AI workforce infrastructure. Customers pay Sockt for orchestration and intelligence, and pay their LLM provider directly for inference.',
  alternates: {
    canonical: '/pricing',
  },
  openGraph: {
    title: 'Sockt Pricing',
    description:
      'Compare Community, Starter, Professional, Business, Agency, and Enterprise tiers for AI workforce deployments.',
    url: '/pricing',
    type: 'website',
  },
  twitter: {
    title: 'Sockt Pricing',
    description:
      'AI workforce pricing with BYOK inference and no token markup.',
  },
};

export default function PricingLayout({ children }: { children: ReactNode }) {
  return children;
}
