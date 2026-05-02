'use client';

import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import './globals.css';

export default function RootLayout({ children }: { children: ReactNode }) {
  const lenisRef = useRef<any>(null);

  useEffect(() => {
    let lenis: any;
    let rafId: number;

    async function initLenis() {
      const { default: Lenis } = await import('lenis');
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      lenis = new Lenis({
        duration: 1.15,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 0.85,
      });

      lenisRef.current = lenis;

      function raf(time: number) {
        lenis.raf(time);
        ScrollTrigger.update();
        rafId = requestAnimationFrame(raf);
      }
      rafId = requestAnimationFrame(raf);
    }

    initLenis();

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      if (lenis) lenis.destroy();
    };
  }, []);

  return (
    <html lang="en">
      <head>
        <title>Sockt — Decentralized GPU Compute for AI Agents</title>
        <meta name="description" content="Autonomous AI infrastructure. Agents procure compute resources, settle in milliseconds via Lightning, and scale without human intervention." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=Fira+Code:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
