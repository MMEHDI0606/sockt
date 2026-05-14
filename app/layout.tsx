import type { ReactNode } from 'react';
import type { Metadata, Viewport } from 'next';
import SmoothScrollProvider from '@/components/providers/SmoothScrollProvider';
import './globals.css';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sockt.dev';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Sockt | Agent Compute Paid in Sats',
    template: '%s | Sockt',
  },
  description:
    'Autonomous AI infrastructure where agents provision compute, pay in sats, execute tasks, and terminate automatically.',
  applicationName: 'Sockt',
  keywords: [
    'AI agents',
    'agent infrastructure',
    'lightning payments',
    'bitcoin sats',
    'gpu sandbox',
    'autonomous compute',
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    url: '/',
    title: 'Sockt | Agent Compute Paid in Sats',
    description:
      'Agents create compute sandboxes, pay via Lightning, run workloads, and shut down automatically.',
    siteName: 'Sockt',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sockt | Agent Compute Paid in Sats',
    description:
      'Autonomous agent compute with pay-per-second settlement in sats.',
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    other: {
      'msvalidate.01': '5E288081AE005BFF3B6F06BF9AD578F3',
    },
  },
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}
