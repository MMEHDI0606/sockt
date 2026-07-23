import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Pricing — Coming Soon',
  description:
    'Sockt pricing is coming soon. Community Edition is free and open-core.',
  robots: { index: false, follow: false },
  alternates: {
    canonical: '/pricing',
  },
  openGraph: {
    title: 'Sockt Pricing — Coming Soon',
    description:
      'Pricing is coming soon. Community Edition is free and open-core.',
    url: '/pricing',
    type: 'website',
  },
  twitter: {
    title: 'Sockt Pricing — Coming Soon',
    description:
      'Pricing is coming soon. Community Edition is free and open-core.',
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
