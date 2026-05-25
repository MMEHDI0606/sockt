'use client';

import { useEffect, useState } from 'react';

type Theme = 'dark' | 'light';

type ThemeToggleProps = {
  className?: string;
  compact?: boolean;
};

function resolveTheme(): Theme {
  if (typeof window === 'undefined') return 'dark';

  const stored = window.localStorage.getItem('theme');
  if (stored === 'light' || stored === 'dark') {
    return stored;
  }

  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

export default function ThemeToggle({ className, compact = false }: ThemeToggleProps) {
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    const nextTheme = resolveTheme();
    document.documentElement.setAttribute('data-theme', nextTheme);
    setTheme(nextTheme);
  }, []);

  function toggleTheme() {
    const nextTheme: Theme = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', nextTheme);
    window.localStorage.setItem('theme', nextTheme);
    setTheme(nextTheme);
  }

  return (
    <button
      type="button"
      aria-label="Toggle theme"
      onClick={toggleTheme}
      className={className}
      style={
        className
          ? undefined
          : {
              fontFamily: 'var(--font-mono)',
              fontSize: compact ? '10px' : '11px',
              color: 'var(--text-secondary)',
              border: '1px solid var(--bg-border)',
              backgroundColor: 'transparent',
              padding: compact ? '6px 8px' : '7px 10px',
              borderRadius: '100px',
              letterSpacing: '0.06em',
              cursor: 'pointer',
              lineHeight: 1,
            }
      }
    >
      {theme === 'dark' ? 'LIGHT' : 'DARK'}
    </button>
  );
}
