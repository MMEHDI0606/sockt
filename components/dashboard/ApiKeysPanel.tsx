'use client';

import { useMemo, useState } from 'react';
import { createApiKeyAction, revokeApiKeyAction } from '@/app/dashboard/actions';

type ApiKeyEntry = {
  id: string;
  preview: string;
  createdAt: string | null;
};

type ApiKeysPanelProps = {
  initialKeys: ApiKeyEntry[];
};

function formatDate(value: string | null): string {
  if (!value) return 'Unknown';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Unknown';
  return date.toLocaleString();
}

export default function ApiKeysPanel({ initialKeys }: ApiKeysPanelProps) {
  const [keys, setKeys] = useState<ApiKeyEntry[]>(initialKeys);
  const [createPending, setCreatePending] = useState(false);
  const [revokePendingId, setRevokePendingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [revealedKey, setRevealedKey] = useState<string | null>(null);

  const hasKeys = useMemo(() => keys.length > 0, [keys]);

  async function handleGenerateKey() {
    setCreatePending(true);
    setError(null);

    const result = await createApiKeyAction();

    if (!result.ok || !result.keyId || !result.preview) {
      setError(result.error || 'Could not generate API key.');
      setCreatePending(false);
      return;
    }

    setKeys((current) => [
      {
        id: result.keyId!,
        preview: result.preview!,
        createdAt: result.createdAt ?? null,
      },
      ...current,
    ]);

    setRevealedKey(result.fullKey ?? null);
    setCreatePending(false);
  }

  async function handleRevokeKey(keyId: string) {
    setRevokePendingId(keyId);
    setError(null);

    const result = await revokeApiKeyAction(keyId);

    if (!result.ok) {
      setError(result.error || 'Could not revoke API key.');
      setRevokePendingId(null);
      return;
    }

    setKeys((current) => current.filter((entry) => entry.id !== keyId));
    setRevokePendingId(null);
  }

  return (
    <section
      style={{
        border: '1px solid var(--bg-border)',
        borderRadius: '12px',
        backgroundColor: 'var(--bg-surface)',
        padding: '20px',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '12px',
          flexWrap: 'wrap',
          marginBottom: '14px',
        }}
      >
        <div>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.25rem',
              marginBottom: '6px',
            }}
          >
            API Keys
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            Generate and revoke keys scoped by Row Level Security.
          </p>
        </div>

        <button
          type="button"
          onClick={handleGenerateKey}
          disabled={createPending}
          style={{
            border: '1px solid var(--accent-btc)',
            backgroundColor: createPending ? '#6f4b24' : 'var(--accent-btc)',
            color: 'var(--bg-void)',
            borderRadius: '999px',
            padding: '10px 14px',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            letterSpacing: '0.07em',
            cursor: createPending ? 'not-allowed' : 'pointer',
          }}
        >
          {createPending ? 'GENERATING...' : 'GENERATE KEY'}
        </button>
      </div>

      {error ? (
        <p style={{ color: 'var(--accent-red)', marginBottom: '10px', fontSize: '13px' }}>{error}</p>
      ) : null}

      {hasKeys ? (
        <ul style={{ listStyle: 'none', display: 'grid', gap: '10px' }}>
          {keys.map((entry) => (
            <li
              key={entry.id}
              style={{
                border: '1px solid var(--bg-border)',
                borderRadius: '10px',
                padding: '12px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '12px',
                flexWrap: 'wrap',
                backgroundColor: '#0b0b0b',
              }}
            >
              <div>
                <p
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '13px',
                    color: 'var(--text-primary)',
                    letterSpacing: '0.04em',
                    marginBottom: '4px',
                  }}
                >
                  {entry.preview}
                </p>
                <p style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>
                  Created: {formatDate(entry.createdAt)}
                </p>
              </div>

              <button
                type="button"
                disabled={revokePendingId === entry.id}
                onClick={() => handleRevokeKey(entry.id)}
                style={{
                  border: '1px solid #5a2020',
                  color: '#ffb4b4',
                  backgroundColor: '#2a0f0f',
                  borderRadius: '8px',
                  padding: '8px 10px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  letterSpacing: '0.07em',
                  cursor: revokePendingId === entry.id ? 'not-allowed' : 'pointer',
                }}
              >
                {revokePendingId === entry.id ? 'REVOKING...' : 'REVOKE'}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
          No keys yet. Generate your first key.
        </p>
      )}

      {revealedKey ? (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.72)',
            display: 'grid',
            placeItems: 'center',
            padding: '24px',
            zIndex: 70,
          }}
        >
          <div
            style={{
              width: 'min(640px, 100%)',
              border: '1px solid var(--bg-border)',
              backgroundColor: 'var(--bg-surface)',
              borderRadius: '12px',
              padding: '18px',
            }}
          >
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                color: 'var(--accent-btc)',
                letterSpacing: '0.1em',
                marginBottom: '8px',
              }}
            >
              REVEAL ONCE
            </p>
            <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: '8px' }}>
              Copy your full API key now
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '12px' }}>
              This is the only time the full key is displayed. Store it securely.
            </p>
            <code
              style={{
                display: 'block',
                fontFamily: 'var(--font-mono)',
                backgroundColor: '#0a0a0a',
                border: '1px solid var(--bg-border)',
                borderRadius: '8px',
                padding: '12px',
                color: 'var(--accent-sats)',
                overflowX: 'auto',
                marginBottom: '12px',
              }}
            >
              {revealedKey}
            </code>
            <button
              type="button"
              onClick={() => setRevealedKey(null)}
              style={{
                border: '1px solid var(--bg-border)',
                borderRadius: '8px',
                padding: '10px 12px',
                color: 'var(--text-primary)',
                backgroundColor: '#111',
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                letterSpacing: '0.05em',
              }}
            >
              CLOSE
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
