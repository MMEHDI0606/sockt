import type { ReactNode } from 'react';
import type { Metadata, Viewport } from 'next';
import SmoothScrollProvider from '@/components/providers/SmoothScrollProvider';
import './globals.css';
import { Analytics } from '@vercel/analytics/next';

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
    default: 'Sockt | Compute for Agents (Lightning & API Key)',
    template: '%s | Sockt',
  },
  description:
    'The first compute infrastructure built for autonomous AI agents. Pay with Bitcoin Lightning sats or pre-loaded fiat credits, with no human required after initial setup.',
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
    'fiat credits',
    'api key compute',
    'agent autonomy',
    'agentic compute',
    'O(1) agent setup',
    'agent economic actor',
    'multi-agent compute',
    'LangChain compute',
    'AutoGen sandbox',
    'CrewAI infrastructure',
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    url: '/',
    title: 'Sockt | Compute for Agents (Lightning & API Key)',
    description:
      'Agents provision compute and pay autonomously via Bitcoin Lightning or fiat credits, with no ongoing human involvement. The O(1) bootstrap model.',
    siteName: 'Sockt',
    images: ['/opengraph-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sockt | Compute for Agents (Lightning & API Key)',
    description:
      'Agents provision compute and pay autonomously via Bitcoin Lightning or fiat credits, with no ongoing human involvement.',
    images: ['/opengraph-image.png'],
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
        <Analytics />
      </body>
    </html>
  );
}
