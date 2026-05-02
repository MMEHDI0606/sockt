'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';

const LAYERS = [
  {
    id: 'layer-agent',
    label: 'AI AGENT LAYER',
    desc: 'Your agent. Any LLM.',
    badge: 'TypeScript / Python SDK',
  },
  {
    id: 'layer-mcp',
    label: 'MCP SERVER FALLBACK',
    desc: 'Bring your own keys.',
    badge: 'MCP Protocol',
  },
  {
    id: 'layer-orchestr',
    label: 'ORCHESTRATION LAYER',
    desc: 'Provisioning engine.',
    badge: 'Go + Python',
  },
  {
    id: 'layer-ln',
    label: 'LIGHTNING SETTLEMENT',
    desc: 'Paid per epoch, in sats.',
    badge: 'Bitcoin / LN',
  },
  {
    id: 'layer-gpu',
    label: 'GPU COMPUTE FABRIC',
    desc: 'Real silicon. No throttles.',
    badge: 'H100 · A100 · A10G',
  },
];

export default function StackSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeLayer, setActiveLayer] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          pin: true,
          scrub: 1.2,
          start: 'top top',
          end: '+=300%',
          onUpdate: (self) => {
            const idx = Math.min(
              Math.floor(self.progress * LAYERS.length),
              LAYERS.length - 1
            );
            setActiveLayer(idx);
          },
        },
      });

      LAYERS.forEach((layer, i) => {
        tl.from(`#${layer.id}`, { y: -60, opacity: 0, duration: 0.4 }, i === 0 ? 0 : '-=0.3');
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '80px 32px',
        borderTop: '1px solid var(--bg-border)',
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
        <div style={{ marginBottom: '64px', display: 'flex', alignItems: 'flex-end', gap: '24px' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '72px', color: 'var(--bg-border)', lineHeight: 1 }}>02</span>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-display)', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 0.9 }}>
            THE STACK
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {LAYERS.map((layer, i) => (
            <div
              key={layer.id}
              id={layer.id}
              style={{
                height: '64px',
                display: 'flex',
                alignItems: 'center',
                padding: '0 20px',
                backgroundColor: i === activeLayer ? 'var(--bg-raised)' : 'transparent',
                borderLeft: `4px solid ${i === activeLayer ? 'var(--accent-btc)' : 'var(--bg-border)'}`,
                transition: 'all 0.3s ease',
                gap: '24px',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  color: 'var(--text-secondary)',
                  letterSpacing: '0.08em',
                  width: '200px',
                  flexShrink: 0,
                }}
              >
                {layer.label}
              </span>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--text-primary)', flex: 1 }}>
                {layer.desc}
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  color: 'var(--text-secondary)',
                  border: '1px solid var(--bg-border)',
                  padding: '3px 10px',
                  borderRadius: '100px',
                  whiteSpace: 'nowrap',
                }}
              >
                {layer.badge}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
