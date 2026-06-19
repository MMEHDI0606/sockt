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
  description:
    'Sockt deploys preconfigured AI employee swarms directly into Slack. They coordinate, remember, and compound in intelligence with built-in loop prevention and credential isolation.',
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
        text: 'Sockt is an open-core AI workforce platform that deploys preconfigured AI employee swarms directly into Slack. They run continuously, remember everything through a Git-backed memory layer, and improve over time.',
      },
    },
    {
      '@type': 'Question',
      name: 'How is this different from a single AI chatbot or coding assistant?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Swarms are multi-agent and role-specialized, with persistent memory across sessions and structural loop prevention. It is not a single stateless chat window.',
      },
    },
    {
      '@type': 'Question',
      name: 'What stops my AI agents from racking up a huge API bill?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'An FSM-enforced task coordination layer prevents open-ended ping-pong between agents. Every interaction is a discrete, auditable task, not free-form messaging.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do I have to give my AI agents my API keys directly?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. Keys are encrypted client-side and stored in an isolated credential vault, never placed in an agent\'s active context window.',
      },
    },
    {
      '@type': 'Question',
      name: 'What LLM provider do I use?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Bring your own key: Anthropic, OpenAI, Azure OpenAI, Google Gemini, or self-hosted providers such as Ollama, vLLM, or LM Studio. You pay your provider directly at their rates.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I self-host?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Community Edition is free and open source, with full loop prevention and memory. Paid tiers add fleet intelligence, compliance inheritance, and multi-workspace features.',
      },
    },
    {
      '@type': 'Question',
      name: 'How fast can I get a swarm running?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Typically under 10 minutes to activate, with the first real output arriving within about 2 hours.',
      },
    },
  ],
};

const homeSectionStyle: React.CSSProperties = {
  maxWidth: '1280px',
  margin: '0 auto',
  padding: '0 24px',
};

const cardStyle: React.CSSProperties = {
  border: '1px solid var(--bg-border)',
  borderRadius: '22px',
  background: 'var(--bg-surface)',
  padding: '22px',
};

const sectionHeadingStyle: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: '11px',
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  color: 'var(--accent-btc)',
  marginBottom: '14px',
};

const problemItems = [
  ['Runaway cost loops', 'Two agents can burn thousands of dollars in tokens when they ping-pong forever.'],
  ['Amnesiac background jobs', 'Scheduled runs often forget what they learned before the next shift starts.'],
  ['Credential leakage', 'Raw API keys in context windows are one prompt injection away from trouble.'],
];

const howItWorks = [
  'Connect Slack in about 2 minutes.',
  'Choose Growth, Product Dev, or Engineering Ops.',
  'Answer five setup questions to seed memory.',
  'Connect your own Anthropic, OpenAI, or Gemini key.',
  'Activation happens automatically and the swarm starts working.',
];

const departments = [
  ['Growth & Lead Generation', 'Social listening, lead research, and personalized outbound with human approval gates by default.'],
  ['Product Development', 'Turns feature requests into specs, tests in isolated execution, and returns consolidated PRs.'],
  ['Engineering Operations', 'Catches incidents, correlates history, and writes the postmortem draft for you.'],
];

const differentiators = ['Loop prevention', 'Real memory', 'Credential isolation', 'Fleet intelligence', 'Pure BYOK', 'Self-improving'];

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
      <Script id="faq-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <Nav />
      <main style={{ background: 'radial-gradient(circle at top, rgba(194, 122, 54, 0.12), transparent 30%), linear-gradient(180deg, var(--bg-void) 0%, var(--bg-surface) 100%)', color: 'var(--text-primary)' }}>
        <section style={{ ...homeSectionStyle, paddingTop: '96px', paddingBottom: '56px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px', alignItems: 'center' }}>
            <div>
              <p style={sectionHeadingStyle}>AI WORKFORCE PLATFORM</p>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 7vw, 5.8rem)', lineHeight: 0.95, letterSpacing: '-0.04em', margin: 0, maxWidth: '10ch' }}>Hire an AI team, not an AI tool.</h1>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '1.05rem', lineHeight: 1.8, color: 'var(--text-secondary)', maxWidth: '62ch', marginTop: '20px' }}>Sockt deploys preconfigured AI employee swarms into Slack. They remember context, coordinate through structured tasks, and compound in intelligence every week without running away with your API bill.</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '28px' }}>
                <Link href="/pricing" style={{ background: 'var(--accent-btc)', color: 'var(--bg-void)', padding: '12px 22px', borderRadius: '999px', fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 600 }}>See pricing</Link>
                <Link href="/about" style={{ border: '1px solid var(--bg-border)', color: 'var(--text-primary)', padding: '12px 22px', borderRadius: '999px', fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 600 }}>How it works</Link>
              </div>
            </div>
            <div style={{ ...cardStyle, borderRadius: '24px', padding: '24px', boxShadow: '0 24px 80px rgba(0,0,0,0.24)' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '16px' }}>What Sockt does</div>
              <ul style={{ margin: 0, paddingLeft: '18px', display: 'grid', gap: '12px', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                <li>Lives in Slack and keeps a persistent memory layer.</li>
                <li>Prevents runaway loops with FSM-enforced coordination.</li>
                <li>Keeps credentials isolated from the agent context window.</li>
                <li>Uses your LLM provider directly. No token markup.</li>
              </ul>
            </div>
          </div>
        </section>

        <section style={{ ...homeSectionStyle, paddingTop: '24px' }}>
          <div style={{ borderTop: '1px solid var(--bg-border)', paddingTop: '48px' }}>
            <p style={sectionHeadingStyle}>Why this exists</p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 4vw, 3rem)', lineHeight: 1.05, margin: 0, maxWidth: '16ch' }}>Most autonomous agent stacks fail for the same three reasons.</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '18px', marginTop: '28px' }}>
              {problemItems.map(([title, body]) => (
                <article key={title} style={cardStyle}>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', margin: 0 }}>{title}</h3>
                  <p style={{ margin: '10px 0 0', color: 'var(--text-secondary)', lineHeight: 1.7 }}>{body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section style={{ ...homeSectionStyle, paddingTop: '80px' }}>
          <div style={{ borderTop: '1px solid var(--bg-border)', paddingTop: '48px' }}>
            <p style={sectionHeadingStyle}>How it works</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px' }}>
              {howItWorks.map((step, index) => (
                <div key={step} style={cardStyle}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.12em', color: 'var(--accent-btc)', marginBottom: '8px' }}>{String(index + 1).padStart(2, '0')}</div>
                  <div style={{ lineHeight: 1.7, color: 'var(--text-secondary)' }}>{step}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="departments" style={{ ...homeSectionStyle, paddingTop: '80px' }}>
          <div style={{ borderTop: '1px solid var(--bg-border)', paddingTop: '48px' }}>
            <p style={sectionHeadingStyle}>Departments</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px' }}>
              {departments.map(([title, body]) => (
                <article key={title} style={cardStyle}>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', margin: 0 }}>{title}</h3>
                  <p style={{ margin: '10px 0 0', color: 'var(--text-secondary)', lineHeight: 1.7 }}>{body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section style={{ ...homeSectionStyle, paddingTop: '80px' }}>
          <div style={{ borderTop: '1px solid var(--bg-border)', paddingTop: '48px' }}>
            <p style={sectionHeadingStyle}>Why Sockt</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px' }}>
              {differentiators.map((item) => (
                <div key={item} style={cardStyle}>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', margin: 0 }}>{item}</h3>
                  <p style={{ margin: '10px 0 0', color: 'var(--text-secondary)', lineHeight: 1.7 }}>Built to keep agents useful in production instead of impressive in a demo.</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" style={{ ...homeSectionStyle, paddingTop: '80px' }}>
          <div style={{ borderTop: '1px solid var(--bg-border)', paddingTop: '48px' }}>
            <p style={sectionHeadingStyle}>Pricing</p>
            <div style={{ border: '1px solid var(--bg-border)', borderRadius: '24px', padding: '28px', background: 'linear-gradient(180deg, rgba(194,122,54,0.08), rgba(255,255,255,0.02))' }}>
              <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: 1.8, maxWidth: '70ch' }}>You pay Sockt for the infrastructure that makes AI agents reliable, safe, and smarter over time. You pay your LLM provider directly for inference, with no markup ever.</p>
              <div style={{ marginTop: '18px' }}>
                <Link href="/pricing" style={{ color: 'var(--accent-btc)', fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 600 }}>Review the full tiers →</Link>
              </div>
            </div>
          </div>
        </section>

        <section style={{ ...homeSectionStyle, paddingTop: '80px', paddingBottom: '120px' }}>
          <div style={{ borderTop: '1px solid var(--bg-border)', paddingTop: '48px', display: 'flex', flexDirection: 'column', gap: '18px', alignItems: 'flex-start' }}>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.7rem, 4vw, 2.8rem)', lineHeight: 1.1, margin: 0, maxWidth: '16ch' }}>Deploy an AI department instead of hiring one by one.</p>
            <Link href="/about" style={{ background: 'var(--text-primary)', color: 'var(--bg-void)', padding: '12px 22px', borderRadius: '999px', fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 600 }}>Learn more about Sockt</Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
