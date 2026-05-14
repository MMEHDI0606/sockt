'use client';

import { useEffect, useRef, useState } from 'react';
import { ScrollTrigger } from '@/lib/gsap';
import { useIsMobile } from '@/hooks/useIsMobile';

const STEPS = [
  {
    role: 'USER',
    color: 'var(--text-secondary)',
    label: 'Prompt',
    text: '"Train a sentiment model on the customer reviews dataset using a GPU sandbox."',
    icon: 'U',
  },
  {
    role: 'LLM',
    color: 'var(--accent-amber)',
    label: 'Tool call',
    text: 'sockt_create_sandbox({ tier: "A100", billingMethod: "lightning" })',
    mono: true,
    icon: '1',
  },
  {
    role: 'LLM',
    color: 'var(--accent-amber)',
    label: 'Tool call',
    text: 'wallet_pay_invoice({ bolt11: "lnbc...", sats: 50000 })',
    mono: true,
    icon: '2',
  },
  {
    role: 'LLM',
    color: 'var(--accent-amber)',
    label: 'Tool call',
    text: 'sandbox_write_file({ path: "train.py", content: "..." })',
    mono: true,
    icon: '3',
  },
  {
    role: 'LLM',
    color: 'var(--accent-amber)',
    label: 'Tool call',
    text: 'sandbox_exec({ command: "python train.py --epochs 10" })',
    mono: true,
    icon: '4',
  },
  {
    role: 'LLM',
    color: 'var(--accent-amber)',
    label: 'Tool call',
    text: 'sandbox_terminate({ id: "sbx_..." })',
    mono: true,
    icon: '5',
  },
  {
    role: 'LLM',
    color: 'var(--accent-green)',
    label: 'Result',
    text: '"Training complete. Accuracy: 94.2%. Model saved to /output/model.pt. Total cost: 1,240 sats."',
    icon: 'R',
  },
];

export default function FallbackSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visibleSteps, setVisibleSteps] = useState(0);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isMobile) {
      setVisibleSteps(STEPS.length);
      return;
    }

    const trigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top 60%',
      onEnter: () => {
        let i = 0;
        const interval = setInterval(() => {
          i++;
          setVisibleSteps(i);
          if (i >= STEPS.length) clearInterval(interval);
        }, 350);
      },
      once: true,
    });
    return () => trigger.kill();
  }, [isMobile]);

  return (
    <section
      ref={sectionRef}
      style={{
        padding: isMobile ? '56px 16px' : '120px 64px',
        maxWidth: '1280px',
        margin: '0 auto',
        borderTop: '1px solid var(--bg-border)',
      }}
    >
      <div>
        <div style={{ display: 'flex', alignItems: isMobile ? 'flex-start' : 'flex-end', gap: isMobile ? '12px' : '24px', marginBottom: isMobile ? '32px' : '64px' }}>
          {/* <span style={{ fontFamily: 'var(--font-mono)', fontSize: isMobile ? '48px' : '72px', color: 'var(--bg-border)', lineHeight: 1 }}>07</span> */}
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-display)', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 0.9 }}>
              AGENT IN ACTION
            </h2>
            {!isMobile ? (
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '15px', color: 'var(--text-secondary)', marginTop: '12px', maxWidth: '560px' }}>
                The agent autonomously creates a sandbox, pays in sats via its wallet, runs the job, and terminates — no human intervention.
              </p>
            ) : null}
          </div>
        </div>

        <div
          style={{
            maxWidth: isMobile ? '100%' : '680px',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '0',
          }}
        >
          {(isMobile ? STEPS.slice(0, 4) : STEPS).map((step, i, steps) => (
            <div
              key={i}
              style={{
                display: 'flex',
                gap: '0',
                opacity: isMobile || i < visibleSteps ? 1 : 0,
                transform: isMobile || i < visibleSteps ? 'translateY(0)' : 'translateY(12px)',
                transition: isMobile ? 'none' : 'opacity 0.35s ease, transform 0.35s ease',
              }}
            >
              {/* Timeline */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '40px', flexShrink: 0 }}>
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--bg-surface)',
                    border: `1px solid ${step.color}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    flexShrink: 0,
                    zIndex: 1,
                  }}
                >
                  {step.icon}
                </div>
                {i < steps.length - 1 && (
                  <div
                    style={{
                      width: '1px',
                      flex: 1,
                      minHeight: '24px',
                      backgroundColor: 'var(--bg-border)',
                    }}
                  />
                )}
              </div>

              {/* Content */}
              <div style={{ paddingLeft: isMobile ? '12px' : '16px', paddingBottom: i < steps.length - 1 ? (isMobile ? '16px' : '24px') : '0', flex: 1 }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '6px' }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '10px',
                      color: step.color,
                      letterSpacing: '0.1em',
                      fontWeight: 600,
                    }}
                  >
                    {step.role}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '10px',
                      color: 'var(--text-secondary)',
                      letterSpacing: '0.06em',
                      backgroundColor: 'var(--bg-surface)',
                      border: '1px solid var(--bg-border)',
                      padding: '1px 8px',
                      borderRadius: '100px',
                    }}
                  >
                    {step.label}
                  </span>
                </div>
                <p
                  style={{
                    fontFamily: step.mono ? 'var(--font-mono)' : 'var(--font-body)',
                      fontSize: isMobile ? '12px' : step.mono ? '12px' : '14px',
                    color: step.mono ? 'var(--text-mono)' : 'var(--text-secondary)',
                      lineHeight: isMobile ? 1.45 : 1.6,
                    backgroundColor: step.mono ? 'var(--bg-surface)' : 'transparent',
                    border: step.mono ? '1px solid var(--bg-border)' : 'none',
                    borderRadius: step.mono ? '4px' : '0',
                    padding: step.mono ? '8px 12px' : '0',
                    margin: 0,
                  }}
                >
                  {step.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
