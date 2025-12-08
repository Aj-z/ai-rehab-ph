'use client';

import { DashboardShell } from './DashboardShell';
import { QuickPainLogger } from './QuickPainLogger';
import { WeeklyProgressChart } from './WeeklyProgressChart';
import { ExerciseStreak } from './ExerciseStreak';
import { InjuryManager } from './InjuryManager';
import { AppointmentCalendar } from './AppointmentCalendar';
import { GenerateReportButton } from './GenerateReportButton';
import { MediaPipeSquatCounter } from './MediaPipeSquatCounter';
import { Profile } from '@/types';

interface Props {
  user: Profile;
}

export function DashboardContent({ user }: Props) {
  if (!user) return null;

  return (
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <QuickPainLogger userId={user.id} />
          <ExerciseStreak userId={user.id} />
          <MediaPipeSquatCounter userId={user.id} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <WeeklyProgressChart />
          <InjuryManager userId={user.id} />
        </div>

        <div className="grid grid-cols-1">
          <AppointmentCalendar userId={user.id} />
        </div>

        <div className="flex justify-end">
          <GenerateReportButton userId={user.id} />
        </div>
      </div>
  );
}