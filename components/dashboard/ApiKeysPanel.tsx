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
  return date.toLocaleDateString();
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
    <section className="rounded-xl border-[0.5px] border-[var(--dashboard-border)] bg-[var(--dashboard-card)] p-5">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="font-display text-xl text-[var(--dashboard-text)]">API Keys</h2>
        <button
          type="button"
          onClick={handleGenerateKey}
          disabled={createPending}
          className={`rounded-lg border-[0.5px] px-3 py-1.5 text-xs font-mono uppercase tracking-[0.12em] transition-all ${
            createPending
              ? 'cursor-not-allowed border-[var(--dashboard-border)] bg-[var(--dashboard-border)] text-[var(--dashboard-muted)]'
              : 'border-[var(--dashboard-accent)] bg-[var(--dashboard-accent)] text-[var(--dashboard-bg)] hover:opacity-90'
          }`}
        >
          {createPending ? 'Generating...' : 'Generate'}
        </button>
      </div>

      {error && (
        <p className="mb-4 text-xs text-[var(--accent-red)]">{error}</p>
      )}

      {hasKeys ? (
        <ul className="space-y-2.5">
          {keys.map((entry) => (
            <li
              key={entry.id}
              className="flex items-center justify-between rounded-lg border-[0.5px] border-[var(--dashboard-border)] bg-[var(--dashboard-bg)] px-3 py-3"
            >
              <div>
                <p className="mb-1 font-mono text-sm text-[var(--dashboard-text)]">{entry.preview}</p>
                <p className="text-[11px] text-[var(--dashboard-muted)]">Created {formatDate(entry.createdAt)}</p>
              </div>

              <button
                type="button"
                disabled={revokePendingId === entry.id}
                onClick={() => handleRevokeKey(entry.id)}
                className="rounded-md border-[0.5px] border-[var(--dashboard-border)] px-2.5 py-1 text-[10px] font-mono uppercase tracking-[0.12em] text-[var(--dashboard-muted)] hover:border-[var(--accent-red)] hover:text-[var(--accent-red)] disabled:opacity-50"
              >
                {revokePendingId === entry.id ? '...' : 'Revoke'}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div className="grid min-h-[250px] place-items-center rounded-lg border-[0.5px] border-[var(--dashboard-border)] bg-[var(--dashboard-bg)] text-center">
          <div>
            <div className="mx-auto mb-3 grid h-10 w-10 place-items-center rounded-full border-[0.5px] border-[var(--dashboard-border)] text-sm text-[var(--dashboard-muted)]">
              key
            </div>
            <p className="text-2xl font-display text-[var(--dashboard-text)]">No active API keys.</p>
            <p className="text-base text-[var(--dashboard-muted)]">Generate one to get started.</p>
          </div>
        </div>
      )}

      {revealedKey && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-[var(--dashboard-bg)]/80 p-6 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border-[0.5px] border-[var(--dashboard-border)] bg-[var(--dashboard-card)] p-8 shadow-2xl">
            <h3 className="mb-2 font-display text-xl text-[var(--dashboard-text)]">New API Key</h3>
            <p className="mb-6 text-sm text-[var(--dashboard-muted)]">
              Copy this key now. For security, it won't be shown again.
            </p>
            <div className="mb-8 rounded-xl border-[0.5px] border-[var(--dashboard-border)] bg-[var(--dashboard-bg)] p-4">
              <code className="block break-all font-mono text-xs font-semibold leading-relaxed text-[var(--dashboard-accent)]">
                {revealedKey}
              </code>
            </div>
            <button
              type="button"
              onClick={() => setRevealedKey(null)}
              className="w-full rounded-xl bg-[var(--dashboard-accent)] py-4 font-display text-sm text-[var(--dashboard-bg)] transition-colors hover:opacity-90"
            >
              I have saved the key
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
