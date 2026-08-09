import { redirect } from 'next/navigation';

export default async function InstallSlackPage({
  searchParams,
}: {
  searchParams: Promise<{ [k: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;
  const teamId = typeof sp.team_id === 'string' ? sp.team_id : undefined;
  const params = new URLSearchParams({ success: '1' });
  if (teamId) params.set('team_id', teamId);
  redirect(`/dashboard/configure/slack?${params.toString()}`);
}