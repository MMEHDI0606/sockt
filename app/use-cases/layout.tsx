import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Use Cases',
  description:
    'Real-world use cases for Sockt autonomous agent compute: model training, eval loops, and batch processing.',
  alternates: {
    canonical: '/use-cases',
  },
  openGraph: {
    title: 'Sockt Use Cases',
    description:
      'See how agents run end-to-end compute jobs with automatic sandbox creation, execution, and settlement.',
    url: '/use-cases',
    type: 'website',
  },
  twitter: {
    title: 'Sockt Use Cases',
    description:
      'Autonomous compute workflows for AI agents across CPU and GPU tiers.',
  },
};

export default function UseCasesLayout({ children }: { children: ReactNode }) {
  return children;
}
