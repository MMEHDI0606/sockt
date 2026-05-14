import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Docs',
  description:
    'Sockt documentation for MCP setup, SDK usage, sandbox lifecycle, and Lightning-based agent billing.',
  alternates: {
    canonical: '/docs',
  },
  openGraph: {
    title: 'Sockt Docs',
    description:
      'Learn how to integrate Sockt MCP and SDK to run autonomous agent compute workflows.',
    url: '/docs',
    type: 'article',
  },
  twitter: {
    title: 'Sockt Docs',
    description:
      'Integrate MCP + SDK for autonomous agent compute with Lightning settlement.',
  },
};

export default function DocsLayout({ children }: { children: ReactNode }) {
  return children;
}
