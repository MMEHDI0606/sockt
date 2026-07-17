import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Install',
  description:
    'Install Sockt Community Edition in one command. Self-host the open-core AI workforce CLI on Linux or macOS, then init and deploy your swarm.',
  alternates: {
    canonical: '/install',
  },
  openGraph: {
    title: 'Install Sockt',
    description:
      'One-command install for the Sockt CLI. Community Edition is free and open-core — self-host on Linux or macOS.',
    url: '/install',
    type: 'website',
  },
  twitter: {
    title: 'Install Sockt',
    description:
      'curl -fsSL https://sockt.dev/install | bash — install the open-core AI workforce CLI.',
  },
};

export default function InstallLayout({ children }: { children: ReactNode }) {
  return children;
}
