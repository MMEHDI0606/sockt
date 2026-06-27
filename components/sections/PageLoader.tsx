'use client';

import { useEffect, useRef, useState } from 'react';

export default function PageLoader() {
  const [mounted, setMounted] = useState(false);
  const [hiding, setHiding] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    // Only show on first visit this session
    if (typeof sessionStorage !== 'undefined' && sessionStorage.getItem('skt-loaded')) {
      setGone(true);
      return;
    }

    setMounted(true);

    const hideTimer = setTimeout(() => {
      setHiding(true);
      sessionStorage.setItem('skt-loaded', '1');
    }, 1350);

    const removeTimer = setTimeout(() => {
      setGone(true);
    }, 1950); // 1350 + 600ms fade

    return () => {
      clearTimeout(hideTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (gone || !mounted) return null;

  return (
    <>
      <style>{`
        @keyframes skt-line {
          from { transform: scaleX(0); transform-origin: left; }
          to   { transform: scaleX(1); transform-origin: left; }
        }
        @keyframes skt-logo {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .skt-loader {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background: #09090B;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 18px;
          transition: opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .skt-loader.hiding { opacity: 0; pointer-events: none; }
        .skt-logo {
          font-family: var(--font-mono);
          font-size: 12px;
          letter-spacing: 0.22em;
          color: #EEECE8;
          animation: skt-logo 0.5s 0.1s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        .skt-line-track {
          width: 100px;
          height: 1px;
          background: #26262B;
          position: relative;
          overflow: hidden;
        }
        .skt-line-fill {
          position: absolute;
          inset: 0;
          background: #EEECE8;
          animation: skt-line 0.75s 0.35s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
      `}</style>
      <div className={`skt-loader${hiding ? ' hiding' : ''}`}>
        <div className="skt-logo">{'{*}'} SOCKT</div>
        <div className="skt-line-track">
          <div className="skt-line-fill" />
        </div>
      </div>
    </>
  );
}
