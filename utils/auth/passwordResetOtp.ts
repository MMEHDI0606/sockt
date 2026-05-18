import { createHash, randomInt, randomUUID } from 'crypto';

const OTP_EXPIRY_MINUTES = 10;
const OTP_MAX_PER_HOUR = 3;

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function hashValue(value: string): string {
  return createHash('sha256').update(value).digest('hex');
}

export function generateOtpCode(): string {
  return String(randomInt(0, 1_000_000)).padStart(6, '0');
}

export function generateResetToken(): string {
  return randomUUID().replace(/-/g, '');
}

export function otpExpiryDate(): Date {
  return new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);
}

export function resetTokenExpiryDate(): Date {
  return new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);
}

export function getOtpExpirySeconds(): number {
  return OTP_EXPIRY_MINUTES * 60;
}

export function getOtpRateLimitMax(): number {
  return OTP_MAX_PER_HOUR;
}
