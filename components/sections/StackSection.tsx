'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { useIsMobile } from '@/hooks/useIsMobile';

const LAYERS = [
  {
    id: 'layer-agent',
    label: 'AI AGENT LAYER',
    desc: 'Your agent. Any model.',
    badge: 'TypeScript / Python SDK',
  },
  {
    id: 'layer-auth',
    label: 'ACCESS + AUTH',
    desc: 'L402, api_key, or JWT path.',
    badge: 'L402 + API Key + JWT',
  },
  {
    id: 'layer-control',
    label: 'CONTROL PLANE',
    desc: 'Provisioning, lifecycle, and policy.',
    badge: 'Go Services',
  },
  {
    id: 'layer-host',
    label: 'HOST DATA PLANE',
    desc: 'exec/files/shell run on host-agent.',
    badge: 'Host-Agent gRPC + HTTPS',
  },
  {
    id: 'layer-billing',
    label: 'LIGHTNING BILLING',
    desc: 'Prepaid msats metered continuously.',
    badge: 'Bitcoin / LN',
  },
  {
    id: 'layer-compute',
    label: 'COMPUTE FABRIC',
    desc: 'Firecracker microVMs + dedicated GPU VMs.',
    badge: 'NANO · MICRO · RTX 5090 · A100',
  },
];

export default function StackSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeLayer, setActiveLayer] = useState(0);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isMobile) return;
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
        tl.from(`#${layer.id}`, { y: -20, duration: 0.4 }, i === 0 ? 0 : '-=0.3');
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [isMobile]);

  return (
    <section
      id="stack"
      ref={sectionRef}
      style={{
        minHeight: isMobile ? 'auto' : '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: isMobile ? '80px 24px' : '80px 64px',
        maxWidth: '1280px',
        margin: '0 auto',
        width: '100%',
        borderTop: '1px solid var(--bg-border)',
      }}
    >
      <div style={{ width: '100%' }}>
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
                height: isMobile ? 'auto' : '64px',
                minHeight: isMobile ? '56px' : undefined,
                display: 'flex',
                alignItems: 'center',
                padding: isMobile ? '12px 16px' : '0 20px',
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
                  width: isMobile ? 'auto' : '200px',
                  minWidth: isMobile ? undefined : '200px',
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
