'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  updateNameAction,
  updatePasswordAction,
  deleteAccountAction,
} from '@/app/dashboard/actions';

type AccountSettingsFormProps = {
  initialDisplayName: string;
  initialEmail: string;
  userId: string;
  balanceUsd?: number;
};

export default function AccountSettingsForm({
  initialDisplayName,
  initialEmail,
  userId,
  balanceUsd,
}: AccountSettingsFormProps) {
  const router = useRouter();

  // Name States
  const [displayName, setDisplayName] = useState(initialDisplayName);
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(initialDisplayName);
  const [namePending, setNamePending] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);
  const [nameSuccess, setNameSuccess] = useState(false);

  // Password States
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordPending, setPasswordPending] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  // Delete Account States
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [deletePending, setDeletePending] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Handle name update
  async function handleUpdateName(e: React.FormEvent) {
    e.preventDefault();
    if (!nameInput.trim()) {
      setNameError('Name cannot be empty.');
      return;
    }

    setNamePending(true);
    setNameError(null);
    setNameSuccess(false);

    const result = await updateNameAction(nameInput);
    if (!result.ok) {
      setNameError(result.error || 'Failed to update name.');
      setNamePending(false);
    } else {
      setDisplayName(nameInput.trim());
      setIsEditingName(false);
      setNamePending(false);
      setNameSuccess(true);
      setTimeout(() => setNameSuccess(false), 3000);
      router.refresh();
    }
  }

  // Handle password update
  async function handleUpdatePassword(e: React.FormEvent) {
    e.preventDefault();
    if (!password) {
      setPasswordError('New password is required.');
      return;
    }
    if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match.');
      return;
    }

    setPasswordPending(true);
    setPasswordError(null);
    setPasswordSuccess(false);

    const result = await updatePasswordAction(password);
    if (!result.ok) {
      setPasswordError(result.error || 'Failed to update password.');
      setPasswordPending(false);
    } else {
      setPassword('');
      setConfirmPassword('');
      setPasswordPending(false);
      setPasswordSuccess(true);
      setTimeout(() => setPasswordSuccess(false), 3000);
    }
  }

  // Handle account deletion
  async function handleDeleteAccount(e: React.FormEvent) {
    e.preventDefault();
    if (deleteConfirmation.trim().toLowerCase() !== 'delete my account') {
      setDeleteError('Please type "delete my account" to confirm.');
      return;
    }

    setDeletePending(true);
    setDeleteError(null);

    const result = await deleteAccountAction();
    if (!result.ok) {
      setDeleteError(result.error || 'Failed to delete account.');
      setDeletePending(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Card 1: Profile & Name Edit */}
      <section className="rounded-xl border-[0.5px] border-[var(--dashboard-border)] bg-[var(--dashboard-card)] p-6 flex flex-col justify-between">
        <div>
          <div className="mb-4 flex items-center justify-between">
            <span className="font-mono text-xs uppercase tracking-[0.15em] text-[var(--dashboard-muted)]">
              Profile Details
            </span>
            <span className="flex items-center gap-1.5 font-mono text-[10px] text-[var(--dashboard-accent)] uppercase tracking-[0.1em]">
              <span className="h-2 w-2 rounded-full bg-[var(--dashboard-accent)] animate-pulse" />
              Verified Session
            </span>
          </div>

          <div className="mt-6 space-y-5">
            {/* Name update section */}
            <div>
              <label className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--dashboard-muted)] block mb-1">
                Name
              </label>
              {isEditingName ? (
                <form onSubmit={handleUpdateName} className="flex gap-2 mt-1">
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    disabled={namePending}
                    required
                    className="flex-1 bg-[var(--dashboard-bg)] border-[0.5px] border-[var(--dashboard-border)] rounded-lg text-sm text-[var(--dashboard-text)] px-3 py-1.5 focus:outline-none focus:border-[var(--dashboard-accent)] disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={namePending}
                    className="rounded-lg bg-[var(--dashboard-accent)] px-3 py-1.5 text-xs font-mono uppercase tracking-[0.1em] font-semibold text-[var(--dashboard-bg)] hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {namePending ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditingName(false);
                      setNameInput(displayName);
                      setNameError(null);
                    }}
                    disabled={namePending}
                    className="rounded-lg border-[0.5px] border-[var(--dashboard-border)] px-3 py-1.5 text-xs font-mono uppercase tracking-[0.1em] text-[var(--dashboard-text)] hover:border-[var(--dashboard-accent)] hover:text-[var(--dashboard-accent)] transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </form>
              ) : (
                <div className="flex items-center justify-between mt-1">
                  <span className="text-sm font-semibold text-[var(--dashboard-text)]">{displayName}</span>
                  <button
                    type="button"
                    onClick={() => setIsEditingName(true)}
                    className="rounded-lg border-[0.5px] border-[var(--dashboard-border)] px-2.5 py-1 text-[10px] font-mono uppercase tracking-[0.1em] text-[var(--dashboard-text)] hover:border-[var(--dashboard-accent)] hover:text-[var(--dashboard-accent)] transition-colors"
                  >
                    Edit
                  </button>
                </div>
              )}
              {nameError && <p className="mt-1 text-xs text-[var(--accent-red)]">{nameError}</p>}
              {nameSuccess && <p className="mt-1 text-xs text-[var(--accent-green)]">Name updated successfully.</p>}
            </div>

            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--dashboard-muted)] block">Email</span>
              <span className="text-sm font-semibold text-[var(--dashboard-text)] block mt-1">{initialEmail}</span>
            </div>

            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--dashboard-muted)] block">User ID</span>
              <span className="break-all font-mono text-xs text-[var(--dashboard-muted)] block mt-1">{userId}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Card 2: Password Edit & Security */}
      <section className="rounded-xl border-[0.5px] border-[var(--dashboard-border)] bg-[var(--dashboard-card)] p-6 flex flex-col justify-between">
        <div>
          <div className="mb-4 flex items-center justify-between">
            <span className="font-mono text-xs uppercase tracking-[0.15em] text-[var(--dashboard-muted)]">
              Account Security
            </span>
            <span className="flex items-center gap-1.5 font-mono text-[10px] text-[var(--accent-green)] uppercase tracking-[0.1em]">
              <span className="h-2 w-2 rounded-full bg-[var(--accent-green)]" />
              Secured
            </span>
          </div>

          <form onSubmit={handleUpdatePassword} className="space-y-4 mt-6">
            <h3 className="font-display text-sm font-semibold text-[var(--dashboard-text)] uppercase tracking-wider mb-2">
              Update Password
            </h3>
            <div className="grid gap-2">
              <label className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--dashboard-muted)]">
                New Password
              </label>
              <input
                type="password"
                placeholder="Min. 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={passwordPending}
                required
                className="w-full bg-[var(--dashboard-bg)] border-[0.5px] border-[var(--dashboard-border)] rounded-lg text-sm text-[var(--dashboard-text)] px-3 py-2 focus:outline-none focus:border-[var(--dashboard-accent)] disabled:opacity-50"
              />
            </div>

            <div className="grid gap-2">
              <label className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--dashboard-muted)]">
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={passwordPending}
                required
                className="w-full bg-[var(--dashboard-bg)] border-[0.5px] border-[var(--dashboard-border)] rounded-lg text-sm text-[var(--dashboard-text)] px-3 py-2 focus:outline-none focus:border-[var(--dashboard-accent)] disabled:opacity-50"
              />
            </div>

            {passwordError && <p className="text-xs text-[var(--accent-red)]">{passwordError}</p>}
            {passwordSuccess && <p className="text-xs text-[var(--accent-green)]">Password updated successfully.</p>}

            <div className="pt-2">
              <button
                type="submit"
                disabled={passwordPending}
                className="rounded-lg bg-[var(--dashboard-accent)] px-4 py-2 text-xs font-mono uppercase tracking-[0.12em] font-semibold text-[var(--dashboard-bg)] hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {passwordPending ? 'Updating...' : 'Update password'}
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Card 3: Danger Zone / Delete Account */}
      <section className="rounded-xl border-[0.5px] border-[var(--accent-red)]/30 bg-[var(--dashboard-card)] p-6 lg:col-span-2 flex flex-col justify-between">
        <div>
          <div className="mb-4 flex items-center justify-between">
            <span className="font-mono text-xs uppercase tracking-[0.15em] text-[var(--accent-red)] font-semibold">
              Danger Zone
            </span>
            <span className="flex items-center gap-1.5 font-mono text-[10px] text-[var(--accent-red)] uppercase tracking-[0.1em]">
              <span className="h-2 w-2 rounded-full bg-[var(--accent-red)] animate-pulse" />
              Destructive
            </span>
          </div>

          <div className="space-y-4 mt-6">
            <h3 className="font-display text-base font-semibold text-[var(--dashboard-text)]">
              Delete Workspace & Account
            </h3>
            <p className="text-xs leading-relaxed text-[var(--dashboard-muted)] max-w-xl">
              This action is permanent and irreversible. Once you delete your account, all active sandboxed agents, API keys, and logs will be permanently destroyed.
            </p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t-[0.5px] border-[var(--dashboard-border)] flex items-center justify-between">
          <span className="font-mono text-[10px] text-[var(--dashboard-muted)]">
            Account purge cannot be undone
          </span>
          <button
            type="button"
            onClick={() => setIsDeleteModalOpen(true)}
            className="rounded-lg border-[0.5px] border-[var(--accent-red)]/50 px-4 py-2 text-xs font-mono uppercase tracking-[0.12em] font-semibold text-[var(--accent-red)] hover:bg-[var(--accent-red)]/10 hover:border-[var(--accent-red)] transition-all"
          >
            Delete Account
          </button>
        </div>
      </section>

      {/* Irreversible Purge Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-[var(--dashboard-bg)]/85 p-4 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-2xl border-[0.5px] border-[var(--accent-red)]/40 bg-[var(--dashboard-card)] p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <h3 className="font-display text-xl text-[var(--dashboard-text)] flex items-center gap-2">
              <span className="text-[var(--accent-red)] font-semibold">⚠️</span> Confirm Account Purge
            </h3>
            <p className="mt-4 text-xs leading-relaxed text-[var(--dashboard-muted)]">
              This is a final warning. You are about to permanently delete your account and all associated data.
            </p>

            <form onSubmit={handleDeleteAccount} className="space-y-5 mt-6">
              <div className="grid gap-2">
                <label className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--dashboard-muted)]">
                  To confirm, type <span className="font-mono font-semibold text-[var(--dashboard-text)]">delete my account</span> below:
                </label>
                <input
                  type="text"
                  placeholder="delete my account"
                  value={deleteConfirmation}
                  onChange={(e) => setDeleteConfirmation(e.target.value)}
                  disabled={deletePending}
                  required
                  className="w-full bg-[var(--dashboard-bg)] border-[0.5px] border-[var(--accent-red)]/30 rounded-lg text-sm text-[var(--dashboard-text)] px-3 py-2.5 focus:outline-none focus:border-[var(--accent-red)] disabled:opacity-50"
                />
              </div>

              {deleteError && <p className="text-xs text-[var(--accent-red)]">{deleteError}</p>}

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={deletePending || deleteConfirmation.trim().toLowerCase() !== 'delete my account'}
                  className="flex-1 rounded-lg bg-[var(--accent-red)] py-3 text-xs font-mono uppercase tracking-[0.12em] font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {deletePending ? 'Purging Account...' : 'I understand, delete account'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsDeleteModalOpen(false);
                    setDeleteConfirmation('');
                    setDeleteError(null);
                  }}
                  disabled={deletePending}
                  className="rounded-lg border-[0.5px] border-[var(--dashboard-border)] px-5 py-3 text-xs font-mono uppercase tracking-[0.12em] text-[var(--dashboard-text)] hover:border-[var(--dashboard-accent)] transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
