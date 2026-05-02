/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'bg-void': '#080808',
        'bg-surface': '#0f0f0f',
        'bg-raised': '#161616',
        'bg-border': '#1f1f1f',
        'text-primary': '#f0ece4',
        'text-secondary': '#6b6761',
        'text-mono': '#c4bfb6',
        'accent-btc': '#f7931a',
        'accent-amber': '#d4840a',
        'accent-sats': '#fbbf24',
        'accent-green': '#22d07a',
        'accent-red': '#e53e3e',
      },
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
      },
    },
  },
  plugins: [],
};
