'use client';

import { useEffect, useState } from 'react';
import { Flame, Plus, Trash2, TrendingUp, Clock, Activity } from 'lucide-react';
import { useSupabase } from '@/lib/supabase-context';
import type { ExerciseSession } from '@/types';
import { toast } from 'sonner';

interface Props {
  userId: string;
}

export function ExerciseStreak({ userId }: Props) {
  const supabase = useSupabase();
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [exercises, setExercises] = useState<ExerciseSession[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    exercise_type: 'squat',
    duration_seconds: 0,
    notes: '',
    count: 1
  });
  const [stats, setStats] = useState({
    totalSessions: 0,
    totalReps: 0,
    avgDuration: 0
  });

  useEffect(() => {
    loadData();
  }, [userId]);

  const loadData = async () => {
    try {
      // Load exercise sessions
      const { data: exerciseData } = await supabase
        .from('exercise_sessions')
        .select('*')
        .eq('user_id', userId)
        .gte('session_date', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
        .order('session_date', { ascending: false });

      if (exerciseData) {
        const validExercises = exerciseData.filter(ex => ex.session_date !== null) as ExerciseSession[];
        setExercises(validExercises);
        calculateStreak(validExercises);
        calculateStats(validExercises);
      }
    } catch (error) {
      console.error('Failed to load exercises:', error);
      toast.error('Failed to load exercise data');
    }
  };

  const calculateStreak = (exerciseData: ExerciseSession[]) => {
    const dates = exerciseData.map(d => new Date(d.session_date).toDateString());
    const uniqueDates = [...new Set(dates)];
    
    let currentStreak = 0;
    let tempStreak = 0;
    let maxStreak = 0;
    let lastDate = new Date();

    for (let i = 0; i < uniqueDates.length; i++) {
      const currentDate = new Date(uniqueDates[i]);
      const daysDiff = Math.floor((lastDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));

      if (daysDiff <= 1) {
        tempStreak++;
        if (tempStreak > maxStreak) maxStreak = tempStreak;
        if (i === 0) currentStreak = tempStreak;
      } else {
        tempStreak = 1;
      }
      
      lastDate = currentDate;
    }

    setStreak(currentStreak);
    setMaxStreak(maxStreak);
  };

  const calculateStats = (exerciseData: ExerciseSession[]) => {
    const totalSessions = exerciseData.length;
    const totalReps = exerciseData.reduce((sum, ex) => sum + (ex.count || 0), 0);
    const avgDuration = exerciseData.reduce((sum, ex) => sum + (ex.duration_seconds || 0), 0) / (totalSessions || 1);

    setStats({
      totalSessions,
      totalReps,
      avgDuration: Math.round(avgDuration)
    });
  };

  const handleAddExercise = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    const insertData = {
      ...formData,
      user_id: userId,
      session_date: new Date().toISOString(),
      // Ensure no undefined values
      count: formData.count || 1,
      duration_seconds: formData.duration_seconds || 0,
      notes: formData.notes || null,
    };

    const { error } = await supabase.from('exercise_sessions').insert([insertData]);

    if (error) {
      console.error('Insert error:', error);
      toast.error(`Error: ${error.message}`);
      return;
    }

    toast.success('Exercise logged successfully!');
    setShowAddForm(false);
    setFormData({ exercise_type: 'squat', duration_seconds: 0, notes: '', count: 1 });
    loadData();
  } catch (error: any) {
    toast.error(`Error: ${error.message}`);
  }
};

  const handleDeleteExercise = async (id: string) => {
    try {
      const { error } = await supabase.from('exercise_sessions').delete().eq('id', id);
      if (error) throw error;

      toast.success('Exercise deleted');
      loadData(); // Refresh data
    } catch (error: any) {
      toast.error(`Error: ${error.message}`);
    }
  };

  const getStreakColor = () => {
    if (streak >= 7) return 'text-orange-500';
    if (streak >= 3) return 'text-yellow-500';
    return 'text-gray-500';
  };

  return (
    <div className="glass-card rounded-2xl p-6 border border-teal-100 shadow-lg space-y-6">
      {/* Header with Streak */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Flame className={`w-5 h-5 ${getStreakColor()}`} />
            Exercise Streak
          </h3>
          <p className="text-sm text-gray-600">Days in a row</p>
        </div>
        <div className="text-right">
          <div className={`text-4xl font-bold ${getStreakColor()}`}>{streak}</div>
          <div className="text-xs text-gray-500">Max: {maxStreak}</div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-teal-50 rounded-lg p-3 text-center">
          <Activity className="w-5 h-5 text-teal-600 mx-auto mb-1" />
          <div className="text-2xl font-bold text-gray-900">{stats.totalSessions}</div>
          <div className="text-xs text-gray-600">Sessions</div>
        </div>
        <div className="bg-teal-50 rounded-lg p-3 text-center">
          <TrendingUp className="w-5 h-5 text-teal-600 mx-auto mb-1" />
          <div className="text-2xl font-bold text-gray-900">{stats.totalReps}</div>
          <div className="text-xs text-gray-600">Total Reps</div>
        </div>
        <div className="bg-teal-50 rounded-lg p-3 text-center">
          <Clock className="w-5 h-5 text-teal-600 mx-auto mb-1" />
          <div className="text-2xl font-bold text-gray-900">{stats.avgDuration}s</div>
          <div className="text-xs text-gray-600">Avg Duration</div>
        </div>
      </div>

      {/* Add Exercise Button */}
      <button
        onClick={() => setShowAddForm(!showAddForm)}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-teal-600 hover:bg-teal-700 rounded-lg text-white transition"
      >
        <Plus className="w-4 h-4" />
        Log Manual Exercise
      </button>

      {/* Add Exercise Form */}
      {showAddForm && (
        <form onSubmit={handleAddExercise} className="space-y-4 p-4 bg-teal-50 rounded-lg">
          <select
            value={formData.exercise_type}
            onChange={(e) => setFormData({ ...formData, exercise_type: e.target.value })}
            className="w-full px-3 py-2 border border-teal-200 rounded-lg"
            required
          >
            <option value="squat">Squat</option>
            <option value="push-up">Push-up</option>
            <option value="plank">Plank</option>
            <option value="lunge">Lunge</option>
            <option value="other">Other</option>
          </select>
          
          <input
            type="number"
            placeholder="Duration (seconds)"
            value={formData.duration_seconds || ''}
            onChange={(e) => setFormData({ ...formData, duration_seconds: parseInt(e.target.value) || 0 })}
            className="w-full px-3 py-2 border border-teal-200 rounded-lg"
          />
          
          <input
            type="number"
            placeholder="Reps (if applicable)"
            value={formData.count || ''}
            onChange={(e) => setFormData({ ...formData, count: parseInt(e.target.value) || 1 })}
            className="w-full px-3 py-2 border border-teal-200 rounded-lg"
          />
          
          <textarea
            placeholder="Notes (optional)"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full px-3 py-2 border border-teal-200 rounded-lg"
            rows={2}
          />

          <div className="flex gap-2">
            <button type="submit" className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg">
              Save
            </button>
            <button type="button" onClick={() => setShowAddForm(false)} className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg">
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Recent Exercises List */}
      <div className="space-y-2 max-h-64 overflow-y-auto">
        <h4 className="font-semibold text-gray-900">Recent Exercises</h4>
        {exercises.slice(0, 5).map((exercise) => (
          <div key={exercise.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-teal-100">
            <div>
              <div className="font-medium text-gray-900 capitalize">{exercise.exercise_type}</div>
              <div className="text-sm text-gray-600">
                {exercise.count} reps • {exercise.duration_seconds}s • {new Date(exercise.session_date).toLocaleDateString()}
              </div>
              {exercise.notes && <div className="text-xs text-gray-500 mt-1">{exercise.notes}</div>}
            </div>
            <button
              onClick={() => handleDeleteExercise(exercise.id)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
        {exercises.length === 0 && (
          <p className="text-gray-500 text-center py-4">No exercises logged yet</p>
        )}
      </div>
    </div>
  );
}