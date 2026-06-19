import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Departments',
  description:
    'Sockt departments for growth, product development, and engineering operations.',
  alternates: {
    canonical: '/departments',
  },
  openGraph: {
    title: 'Sockt Departments',
    description:
      'See the preconfigured AI employee swarms Sockt deploys for each department.',
    url: '/departments',
    type: 'website',
  },
  twitter: {
    title: 'Sockt Departments',
    description:
      'Department swarms for Slack-native AI workforces.',
  },
};

export default function DepartmentsLayout({ children }: { children: ReactNode }) {
  return children;
}
