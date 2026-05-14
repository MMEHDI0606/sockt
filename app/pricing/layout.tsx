import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Pricing',
  description:
    'Sockt pricing for CPU and GPU agent sandboxes with pay-per-second billing in USD or msats.',
  alternates: {
    canonical: '/pricing',
  },
  openGraph: {
    title: 'Sockt Pricing',
    description:
      'Compare Nano, Micro, GPU Small, and GPU Large tiers for autonomous agent workloads.',
    url: '/pricing',
    type: 'website',
  },
  twitter: {
    title: 'Sockt Pricing',
    description:
      'Pay-per-second pricing for agent compute across CPU and GPU tiers.',
  },
};

export default function PricingLayout({ children }: { children: ReactNode }) {
  return children;
}
