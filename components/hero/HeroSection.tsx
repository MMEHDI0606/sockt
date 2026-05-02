'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { layout, prepare } from '@chenglou/pretext';
import HeroConsole from './HeroConsole';

const HEADLINE = ['COMPUTE', 'FOR AGENTS', 'THAT PAY IN SATS.'];
const TAGLINE = 'Autonomous AI infrastructure. Agents procure compute resources, settle in milliseconds via Lightning, and scale without human intervention.';

export default function HeroSection() {
  const headlineRefs = useRef<(HTMLDivElement | null)[]>([]);
  const chevronRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const [pretextMetrics, setPretextMetrics] = useState<{ lineCount: number; height: number }>({
    lineCount: 0,
    height: 0,
  });

  useEffect(() => {
    // Headline stagger entry
    gsap.from(headlineRefs.current.filter(Boolean), {
      y: 120,
      opacity: 0,
      duration: 0.9,
      ease: 'expo.out',
      stagger: 0.1,
      delay: 0.2,
    });

    // Chevron bounce loop
    if (chevronRef.current) {
      gsap.to(chevronRef.current, {
        y: 6,
        duration: 1.8,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      });
    }

    const p = taglineRef.current;
    if (!p) return;

    const style = window.getComputedStyle(p);
    const fontWeight = style.fontWeight || '400';
    const fontSize = style.fontSize || '16px';
    const fontFamily = style.fontFamily || 'sans-serif';
    const font = `${fontWeight} ${fontSize} ${fontFamily}`;
    const lineHeight = Number.parseFloat(style.lineHeight) || 27;
    const prepared = prepare(TAGLINE, font);

    const updatePretextMetrics = () => {
      const width = p.clientWidth;
      if (!width) return;
      const { lineCount, height } = layout(prepared, width, lineHeight);
      setPretextMetrics({ lineCount, height });
    };

    updatePretextMetrics();
    const resizeObserver = new ResizeObserver(updatePretextMetrics);
    resizeObserver.observe(p);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <section
      style={{
        minHeight: '100vh',
        paddingTop: '56px',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}
    >
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px 32px 120px',
          maxWidth: '1280px',
          margin: '0 auto',
          width: '100%',
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: '48px',
            alignItems: 'flex-start',
          }}
        >
          {/* Headline */}
          <div style={{ flex: 1 }}>
            {HEADLINE.map((line, i) => (
              <div
                key={i}
                ref={(el) => { headlineRefs.current[i] = el; }}
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'var(--text-hero)',
                  fontWeight: 800,
                  lineHeight: 0.92,
                  color: i === 2 ? 'var(--accent-btc)' : 'var(--text-primary)',
                  marginBottom: i < 2 ? '4px' : '0',
                  display: 'block',
                }}
              >
                {line}
              </div>
            ))}

            {/* Tagline */}
            <p
              ref={taglineRef}
              style={{
                marginTop: '32px',
                fontFamily: 'var(--font-body)',
                fontSize: '16px',
                lineHeight: 1.7,
                color: 'var(--text-secondary)',
                maxWidth: '480px',
              }}
            >
              {TAGLINE}
            </p>

            <div
              style={{
                marginTop: '10px',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                color: 'var(--accent-amber)',
                letterSpacing: '0.05em',
              }}
            >
              PRETEXT LAYOUT: {pretextMetrics.lineCount} LINES / {Math.round(pretextMetrics.height)}PX
            </div>

            {/* CTA */}
            <div style={{ marginTop: '40px', display: 'flex', gap: '16px', alignItems: 'center' }}>
              <a
                href="#"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '13px',
                  backgroundColor: 'var(--accent-btc)',
                  color: 'var(--bg-void)',
                  padding: '12px 24px',
                  borderRadius: '4px',
                  fontWeight: 600,
                  letterSpacing: '0.04em',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'inline-block',
                }}
              >
                Deploy your first agent →
              </a>
              <a
                href="#"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '13px',
                  color: 'var(--text-secondary)',
                  letterSpacing: '0.04em',
                }}
              >
                Read the docs
              </a>
            </div>
          </div>

          {/* Console */}
          <HeroConsole />
        </div>
      </div>

      {/* Scroll chevron */}
      <div
        ref={chevronRef}
        style={{
          position: 'absolute',
          bottom: '40px',
          left: '50%',
          transform: 'translateX(-50%)',
          opacity: 0.4,
          color: 'var(--text-secondary)',
          fontSize: '20px',
          cursor: 'pointer',
        }}
      >
        ↓
      </div>
    </section>
  );
}
