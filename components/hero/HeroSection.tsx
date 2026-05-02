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

const HEADLINE_TEXT = 'COMPUTE FOR AGENTS THAT PAY IN SATS.';
const TAGLINE = 'Your agent shouldn’t pause and wait for a human to provision compute. Sockt gives it a wallet, a channel, and a GPU — autonomous and settled in under 90 seconds.';

type DynamicLine = {
  text: string;
  xOffset: number;
};

type CursorPoint = {
  x: number;
  y: number;
};

function buildReactiveLines(
  prepared: ReturnType<typeof prepareWithSegments>,
  width: number,
  lineHeight: number,
  cursor: CursorPoint | null,
  radius: number,
  pullWidth: number,
  minWidth: number,
  shiftX: number
): DynamicLine[] {
  let cursorState: LayoutCursor = { segmentIndex: 0, graphemeIndex: 0 };
  let y = 0;
  let guard = 0;
  const lines: DynamicLine[] = [];

  while (guard < 60) {
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

    const dynamicWidth = Math.max(minWidth, width - influence * pullWidth);
    const range = layoutNextLineRange(prepared, cursorState, dynamicWidth);
    if (!range) break;

    const line = materializeLineRange(prepared, range);
    lines.push({
      text: line.text,
      xOffset: signedX * influence * shiftX,
    });

    cursorState = range.end;
    y += lineHeight;
    guard += 1;
  }

  return lines;
}

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const chevronRef = useRef<HTMLDivElement>(null);
  const headlineBoxRef = useRef<HTMLDivElement>(null);
  const taglineBoxRef = useRef<HTMLDivElement>(null);
  const lastCursorRef = useRef<{ clientX: number; clientY: number } | null>(null);
  const preparedHeadlineRef = useRef<ReturnType<typeof prepareWithSegments> | null>(null);
  const preparedTaglineRef = useRef<ReturnType<typeof prepareWithSegments> | null>(null);
  const headlineLineHeightRef = useRef(110);
  const taglineLineHeightRef = useRef(27);
  const hoverRafRef = useRef<number | null>(null);
  const [headlineLines, setHeadlineLines] = useState<DynamicLine[]>([]);
  const [taglineLines, setTaglineLines] = useState<DynamicLine[]>([]);

  useEffect(() => {
    const headlineNodes = sectionRef.current?.querySelectorAll('.hero-headline-line');
    gsap.from(headlineNodes || [], {
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
    const headlineBox = headlineBoxRef.current;
    const taglineBox = taglineBoxRef.current;
    if (!headlineBox || !taglineBox) return;

    const headlineStyle = window.getComputedStyle(headlineBox);
    const headlineFont = `${headlineStyle.fontWeight || '800'} ${headlineStyle.fontSize || '64px'} ${headlineStyle.fontFamily || 'sans-serif'}`;
    headlineLineHeightRef.current = Number.parseFloat(headlineStyle.lineHeight) || 110;
    preparedHeadlineRef.current = prepareWithSegments(HEADLINE_TEXT, headlineFont);

    const taglineStyle = window.getComputedStyle(taglineBox);
    const taglineFont = `${taglineStyle.fontWeight || '400'} ${taglineStyle.fontSize || '16px'} ${taglineStyle.fontFamily || 'sans-serif'}`;
    taglineLineHeightRef.current = Number.parseFloat(taglineStyle.lineHeight) || 27;
    preparedTaglineRef.current = prepareWithSegments(TAGLINE, taglineFont);

    const rebuild = (cursorX: number | null, cursorY: number | null) => {
      const preparedHeadline = preparedHeadlineRef.current;
      const preparedTagline = preparedTaglineRef.current;
      if (!preparedHeadline || !preparedTagline) return;

      const hRect = headlineBox.getBoundingClientRect();
      const tRect = taglineBox.getBoundingClientRect();

      const hCursor = cursorX === null || cursorY === null
        ? null
        : {
            x: Math.max(0, Math.min(hRect.width, cursorX - hRect.left)),
            y: Math.max(0, Math.min(hRect.height, cursorY - hRect.top)),
          };
      const tCursor = cursorX === null || cursorY === null
        ? null
        : {
            x: Math.max(0, Math.min(tRect.width, cursorX - tRect.left)),
            y: Math.max(0, Math.min(tRect.height, cursorY - tRect.top)),
          };

      setHeadlineLines(
        buildReactiveLines(
          preparedHeadline,
          hRect.width,
          headlineLineHeightRef.current,
          hCursor,
          120,
          180,
          420,
          34
        )
      );

      setTaglineLines(
        buildReactiveLines(
          preparedTagline,
          tRect.width,
          taglineLineHeightRef.current,
          tCursor,
          92,
          110,
          180,
          28
        )
      );
    };

    rebuild(null, null);
    const resizeObserver = new ResizeObserver(() => {
      const last = lastCursorRef.current;
      rebuild(last?.clientX ?? null, last?.clientY ?? null);
    });
    resizeObserver.observe(headlineBox);
    resizeObserver.observe(taglineBox);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  const handleMouseMove = (event: React.MouseEvent<HTMLElement>) => {
    const headlineBox = headlineBoxRef.current;
    const taglineBox = taglineBoxRef.current;
    const preparedHeadline = preparedHeadlineRef.current;
    const preparedTagline = preparedTaglineRef.current;
    if (!headlineBox || !taglineBox || !preparedHeadline || !preparedTagline) return;

    lastCursorRef.current = { clientX: event.clientX, clientY: event.clientY };
    if (hoverRafRef.current) cancelAnimationFrame(hoverRafRef.current);

    hoverRafRef.current = requestAnimationFrame(() => {
      const hRect = headlineBox.getBoundingClientRect();
      const tRect = taglineBox.getBoundingClientRect();

      const hCursor = {
        x: Math.max(0, Math.min(hRect.width, event.clientX - hRect.left)),
        y: Math.max(0, Math.min(hRect.height, event.clientY - hRect.top)),
      };
      const tCursor = {
        x: Math.max(0, Math.min(tRect.width, event.clientX - tRect.left)),
        y: Math.max(0, Math.min(tRect.height, event.clientY - tRect.top)),
      };

      setHeadlineLines(
        buildReactiveLines(
          preparedHeadline,
          hRect.width,
          headlineLineHeightRef.current,
          hCursor,
          120,
          180,
          420,
          34
        )
      );

      setTaglineLines(
        buildReactiveLines(
          preparedTagline,
          tRect.width,
          taglineLineHeightRef.current,
          tCursor,
          92,
          110,
          180,
          28
        )
      );
    });
  };

  const handleMouseLeave = () => {
    const headlineBox = headlineBoxRef.current;
    const taglineBox = taglineBoxRef.current;
    const preparedHeadline = preparedHeadlineRef.current;
    const preparedTagline = preparedTaglineRef.current;
    if (!headlineBox || !taglineBox || !preparedHeadline || !preparedTagline) return;

    lastCursorRef.current = null;
    setHeadlineLines(
      buildReactiveLines(
        preparedHeadline,
        headlineBox.clientWidth,
        headlineLineHeightRef.current,
        null,
        120,
        180,
        420,
        34
      )
    );
    setTaglineLines(
      buildReactiveLines(
        preparedTagline,
        taglineBox.clientWidth,
        taglineLineHeightRef.current,
        null,
        92,
        110,
        180,
        28
      )
    );
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
            <div
              ref={headlineBoxRef}
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--text-hero)',
                fontWeight: 800,
                lineHeight: 0.92,
                maxWidth: '820px',
              }}
            >
              {headlineLines.map((line, index) => (
                <div
                  key={`${index}-${line.text.length}`}
                  className="hero-headline-line"
                  style={{
                    transform: `translateX(${line.xOffset}px)`,
                    transition: 'transform 110ms ease-out',
                    marginBottom: index < headlineLines.length - 1 ? '4px' : '0',
                    color: line.text.includes('SATS') ? 'var(--accent-btc)' : 'var(--text-primary)',
                  }}
                >
                  {line.text}
                </div>
              ))}
            </div>

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
              {taglineLines.map((line, index) => (
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
                Run your first paid task →
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
                See 90-second flow →
              </a>
            </div>

            <div
              style={{
                marginTop: '14px',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                color: 'var(--text-secondary)',
                letterSpacing: '0.05em',
              }}
            >
              No crypto required to start. api_key path available.
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
