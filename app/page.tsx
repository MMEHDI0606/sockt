'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import Script from 'next/script';
import Nav from '@/components/nav/Nav';
import HeroSection from '@/components/hero/HeroSection';
import WalkingCharacter from '@/components/docs/WalkingCharacter';

// const StackSection = dynamic(() => import('@/components/sections/StackSection'), { ssr: false });
const WhatIsSection = dynamic(() => import('@/components/sections/WhatIsSection'), { ssr: false });
const HowItWorksSection = dynamic(() => import('@/components/sections/HowItWorksSection'), { ssr: false });
const PricingSection = dynamic(() => import('@/components/sections/PricingSection'), { ssr: false });
const SDKSection = dynamic(() => import('@/components/sections/SDKSection'), { ssr: false });
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

export default function Home() {
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
        <section
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            padding: '44px 16px',
            borderTop: '1px solid var(--bg-border)',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '10px',
              alignItems: 'center',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                color: 'var(--text-secondary)',
                letterSpacing: '0.08em',
                marginRight: '6px',
              }}
            >
              EXPLORE
            </span>
            <Link href="/docs" style={quickLinkStyle}>Docs</Link>
            <Link href="/pricing" style={quickLinkStyle}>Pricing</Link>
            <Link href="/sdk" style={quickLinkStyle}>SDK</Link>
            <Link href="/use-cases" style={quickLinkStyle}>Use Cases</Link>
            <Link href="/terms" style={quickLinkStyle}>Terms</Link>
            <Link href="/privacy" style={quickLinkStyle}>Privacy</Link>
          </div>
        </section>
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
