'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

const STYLES = `
  .sockt-walker {
    position: fixed;
    top: 100px;
    pointer-events: none;
    z-index: 9999;
  }

  .sockt-walker svg {
    display: block;
  }

  .sockt-walker.walking-right {
    transform: scaleX(1);
  }

  .sockt-walker.walking-left {
    transform: scaleX(-1);
  }
`;

export default function WalkingCharacter() {
  const [mounted, setMounted] = useState(false);
  const [left, setLeft] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const prevPositionRef = useRef(0);

  useEffect(() => {
    setMounted(true);

    const onScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const scrollProgress = maxScroll > 0 ? window.scrollY / maxScroll : 0;

      // Calculate position: 0 to (window.innerWidth - 144)
      const maxLeft = Math.max(0, window.innerWidth - 144);
      const newLeft = scrollProgress * maxLeft;

      // Determine direction based on position change
      if (newLeft > prevPositionRef.current) {
        setDirection('right');
      } else if (newLeft < prevPositionRef.current) {
        setDirection('left');
      }

      setLeft(newLeft);
      prevPositionRef.current = newLeft;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  if (!mounted) return null;

  return createPortal(
    <>
      <style>{STYLES}</style>
      <div
        className={`sockt-walker walking-${direction}`}
        style={{
          left: `${left}px`,
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 72" width="144" height="108" shapeRendering="crispEdges" style={{ display: 'block' }}>
          <defs>
            <symbol id="sockt-mascot" viewBox="-16 -14 32 40">
              <text
                x="0"
                y="0"
                textAnchor="middle"
                dominantBaseline="middle"
                fontFamily="monospace"
                fontSize="13"
                fontWeight="700"
                fill="#c27a36"
              >{'{*}'}</text>

              <g>
                <animate attributeName="opacity" values="1;1;1;0;0;1" dur="3.2s" repeatCount="indefinite"/>
                <rect x="-4" y="-3" width="1" height="1" fill="#c27a36"/>
                <rect x="3" y="-3" width="1" height="1" fill="#c27a36"/>
              </g>

              <g opacity="0">
                <animate attributeName="opacity" values="0;0;0;1;1;0" dur="3.2s" repeatCount="indefinite"/>
                <rect x="-4" y="-3" width="1" height="0.35" fill="#c27a36"/>
                <rect x="3" y="-3" width="1" height="0.35" fill="#c27a36"/>
              </g>

              <g>
                <animate attributeName="opacity" values="1;0;1" dur="0.46s" repeatCount="indefinite"/>
                <rect x="-4" y="8" width="1" height="5" fill="#c27a36"/>
                <rect x="-5" y="13" width="2" height="1" fill="#c27a36"/>

                <rect x="4" y="8" width="1" height="5" fill="#c27a36"/>
                <rect x="4" y="13" width="2" height="1" fill="#c27a36"/>
              </g>

              <g opacity="0">
                <animate attributeName="opacity" values="0;1;0" dur="0.46s" repeatCount="indefinite"/>
                <rect x="-5" y="8" width="1" height="5" fill="#c27a36"/>
                <rect x="-6" y="13" width="2" height="1" fill="#c27a36"/>

                <rect x="5" y="8" width="1" height="5" fill="#c27a36"/>
                <rect x="5" y="13" width="2" height="1" fill="#c27a36"/>
              </g>
            </symbol>
          </defs>

          <g transform="translate(24 36)">
            <g>
              <animateTransform
                attributeName="transform"
                type="translate"
                values="0 0;0 -1;0 0"
                dur="0.46s"
                repeatCount="indefinite"/>

              <use href="#sockt-mascot"/>
            </g>
          </g>
        </svg>
      </div>
    </>,
    document.body
  );
}
