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
    'The first compute infrastructure built for autonomous AI agents. Pay with Bitcoin Lightning sats or pre-loaded fiat credits, with no human required after initial setup.',
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
        text: 'Sockt is the first compute infrastructure platform purpose-built for autonomous AI agents. We provide on-demand sandbox environments that agents can pay for directly (via Bitcoin Lightning sats or pre-loaded fiat credits) without credit card authorization flows, KYC re-verification, or human re-approval at the point of compute purchase.',
      },
    },
    {
      '@type': 'Question',
      name: 'How does billing work on Sockt?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Two billing models are available. Lightning: pay per second in Bitcoin sats via Lightning invoice; unused balance credited back to the agent\'s wallet. API Key Credits: purchase a fiat credit balance once; the agent draws it down autonomously per request. Credits are non-refundable (treat as compute budget allocation).',
      },
    },
    {
      '@type': 'Question',
      name: 'Can AI agents pay for compute autonomously?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Both pathways deliver full agent autonomy post-setup. Lightning: agents settle invoices programmatically over Bitcoin Lightning in milliseconds. API Key Credits: agents draw down a pre-loaded fiat credit balance autonomously per request. In neither case is human approval required after initial setup.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the difference between the Lightning and API Key pathways?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Both deliver full agent autonomy post-setup. The difference is financial sovereignty and recirculability. Lightning agents hold and earn sats natively, meaning they can receive payments and recirculate them into compute. API Key agents spend a pre-allocated credit budget. Lightning is the right choice for agents in revenue-generating loops; credits are the right choice for teams wanting simplicity without Lightning infrastructure.',
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
        text: 'The Bitcoin Lightning Network is a layer-2 payment protocol that enables near-instant, sub-cent transactions settled on Bitcoin. Sockt uses it to enable real-time micropayments for compute, measured in millisatoshis (msats).',
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
