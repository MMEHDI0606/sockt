create table if not exists public.password_reset_otps (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  otp_hash text not null,
  expires_at timestamptz not null,
  used_at timestamptz,
  created_at timestamptz not null default now(),
  attempts integer not null default 0,
  request_ip text,
  user_agent text,
  reset_token_hash text,
  reset_expires_at timestamptz,
  reset_used_at timestamptz
);

create index if not exists password_reset_otps_email_created_idx
  on public.password_reset_otps (email, created_at desc);

create index if not exists password_reset_otps_email_otp_idx
  on public.password_reset_otps (email, otp_hash);

alter table public.password_reset_otps enable row level security;

-- No direct client access; API routes use service role key.
create policy if not exists "deny_all_password_reset_otps"
  on public.password_reset_otps
  for all
  using (false)
  with check (false);
