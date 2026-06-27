'use client';

import { useEffect, RefObject } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';

interface RevealOptions {
  stagger?: number;
  y?: number;
  duration?: number;
  delay?: number;
  start?: string;
  selector?: string; // e.g. '[data-reveal]' — if omitted, animates the container itself
}

/**
 * Moranta-style "emerge from darkness" scroll reveal.
 * Animates opacity 0→1 with a subtle y lift. No horizontal slides.
 */
export function useReveal(ref: RefObject<HTMLElement | null>, opts: RevealOptions = {}) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const targets = opts.selector
      ? Array.from(el.querySelectorAll<HTMLElement>(opts.selector))
      : [el];

    if (targets.length === 0) return;

    // Set initial invisible state immediately so there's no flash
    gsap.set(targets, { opacity: 0, y: opts.y ?? 36 });

    const ctx = gsap.context(() => {
      gsap.to(targets, {
        opacity: 1,
        y: 0,
        duration: opts.duration ?? 0.9,
        ease: 'power3.out',
        stagger: opts.stagger ?? 0,
        delay: opts.delay ?? 0,
        scrollTrigger: {
          trigger: el,
          start: opts.start ?? 'top 76%',
          toggleActions: 'play none none none',
        },
      });
    });

    return () => ctx.revert();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
