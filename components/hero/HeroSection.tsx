'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import {
  layoutNextLineRange,
  materializeLineRange,
  prepareWithSegments,
  type LayoutCursor,
} from '@chenglou/pretext';
import HeroConsole from './HeroConsole';

const HEADLINE = ['COMPUTE', 'FOR AGENTS', 'THAT PAY IN SATS.'];
const TAGLINE = 'Autonomous AI infrastructure. Agents procure compute resources, settle in milliseconds via Lightning, and scale without human intervention.';

type DynamicLine = {
  text: string;
  xOffset: number;
};

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRefs = useRef<(HTMLDivElement | null)[]>([]);
  const chevronRef = useRef<HTMLDivElement>(null);
  const taglineBoxRef = useRef<HTMLDivElement>(null);
  const lastCursorRef = useRef<{ x: number; y: number } | null>(null);
  const hoverRafRef = useRef<number | null>(null);
  const [dynamicLines, setDynamicLines] = useState<DynamicLine[]>([]);
  const [pretextMetrics, setPretextMetrics] = useState<{ lineCount: number; height: number }>({
    lineCount: 0,
    height: 0,
  });

  useEffect(() => {
    // Headline stagger entry
    gsap.from(headlineRefs.current.filter(Boolean), {
      y: 120,
      opacity: 0,
      duration: 0.9,
      ease: 'expo.out',
      stagger: 0.1,
      delay: 0.2,
    });

    // Chevron bounce loop
    if (chevronRef.current) {
      gsap.to(chevronRef.current, {
        y: 6,
        duration: 1.8,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      });
    }

    return () => {
      if (hoverRafRef.current) {
        cancelAnimationFrame(hoverRafRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const box = taglineBoxRef.current;
    if (!box) return;

    const style = window.getComputedStyle(box);
    const fontWeight = style.fontWeight || '400';
    const fontSize = style.fontSize || '16px';
    const fontFamily = style.fontFamily || 'sans-serif';
    const font = `${fontWeight} ${fontSize} ${fontFamily}`;
    const lineHeight = Number.parseFloat(style.lineHeight) || 27;
    const prepared = prepareWithSegments(TAGLINE, font);
    const radius = 92;

    const rebuild = (cursor: { x: number; y: number } | null) => {
      const width = box.clientWidth;
      if (!width) return;

      let cursorState: LayoutCursor = { segmentIndex: 0, graphemeIndex: 0 };
      let y = 0;
      let guard = 0;
      const nextLines: DynamicLine[] = [];

      while (guard < 40) {
        const lineCenterY = y + lineHeight / 2;
        let influence = 0;
        let signedX = 0;

        if (cursor) {
          const deltaY = Math.abs(lineCenterY - cursor.y);
          if (deltaY < radius) {
            influence = (radius - deltaY) / radius;
            signedX = cursor.x / width - 0.5;
          }
        }

        const dynamicWidth = Math.max(180, width - influence * 110);
        const range = layoutNextLineRange(prepared, cursorState, dynamicWidth);
        if (!range) break;

        const line = materializeLineRange(prepared, range);
        nextLines.push({
          text: line.text,
          xOffset: signedX * influence * 28,
        });

        cursorState = range.end;
        y += lineHeight;
        guard += 1;
      }

      setDynamicLines(nextLines);
      setPretextMetrics({
        lineCount: nextLines.length,
        height: Math.round(nextLines.length * lineHeight),
      });
    };

    rebuild(null);
    const resizeObserver = new ResizeObserver(() => rebuild(lastCursorRef.current));
    resizeObserver.observe(box);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  const handleMouseMove = (event: React.MouseEvent<HTMLElement>) => {
    const box = taglineBoxRef.current;
    if (!box) return;

    const boxRect = box.getBoundingClientRect();
    const cursor = {
      x: Math.max(0, Math.min(boxRect.width, event.clientX - boxRect.left)),
      y: Math.max(0, Math.min(boxRect.height, event.clientY - boxRect.top)),
    };

    lastCursorRef.current = cursor;
    if (hoverRafRef.current) cancelAnimationFrame(hoverRafRef.current);

    hoverRafRef.current = requestAnimationFrame(() => {
      const boxNow = taglineBoxRef.current;
      if (!boxNow) return;

      const style = window.getComputedStyle(boxNow);
      const fontWeight = style.fontWeight || '400';
      const fontSize = style.fontSize || '16px';
      const fontFamily = style.fontFamily || 'sans-serif';
      const font = `${fontWeight} ${fontSize} ${fontFamily}`;
      const lineHeight = Number.parseFloat(style.lineHeight) || 27;
      const prepared = prepareWithSegments(TAGLINE, font);
      const radius = 92;
      const width = boxNow.clientWidth;

      if (!width) return;

      let cursorState: LayoutCursor = { segmentIndex: 0, graphemeIndex: 0 };
      let y = 0;
      let guard = 0;
      const nextLines: DynamicLine[] = [];

      while (guard < 40) {
        const lineCenterY = y + lineHeight / 2;
        const deltaY = Math.abs(lineCenterY - cursor.y);
        const influence = deltaY < radius ? (radius - deltaY) / radius : 0;
        const signedX = cursor.x / width - 0.5;
        const dynamicWidth = Math.max(180, width - influence * 110);
        const range = layoutNextLineRange(prepared, cursorState, dynamicWidth);
        if (!range) break;

        const line = materializeLineRange(prepared, range);
        nextLines.push({
          text: line.text,
          xOffset: signedX * influence * 28,
        });

        cursorState = range.end;
        y += lineHeight;
        guard += 1;
      }

      setDynamicLines(nextLines);
      setPretextMetrics({
        lineCount: nextLines.length,
        height: Math.round(nextLines.length * lineHeight),
      });
    });
  };

  const handleMouseLeave = () => {
    lastCursorRef.current = null;
    const box = taglineBoxRef.current;
    if (!box) return;

    const style = window.getComputedStyle(box);
    const fontWeight = style.fontWeight || '400';
    const fontSize = style.fontSize || '16px';
    const fontFamily = style.fontFamily || 'sans-serif';
    const font = `${fontWeight} ${fontSize} ${fontFamily}`;
    const lineHeight = Number.parseFloat(style.lineHeight) || 27;
    const prepared = prepareWithSegments(TAGLINE, font);
    const width = box.clientWidth;
    if (!width) return;

    let cursorState: LayoutCursor = { segmentIndex: 0, graphemeIndex: 0 };
    let guard = 0;
    const nextLines: DynamicLine[] = [];

    while (guard < 40) {
      const range = layoutNextLineRange(prepared, cursorState, width);
      if (!range) break;
      const line = materializeLineRange(prepared, range);
      nextLines.push({ text: line.text, xOffset: 0 });
      cursorState = range.end;
      guard += 1;
    }

    setDynamicLines(nextLines);
    setPretextMetrics({
      lineCount: nextLines.length,
      height: Math.round(nextLines.length * lineHeight),
    });
  };

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        minHeight: '100vh',
        paddingTop: '56px',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}
    >
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px 32px 120px',
          maxWidth: '1280px',
          margin: '0 auto',
          width: '100%',
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: '48px',
            alignItems: 'flex-start',
          }}
        >
          {/* Headline */}
          <div style={{ flex: 1 }}>
            {HEADLINE.map((line, i) => (
              <div
                key={i}
                ref={(el) => { headlineRefs.current[i] = el; }}
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'var(--text-hero)',
                  fontWeight: 800,
                  lineHeight: 0.92,
                  color: i === 2 ? 'var(--accent-btc)' : 'var(--text-primary)',
                  marginBottom: i < 2 ? '4px' : '0',
                  display: 'block',
                }}
              >
                {line}
              </div>
            ))}

            {/* Tagline */}
            <div
              ref={taglineBoxRef}
              style={{
                marginTop: '32px',
                fontFamily: 'var(--font-body)',
                fontSize: '16px',
                lineHeight: 1.7,
                color: 'var(--text-secondary)',
                maxWidth: '480px',
              }}
            >
              {dynamicLines.map((line, index) => (
                <div
                  key={`${index}-${line.text.length}`}
                  style={{
                    transform: `translateX(${line.xOffset}px)`,
                    transition: 'transform 120ms ease-out',
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {line.text}
                </div>
              ))}
            </div>

            <div
              style={{
                marginTop: '10px',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                color: 'var(--accent-amber)',
                letterSpacing: '0.05em',
              }}
            >
              HOVER REACTIVE PRETEXT: {pretextMetrics.lineCount} LINES / {Math.round(pretextMetrics.height)}PX
            </div>

            {/* CTA */}
            <div style={{ marginTop: '40px', display: 'flex', gap: '16px', alignItems: 'center' }}>
              <a
                href="#"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '13px',
                  backgroundColor: 'var(--accent-btc)',
                  color: 'var(--bg-void)',
                  padding: '12px 24px',
                  borderRadius: '4px',
                  fontWeight: 600,
                  letterSpacing: '0.04em',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'inline-block',
                }}
              >
                Start wallet-native path →
              </a>
              <a
                href="#"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '13px',
                  color: 'var(--text-secondary)',
                  letterSpacing: '0.04em',
                }}
              >
                Use website api_key fallback →
              </a>
            </div>
          </div>

          {/* Console */}
          <HeroConsole />
        </div>
      </div>

      {/* Scroll chevron */}
      <div
        ref={chevronRef}
        style={{
          position: 'absolute',
          bottom: '40px',
          left: '50%',
          transform: 'translateX(-50%)',
          opacity: 0.4,
          color: 'var(--text-secondary)',
          fontSize: '20px',
          cursor: 'pointer',
        }}
      >
        ↓
      </div>
    </section>
  );
}
