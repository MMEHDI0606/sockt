'use client';

// Animated SVG — concentric rings expanding outward from a center glyph.
// Evokes "memory being written" / GBrain / knowledge radiating outward.
// Loops infinitely. Use as abstract art in fleet / open-source section.

export default function MemoryPulse({ size = 200 }: { size?: number }) {
  const cx = size / 2;
  const cy = size / 2;

  const rings = [
    { delay: '0s',    dur: '3.2s' },
    { delay: '0.8s',  dur: '3.2s' },
    { delay: '1.6s',  dur: '3.2s' },
    { delay: '2.4s',  dur: '3.2s' },
  ];

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      aria-hidden
      style={{ display: 'block', overflow: 'visible' }}
    >
      <defs>
        <style>{`
          @keyframes ring-expand {
            0%   { r: 12; opacity: 0.55; stroke-width: 1.2; }
            60%  { opacity: 0.15; }
            100% { r: ${size * 0.46}; opacity: 0; stroke-width: 0.3; }
          }
          @keyframes center-breathe {
            0%,100% { opacity: 0.7; transform: scale(1); }
            50%      { opacity: 1; transform: scale(1.15); }
          }
          @keyframes glyph-pulse {
            0%,100% { opacity: 0.55; }
            50%      { opacity: 0.9; }
          }
        `}</style>
      </defs>

      {/* Expanding rings */}
      {rings.map((ring, i) => (
        <circle
          key={i}
          cx={cx} cy={cy}
          fill="none"
          stroke="rgba(238,236,232,0.5)"
          style={{
            animation: `ring-expand ${ring.dur} ease-out infinite`,
            animationDelay: ring.delay,
          }}
        />
      ))}

      {/* Center glyph container */}
      <g style={{ transformOrigin: `${cx}px ${cy}px`, animation: 'center-breathe 4s ease-in-out infinite' }}>
        {/* Inner dot */}
        <circle cx={cx} cy={cy} r={6} fill="rgba(238,236,232,0.8)" />
        {/* {*} text label */}
        <text
          x={cx} y={cy + 22}
          textAnchor="middle"
          fontFamily="'Berkeley Mono', 'Fira Code', monospace"
          fontSize="9"
          fill="rgba(238,236,232,0.4)"
          letterSpacing="0.08em"
          style={{ animation: 'glyph-pulse 3.2s ease-in-out infinite' }}
        >
          GBrain
        </text>
      </g>

      {/* Orbit satellite dots */}
      {[0, 72, 144, 216, 288].map((angle, i) => {
        const r = 20;
        const x = cx + r * Math.cos((angle * Math.PI) / 180);
        const y = cy + r * Math.sin((angle * Math.PI) / 180);
        return (
          <circle key={i} cx={x} cy={y} r={1.5} fill="rgba(238,236,232,0.4)">
            <animate attributeName="opacity" values="0.4;0.8;0.4" dur={`${2 + i * 0.35}s`} begin={`${i * 0.2}s`} repeatCount="indefinite" />
          </circle>
        );
      })}
    </svg>
  );
}
