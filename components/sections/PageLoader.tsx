'use client';

import { useEffect, useRef, useState } from 'react';

export default function PageLoader() {
  const [mounted, setMounted] = useState(false);
  const [phase, setPhase] = useState(0); // 0 void → 1 hairlines → 2 grid → 3 logo → 4 line → 5 dot → 6 hiding
  const [gone, setGone] = useState(false);
  const dotRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (typeof sessionStorage !== 'undefined' && sessionStorage.getItem('skt-loaded')) {
      setGone(true);
      return;
    }

    setMounted(true);

    const timings: [number, number][] = [
      [80,  1],  // hairlines draw down
      [280, 2],  // dot grid fade
      [520, 3],  // logo appears
      [820, 4],  // line fills
      [1100, 5], // brass dot + status
      [1500, 6], // start hide
    ];

    const timers = timings.map(([ms, p]) => setTimeout(() => setPhase(p), ms));

    const removeTimer = setTimeout(() => {
      sessionStorage.setItem('skt-loaded', '1');
      setGone(true);
    }, 2100);

    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(removeTimer);
    };
  }, []);

  if (gone || !mounted) return null;

  const hiding = phase >= 6;

  return (
    <>
      <style>{`
        @keyframes skt-hairline-l {
          from { transform: scaleY(0); transform-origin: top; }
          to   { transform: scaleY(1); transform-origin: top; }
        }
        @keyframes skt-hairline-r {
          from { transform: scaleY(0); transform-origin: top; }
          to   { transform: scaleY(1); transform-origin: top; }
        }
        @keyframes skt-logo {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes skt-line {
          from { transform: scaleX(0); transform-origin: left; }
          to   { transform: scaleX(1); transform-origin: left; }
        }
        @keyframes skt-dot-brass {
          from { background: #29272B; }
          to   { background: #C2A878; box-shadow: 0 0 6px rgba(194,168,120,0.5); }
        }
        @keyframes skt-status {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .skt-loader {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background: #09090B;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: opacity 0.55s cubic-bezier(0.16, 1, 0.3, 1);
          overflow: hidden;
        }
        .skt-loader.hiding { opacity: 0; pointer-events: none; }
        .skt-hairline {
          position: absolute;
          top: 0; bottom: 0;
          width: 1px;
          background: #29272B;
        }
        .skt-hairline.left  { left: calc(50% - min(700px, 45vw)); }
        .skt-hairline.right { right: calc(50% - min(700px, 45vw)); }
        .skt-hairline.animate {
          animation: skt-hairline-l 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        .skt-grid {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(circle, #26262B 1px, transparent 1px);
          background-size: 28px 28px;
          transition: opacity 0.4s ease;
        }
        .skt-center {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }
        .skt-logo {
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.24em;
          color: #EEECE8;
          animation: skt-logo 0.45s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        .skt-line-track {
          width: 88px;
          height: 1px;
          background: #26262B;
          position: relative;
          overflow: hidden;
        }
        .skt-line-fill {
          position: absolute;
          inset: 0;
          background: #EEECE8;
          animation: skt-line 0.55s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        .skt-status {
          display: flex;
          align-items: center;
          gap: 7px;
          font-family: var(--font-mono);
          font-size: 10px;
          letter-spacing: 0.12em;
          color: #6D6D78;
          animation: skt-status 0.35s ease both;
        }
        .skt-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #29272B;
          display: inline-block;
          flex-shrink: 0;
          animation: skt-dot-brass 0.4s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
      `}</style>
      <div className={`skt-loader${hiding ? ' hiding' : ''}`}>
        {/* Vertical hairlines */}
        <div className={`skt-hairline left${phase >= 1 ? ' animate' : ''}`} />
        <div className={`skt-hairline right${phase >= 1 ? ' animate' : ''}`} style={{ animationDelay: '0.06s' }} />

        {/* Dot grid */}
        <div className="skt-grid" style={{ opacity: phase >= 2 ? 0.5 : 0 }} />

        {/* Centre content */}
        <div className="skt-center">
          {phase >= 3 && (
            <div className="skt-logo">{'{*}'} SOCKT</div>
          )}
          {phase >= 4 && (
            <div className="skt-line-track">
              <div className="skt-line-fill" />
            </div>
          )}
          {phase >= 5 && (
            <div className="skt-status">
              <span className="skt-dot" ref={dotRef} />
              fleet online
            </div>
          )}
        </div>
      </div>
    </>
  );
}
