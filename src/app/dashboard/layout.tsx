import { createClient } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';
import { DashboardShell } from '@/components/Dashboard/DashboardShell';
import { Profile } from '@/types';

export const dynamic = 'force-dynamic';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const { data: { session } } = await supabase.auth.getSession();
  if (!session) redirect('/login?error=access_denied');

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single() as { data: Profile | null };

  if (!profile) {
    // Auto-create profile if missing
    const { data: newProfile } = await supabase
      .from('profiles')
      .insert({
        id: session.user.id,
        full_name: session.user.user_metadata?.full_name || 'User',
      })
      .select()
      .single();
    return <DashboardShell user={newProfile}>{children}</DashboardShell>;
  }

  return <DashboardShell user={profile}>{children}</DashboardShell>;
}