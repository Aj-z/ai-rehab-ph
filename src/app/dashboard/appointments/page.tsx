import { createClient } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';
import { AppointmentCalendar } from '@/components/Dashboard/AppointmentCalendar';
import { Profile } from '@/types';

export const dynamic = 'force-dynamic';

export default async function AppointmentsPage() {
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
    <div className="p-6">
      <AppointmentCalendar userId={session.user.id} />
    </div>
  );
}