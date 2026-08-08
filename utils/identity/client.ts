/**
 * Browser-side client for the sockt-cloud identity backend.
 *
 * Flow:
 *   1. Frontend authenticates with Supabase Auth (password / OAuth / magic link).
 *   2. `exchangeForSession(supabaseAccessToken)` swaps that short-lived Supabase
 *      access token for an identity session: the backend sets an httpOnly
 *      `sockt_refresh` cookie and returns an access token (held in memory here).
 *   3. Call `identityFetch()` for any GCP-backend request; it attaches the
 *      bearer token and transparently refreshes on 401.
 *   4. `logoutSession()` revokes the identity session and clears the cookie.
 */

const IDENTITY_URL = process.env.NEXT_PUBLIC_IDENTITY_URL || 'http://localhost:3003';

let accessToken: string | null = null;
let accessExpiresAt: number | null = null;
let refreshPromise: Promise<boolean> | null = null;

export interface ExchangeResult {
  accessToken: string;
  accessExpiresAt: number;
  sessionId: string;
  user: {
    id: string;
    tenantId: string;
    email: string;
    role: string;
    displayName: string;
  };
}

export function getAccessToken(): string | null {
  if (!accessToken) return null;
  if (accessExpiresAt && Date.now() >= accessExpiresAt - 30_000) return null;
  return accessToken;
}

export function setAccessToken(token: string | null, expiresAt: number | null = null): void {
  accessToken = token;
  accessExpiresAt = expiresAt;
}

export async function exchangeForSession(supabaseAccessToken: string): Promise<ExchangeResult> {
  if (!IDENTITY_URL) throw new Error('NEXT_PUBLIC_IDENTITY_URL is not configured');
  const res = await fetch(`${IDENTITY_URL}/api/auth/exchange`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ supabaseAccessToken }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `exchange failed: ${res.status}`);
  }
  const data = (await res.json()) as ExchangeResult;
  setAccessToken(data.accessToken, data.accessExpiresAt);
  return data;
}

async function refresh(): Promise<boolean> {
  if (refreshPromise) return refreshPromise;
  if (!IDENTITY_URL) return false;
  refreshPromise = (async () => {
    try {
      const res = await fetch(`${IDENTITY_URL}/api/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({}),
      });
      if (!res.ok) {
        setAccessToken(null, null);
        return false;
      }
      const data = (await res.json()) as { accessToken: string; accessExpiresAt: number };
      setAccessToken(data.accessToken, data.accessExpiresAt);
      return true;
    } catch {
      setAccessToken(null, null);
      return false;
    } finally {
      refreshPromise = null;
    }
  })();
  return refreshPromise;
}

export async function logoutSession(): Promise<void> {
  if (!IDENTITY_URL) return;
  setAccessToken(null, null);
  try {
    await fetch(`${IDENTITY_URL}/api/auth/logout`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({}),
    });
  } catch {
    // best-effort
  }
}

/**
 * fetch() wrapper that attaches `Authorization: Bearer <accessToken>` and
 * transparently refreshes once on 401. Only use for calls to the identity /
 * GCP backend origin.
 */
export async function identityFetch(input: string, init: RequestInit = {}): Promise<Response> {
  if (!IDENTITY_URL) throw new Error('NEXT_PUBLIC_IDENTITY_URL is not configured');
  const url = input.startsWith('http') ? input : `${IDENTITY_URL}${input.startsWith('/') ? '' : '/'}${input}`;
  const token = getAccessToken();

  const headers = new Headers(init.headers);
  if (token) headers.set('authorization', `Bearer ${token}`);

  let res = await fetch(url, { ...init, credentials: 'include', headers });

  if (res.status === 401 && token) {
    const refreshed = await refresh();
    if (refreshed) {
      const newToken = getAccessToken();
      if (newToken) {
        const retryHeaders = new Headers(init.headers);
        retryHeaders.set('authorization', `Bearer ${newToken}`);
        res = await fetch(url, { ...init, credentials: 'include', headers: retryHeaders });
      }
    }
  }
  return res;
}