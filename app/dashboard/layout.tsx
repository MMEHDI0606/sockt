import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import DashboardShell from '@/components/dashboard/DashboardShell';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // DEV: auth bypassed for local testing
  const { data: { user } } = await supabase.auth.getUser();
  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Dev User';
  const userEmail = user?.email || 'dev@local';

  return (
    <DashboardShell userName={displayName} userEmail={userEmail}>
      {children}
    </DashboardShell>
  );
}
