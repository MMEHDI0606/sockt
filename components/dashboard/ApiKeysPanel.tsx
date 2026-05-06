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
    <section className="border border-[var(--bg-border)] rounded-xl bg-[var(--bg-surface)] p-6 flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-display text-white">API Keys</h2>
        <button
          type="button"
          onClick={handleGenerateKey}
          disabled={createPending}
          className={`px-4 py-2 rounded-lg text-xs font-mono tracking-wider transition-all ${
            createPending
              ? 'bg-[#6f4b24] cursor-not-allowed'
              : 'bg-[var(--accent-btc)] text-black hover:opacity-90'
          }`}
        >
          {createPending ? 'GENERATING...' : 'GENERATE KEY'}
        </button>
      </div>

      {error && (
        <p className="text-[var(--accent-red)] text-xs mb-4">{error}</p>
      )}

      <div className="flex-1 overflow-auto">
        {hasKeys ? (
          <ul className="space-y-3">
            {keys.map((entry) => (
              <li
                key={entry.id}
                className="flex items-center justify-between p-4 rounded-lg bg-black border border-[var(--bg-border)]"
              >
                <div>
                  <p className="font-mono text-sm text-[var(--text-primary)] mb-1">
                    {entry.preview}
                  </p>
                  <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-tight">
                    Created {formatDate(entry.createdAt)}
                  </p>
                </div>

                <button
                  type="button"
                  disabled={revokePendingId === entry.id}
                  onClick={() => handleRevokeKey(entry.id)}
                  className="px-3 py-1.5 rounded-md text-[10px] font-mono tracking-wider border border-red-900/50 bg-red-950/20 text-red-400 hover:bg-red-950/40 transition-colors disabled:opacity-50"
                >
                  {revokePendingId === entry.id ? '...' : 'REVOKE'}
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-[var(--text-secondary)] text-center py-8">
            No active API keys found.
          </p>
        )}
      </div>

      {revealedKey && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 grid place-items-center p-6">
          <div className="w-full max-w-lg bg-[var(--bg-surface)] border border-[var(--bg-border)] rounded-2xl p-8 shadow-2xl">
            <h3 className="text-xl font-display text-white mb-2">New API Key</h3>
            <p className="text-sm text-[var(--text-secondary)] mb-6">
              Copy this key now. For security, it won't be shown again.
            </p>
            <div className="bg-black border border-[var(--bg-border)] rounded-xl p-4 mb-8">
              <code className="block font-mono text-xs text-[var(--accent-sats)] break-all leading-relaxed font-semibold">
                {revealedKey}
              </code>
            </div>
            <button
              type="button"
              onClick={() => setRevealedKey(null)}
              className="w-full py-4 bg-white text-black rounded-xl font-display text-sm hover:bg-neutral-200 transition-colors"
            >
              I have saved the key
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
