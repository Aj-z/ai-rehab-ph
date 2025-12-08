'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase-client'; // Direct import
import { toast, Toaster } from 'sonner';
import { DailyLog } from '@/types';
import { useSupabase } from '@/lib/supabase-context'; 
interface Props {
  userId: string;
}

export function QuickPainLogger({ userId }: Props) {
  const supabase = useSupabase(); // ✅ Single instance per component
  const [isLoading, setIsLoading] = useState(false);
  const [lastLog, setLastLog] = useState<DailyLog | null>(null);

  const painLevels = [
    { level: 0, label: 'None', color: 'bg-green-500 hover:bg-green-600', desc: 'No pain' },
    { level: 2, label: 'Mild', color: 'bg-teal-500 hover:bg-teal-600', desc: 'Slightly uncomfortable' },
    { level: 4, label: 'Moderate', color: 'bg-yellow-500 hover:bg-yellow-600', desc: 'Distracting' },
    { level: 6, label: 'Severe', color: 'bg-orange-500 hover:bg-orange-600', desc: 'Hard to ignore' },
    { level: 8, label: 'Very Severe', color: 'bg-red-500 hover:bg-red-600', desc: 'Unable to perform tasks' },
    { level: 10, label: 'Unbearable', color: 'bg-purple-600 hover:bg-purple-700', desc: 'Emergency' },
  ];

  const logPain = async (level: number) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('daily_logs')
        .insert([
          {
            user_id: userId,
            pain_level: level,
            logged_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (error) throw error;

      setLastLog(data);
      toast.success(`Pain level ${level}/10 logged successfully!`);
    } catch (error: any) {
      toast.error(`Error: ${error.message}`);
      console.error('Supabase error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      <Toaster position="top-right" theme="light" />
      <div className="glass-card rounded-2xl p-4 border border-teal-100 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <span>📊</span> Quick Pain Log
          </h3>
          {lastLog && (
            <span className="text-xs text-gray-600">
              Last: {lastLog.pain_level}/10 at {new Date(lastLog.logged_at).toLocaleTimeString()}
            </span>
          )}
        </div>
        
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
          {painLevels.map(({ level, label, color, desc }) => (
            <button
              key={level}
              onClick={() => logPain(level)}
              disabled={isLoading}
              title={desc}
              className={`${color} text-white px-2 py-3 rounded-lg text-xs font-medium transition-all
                ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 hover:shadow-lg'}`}
            >
              <div className="text-lg font-bold">{level}</div>
              <div>{label}</div>
            </button>
          ))}
        </div>

        {isLoading && (
          <div className="mt-3 flex items-center justify-center">
            <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
          </div>
        )}
      </div>
    </div>
  );
}