'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { createHash } from 'crypto';
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

function buildKeyPrefix(fullKey: string): string {
  return fullKey.slice(0, 7);
}

function hashApiKey(fullKey: string): string {
  return createHash('sha256').update(fullKey).digest('hex');
}

export async function createApiKeyAction(): Promise<CreateKeyResult> {
  try {
    const { supabase, user } = await getAuthenticatedClient();
    const fullKey = `SEK-B1-${crypto.randomUUID()}`;
    const keyPrefix = buildKeyPrefix(fullKey);
    const keyHash = hashApiKey(fullKey);

    const { data, error } = await supabase
      .from('api_keys')
      .insert({
        user_id: user.id,
        key_hash: keyHash,
        key_prefix: keyPrefix,
        name: 'Default',
        is_active: true,
      })
      .select('key_hash, created_at')
      .single();

    if (error || !data) {
      return {
        ok: false,
        error: error?.message || 'Failed to store API key.',
      };
    }

    revalidatePath('/dashboard');

    return {
      ok: true,
      keyId: data.key_hash,
      fullKey,
      preview: `${keyPrefix}****`,
      createdAt: data.created_at ?? null,
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
      .update({ is_active: false })
      .eq('key_hash', keyId)
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
