# Sockt

**Decentralized GPU Compute · Lightning Payments · Autonomous AI Commerce**

Sockt is an infrastructure platform for autonomous AI agents — pay-per-use GPU compute settled over the Bitcoin Lightning Network, with no subscriptions, no KYC, and sub-second settlement.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.2.4 (Turbopack) |
| Language | TypeScript 6 |
| UI | React 19 |
| Styling | Tailwind CSS 3 |
| Animations | GSAP 3 + ScrollTrigger |
| Smooth Scroll | Lenis 1.3 |

---

## Getting Started

```bash
# Install dependencies
npm install

# Run dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure

```
web/
├── app/
│   ├── layout.tsx        # Root layout — Lenis + GSAP init
│   ├── page.tsx          # Page assembly (dynamic imports for perf)
│   └── globals.css       # Design tokens, Tailwind base
├── components/
│   ├── nav/              # Sticky nav with scroll-triggered bg
│   ├── hero/             # Hero section, ticker, terminal console
│   └── sections/         # All page sections (WhatIs → Footer)
└── lib/
    └── gsap.ts           # Shared GSAP + ScrollTrigger singleton
```

---

## Scripts

```bash
npm run dev      # Start dev server with Turbopack
npm run build    # Production build
npm run start    # Start production server
npm run lint     # ESLint
```

---

## Design

Dark-field infrastructure aesthetic — near-black background, phosphor-amber + electric-white type palette, Bitcoin orange as the primary accent. Inspired by e2b.dev, identiti.studio, and tavily.com.

Full design spec: `sockt-design-doc`
