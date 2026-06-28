'use client';

// Animated SVG — 7 nodes orbiting a center at different radii + speeds.
// Faint connecting lines form and dissolve. Loops infinitely.
// Use as a decorative "abstract art" insert in the departments section.

export default function SwarmOrbit({ size = 260 }: { size?: number }) {
  const cx = size / 2;
  const cy = size / 2;

  // Each node: [radius, initial-angle, orbit-duration, dot-size, opacity]
  const nodes: [number, number, number, number, number][] = [
    [28,  0,   7.2, 3.5, 0.7],
    [48,  80,  11.8, 2.5, 0.5],
    [68,  150, 17.5, 3.0, 0.6],
    [88,  220, 22.3, 2.0, 0.4],
    [105, 40,  28.1, 2.8, 0.55],
    [118, 170, 13.4, 2.2, 0.45],
    [130, 290, 19.7, 3.2, 0.5],
  ];

  // Connection pairs (indices)
  const connections: [number,number][] = [[0,1],[1,2],[2,3],[3,4],[0,2],[1,3],[4,5],[5,6]];

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      aria-hidden
      style={{ display: 'block' }}
    >
      <defs>
        {/* Each node gets an animateTransform on a <g> rotated around center */}
        {nodes.map((_, i) => (
          <style key={i}>{`
            @keyframes orbit-${i} {
              from { transform: rotate(${nodes[i][1]}deg); }
              to   { transform: rotate(${nodes[i][1] + 360}deg); }
            }
          `}</style>
        ))}
        <style>{`
          @keyframes linePulse {
            0%,100% { opacity: 0.06; }
            50%      { opacity: 0.18; }
          }
          @keyframes centerPulse {
            0%,100% { r: 3.5; opacity: 0.5; }
            50%      { r: 5; opacity: 0.8; }
          }
        `}</style>
      </defs>

      {/* Connection lines — reference node positions via approximation */}
      {connections.map(([a, b], idx) => {
        const nA = nodes[a];
        const nB = nodes[b];
        // Use average orbit angle for static line base
        const ax = cx + Math.cos(((nA[1] + 45) * Math.PI) / 180) * nA[0];
        const ay = cy + Math.sin(((nA[1] + 45) * Math.PI) / 180) * nA[0];
        const bx = cx + Math.cos(((nB[1] + 90) * Math.PI) / 180) * nB[0];
        const by = cy + Math.sin(((nB[1] + 90) * Math.PI) / 180) * nB[0];
        return (
          <line
            key={idx}
            x1={ax} y1={ay} x2={bx} y2={by}
            stroke="rgba(238,236,232,0.1)"
            strokeWidth="0.5"
            style={{
              animation: `linePulse ${4 + idx * 1.2}s ease-in-out infinite`,
              animationDelay: `${idx * 0.4}s`,
            }}
          />
        );
      })}

      {/* Center node */}
      <circle
        cx={cx} cy={cy}
        fill="rgba(238,236,232,0.6)"
        style={{ animation: 'centerPulse 4s ease-in-out infinite' }}
      >
        <animate attributeName="r" values="3.5;5;3.5" dur="4s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.5;0.9;0.5" dur="4s" repeatCount="indefinite" />
      </circle>

      {/* Orbit rings (very faint guide circles) */}
      {nodes.map(([r], i) => (
        <circle
          key={`ring-${i}`}
          cx={cx} cy={cy} r={r}
          fill="none"
          stroke="rgba(238,236,232,0.025)"
          strokeWidth="0.5"
        />
      ))}

      {/* Orbiting nodes */}
      {nodes.map(([radius, angle, dur, dotSize, opacity], i) => (
        <g
          key={i}
          style={{
            transformOrigin: `${cx}px ${cy}px`,
            animation: `orbit-${i} ${dur}s linear infinite`,
          }}
        >
          <circle
            cx={cx + radius}
            cy={cy}
            r={dotSize}
            fill={`rgba(238,236,232,${opacity})`}
          >
            {/* Each dot pulses slightly */}
            <animate attributeName="opacity" values={`${opacity};${(opacity * 0.5).toFixed(2)};${opacity}`} dur={`${2.5 + i * 0.5}s`} repeatCount="indefinite" />
          </circle>
        </g>
      ))}
    </svg>
  );
}
