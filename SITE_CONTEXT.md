# Sockt Site Context Document

## 1) Product Overview
Sockt is a Next.js web app for agent-provisioned compute sandboxes. It combines:
- Marketing website content (home, docs, pricing, use-cases, legal pages)
- Supabase authentication and account management
- A user dashboard for credits, API key lifecycle, and top-up workflows
- Polar webhook integration for payment settlement into user balance
- Password reset via OTP flow (server-side routes + Supabase-backed OTP table)

The platform framing across UI copy is: agent-native compute, pay-per-use billing, and Bitcoin/Lightning-themed positioning.

## 2) Core Technology Stack
- Framework: Next.js App Router (v16)
- Language: TypeScript + React
- Styling: Tailwind + design-token CSS variables in app/globals.css
- Auth + data: Supabase (SSR/browser clients + admin service-role client)
- Payments: Polar SDK + webhook endpoint
- Animations/UI effects: GSAP + ScrollTrigger + smooth scroll provider

Primary dependency snapshot is in package.json, including:
- @supabase/ssr
- @supabase/supabase-js
- @polar-sh/sdk
- gsap
- next/react/react-dom/tailwind/typescript

## 3) Runtime Architecture
### Frontend layout
- App Router entry and metadata: app/layout.tsx
- Global tokens and base CSS: app/globals.css
- Public pages under app/*
- Dashboard app page under app/dashboard/page.tsx (dynamic/authenticated)

### Data/Auth clients
- Browser Supabase client: utils/supabase/client.ts
- Server Supabase SSR client (cookie-bound): utils/supabase/server.ts
- Admin Supabase client (service role): utils/supabase/admin.ts

### Server-side features
- Dashboard server actions: app/dashboard/actions.ts
- Polar webhook handler: app/api/webhooks/polar/route.ts
- Forgot-password OTP API:
  - app/api/auth/forgot-password/request/route.ts
  - app/api/auth/forgot-password/verify/route.ts
  - app/api/auth/forgot-password/reset/route.ts

## 4) Route and Page Map
### Public content routes
- /
- /about
- /docs
- /pricing
- /sdk
- /stack
- /flow
- /use-cases
- /privacy
- /terms

### Auth routes
- /login
- /signup
- /forgot-password
- /forgot-password/verify
- /forgot-password/reset

### App route
- /dashboard
- /dashboard/account
- /dashboard/settings

### System/SEO routes
- /robots.txt (via app/robots.ts)
- /sitemap.xml (via app/sitemap.ts)
- Catch-all page in app/[...slug]/page.tsx

## 5) Authentication and Session Model
- Supabase auth session is read server-side via cookie-backed SSR client.
- Protected page behavior:
  - /dashboard checks supabase.auth.getUser()
  - redirects to /login when unauthenticated
- Sign-out path:
  - Dashboard form calls signOutAction()
  - action invokes supabase.auth.signOut() and redirects to /

## 6) Dashboard System (Current UI/Logic)
The dashboard is now implemented as a full shell layout:
- Sidebar (220px on desktop):
  - Brand area
  - Navigation links (Dashboard, Sandboxes, Billing, API Keys, Account, Logs, Settings)
  - User row with initials, name, email
  - Sign-out button wired to existing signOutAction
- Main content:
  - Topbar with title/subtitle and actions (New sandbox, Top up)
  - 4 metric cards (Balance, Active sandboxes, Spent this month, API calls 24h)
  - Two-column grid:
    - Billing panel (Lightning balance, usage bar, tier pricing rows)
    - API Keys panel (generate action + list/empty state)
  - Recent logs table (timestamp, event, status tag)

### Dashboard information architecture (canonical labels)
- Sockt
- Agent infrastructure
- Overview
- Dashboard
- Sandboxes
- Billing
- API Keys
- Account
- Logs
- Settings

### Dashboard data wiring
- Balance source: users.credit_balance_subcents
- API keys source: api_keys where user_id = current user and is_active = true
- API key create/revoke actions preserved:
  - createApiKeyAction()
  - revokeApiKeyAction()
- Top-up action preserved:
  - createTopupCheckoutAction() (Polar checkout)

### Billing logic continuity
The existing top-up/payment flow remains intact:
- Dashboard top-up action creates Polar checkout
- Webhook validates signature and increments credit_balance_subcents
- Balance reflects updated subcents converted to USD in dashboard display

### New dashboard child pages
- /dashboard/account
  - Protected route (same session guard model as /dashboard)
  - Shows active user identity details sourced from Supabase auth session
  - Surfaces account-level information (name, email, user id, current credit snapshot)
  - Retains sidebar shell and shared sign-out footer action
- /dashboard/settings
  - Protected route with same sidebar shell and session guard
  - Hosts settings-oriented panels for preferences and security entry points
  - Links to existing password reset flow and account details page
  - Uses tokenized dashboard design variables for dark/light compatibility

## 7) API Keys Lifecycle
- Key creation:
  - Full token pattern: sockt_live_<uuid>
  - Prefix persisted for display
  - SHA-256 hash persisted in database
- Key revocation:
  - Soft deactivation via is_active=false
- UI behavior:
  - Shows active key previews and created date
  - One-time revealed full key modal on generate

## 8) OTP Password Reset System
### High-level flow
1. Request OTP
   - Validates email
   - Enforces hourly request limit
   - Stores hashed OTP + expiry
   - Sends OTP via Resend when configured
2. Verify OTP
   - Validates 6-digit code
   - Marks OTP used
   - Issues hashed reset token + expiry
3. Reset password
   - Validates reset token hash and expiry
   - Finds user by email via admin user listing
   - Updates password through Supabase admin API

### Security traits
- OTP and reset tokens are stored as hashes, not plaintext
- Pepper secrets used in hash inputs
- One-time-use semantics enforced by used_at/reset_used_at
- Expiry windows enforced at DB query level

### Migration
- OTP table/schema migration exists under supabase/migrations/20260518_forgot_password_otp.sql

## 9) Supabase Email Templates
Custom Supabase auth templates are stored in:
- supabase/templates/confirm-signup.html
- supabase/templates/magic-link.html
- supabase/templates/reset-password.html
- supabase/templates/change-email.html
- supabase/templates/invite-user.html
- supabase/templates/reauthentication.html

These include Sockt brand header, card content blocks, and CTA links.

## 10) Theme and Design Tokens
Global tokens are defined in app/globals.css.

Key dashboard-specific tokens now include:
- --dashboard-bg
- --dashboard-sidebar
- --dashboard-card
- --dashboard-border
- --dashboard-text
- --dashboard-muted
- --dashboard-accent

Light mode availability for dashboard:
- Explicit token override when data-theme='light' is present
- Automatic fallback via @media (prefers-color-scheme: light)

Dashboard visual spec alignment:
- Primary background: #0a0a0a (default dark)
- Sidebar background: #111111
- Accent: #F7AC27
- Borders: 0.5px throughout shell cards/panels

## 11) Payments and Webhooks
- Endpoint: app/api/webhooks/polar/route.ts
- Signature verified with POLAR_WEBHOOK_SECRET
- Handles order.paid events
- Reads userId from order metadata
- Increments users.credit_balance_subcents accordingly

## 12) Environment Variables
Commonly required environment variables:
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
- SUPABASE_SERVICE_ROLE_KEY
- POLAR_ACCESS_TOKEN
- POLAR_TOPUP_PRODUCT_ID
- POLAR_WEBHOOK_SECRET
- NEXT_PUBLIC_BASE_URL

Forgot-password/OTP specific:
- OTP_HASH_PEPPER
- RESET_TOKEN_PEPPER
- RESEND_API_KEY
- EMAIL_FROM

## 13) Build and Verification Notes
On this Windows workstation, native SWC binary reports invalid Win32 application, so validated production builds are executed with:
- npx next build --webpack

This remains a reliable verification path for compile/typecheck/page generation in current environment.

## 14) Known Operational Behaviors
- /dashboard is dynamic and session-gated
- API key full value is intentionally one-time visible in UI
- Password-reset request route returns devOtp outside production if email provider config is missing
- Webhook uses server-role Supabase client and expects valid metadata.userId

## 15) Suggested Next Documentation Additions
Potential follow-up docs that would improve onboarding and maintenance:
- DATA_MODEL.md (tables, key fields, expected indexes, ownership)
- RUNBOOK.md (incident response for webhook/auth failures)
- ENV_MATRIX.md (local vs preview vs production variable requirements)
- SECURITY_NOTES.md (token handling, key storage, rotation guidance)

## 16) End-to-End User Journeys
### New visitor journey
1. Lands on marketing homepage and navigates docs/pricing/feature sections.
2. Creates account via signup and email confirmation flow.
3. Authenticates and enters /dashboard.

### Returning user journey
1. Signs in with credentials or magic-link flow.
2. Opens /dashboard for balance and API key management.
3. Uses top-up action to create checkout and add credits.

### Password recovery journey
1. User submits email in forgot-password request page.
2. OTP is issued and validated via verify step.
3. Reset token is consumed to update password.
4. User is redirected to authenticated area after sign-in.

### API key operation journey
1. User generates a new key from API Keys panel.
2. Full key is shown once in modal (must be copied immediately).
3. User can revoke keys individually (is_active=false).

## 17) Operational Boundaries
- Business logic is server-trusted; client only triggers actions/routes.
- Admin operations (service role) are isolated to server-only utilities.
- Dashboard rendering depends on authenticated server session.
- Visual shell changes are intended to be independent of billing/auth logic.

---
This file is intended to be a living technical context reference for contributors and AI agents working inside the Sockt repository.
