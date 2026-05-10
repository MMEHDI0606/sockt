'use client';

import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { useIsMobile } from '@/hooks/useIsMobile';

const USE_CASES = [
  {
    title: 'Autonomous Model Training',
    summary: 'Agent spins up a GPU sandbox, pays via Lightning, trains, then returns metrics and artifacts.',
    steps: [
      'Create sandbox on A100 tier',
      'Pay invoice from wallet MCP tool',
      'Write train script and dataset config',
      'Run training and report results',
    ],
  },
  {
    title: 'Codebase Evaluation Loops',
    summary: 'Agent runs repeatable eval jobs in isolated compute and streams sats-based usage while executing.',
    steps: [
      'Create micro or standard sandbox',
      'Run unit and regression workloads',
      'Collect output, traces, and cost totals',
      'Terminate sandbox when loop finishes',
    ],
  },
  {
    title: 'Research Batch Processing',
    summary: 'Agent schedules paid compute bursts for simulations, embeddings, or dataset transforms without humans.',
    steps: [
      'Provision high-memory tier',
      'Upload scripts and input files',
      'Execute batch commands in sequence',
      'Return files and sats settlement summary',
    ],
  },
];

export default function HowItWorksSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.use-case-card', {
        opacity: 0,
        y: 24,
        duration: 0.55,
        ease: 'power2.out',
        stagger: 0.12,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 60%',
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="use-cases"
      ref={sectionRef}
      style={{
        padding: isMobile ? '96px 24px' : '140px 64px',
        maxWidth: '1280px',
        margin: '0 auto',
        borderTop: '1px solid var(--bg-border)',
      }}
    >
      <div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '24px', marginBottom: isMobile ? '42px' : '72px' }}>
          {/* <span style={{ fontFamily: 'var(--font-mono)', fontSize: isMobile ? '48px' : '72px', color: 'var(--bg-border)', lineHeight: 1 }}>03</span> */}
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-display)', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 0.9 }}>
              USE CASES
            </h2>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: isMobile ? '15px' : '17px', color: 'var(--text-secondary)', marginTop: '12px', maxWidth: '760px', lineHeight: 1.7 }}>
              Real workflows where an agent creates compute, pays in sats, executes tasks, and delivers output end-to-end.
            </p>
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, minmax(0, 1fr))',
            gap: isMobile ? '14px' : '16px',
          }}
        >
          {USE_CASES.map((item, i) => (
            <article
              key={item.title}
              className="use-case-card"
              style={{
                border: '1px solid var(--bg-border)',
                borderRadius: '8px',
                backgroundColor: 'var(--bg-surface)',
                padding: isMobile ? '22px' : '28px',
              }}
              onMouseEnter={(e) => {
                gsap.to(e.currentTarget, { y: -5, borderColor: 'var(--accent-sats)', duration: 0.2 });
              }}
              onMouseLeave={(e) => {
                gsap.to(e.currentTarget, { y: 0, borderColor: 'var(--bg-border)', duration: 0.2 });
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--accent-amber)', letterSpacing: '0.09em' }}>
                  USE CASE {String(i + 1).padStart(2, '0')}
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-secondary)', letterSpacing: '0.08em' }}>
                  AGENT-RUN
                </span>
              </div>

              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: isMobile ? '1.4rem' : '1.65rem', color: 'var(--text-primary)', lineHeight: 1.08, marginBottom: '12px' }}>
                {item.title}
              </h3>

              <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '16px' }}>
                {item.summary}
              </p>

              <div style={{ borderTop: '1px solid var(--bg-border)', paddingTop: '14px' }}>
                {item.steps.map((step) => (
                  <div key={step} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--accent-btc)', lineHeight: 1.4 }}>
                      {'>'}
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-mono)', lineHeight: 1.5 }}>
                      {step}
                    </span>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
