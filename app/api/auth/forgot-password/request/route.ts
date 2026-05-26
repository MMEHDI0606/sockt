import { NextResponse } from 'next/server';
import { createAdminClient } from '@/utils/supabase/admin';
import {
  generateOtpCode,
  getOtpExpirySeconds,
  getOtpRateLimitMax,
  hashValue,
  normalizeEmail,
  otpExpiryDate,
} from '@/utils/auth/passwordResetOtp';

const OTP_HASH_PEPPER = process.env.OTP_HASH_PEPPER || '';

function hashOtp(otp: string): string {
  return hashValue(`${otp}:${OTP_HASH_PEPPER}`);
}

async function sendOtpEmail(email: string, otpCode: string): Promise<boolean> {
  const emailApiKey = process.env.RESEND_API_KEY;
  const emailFrom = process.env.EMAIL_FROM;

  if (!emailApiKey || !emailFrom) {
    return false;
  }

  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.6">
      <h2>Sockt password reset code</h2>
      <p>Use this one-time code to reset your password:</p>
      <p style="font-size:28px;font-weight:700;letter-spacing:6px">${otpCode}</p>
      <p>This code expires in 10 minutes and can only be used once.</p>
    </div>
  `;

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${emailApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: emailFrom,
      to: [email],
      subject: 'Your Sockt password reset code',
      html,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to send OTP email');
  }

  return true;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const rawEmail = typeof body?.email === 'string' ? body.email : '';
    const email = normalizeEmail(rawEmail);

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }

    const admin = createAdminClient();
    const oneHourAgoIso = new Date(Date.now() - 60 * 60 * 1000).toISOString();

    const { count: requestCount, error: countError } = await admin
      .from('password_reset_otps')
      .select('id', { count: 'exact', head: true })
      .eq('email', email)
      .gte('created_at', oneHourAgoIso);

    if (countError) {
      return NextResponse.json({ error: 'Unable to process OTP request right now.' }, { status: 500 });
    }

    if ((requestCount || 0) >= getOtpRateLimitMax()) {
      return NextResponse.json(
        { error: 'Too many OTP requests. Please try again in an hour.', code: 'too_many_attempts' },
        { status: 429 }
      );
    }

    const otpCode = generateOtpCode();
    const expiresAt = otpExpiryDate();
    const otpHash = hashOtp(otpCode);
    const forwardedFor = request.headers.get('x-forwarded-for');
    const requestIp = forwardedFor ? forwardedFor.split(',')[0]?.trim() : null;
    const userAgent = request.headers.get('user-agent');

    const { error: insertError } = await admin.from('password_reset_otps').insert({
      email,
      otp_hash: otpHash,
      expires_at: expiresAt.toISOString(),
      request_ip: requestIp,
      user_agent: userAgent,
    });

    if (insertError) {
      return NextResponse.json({ error: 'Unable to create OTP request.' }, { status: 500 });
    }

    let emailDelivered = false;
    let deliveryWarning: string | null = null;

    try {
      emailDelivered = await sendOtpEmail(email, otpCode);
      if (!emailDelivered) {
        deliveryWarning = 'Email delivery is not configured. Use the development OTP shown after submit.';
      }
    } catch (error) {
      deliveryWarning = 'OTP was created, but the email could not be sent.';
      console.error('Failed to send password reset OTP email:', error);
    }

    const remaining = Math.max(0, getOtpRateLimitMax() - ((requestCount || 0) + 1));

    return NextResponse.json({
      ok: true,
      emailDelivered,
      warning: deliveryWarning,
      expiresAt: expiresAt.toISOString(),
      expirySeconds: getOtpExpirySeconds(),
      remainingRequestsThisHour: remaining,
      ...(process.env.NODE_ENV === 'production' ? {} : { devOtp: otpCode }),
    });
  } catch {
    return NextResponse.json({ error: 'Unexpected error while requesting OTP.' }, { status: 500 });
  }
}
