import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Pricing — Sockt',
  description:
    'Community Edition is free forever. Managed hosting from $79/mo. FSM loop prevention, GBrain persistent memory, and Secret Vault Proxy are on every plan.',
  alternates: {
    canonical: '/pricing',
  },
  openGraph: {
    title: 'Sockt Pricing — Free to start. Pay for hosting, not safety.',
    description:
      'Community Edition is free and open-core. Managed hosting from $79/mo. No token markup, no per-seat Slack tax, no safety features behind a paywall.',
    url: '/pricing',
    type: 'website',
  },
  twitter: {
    title: 'Sockt Pricing — Free to start. Pay for hosting, not safety.',
    description:
      'Community Edition is free and open-core. Managed hosting from $79/mo. No token markup, no per-seat Slack tax.',
  },
};

const breadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://sockt.dev' },
    { '@type': 'ListItem', position: 2, name: 'Pricing', item: 'https://sockt.dev/pricing' },
  ],
};

export default function PricingLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      {children}
    </>
  );
}
