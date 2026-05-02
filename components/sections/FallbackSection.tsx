'use client';

import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';

export default function FallbackSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 60%',
        },
      });

      // Animate SVG paths
      const paths = sectionRef.current?.querySelectorAll<SVGPathElement>('.flow-path');
      const nodes = sectionRef.current?.querySelectorAll('.node-box');

      if (paths) {
        paths.forEach((path) => {
          const len = path.getTotalLength();
          gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
        });

        tl.to(paths, {
          strokeDashoffset: 0,
          duration: 0.6,
          ease: 'power2.inOut',
          stagger: 0.15,
        });
      }

      if (nodes) {
        tl.from(nodes, { opacity: 0, y: 10, stagger: 0.08 }, '-=0.3');
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        padding: '120px 32px',
        borderTop: '1px solid var(--bg-border)',
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '64px', textAlign: 'center' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '72px', color: 'var(--bg-border)', lineHeight: 1, marginBottom: '12px' }}>07</span>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-display)', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 0.9 }}>
              FALLBACK LAYER
            </h2>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '15px', color: 'var(--text-secondary)', marginTop: '12px', maxWidth: '560px', marginLeft: 'auto', marginRight: 'auto' }}>
              If Sockt's node can't fill a request, the MCP server automatically routes through your personal API keys. Zero downtime, zero config.
            </p>
          </div>
        </div>

        <svg
          id="fallback"
          viewBox="0 0 900 400"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: '100%', maxWidth: '900px', margin: '0 auto', display: 'block' }}
        >
          {/* AI Agent */}
          <rect className="node-box" x="350" y="20" width="200" height="52" rx="4" fill="var(--bg-raised)" stroke="var(--bg-border)" strokeWidth="1" />
          <text x="450" y="50" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="12" fill="var(--text-primary)">AI AGENT</text>

          {/* Arrow down */}
          <path className="flow-path" d="M 450 72 L 450 118" stroke="var(--bg-border)" strokeWidth="1" markerEnd="url(#arrow)" />

          {/* Sockt Orchestration */}
          <rect className="node-box" x="290" y="118" width="320" height="52" rx="4" fill="var(--bg-raised)" stroke="var(--bg-border)" strokeWidth="1" />
          <text x="450" y="148" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="12" fill="var(--text-primary)">SOCKT ORCHESTRATION</text>

          {/* YES path → right */}
          <path className="flow-path" d="M 610 144 L 750 144" stroke="var(--bg-border)" strokeWidth="1" markerEnd="url(#arrow)" />
          <text x="680" y="136" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="10" fill="var(--text-secondary)">YES</text>

          {/* Sockt GPU Node */}
          <rect className="node-box" x="750" y="118" width="130" height="52" rx="4" fill="var(--bg-raised)" stroke="var(--accent-btc)" strokeWidth="1" />
          <text x="815" y="148" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="11" fill="var(--accent-btc)">SOCKT GPU</text>

          {/* Arrow down from GPU */}
          <path className="flow-path" d="M 815 170 L 815 240" stroke="var(--bg-border)" strokeWidth="1" markerEnd="url(#arrow)" />

          {/* Settled in sats */}
          <rect className="node-box" x="720" y="240" width="190" height="52" rx="4" fill="var(--bg-raised)" stroke="var(--accent-btc)" strokeWidth="1.5" />
          <text x="815" y="262" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="11" fill="var(--accent-btc)">SETTLED IN SATS</text>
          <text x="815" y="280" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="9" fill="var(--text-secondary)">⚡ 1,240 sats / epoch</text>

          {/* NO path → down */}
          <path className="flow-path" d="M 450 170 L 450 230" stroke="var(--bg-border)" strokeWidth="1" markerEnd="url(#arrow)" />
          <text x="430" y="205" fontFamily="var(--font-mono)" fontSize="10" fill="var(--text-secondary)">NO</text>

          {/* MCP Fallback */}
          <rect className="node-box" x="290" y="230" width="320" height="52" rx="4" fill="var(--bg-raised)" stroke="var(--bg-border)" strokeWidth="1" />
          <text x="450" y="260" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="12" fill="var(--text-primary)">MCP FALLBACK</text>

          {/* Arrow down */}
          <path className="flow-path" d="M 450 282 L 450 328" stroke="var(--bg-border)" strokeWidth="1" markerEnd="url(#arrow)" />

          {/* User API Keys */}
          <rect className="node-box" x="270" y="328" width="360" height="56" rx="4" fill="var(--bg-raised)" stroke="var(--bg-border)" strokeWidth="1" />
          <text x="450" y="352" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="12" fill="var(--text-primary)">USER&apos;S API KEYS</text>
          <text x="450" y="370" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="10" fill="var(--text-secondary)">Anthropic / OpenAI / custom</text>

          <defs>
            <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
              <path d="M0,0 L0,6 L8,3 z" fill="var(--bg-border)" />
            </marker>
          </defs>
        </svg>
      </div>
    </section>
  );
}
