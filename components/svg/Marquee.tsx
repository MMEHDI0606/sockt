'use client';

const TERMS = [
  'FSM-enforced coordination',
  'CADVP memory protocol',
  'TEE hardware isolation',
  'GBrain knowledge graph',
  'BYOK — zero markup',
  'dream-cycle optimization',
  'fleet intelligence',
  'prompt injection containment',
  'git-backed audit trail',
  'hierarchical task list',
  'OneCLI secret vault',
  'HITL approval gates',
  'FSL-1.1-MIT',
];

const TEXT = TERMS.join('  ·  ') + '  ·  ';

export default function Marquee() {
  return (
    <>
      <style>{`
        @keyframes marquee-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .marquee-track {
          display: flex;
          width: max-content;
          animation: marquee-scroll 38s linear infinite;
        }
        .marquee-track:hover { animation-play-state: paused; }
      `}</style>
      <div
        aria-hidden
        style={{
          overflow: 'hidden',
          borderTop: '1px solid var(--bg-border)',
          borderBottom: '1px solid var(--bg-border)',
          padding: '10px 0',
          background: 'var(--bg-surface)',
          opacity: 0.6,
          userSelect: 'none',
        }}
      >
        <div className="marquee-track">
          {[TEXT, TEXT].map((t, i) => (
            <span
              key={i}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                color: 'var(--text-secondary)',
                letterSpacing: '0.14em',
                whiteSpace: 'nowrap',
                paddingRight: 0,
              }}
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </>
  );
}
