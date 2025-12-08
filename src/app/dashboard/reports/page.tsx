import { createClient } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';
import { GenerateReportButton } from '@/components/Dashboard/GenerateReportButton';
import { AIAnalysisChat } from '@/components/Dashboard/AIAnalysisChat';
import { DashboardShell } from '@/components/Dashboard/DashboardShell';
import { Profile } from '@/types';

export const dynamic = 'force-dynamic';

export default async function ReportsPage() {
  const supabase = await createClient();

  const { data: { session } } = await supabase.auth.getSession();
  if (!session) redirect('/login?error=access_denied');

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single() as { data: Profile | null };

  if (!profile) redirect('/login?error=profile_not_found');

  // Fetch all data for AI analysis
  const [
    { data: dailyLogs },
    { data: exerciseSessions },
    { data: injuries },
    { data: appointments },
  ] = await Promise.all([
    supabase.from('daily_logs').select('*').eq('user_id', session.user.id).order('logged_at', { ascending: true }),
    supabase.from('exercise_sessions').select('*').eq('user_id', session.user.id).order('session_date', { ascending: true }),
    supabase.from('injuries').select('*').eq('user_id', session.user.id).order('created_at', { ascending: true }),
    supabase.from('appointments').select('*').eq('user_id', session.user.id).order('appointment_date', { ascending: true })
  ]);

  const analysisData = {
    dailyLogs,
    exerciseSessions,
    injuries,
    appointments,
    profile,
  };

  return (
      <div className="p-6 space-y-6">
        {/* PDF Generation Section */}
        <div className="glass-card rounded-2xl p-6 border border-teal-100 shadow-lg">
          <div className="flex flex-col items-center justify-center min-h-64">
            <div className="w-16 h-16 bg-gradient-to-r from-teal-600 to-teal-700 rounded-2xl flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Generate Medical Report</h2>
            <p className="text-gray-600 text-center mb-8 max-w-md">
              Download a comprehensive PDF report of your rehabilitation progress.
            </p>
            <GenerateReportButton userId={session.user.id} userName={profile.full_name} />
          </div>
        </div>

        {/* AI Analysis Chat */}
        <div className="glass-card rounded-2xl p-6 border border-teal-100 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900">AI Medical Assistant</h2>
            <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full">BETA</span>
          </div>
          <AIAnalysisChat data={analysisData} />
        </div>
      </div>
  );
}