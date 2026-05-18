import { NextResponse } from 'next/server';
import { createAdminClient } from '@/utils/supabase/admin';
import {
  generateResetToken,
  hashValue,
  normalizeEmail,
  resetTokenExpiryDate,
} from '@/utils/auth/passwordResetOtp';

const OTP_HASH_PEPPER = process.env.OTP_HASH_PEPPER || '';
const RESET_TOKEN_PEPPER = process.env.RESET_TOKEN_PEPPER || '';

function hashOtp(otp: string): string {
  return hashValue(`${otp}:${OTP_HASH_PEPPER}`);
}

function hashResetToken(token: string): string {
  return hashValue(`${token}:${RESET_TOKEN_PEPPER}`);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = normalizeEmail(typeof body?.email === 'string' ? body.email : '');
    const otp = typeof body?.otp === 'string' ? body.otp.trim() : '';

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }

    if (!/^\d{6}$/.test(otp)) {
      return NextResponse.json({ error: 'OTP must be a 6-digit numeric code.', code: 'invalid_otp' }, { status: 400 });
    }

    const nowIso = new Date().toISOString();
    const resetToken = generateResetToken();
    const resetTokenHash = hashResetToken(resetToken);
    const resetExpiresAt = resetTokenExpiryDate().toISOString();

    const admin = createAdminClient();

    const { data, error } = await admin
      .from('password_reset_otps')
      .update({
        used_at: nowIso,
        reset_token_hash: resetTokenHash,
        reset_expires_at: resetExpiresAt,
      })
      .eq('email', email)
      .eq('otp_hash', hashOtp(otp))
      .is('used_at', null)
      .gt('expires_at', nowIso)
      .select('id')
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: 'Unable to verify OTP right now.' }, { status: 500 });
    }

    if (!data) {
      const { data: latest } = await admin
        .from('password_reset_otps')
        .select('id, expires_at, used_at, attempts')
        .eq('email', email)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (latest?.id && !latest.used_at) {
        await admin
          .from('password_reset_otps')
          .update({ attempts: (latest.attempts || 0) + 1 })
          .eq('id', latest.id);
      }

      if (latest?.expires_at && new Date(latest.expires_at).getTime() < Date.now()) {
        return NextResponse.json({ error: 'This OTP has expired. Request a new code.', code: 'expired_otp' }, { status: 400 });
      }

      return NextResponse.json({ error: 'Invalid OTP code.', code: 'invalid_otp' }, { status: 400 });
    }

    return NextResponse.json({
      ok: true,
      resetToken,
      resetExpiresAt,
    });
  } catch {
    return NextResponse.json({ error: 'Unexpected error while verifying OTP.' }, { status: 500 });
  }
}
