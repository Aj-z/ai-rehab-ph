'use client';

import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, subDays, isSameDay } from 'date-fns';
import { DailyLog } from '@/types';
import { createClient } from '@/lib/supabase-client';
import { useSupabase } from '@/lib/supabase-context';   

interface Props {
  initialLogs?: DailyLog[];
}

export function WeeklyProgressChart({ initialLogs = [] }: Props) {
  const supabase = useSupabase();
  const [chartData, setChartData] = useState<any[]>([]);
  const [averagePain, setAveragePain] = useState(0);
  const [trend, setTrend] = useState<'up' | 'down' | 'stable'>('stable');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('daily_logs')
        .select('pain_level, logged_at')
        .eq('user_id', user.id)
        .gte('logged_at', subDays(new Date(), 7).toISOString())
        .order('logged_at', { ascending: true });

      processChartData(data || []);
    } catch (error) {
      console.error('Failed to load chart data:', error);
    }
  };

  const processChartData = (logs: DailyLog[]) => {
    const data = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(new Date(), 6 - i);
      const dayLog = logs.find(log => {
        const logDate = new Date(log.logged_at);
        return isSameDay(logDate, date);
      });
      return {
        date: format(date, 'EEE'),
        pain: dayLog?.pain_level ?? null,
        mood: dayLog?.mood ?? null,
      };
    });

    setChartData(data);

    const validPainLevels = data.filter(d => d.pain !== null).map(d => d.pain);
    const avg = validPainLevels.reduce((a, b) => a + b, 0) / validPainLevels.length;
    setAveragePain(avg);

    const firstHalf = validPainLevels.slice(0, Math.floor(validPainLevels.length / 2));
    const secondHalf = validPainLevels.slice(Math.floor(validPainLevels.length / 2));
    const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;

    if (secondAvg < firstAvg - 0.5) setTrend('down'); // Improving
    else if (secondAvg > firstAvg + 0.5) setTrend('up'); // Worsening
    else setTrend('stable');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">7-Day Pain Trend</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Avg:</span>
          <span className={`font-bold ${averagePain <= 3 ? 'text-green-600' : averagePain <= 6 ? 'text-yellow-600' : 'text-red-600'}`}>
            {averagePain.toFixed(1)}/10
          </span>
          <span className={`text-sm ${trend === 'down' ? 'text-green-600' : trend === 'up' ? 'text-red-600' : 'text-gray-600'}`}>
            {trend === 'down' ? '↘️ Improving' : trend === 'up' ? '↗️ Worsening' : '→ Stable'}
          </span>
        </div>
      </div>

      <div className="w-full h-64 bg-white rounded-xl p-4 border border-teal-100 min-h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
            <YAxis domain={[0, 10]} stroke="#6b7280" fontSize={12} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#ffffff', 
                border: '1px solid #0891b2', 
                borderRadius: '8px' 
              }}
              labelStyle={{ color: '#6b7280' }}
              formatter={(value: any) => [`Pain Level: ${value}/10`, '']}
            />
            <Line 
              type="monotone" 
              dataKey="pain" 
              stroke="#0891b2" 
              strokeWidth={3}
              dot={{ fill: '#0891b2', stroke: '#fff', strokeWidth: 2, r: 6 }}
              activeDot={{ r: 8, fill: '#0e7490' }}
              connectNulls={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-teal-600 rounded-full"></div>
          <span className="text-gray-700">Pain Level</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-gray-400 rounded"></div>
          <span className="text-gray-500">No Data</span>
        </div>
      </div>
    </div>
  );
}