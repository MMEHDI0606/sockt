import type { ReactNode } from 'react';
import type { Metadata, Viewport } from 'next';
import SmoothScrollProvider from '@/components/providers/SmoothScrollProvider';
import './globals.css';

const themeBootstrapScript = `
(() => {
  const stored = window.localStorage.getItem('theme');
  const theme = stored === 'light' || stored === 'dark'
    ? stored
    : (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
  document.documentElement.setAttribute('data-theme', theme);
})();
`;

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sockt.dev';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Sockt | Agent Compute Paid in Sats',
    template: '%s | Sockt',
  },
  description:
    'On-demand compute sandboxes that AI agents can buy autonomously to run their code, settle over Lightning, and terminate automatically.',
  applicationName: 'Sockt',
  keywords: [
    'AI agents',
    'compute sandboxes',
    'agent-provisioned compute',
    'AI agent sandboxes',
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
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootstrapScript }} />
      </head>
      <body>
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}
