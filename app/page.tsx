'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import Script from 'next/script';
import Nav from '@/components/nav/Nav';
import { useIsMobile } from '@/hooks/useIsMobile';
import HeroSection from '@/components/hero/HeroSection';
import WalkingCharacter from '@/components/docs/WalkingCharacter';

// const StackSection = dynamic(() => import('@/components/sections/StackSection'), { ssr: false });
const WhatIsSection = dynamic(() => import('@/components/sections/WhatIsSection'), { ssr: false });
const HowItWorksSection = dynamic(() => import('@/components/sections/HowItWorksSection'), { ssr: false });
const PricingSection = dynamic(() => import('@/components/sections/PricingSection'), { ssr: false });
// const SDKSection = dynamic(() => import('@/components/sections/SDKSection'), { ssr: false });
const FallbackSection = dynamic(() => import('@/components/sections/FallbackSection'), { ssr: false });
const TrustedBySection = dynamic(() => import('@/components/sections/TrustedBySection'), { ssr: false });
const CTASection = dynamic(() => import('@/components/sections/CTASection'), { ssr: false });
const Footer = dynamic(() => import('@/components/sections/Footer'), { ssr: false });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sockt.dev';

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Sockt',
  url: siteUrl,
  logo: `${siteUrl}/favicon.svg`,
  sameAs: ['https://x.com/socktdev', 'https://github.com/socktdev'],
};

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Sockt',
  url: siteUrl,
  description:
    'Autonomous AI infrastructure where agents provision compute, pay in sats, execute tasks, and terminate automatically.',
  inLanguage: 'en',
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is Sockt?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Sockt is autonomous AI compute infrastructure. It lets AI agents provision on-demand sandboxes (CPU and GPU), pay per second using Bitcoin Lightning (msats), run tasks, and terminate — without human involvement.',
      },
    },
    {
      '@type': 'Question',
      name: 'How does billing work on Sockt?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Sockt uses per-second billing. The agent pays a prepaid balance via Lightning invoice to start the sandbox. When the agent terminates it, the remaining amount is credited back to the agent\'s wallet.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can AI agents pay for compute autonomously?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Sockt is designed for agent-native payment flows. Agents settle invoices programmatically over the Bitcoin Lightning Network in milliseconds — no human credit card or approval required.',
      },
    },
    {
      '@type': 'Question',
      name: 'What compute tiers does Sockt offer?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Sockt offers CPU tiers (Nano, Micro, Standard) and GPU tiers (GPU Small, GPU Large), all billed per second. Pricing can be viewed in USD or millisatoshis (msats).',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I integrate Sockt into an AI agent?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Sockt provides an MCP server and a TypeScript/Python SDK. Agents connect via the Model Context Protocol or import the SDK directly to provision sandboxes, execute code, and manage compute programmatically.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the Bitcoin Lightning Network?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The Bitcoin Lightning Network is a layer-2 payment protocol that enables near-instant, sub-cent transactions settled on Bitcoin. Sockt uses it to enable real-time micropayments for compute — measured in millisatoshis (msats).',
      },
    },
  ],
};

export default function Home() {
  const isMobile = useIsMobile();

  return (
    <>
      <Script
        id="organization-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <Script
        id="website-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <Script
        id="faq-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      {/* <WalkingCharacter /> */}
      <Nav />
      <main>

        <HeroSection />
        <WhatIsSection />
        {/* <StackSection /> */}
        <HowItWorksSection />
        <PricingSection />
        {/* <SDKSection /> */}
        <FallbackSection />

        {/* <TrustedBySection /> */}
        <CTASection />
      </main>
      <Footer />
    </>
  );
}

const quickLinkStyle: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: '12px',
  color: 'var(--text-secondary)',
  border: '1px solid var(--bg-border)',
  padding: '8px 12px',
  borderRadius: '4px',
  letterSpacing: '0.05em',
};
