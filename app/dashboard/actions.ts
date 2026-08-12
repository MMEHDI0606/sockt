'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';

type ActionResult = {
  ok: boolean;
  error?: string;
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

    const { error: profileError } = await supabase
      .from('users')
      .delete()
      .eq('id', user.id);

    if (profileError) {
      return { ok: false, error: `Failed to delete profile: ${profileError.message}` };
    }

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