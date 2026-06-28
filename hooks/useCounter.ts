'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Counts a numeric value from 0 to `target` when the element
 * referenced by `ref` enters the viewport.
 * For non-numeric stats (e.g. "< 10 min"), pass `raw: true`
 * to skip the counter and just trigger a reveal at the same moment.
 */
export function useCounter(
  ref: React.RefObject<HTMLElement | null>,
  target: number,
  opts: { duration?: number; prefix?: string; suffix?: string } = {}
) {
  const [value, setValue] = useState(0);
  const startedRef = useRef(false);
  const { duration = 1200, prefix = '', suffix = '' } = opts;

  useEffect(() => {
    const el = ref.current;
    if (!el || target === 0) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !startedRef.current) {
          startedRef.current = true;
          const start = performance.now();
          const tick = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setValue(Math.round(eased * target));
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.5 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [target, duration]);

  return `${prefix}${value}${suffix}`;
}
