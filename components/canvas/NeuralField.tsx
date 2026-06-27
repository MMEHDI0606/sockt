'use client';

import { useEffect, useRef } from 'react';

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  r: number; alpha: number;
  pulseOffset: number;
}

const COUNT_DESKTOP = 58;
const COUNT_MOBILE  = 28;
const MAX_DIST      = 140;
const LINE_ALPHA    = 0.055;
const DOT_ALPHA_MAX = 0.22;
const DOT_ALPHA_MIN = 0.06;
const SPEED         = 0.22;

function makeParticles(w: number, h: number, count: number): Particle[] {
  return Array.from({ length: count }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * SPEED,
    vy: (Math.random() - 0.5) * SPEED,
    r: Math.random() * 1.2 + 0.5,
    alpha: Math.random() * (DOT_ALPHA_MAX - DOT_ALPHA_MIN) + DOT_ALPHA_MIN,
    pulseOffset: Math.random() * Math.PI * 2,
  }));
}

export default function NeuralField({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const isMobile = () => window.innerWidth < 768;
    let count = isMobile() ? COUNT_MOBILE : COUNT_DESKTOP;

    const setSize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    setSize();

    let particles = makeParticles(canvas.width, canvas.height, count);
    let raf: number;
    let t = 0;

    const draw = () => {
      t += 0.004;
      const { width: w, height: h } = canvas;
      ctx.clearRect(0, 0, w, h);

      // Update + draw dots
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -20) p.x = w + 20;
        else if (p.x > w + 20) p.x = -20;
        if (p.y < -20) p.y = h + 20;
        else if (p.y > h + 20) p.y = -20;

        // Gentle alpha pulse per particle
        const pulsed = p.alpha * (0.8 + 0.2 * Math.sin(t * 1.5 + p.pulseOffset));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(238,236,232,${pulsed.toFixed(3)})`;
        ctx.fill();
      }

      // Draw connections (O(n²) but n is small)
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MAX_DIST) {
            const alpha = (1 - dist / MAX_DIST) * LINE_ALPHA;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(238,236,232,${alpha.toFixed(4)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);

    const onResize = () => {
      setSize();
      const newCount = isMobile() ? COUNT_MOBILE : COUNT_DESKTOP;
      if (newCount !== count) {
        count = newCount;
        particles = makeParticles(canvas.width, canvas.height, count);
      }
    };
    window.addEventListener('resize', onResize, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        display: 'block',
      }}
    />
  );
}
