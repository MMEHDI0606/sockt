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
        text: 'Sockt uses per-second billing. A Lightning invoice is generated when a sandbox starts, and billing stops the moment the agent terminates it. You only pay for the exact seconds of compute used.',
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
        text: 'Sockt offers CPU tiers (Nano, Micro, Micro+) and GPU tiers (GPU Small, GPU Large), all billed per second. Pricing can be viewed in USD or millisatoshis (msats).',
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

        {/* About Sockt — brand entity section */}
        <section
          style={{
            maxWidth: '860px',
            margin: '0 auto',
            padding: '72px 24px',
            borderTop: '1px solid var(--bg-border)',
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              color: 'var(--accent-btc)',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              marginBottom: '16px',
            }}
          >
            ABOUT SOCKT
          </p>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.5rem, 3.5vw, 2.2rem)',
              fontWeight: 700,
              lineHeight: 1.2,
              marginBottom: '20px',
              color: 'var(--text-primary)',
            }}
          >
            Autonomous compute infrastructure for AI agents
          </h2>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '1rem',
              lineHeight: 1.75,
              color: 'var(--text-secondary)',
              maxWidth: '640px',
              marginBottom: '28px',
            }}
          >
            Sockt gives AI agents the ability to provision on-demand compute sandboxes,
            pay per second in Bitcoin Lightning sats, execute tasks, and terminate —
            without any human in the loop. CPU and GPU tiers available, billed to the second.
          </p>
          <Link
            href="/about"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              color: 'var(--accent-btc)',
              border: '1px solid var(--accent-btc)',
              padding: '8px 14px',
              borderRadius: '4px',
              letterSpacing: '0.05em',
              textDecoration: 'none',
              display: 'inline-block',
            }}
          >
            Learn more about Sockt
          </Link>
        </section>

        {/* FAQ — structured for Google rich results */}
        <section
          style={{
            maxWidth: '860px',
            margin: '0 auto',
            padding: '0 24px 72px',
            borderTop: '1px solid var(--bg-border)',
            paddingTop: '56px',
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              color: 'var(--text-secondary)',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              marginBottom: '20px',
            }}
          >
            FAQ
          </p>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.3rem, 3vw, 1.8rem)',
              fontWeight: 700,
              marginBottom: '32px',
              color: 'var(--text-primary)',
            }}
          >
            Frequently asked questions
          </h2>
          <dl style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {[
              {
                q: 'What is Sockt?',
                a: 'Sockt is autonomous AI compute infrastructure. It lets AI agents provision on-demand CPU and GPU sandboxes, pay per second using Bitcoin Lightning (msats), run tasks, and terminate — without human involvement.',
              },
              {
                q: 'How does billing work?',
                a: 'Billing is per second. A Lightning invoice is generated when a sandbox starts and stops the moment the agent terminates it. You only pay for the exact seconds of compute used.',
              },
              {
                q: 'Can AI agents pay for compute autonomously?',
                a: 'Yes. Sockt is designed for agent-native payment flows. Agents settle invoices programmatically over the Bitcoin Lightning Network in milliseconds — no human credit card or approval needed.',
              },
              {
                q: 'What compute tiers are available?',
                a: 'Sockt offers CPU tiers (Nano, Micro, Micro+) and GPU tiers (GPU Small, GPU Large), all billed per second. Pricing is viewable in USD or millisatoshis (msats).',
              },
              {
                q: 'How do I integrate Sockt into an agent?',
                a: 'Sockt provides an MCP server and a TypeScript/Python SDK. Agents connect via the Model Context Protocol or import the SDK directly to provision sandboxes and manage compute.',
              },
            ].map(({ q, a }, i, arr) => (
              <div
                key={q}
                style={{
                  borderBottom: i < arr.length - 1 ? '1px solid var(--bg-border)' : 'none',
                  padding: '20px 0',
                }}
              >
                <dt
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1rem',
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                    marginBottom: '8px',
                  }}
                >
                  {q}
                </dt>
                <dd
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.95rem',
                    lineHeight: 1.7,
                    color: 'var(--text-secondary)',
                    margin: 0,
                  }}
                >
                  {a}
                </dd>
              </div>
            ))}
          </dl>
        </section>

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
            <Link href="/about" style={quickLinkStyle}>About</Link>
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
