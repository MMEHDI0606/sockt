import { NextResponse } from 'next/server';
import { createAdminClient } from '@/utils/supabase/admin';
import { hashValue, normalizeEmail } from '@/utils/auth/passwordResetOtp';

const RESET_TOKEN_PEPPER = process.env.RESET_TOKEN_PEPPER || '';

function hashResetToken(token: string): string {
  return hashValue(`${token}:${RESET_TOKEN_PEPPER}`);
}

async function findUserIdByEmail(email: string): Promise<string | null> {
  const admin = createAdminClient();
  let page = 1;

  while (page <= 20) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 1000 });
    if (error) return null;

    const found = data.users.find((user) => user.email?.toLowerCase() === email);
    if (found?.id) return found.id;

    if (!data.users.length) break;
    page += 1;
  }

  return null;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = normalizeEmail(typeof body?.email === 'string' ? body.email : '');
    const resetToken = typeof body?.resetToken === 'string' ? body.resetToken.trim() : '';
    const password = typeof body?.password === 'string' ? body.password : '';

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }

    if (!resetToken) {
      return NextResponse.json({ error: 'Reset token is required.' }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters long.' }, { status: 400 });
    }

    const admin = createAdminClient();
    const nowIso = new Date().toISOString();

    const { data: tokenRow, error: tokenError } = await admin
      .from('password_reset_otps')
      .update({ reset_used_at: nowIso })
      .eq('email', email)
      .eq('reset_token_hash', hashResetToken(resetToken))
      .is('reset_used_at', null)
      .gt('reset_expires_at', nowIso)
      .select('id')
      .maybeSingle();

    if (tokenError) {
      return NextResponse.json({ error: 'Unable to reset password right now.' }, { status: 500 });
    }

    if (!tokenRow) {
      return NextResponse.json({ error: 'Reset token is invalid or expired.', code: 'invalid_or_expired' }, { status: 400 });
    }

    const userId = await findUserIdByEmail(email);
    if (!userId) {
      return NextResponse.json({ error: 'No account found for this email.' }, { status: 404 });
    }

    const { error: updateError } = await admin.auth.admin.updateUserById(userId, { password });

    if (updateError) {
      return NextResponse.json({ error: 'Failed to update password.' }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Unexpected error while resetting password.' }, { status: 500 });
  }
}
