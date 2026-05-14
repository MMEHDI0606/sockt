import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'SDK',
  description:
    'Sockt SDK references for TypeScript and Python to provision, execute, and terminate agent sandboxes.',
  alternates: {
    canonical: '/sdk',
  },
  openGraph: {
    title: 'Sockt SDK',
    description:
      'Build agent compute workflows with the Sockt SDK and Lightning-aware billing paths.',
    url: '/sdk',
    type: 'article',
  },
  twitter: {
    title: 'Sockt SDK',
    description:
      'TypeScript and Python SDK support for autonomous compute orchestration.',
  },
};

export default function SdkLayout({ children }: { children: ReactNode }) {
  return children;
}
