'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';

type ActionResult = {
  ok: boolean;
  error?: string;
};

type CreateKeyResult = ActionResult & {
  keyId?: string;
  fullKey?: string;
  preview?: string;
  createdAt?: string | null;
};

async function getAuthenticatedClient() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  return { supabase, user };
}

function maskKey(fullKey: string): string {
  return fullKey.startsWith('SEK-B1-') ? 'SEK-B1-****' : '****';
}

export async function createApiKeyAction(): Promise<CreateKeyResult> {
  try {
    const { supabase, user } = await getAuthenticatedClient();
    const fullKey = `SEK-B1-${crypto.randomUUID()}`;

    let keyRow: { id: string; created_at?: string | null } | null = null;

    // Try common column name first.
    {
      const { data, error } = await supabase
        .from('api_keys')
        .insert({ user_id: user.id, api_key: fullKey })
        .select('id, created_at')
        .single();

      if (!error && data) {
        keyRow = data as { id: string; created_at?: string | null };
      }
    }

    // Fallback for schemas using `key` instead of `api_key`.
    if (!keyRow) {
      const { data, error } = await supabase
        .from('api_keys')
        .insert({ user_id: user.id, key: fullKey })
        .select('id, created_at')
        .single();

      if (error || !data) {
        return {
          ok: false,
          error: error?.message || 'Failed to store API key.',
        };
      }

      keyRow = data as { id: string; created_at?: string | null };
    }

    revalidatePath('/dashboard');

    return {
      ok: true,
      keyId: keyRow.id,
      fullKey,
      preview: maskKey(fullKey),
      createdAt: keyRow.created_at ?? null,
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Unexpected error while creating API key.',
    };
  }
}

export async function revokeApiKeyAction(keyId: string): Promise<ActionResult> {
  try {
    if (!keyId) {
      return { ok: false, error: 'Key id is required.' };
    }

    const { supabase, user } = await getAuthenticatedClient();

    const { error } = await supabase
      .from('api_keys')
      .delete()
      .eq('id', keyId)
      .eq('user_id', user.id);

    if (error) {
      return { ok: false, error: error.message };
    }

    revalidatePath('/dashboard');
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Unexpected error while revoking key.',
    };
  }
}

export async function signOutAction() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  await supabase.auth.signOut();
  redirect('/');
}
