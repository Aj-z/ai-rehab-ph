// app/dashboard/layout.tsx
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

  // ✅ SECURE: Use getUser() instead of getSession()
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    redirect('/login?error=access_denied');
  }

  // Try to get existing profile
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single() as { data: Profile | null; error: any };

  // Profile doesn't exist - create it
  if (profileError?.code === 'PGRST116') {
    const { data: newProfile, error: createError } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
        created_at: new Date().toISOString(),
      })
      .select()
      .single() as { data: Profile | null; error: any };

    if (createError) {
      console.error('Profile creation failed:', createError);
      redirect('/login?error=profile_creation_failed');
    }

    return <DashboardShell user={newProfile}>{children}</DashboardShell>;
  }

  // Other profile errors
  if (profileError) {
    console.error('Profile fetch error:', profileError);
    redirect('/login?error=profile_fetch_failed');
  }

  return <DashboardShell user={profile}>{children}</DashboardShell>;
}