import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { DashboardContent } from '@/components/Dashboard/DashboardContent'

export default async function DashboardPage() {
  const supabase = await createClient() // ✅ Await client creation

  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect('/login?error=access_denied')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single()

  if (!profile) {
    const { data: newProfile } = await supabase
      .from('profiles')
      .insert({
        id: session.user.id,
        full_name: session.user.user_metadata?.full_name || 'User',
      })
      .select()
      .single()
    if (!newProfile) {
      // Handle insert failure, e.g., redirect or show error
      redirect('/login?error=profile_creation_failed')
    }
    return <DashboardContent user={newProfile as any} />
  }

  return <DashboardContent user={profile as any} />
}