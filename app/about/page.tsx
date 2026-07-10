'use client';

import Nav from '@/components/nav/Nav';
import Footer from '@/components/sections/Footer';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sockt.dev';

const aboutJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  name: 'About Sockt',
  url: `${siteUrl}/about`,
  description:
    'Sockt is an AI-native workforce platform that deploys preconfigured AI employee swarms into Slack with persistent memory, loop prevention, and credential isolation.',
  mainEntity: {
    '@type': 'Organization',
    name: 'Sockt',
    url: siteUrl,
    logo: `${siteUrl}/favicon.svg`,
    description:
      'Sockt is an AI-native platform that deploys preconfigured AI employee swarms directly into Slack. They coordinate, remember, and compound in intelligence with built-in loop prevention and credential isolation.',
    foundingDate: '2024',
    sameAs: ['https://x.com/socktdev', 'https://github.com/socktdev'],
  },
};

const founderCardStyle: React.CSSProperties = {
  border: '1px solid var(--bg-border)',
  borderRadius: '12px',
  padding: '24px',
  background: 'var(--bg-surface)',
};

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutJsonLd) }}
      />
      <Nav />
      <main
        style={{
          background: 'radial-gradient(circle at top, rgba(194, 122, 54, 0.14), transparent 40%)',
          color: 'var(--text-primary)',
          minHeight: '100vh',
          paddingBottom: '80px',
        }}
      >
        <section style={{ maxWidth: '1040px', margin: '0 auto', padding: '96px 24px 56px' }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--accent-btc)', marginBottom: '14px' }}>About Sockt</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.2rem, 6vw, 4.4rem)', lineHeight: 0.98, letterSpacing: '-0.04em', margin: 0, maxWidth: '12ch' }}>A team of two should be able to operate like twenty.</h1>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '1.05rem', lineHeight: 1.8, color: 'var(--text-secondary)', marginTop: '20px', maxWidth: '68ch' }}>Sockt exists to reclaim the time founders lose to repetitive coordination, status updates, lead qualification, and error triage. The platform turns those chores into coordinated AI-native departments that remember what happened yesterday and act on it today.</p>

          <section style={{ marginTop: '80px', borderTop: '1px solid var(--bg-border)', paddingTop: '56px' }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--accent-btc)', marginBottom: '24px' }}>The team</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '56px' }}>
              {[
                {
                  name: 'Muhammad Mehdi',
                  role: 'Co-Founder & CEO',
                  bio: 'Driving the vision for accessible AI workforces - building the platform that lets lean teams deploy reliable, coordinated AI departments without an ML team or a DevOps budget.',
                  links: [
                    { label: 'X', href: 'https://x.com/SocktDev' },
                    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/muhammad-mehdi-alvi/' },
                  ],
                },
                {
                  name: 'Ali Aan',
                  role: 'Co-Founder & CTO',
                  bio: "Leading Sockt's orchestration layer - loop prevention, credential isolation, and the memory systems that let AI departments compound in intelligence over time.",
                  links: [
                    { label: 'X', href: 'https://x.com/AanBuilds' },
                    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/aliaan/' },
                  ],
                },
              ].map((founder) => (
                <div key={founder.name} style={founderCardStyle}>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', margin: '0 0 4px', color: 'var(--text-primary)' }}>{founder.name}</h3>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--accent-btc)', letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 12px' }}>{founder.role}</p>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', lineHeight: 1.7, color: 'var(--text-secondary)', margin: '0 0 16px' }}>{founder.bio}</p>
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    {founder.links.map((link) => (
                      <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-secondary)', border: '1px solid var(--bg-border)', padding: '6px 10px', borderRadius: '4px', textDecoration: 'none' }}>{link.label}</a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section style={{ borderTop: '1px solid var(--bg-border)', paddingTop: '56px', marginBottom: '56px' }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--accent-btc)', marginBottom: '24px' }}>Our purpose</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
              <div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', marginBottom: '12px', color: 'var(--text-primary)' }}>Vision</h2>
                <p style={{ fontFamily: 'var(--font-body)', lineHeight: 1.8, color: 'var(--text-secondary)', maxWidth: '520px' }}>A world where any team of two people can operate with the operational capacity of twenty - not by working harder, but by deploying an AI-native workforce that learns, remembers, and compounds in value over time.</p>
              </div>
              <div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', marginBottom: '12px', color: 'var(--text-primary)' }}>Mission</h2>
                <p style={{ fontFamily: 'var(--font-body)', lineHeight: 1.8, color: 'var(--text-secondary)', maxWidth: '520px' }}>Make reliable, always-on AI-native departments accessible to every lean team on earth - starting with companies too small for enterprise software and too fast-moving to wait for it.</p>
              </div>
            </div>
          </section>

          <section style={{ borderTop: '1px solid var(--bg-border)', paddingTop: '56px', marginBottom: '56px' }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--accent-btc)', marginBottom: '24px' }}>Core belief</p>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '1.05rem', lineHeight: 1.8, color: 'var(--text-secondary)', maxWidth: '68ch' }}>The bottleneck to growth for most bootstrapped businesses is human bandwidth. Sockt reclaims that bandwidth with persistent memory, structured coordination, and a system that is trustworthy enough to run without babysitting.</p>
          </section>

          <section style={{ borderTop: '1px solid var(--bg-border)', paddingTop: '56px' }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--accent-btc)', marginBottom: '24px' }}>FAQ</p>
            <div style={{ display: 'grid', gap: '24px', maxWidth: '720px' }}>
              {[
                ['What is Sockt?', 'An open-core, AI-native platform that deploys preconfigured AI employee swarms into Slack. They share persistent memory, follow structured coordination, and improve over time.'],
                ['How is this different from a chatbot?', 'Sockt is a multi-agent operating environment, not a single chat window. It has roles, memory, task coordination, and approval gates for risky actions.'],
                ['What LLM provider do I use?', 'Bring your own key for Anthropic, OpenAI, Azure OpenAI, Google Gemini, or self-hosted models. Sockt adds orchestration and intelligence, not inference markup.'],
                ['Can I self-host?', 'Yes. Community Edition is free and open source, with the core memory and loop-prevention model. Paid tiers add fleet intelligence and compliance features.'],
              ].map(([question, answer]) => (
                <details key={question} style={{ border: '1px solid var(--bg-border)', borderRadius: '8px', padding: '16px', cursor: 'pointer' }}>
                  <summary style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', outline: 'none' }}>{question}</summary>
                  <p style={{ fontFamily: 'var(--font-body)', lineHeight: 1.7, color: 'var(--text-secondary)', marginTop: '12px', marginBottom: 0 }}>{answer}</p>
                </details>
              ))}
            </div>
          </section>
        </section>
      </main>
      <Footer />
    </>
  );
}
