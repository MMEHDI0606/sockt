import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Pricing — Coming Soon',
  description:
    'Sockt pricing is coming soon. Community Edition is free and open-core — self-host it today.',
  alternates: {
    canonical: '/pricing',
  },
  openGraph: {
    title: 'Sockt Pricing — Coming Soon',
    description:
      'Pricing is coming soon. Community Edition is free and open-core — self-host it today.',
    url: '/pricing',
    type: 'website',
  },
  twitter: {
    title: 'Sockt Pricing — Coming Soon',
    description:
      'Pricing is coming soon. Community Edition is free and open-core.',
  },
};

export default function PricingLayout({ children }: { children: ReactNode }) {
  return children;
}
