import { createClient } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';
import { ExerciseStreak } from '@/components/Dashboard/ExerciseStreak';
import { MediaPipeSquatCounter } from '@/components/Dashboard/MediaPipeSquatCounter';
import { DashboardShell } from '@/components/Dashboard/DashboardShell';
import { Profile } from '@/types';

export const dynamic = 'force-dynamic';

export default async function ExercisesPage() {
  const supabase = await createClient();

  const { data: { session } } = await supabase.auth.getSession();
  if (!session) redirect('/login?error=access_denied');

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single() as { data: Profile | null };

  if (!profile) redirect('/login?error=profile_not_found');

  return (
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* ExerciseStreak now has built-in CRUD */}
          <ExerciseStreak userId={session.user.id} />
          <MediaPipeSquatCounter userId={session.user.id} />
        </div>
      </div>
  );
}