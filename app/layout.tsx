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
    default: 'Sockt | AI workforce platform',
    template: '%s | Sockt',
  },
  description:
    'Sockt deploys preconfigured AI employee swarms directly into Slack. They coordinate, remember, and compound in intelligence with built-in loop prevention and credential isolation. Bring your own LLM key.',
  applicationName: 'Sockt',
  keywords: [
    'AI agents',
    'AI employees',
    'multi-agent swarm',
    'Slack AI agent',
    'AI workforce platform',
    'autonomous AI departments',
    'agentic AI',
    'AI agent memory',
    'prompt injection protection',
    'BYOK AI agents',
    'open-core AI agents',
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    url: '/',
    title: 'Sockt | AI workforce platform',
    description:
      'Preconfigured AI employee swarms for Slack with persistent memory, loop prevention, and credential isolation. Built for lean teams that need reliable automation.',
    siteName: 'Sockt',
    images: ['/opengraph-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sockt | AI workforce platform',
    description:
      'Preconfigured AI employee swarms for Slack with persistent memory, loop prevention, and credential isolation.',
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
