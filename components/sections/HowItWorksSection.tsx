'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';

const STEPS = [
  {
    num: '01',
    title: 'Agent Initializes',
    outcome: 'Your agent has a budget ceiling and a payment identity before the first request fires.',
    reassurance: 'No Lightning wallet yet? Drop an api_key — same lifecycle, same guarantees.',
    code: `import { SocktAgent } from '@sockt/sdk';

const agent = new SocktAgent({
  apiKey: process.env.SOCKT_KEY,
  budget: { sats: 50_000 },
  fallback: {
    provider: 'anthropic',
    apiKey: process.env.ANTHROPIC_KEY
  }
});`,
  },
  {
    num: '02',
    title: 'Channel Opens',
    outcome: 'Compute access is payment-ready in milliseconds — no human approval step.',
    reassurance: 'Dual-path design means a failed payment route never halts your agent.',
    code: `// Lightning channel established
const channel = await agent.openChannel({
  capacity: 100_000, // sats
  peer: 'SOCKT_NODE',
});

// channel_id: lnbc1pvjluez...
// status: ACTIVE`,
  },
  {
    num: '03',
    title: 'GPU Provisioned',
    outcome: 'Agent gets exactly the capacity it declared — visible state, bounded cost.',
    reassurance: 'When preferred capacity is full, fallback route routes instantly to avoid downtime.',
    code: `- gpu: null
+ gpu: H100_SXM5_2x

- status: pending
+ status: provisioned

- allocated_sats: 0
+ allocated_sats: 50_000`,
  },
  {
    num: '04',
    title: 'Epoch Settled',
    outcome: 'Every epoch closes with a receipt. Spend is auditable, predictable, and stoppable.',
    reassurance: 'Pause and resume preserve progress without burning the remaining budget.',
    code: `INVOICE → PAID → RECEIPT

invoice_id: lnbc1240n1...
amount:     1,240 sats
epoch:      #00142
settle_ms:  128

✓ Receipt confirmed`,
  },
];

export default function HowItWorksSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeDot, setActiveDot] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const track = trackRef.current;
      if (!track) return;

      gsap.to(track, {
        x: () => -(track.scrollWidth - window.innerWidth),
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          pin: true,
          scrub: 1,
          start: 'top top',
          end: () => `+=${track.scrollWidth - window.innerWidth}`,
          onUpdate: (self) => {
            setActiveDot(Math.min(Math.floor(self.progress * STEPS.length), STEPS.length - 1));
          },
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{ overflow: 'hidden', borderTop: '1px solid var(--bg-border)' }}
    >
      <div
        ref={trackRef}
        style={{ display: 'flex', width: `${STEPS.length * 100}vw` }}
      >
        {STEPS.map((step, i) => (
          <div
            key={i}
            style={{
              width: '100vw',
              height: '100vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '80px 10vw',
              flexShrink: 0,
              position: 'relative',
            }}
          >
            {/* Step number background */}
            <span
              style={{
                position: 'absolute',
                left: '8vw',
                top: '50%',
                transform: 'translateY(-50%)',
                fontFamily: 'var(--font-mono)',
                fontSize: 'clamp(120px, 20vw, 200px)',
                fontWeight: 700,
                color: 'var(--bg-raised)',
                lineHeight: 1,
                userSelect: 'none',
                pointerEvents: 'none',
              }}
            >
              {step.num}
            </span>

            <div style={{ position: 'relative', zIndex: 1, maxWidth: '640px', width: '100%' }}>
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(2rem, 4vw, 3rem)',
                  fontWeight: 800,
                  color: 'var(--text-primary)',
                  marginBottom: '32px',
                }}
              >
                {step.title}
              </h3>
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '15px',
                  lineHeight: 1.7,
                  color: 'var(--text-primary)',
                  marginBottom: '12px',
                }}
              >
                {step.outcome}
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  lineHeight: 1.6,
                  color: 'var(--text-secondary)',
                  marginBottom: '18px',
                }}
              >
                {step.reassurance}
              </p>
              <pre
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '13px',
                  lineHeight: 1.7,
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--bg-border)',
                  borderRadius: '6px',
                  padding: '24px',
                  color: 'var(--text-mono)',
                  overflow: 'auto',
                  whiteSpace: 'pre-wrap',
                }}
              >
                <code
                  dangerouslySetInnerHTML={{
                    __html: step.code
                      .replace(/^(\+ .+)$/gm, '<span style="color:var(--accent-green)">$1</span>')
                      .replace(/^(- .+)$/gm, '<span style="color:var(--accent-red)">$1</span>')
                      .replace(/(✓.+)/g, '<span style="color:var(--accent-green)">$1</span>'),
                  }}
                />
              </pre>
            </div>
          </div>
        ))}
      </div>

      {/* Progress dots */}
      <div
        style={{
          position: 'fixed',
          bottom: '32px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '8px',
          zIndex: 10,
        }}
      >
        {STEPS.map((_, i) => (
          <div
            key={i}
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: i === activeDot ? 'var(--accent-btc)' : 'var(--bg-border)',
              transition: 'background-color 0.3s ease',
            }}
          />
        ))}
      </div>
    </section>
  );
}
