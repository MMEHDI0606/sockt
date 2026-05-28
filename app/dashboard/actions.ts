'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { createHash } from 'crypto';
import { createClient } from '@/utils/supabase/server';
import { Polar } from '@polar-sh/sdk';

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
    const fullKey = `sockt_live_${crypto.randomUUID()}`;
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
      error: error instanceof Error ? error.message : 'Unexpected error while revoking API key.',
    };
  }
}

export async function createTopupCheckoutAction() {
  const { user } = await getAuthenticatedClient();

  if (!process.env.POLAR_ACCESS_TOKEN) {
    throw new Error('Missing POLAR_ACCESS_TOKEN');
  }
  
  if (!process.env.POLAR_TOPUP_PRODUCT_ID) {
    throw new Error('Missing POLAR_TOPUP_PRODUCT_ID');
  }

  const polar = new Polar({
    accessToken: process.env.POLAR_ACCESS_TOKEN
  });

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  const checkout = await polar.checkouts.create({
    products: [process.env.POLAR_TOPUP_PRODUCT_ID],
    successUrl: `${baseUrl}/dashboard?status=success&checkout_id={CHECKOUT_ID}`,
    metadata: {
      userId: user.id,
    },
    customerEmail: user.email,
  });

  if (checkout.url) {
    redirect(checkout.url);
  } else {
    throw new Error('Failed to create Polar checkout session.');
  }
}

export async function signOutAction() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  await supabase.auth.signOut();
  redirect('/');
}

export async function updateNameAction(newName: string): Promise<ActionResult> {
  try {
    if (!newName || !newName.trim()) {
      return { ok: false, error: 'Name cannot be empty.' };
    }
    const { supabase } = await getAuthenticatedClient();
    const { error } = await supabase.auth.updateUser({
      data: { full_name: newName.trim() },
    });
    if (error) {
      return { ok: false, error: error.message };
    }
    revalidatePath('/dashboard/account');
    revalidatePath('/dashboard');
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Failed to update name.',
    };
  }
}

export async function updatePasswordAction(password: string): Promise<ActionResult> {
  try {
    if (!password || password.length < 8) {
      return { ok: false, error: 'Password must be at least 8 characters long.' };
    }
    const { supabase } = await getAuthenticatedClient();
    const { error } = await supabase.auth.updateUser({
      password: password,
    });
    if (error) {
      return { ok: false, error: error.message };
    }
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Failed to update password.',
    };
  }
}

export async function deleteAccountAction(): Promise<ActionResult> {
  let success = false;
  try {
    const { supabase, user } = await getAuthenticatedClient();
    
    // 1. Delete user API keys
    const { error: apiKeysError } = await supabase
      .from('api_keys')
      .delete()
      .eq('user_id', user.id);

    if (apiKeysError) {
      return { ok: false, error: `Failed to delete API keys: ${apiKeysError.message}` };
    }

    // 2. Delete user profile row
    const { error: profileError } = await supabase
      .from('users')
      .delete()
      .eq('id', user.id);

    if (profileError) {
      return { ok: false, error: `Failed to delete profile: ${profileError.message}` };
    }

    // 3. Sign out user session
    await supabase.auth.signOut();
    success = true;
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Failed to delete account.',
    };
  }

  if (success) {
    redirect('/');
  }
  return { ok: true };
}
