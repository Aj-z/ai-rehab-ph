'use client';

import { useState } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { Download, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase-client';
import { useSupabase } from '@/lib/supabase-context'; //

interface Props {
  userId: string;
  userName?: string;
}

export function GenerateReportButton({ userId, userName = 'Patient' }: Props) {
  const supabase = useSupabase();
  const [isGenerating, setIsGenerating] = useState(false);

  const generateReport = async () => {
    setIsGenerating(true);
    try {
      // Fetch all data
      const [
        { data: dailyLogs },
        { data: exerciseSessions },
        { data: injuries },
        { data: appointments },
        { data: profile }
      ] = await Promise.all([
        supabase.from('daily_logs').select('*').eq('user_id', userId).order('logged_at', { ascending: true }),
        supabase.from('exercise_sessions').select('*').eq('user_id', userId).order('session_date', { ascending: true }),
        supabase.from('injuries').select('*').eq('user_id', userId).order('created_at', { ascending: true }),
        supabase.from('appointments').select('*').eq('user_id', userId).order('appointment_date', { ascending: true }),
        supabase.from('profiles').select('*').eq('id', userId).single()
      ]);

      // Create PDF
      const doc = new jsPDF('p', 'mm', 'a4');
      
      // Colors
      const medicalTeal = '#0891b2';
      const softSage = '#84cc16';
      const warmGray = '#6b7280';
      const deepNavy = '#1e293b';
      const lightTeal = '#f0fdfa';

      // Title Page
      doc.setFillColor(medicalTeal);
      doc.rect(0, 0, 210, 40, 'F');
      
      doc.setTextColor('#ffffff');
      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      doc.text('AI Rehab PH', 105, 25, { align: 'center' });
      
      doc.setFontSize(16);
      doc.setFont('helvetica', 'normal');
      doc.text('Rehabilitation Progress Report', 105, 35, { align: 'center' });
      
      // Patient Info
      doc.setTextColor(deepNavy);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Patient Information', 20, 60);
      
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(warmGray);
      doc.text(`Name: ${profile?.full_name || userName}`, 20, 70);
      doc.text(`Medical Record: ${profile?.medical_record_number || 'N/A'}`, 20, 78);
      doc.text(`Date Generated: ${new Date().toLocaleDateString()}`, 20, 86);

      // Executive Summary
      doc.setTextColor(deepNavy);
      doc.setFont('helvetica', 'bold');
      doc.text('Executive Summary', 20, 105);
      
      doc.setDrawColor(medicalTeal);
      doc.setLineWidth(0.5);
      doc.line(20, 108, 190, 108);

      const summary = {
        totalPainLogs: dailyLogs?.length || 0,
        totalExerciseSessions: exerciseSessions?.length || 0,
        activeInjuries: injuries?.filter(i => i.status === 'active').length || 0,
        upcomingAppointments: appointments?.filter(a => new Date(a.appointment_date) > new Date()).length || 0,
        exerciseStreak: calculateStreak(exerciseSessions || [])
      };

      doc.setTextColor(warmGray);
      doc.setFont('helvetica', 'normal');
      doc.text(`Total Pain Logs: ${summary.totalPainLogs}`, 20, 118);
      doc.text(`Exercise Sessions: ${summary.totalExerciseSessions}`, 20, 126);
      doc.text(`Active Injuries: ${summary.activeInjuries}`, 20, 134);
      doc.text(`Upcoming Appointments: ${summary.upcomingAppointments}`, 20, 142);
      doc.text(`Current Streak: ${summary.exerciseStreak} days`, 20, 150);

      // Pain Trend
      doc.setTextColor(deepNavy);
      doc.setFont('helvetica', 'bold');
      doc.text('Pain Trend (Last 7 Days)', 20, 170);
      doc.line(20, 173, 190, 173);

      doc.setTextColor(warmGray);
      doc.setFontSize(10);
      const recentLogs = dailyLogs?.slice(-7) || [];
      recentLogs.forEach((log, index) => {
        const y = 183 + (index * 8);
        const date = new Date(log.logged_at).toLocaleDateString();
        doc.text(`• ${date}: ${log.pain_level}/10`, 20, y);
      });

      // Active Injuries
      if (summary.activeInjuries > 0) {
        doc.addPage();
        doc.setTextColor(deepNavy);
        doc.setFont('helvetica', 'bold');
        doc.text('Active Injuries', 20, 30);
        doc.line(20, 33, 190, 33);

        doc.setTextColor(warmGray);
        doc.setFontSize(10);
        injuries?.filter(i => i.status === 'active').forEach((injury, index) => {
          const y = 45 + (index * 25);
          doc.setFont('helvetica', 'bold');
          doc.text(`${injury.injury_type} (Severity: ${injury.severity}/10)`, 20, y);
          doc.setFont('helvetica', 'normal');
          doc.text(`Body Part: ${injury.body_part || 'N/A'}`, 20, y + 8);
          doc.text(`Description: ${injury.description}`, 20, y + 16);
          doc.text(`Status: ${injury.status}`, 20, y + 24);
        });
      }

      // Upcoming Appointments
      if (summary.upcomingAppointments > 0) {
        doc.addPage();
        doc.setTextColor(deepNavy);
        doc.setFont('helvetica', 'bold');
        doc.text('Upcoming Appointments', 20, 30);
        doc.line(20, 33, 190, 33);

        doc.setTextColor(warmGray);
        doc.setFontSize(10);
        appointments?.filter(a => new Date(a.appointment_date) > new Date()).forEach((apt, index) => {
          const y = 45 + (index * 20);
          doc.setFont('helvetica', 'bold');
          doc.text(`${apt.title || 'Appointment'}`, 20, y);
          doc.setFont('helvetica', 'normal');
          doc.text(`Date: ${new Date(apt.appointment_date).toLocaleString()}`, 20, y + 8);
          if (apt.location) doc.text(`Location: ${apt.location}`, 20, y + 16);
          if (apt.professional_name) doc.text(`With: ${apt.professional_name}`, 20, y + 24);
        });
      }

      // Footer
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setTextColor(medicalTeal);
        doc.setFontSize(8);
        doc.text('AI Rehab PH - Professional Healthcare Platform', 105, 290, { align: 'center' });
        doc.text(`Page ${i} of ${pageCount}`, 105, 295, { align: 'center' });
      }

      // Download
      doc.save(`rehab-report-${userId}-${new Date().toISOString().split('T')[0]}.pdf`);
      
      toast.success('PDF report generated successfully!', {
        description: 'Your medical report has been downloaded.',
      });
    } catch (error) {
      toast.error('Failed to generate report');
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const calculateStreak = (sessions: any[]) => {
    if (sessions.length === 0) return 0;
    const dates = sessions.map(s => new Date(s.session_date).toDateString());
    const uniqueDates = [...new Set(dates)].sort();
    let streak = 0;
    let lastDate = new Date();
    
    for (let i = uniqueDates.length - 1; i >= 0; i--) {
      const currentDate = new Date(uniqueDates[i]);
      const daysDiff = Math.floor((lastDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
      if (daysDiff <= 1 || i === uniqueDates.length - 1) streak++;
      else break;
      lastDate = currentDate;
    }
    return streak;
  };

  return (
    <button
      onClick={generateReport}
      disabled={isGenerating}
      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white font-medium transition-all shadow-lg hover:shadow-teal-500/25"
    >
      <Download className="w-5 h-5" />
      {isGenerating ? 'Generating PDF...' : 'Generate PDF Report'}
    </button>
  );
}