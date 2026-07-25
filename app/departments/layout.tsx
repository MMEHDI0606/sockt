import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Departments',
  description:
    'Shared AI swarms for growth, product development, and engineering operations. Deploy into a Slack channel — your whole team steers.',
  alternates: {
    canonical: '/departments',
  },
  openGraph: {
    title: 'Sockt Departments',
    description:
      'Preconfigured AI swarms for each department. Deploy into shared Slack channels where your entire team can watch, steer, and compound together.',
    url: '/departments',
    type: 'website',
  },
  twitter: {
    title: 'Sockt Departments',
    description:
      'AI swarms for Slack — pick a department, invite your team, start steering.',
  },
};

const breadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://sockt.dev' },
    { '@type': 'ListItem', position: 2, name: 'Departments', item: 'https://sockt.dev/departments' },
  ],
};

export default function DepartmentsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      {children}
    </>
  );
}
