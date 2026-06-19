'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import Nav from '@/components/nav/Nav';
import Footer from '@/components/sections/Footer';

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
  description: 'Sockt deploys preconfigured AI employee swarms into Slack with memory, loop prevention, and safe coordination.',
  inLanguage: 'en',
};

const problemItems = [
  ['Runaway cost loops', 'Agents can ping-pong forever and burn tokens.'],
  ['Amnesiac background jobs', 'Most automations forget yesterday and restart dumb.'],
  ['Credential leakage', 'Secrets inside prompts turn one injection into exposure.'],
];

const howItWorks = [
  'Connect Slack.',
  'Pick a department.',
  'Seed memory with five answers.',
  'Bring your own model key.',
  'Swarm activates and starts shipping.',
];

const departments = [
  {
    name: 'Growth & Lead Gen',
    body: 'Finds intent signals, enriches leads, and drafts outbound for approval.',
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" aria-hidden="true">
        <circle cx="11" cy="29" r="4" fill="var(--accent-btc)" />
        <circle cx="20" cy="20" r="4" fill="var(--accent-btc)" />
        <circle cx="29" cy="11" r="4" fill="var(--accent-btc)" />
        <path d="M11 29 L20 20 L29 11" stroke="var(--accent-btc)" strokeWidth="2" fill="none" />
      </svg>
    ),
  },
  {
    name: 'Product Dev',
    body: 'Turns requests into specs, executes approved tasks, and returns clean PRs.',
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" aria-hidden="true">
        <rect x="8" y="8" width="24" height="24" rx="5" fill="none" stroke="var(--accent-btc)" strokeWidth="2" />
        <path d="M14 20h12M20 14v12" stroke="var(--accent-btc)" strokeWidth="2" />
      </svg>
    ),
  },
  {
    name: 'Engineering Ops',
    body: 'Triages incidents, correlates history, and drafts the root-cause summary.',
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" aria-hidden="true">
        <path d="M20 8l10 6v12l-10 6-10-6V14l10-6z" fill="none" stroke="var(--accent-btc)" strokeWidth="2" />
        <circle cx="20" cy="20" r="4" fill="var(--accent-btc)" />
      </svg>
    ),
  },
];

const differentiators = [
  ['Loop prevention', 'FSM-enforced tasks. No infinite ping-pong, no surprise bill.'],
  ['Real memory', 'Git-backed memory. What it learns Monday, it remembers Friday.'],
  ['Credential isolation', 'Keys live in a vault, never in the agent\'s context.'],
  ['Fleet intelligence', '200+ deployments worth of threat data, applied to you in <1hr.'],
  ['Pure BYOK', "You pay your LLM provider directly. We don't touch that line."],
  ['Self-improving', 'Every completed task can become a reusable skill.'],
] as const;

const homeSectionStyle: React.CSSProperties = {
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '0 24px',
};

const cardStyle: React.CSSProperties = {
  border: '1px solid var(--bg-border)',
  borderRadius: '18px',
  background: 'var(--bg-surface)',
  padding: '18px',
};

const sectionHeadingStyle: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: '11px',
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  color: 'var(--accent-btc)',
  marginBottom: '14px',
};

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        router.replace('/dashboard');
      }
    });
  }, [router]);

  return (
    <>
      <Script id="organization-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
      <Script id="website-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
      <Nav />
      <main style={{ color: 'var(--text-primary)' }}>
        <section style={{ ...homeSectionStyle, paddingTop: '96px', paddingBottom: '40px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '28px', alignItems: 'center' }}>
            <div>
              <p style={sectionHeadingStyle}>AI WORKFORCE PLATFORM</p>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.4rem, 7vw, 5.2rem)', lineHeight: 0.94, letterSpacing: '-0.04em', margin: 0, maxWidth: '10ch' }}>Hire an AI team, not an AI tool.</h1>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '1.02rem', lineHeight: 1.65, color: 'var(--text-secondary)', maxWidth: '58ch', marginTop: '18px' }}>Deploy preconfigured AI departments in Slack that coordinate safely, remember context, and keep costs bounded.</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '24px' }}>
                <Link href="/pricing" style={{ background: 'var(--accent-btc)', color: 'var(--bg-void)', padding: '12px 22px', borderRadius: '999px', fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 600 }}>See pricing</Link>
                <Link href="/departments" style={{ border: '1px solid var(--bg-border)', color: 'var(--text-primary)', padding: '12px 22px', borderRadius: '999px', fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 600 }}>View departments</Link>
              </div>
            </div>
            <div className="lift-card drift" style={{ ...cardStyle, borderColor: 'var(--accent-btc)', background: 'var(--bg-raised)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '12px' }}>
                <svg width="56" height="56" viewBox="0 0 56 56" aria-hidden="true">
                  <rect x="6" y="6" width="44" height="44" rx="10" fill="none" stroke="var(--accent-btc)" strokeWidth="2" />
                  <circle cx="20" cy="20" r="4" fill="var(--accent-btc)">
                    <animate attributeName="r" values="4;5;4" dur="1.8s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="36" cy="20" r="4" fill="var(--accent-btc)">
                    <animate attributeName="r" values="4;5;4" dur="1.8s" begin="0.25s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="28" cy="34" r="4" fill="var(--accent-btc)">
                    <animate attributeName="r" values="4;5;4" dur="1.8s" begin="0.5s" repeatCount="indefinite" />
                  </circle>
                  <path d="M20 20 L36 20 L28 34 Z" fill="none" stroke="var(--accent-btc)" strokeWidth="2" />
                </svg>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>Hero System Pulse</div>
              </div>
              <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: 1.6 }}>Always-on swarms with memory, guardrails, and role-based execution.</p>
            </div>
          </div>
        </section>

        <section style={{ ...homeSectionStyle, paddingTop: '24px' }}>
          <div style={{ borderTop: '1px solid var(--bg-border)', paddingTop: '34px' }}>
            <p style={sectionHeadingStyle}>Why this exists</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
              {problemItems.map(([title, body]) => (
                <article key={title} className="lift-card" style={cardStyle}>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.02rem', margin: 0 }}>{title}</h3>
                  <p style={{ margin: '8px 0 0', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section style={{ ...homeSectionStyle, paddingTop: '52px' }}>
          <div style={{ borderTop: '1px solid var(--bg-border)', paddingTop: '34px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap', marginBottom: '14px' }}>
              <p style={sectionHeadingStyle}>How it works</p>
              <svg className="drift" width="72" height="26" viewBox="0 0 72 26" aria-hidden="true">
                <rect x="1" y="5" width="14" height="14" rx="4" fill="var(--accent-btc)" />
                <path d="M17 12 H27 M31 12 H41 M45 12 H55" stroke="var(--accent-btc)" strokeWidth="2" />
                <rect x="57" y="5" width="14" height="14" rx="4" fill="none" stroke="var(--accent-btc)" strokeWidth="2" />
              </svg>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
              {howItWorks.map((step, index) => (
                <div key={step} className="lift-card" style={cardStyle}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.12em', color: 'var(--accent-btc)', marginBottom: '8px' }}>{String(index + 1).padStart(2, '0')}</div>
                  <div style={{ lineHeight: 1.5, color: 'var(--text-secondary)' }}>{step}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="departments" style={{ ...homeSectionStyle, paddingTop: '52px' }}>
          <div style={{ borderTop: '1px solid var(--bg-border)', paddingTop: '34px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap', marginBottom: '14px' }}>
              <p style={sectionHeadingStyle}>Departments</p>
              <svg className="drift" width="64" height="26" viewBox="0 0 64 26" aria-hidden="true">
                <circle cx="11" cy="13" r="6" fill="var(--accent-btc)" />
                <circle cx="32" cy="13" r="6" fill="var(--accent-btc)" opacity="0.6" />
                <circle cx="53" cy="13" r="6" fill="var(--accent-btc)" opacity="0.35" />
              </svg>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
              {departments.map((department) => (
                <article key={department.name} className="lift-card" style={cardStyle}>
                  <div style={{ marginBottom: '10px' }}>{department.icon}</div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', margin: 0 }}>{department.name}</h3>
                  <p style={{ margin: '8px 0 0', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{department.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section style={{ ...homeSectionStyle, paddingTop: '52px' }}>
          <div style={{ borderTop: '1px solid var(--bg-border)', paddingTop: '34px' }}>
            <p style={sectionHeadingStyle}>Why Sockt</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '14px' }}>
              {differentiators.map(([title, body]) => (
                <div key={title} className="lift-card" style={cardStyle}>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', margin: 0 }}>{title}</h3>
                  <p style={{ margin: '8px 0 0', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section style={{ ...homeSectionStyle, paddingTop: '52px', paddingBottom: '96px' }}>
          <div style={{ borderTop: '1px solid var(--bg-border)', paddingTop: '34px', display: 'flex', flexDirection: 'column', gap: '14px', alignItems: 'flex-start' }}>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem, 4vw, 2.3rem)', lineHeight: 1.05, margin: 0, maxWidth: '18ch' }}>Launch an AI department this week.</p>
            <Link href="/pricing" style={{ background: 'var(--text-primary)', color: 'var(--bg-void)', padding: '11px 20px', borderRadius: '999px', fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 600 }}>Choose a plan</Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
