import React, { useState, useEffect } from 'react';
import anime from 'animejs';
import { exercises as exerciseData } from './exerciseData';
import { Exercise, WorkoutPlan } from './types';
import ExerciseModal from './ExerciseModal';
import WorkoutTimerModal from './WorkoutTimerModal';
import FiltersSidebar from './FiltersSidebar';
import ExerciseCard from './ExerciseCard';
import WorkoutPlanModal from './WorkoutPlanModal';

const ExerciseLibrary: React.FC = () => {
  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>(exerciseData);
  const [filters, setFilters] = useState({ bodyPart: 'all', difficulty: 'all', equipment: 'all' });
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [timerExercise, setTimerExercise] = useState<Exercise | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Workout Plan State
  const [workoutPlan, setWorkoutPlan] = useState<Exercise[]>([]);
  const [showWorkoutPlanModal, setShowWorkoutPlanModal] = useState(false);
  const [savedWorkoutPlans, setSavedWorkoutPlans] = useState<WorkoutPlan[]>([]);

  useEffect(() => {
    // Load saved workout plans from localStorage
    const saved = localStorage.getItem('workoutPlans');
    if (saved) {
      const parsed = JSON.parse(saved);
      setSavedWorkoutPlans(parsed.map((p: any) => ({
        ...p,
        createdAt: new Date(p.createdAt)
      })));
    }
  }, []);

  useEffect(() => {
    // Filter exercises
    const result = exerciseData.filter(ex => {
      const bodyPartMatch = filters.bodyPart === 'all' || ex.bodyPart === filters.bodyPart;
      const difficultyMatch = filters.difficulty === 'all' || ex.difficulty === filters.difficulty;
      const equipmentMatch = filters.equipment === 'all' || ex.equipment === filters.equipment;
      return bodyPartMatch && difficultyMatch && equipmentMatch;
    });
    setFilteredExercises(result);
  }, [filters]);

  useEffect(() => {
    anime({
      targets: '.exercise-card',
      translateY: [50, 0],
      opacity: [0, 1],
      delay: anime.stagger(100),
      duration: 600,
      easing: 'easeOutExpo'
    });
  }, [filteredExercises]);

  const handleFilterChange = (type: 'bodyPart' | 'difficulty' | 'equipment', value: string) => {
    setFilters(prev => ({ ...prev, [type]: value }));
  };

  const handleOpenModal = (exercise: Exercise) => setSelectedExercise(exercise);
  
  const handleStartTimer = (exercise: Exercise) => setTimerExercise(exercise);

  // Workout Plan Handlers
  const handleAddToWorkout = (exercise: Exercise) => {
    setWorkoutPlan(prev => {
      if (prev.find(ex => ex.id === exercise.id)) {
        return prev; // Prevent duplicates
      }
      return [...prev, exercise];
    });
  };

  const handleRemoveFromWorkout = (exerciseId: number) => {
    setWorkoutPlan(prev => prev.filter(ex => ex.id !== exerciseId));
  };

  const handleCreateWorkoutPlan = () => {
    setShowWorkoutPlanModal(true);
  };

  const handleSaveWorkoutPlan = (name: string) => {
    if (workoutPlan.length === 0) return;
    
    const newPlan: WorkoutPlan = {
      id: Date.now().toString(),
      name,
      exercises: workoutPlan,
      createdAt: new Date()
    };
    
    const updatedPlans = [...savedWorkoutPlans, newPlan];
    setSavedWorkoutPlans(updatedPlans);
    localStorage.setItem('workoutPlans', JSON.stringify(updatedPlans));
    
    // Clear current plan after saving
    setWorkoutPlan([]);
  };

  const handleLoadWorkoutPlan = (plan: WorkoutPlan) => {
    setWorkoutPlan(plan.exercises);
  };

  const handleDeleteSavedPlan = (planId: string) => {
    const updatedPlans = savedWorkoutPlans.filter(p => p.id !== planId);
    setSavedWorkoutPlans(updatedPlans);
    localStorage.setItem('workoutPlans', JSON.stringify(updatedPlans));
  };

  const handleStartWorkout = () => {
    if (workoutPlan.length === 0) return;
    // Start first exercise in plan
    setTimerExercise(workoutPlan[0]);
    setShowWorkoutPlanModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 pt-24 pb-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Exercise Library & Training Plans</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Personalized exercise programs designed by healthcare professionals to support your recovery and improve your overall wellness.
        </p>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <FiltersSidebar 
            currentFilters={filters} 
            onChange={handleFilterChange}
            onCreateWorkoutPlan={handleCreateWorkoutPlan}
            workoutPlanCount={workoutPlan.length}
          />
        </div>

        <div className="lg:col-span-3">
          <div className="flex justify-between items-center mb-6">
            <span className="text-gray-600">Showing {filteredExercises.length} exercises</span>
            <div className="flex space-x-2">
              <button
                className={`px-4 py-2 rounded-lg text-sm font-medium ${viewMode === 'grid' ? 'bg-teal-600 text-white' : 'bg-gray-100'}`}
                onClick={() => setViewMode('grid')}
              >
                Grid View
              </button>
              <button
                className={`px-4 py-2 rounded-lg text-sm font-medium ${viewMode === 'list' ? 'bg-teal-600 text-white' : 'bg-gray-100'}`}
                onClick={() => setViewMode('list')}
              >
                List View
              </button>
            </div>
          </div>

          <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 xl:grid-cols-3 gap-6' : 'space-y-6'}>
            {filteredExercises.map(ex => (
              <ExerciseCard
                key={ex.id}
                exercise={ex}
                onOpenModal={handleOpenModal}
                onStartTimer={handleStartTimer}
                viewMode={viewMode}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Modals */}
      {selectedExercise && (
        <ExerciseModal
          exercise={selectedExercise}
          isOpen={!!selectedExercise}
          onClose={() => setSelectedExercise(null)}
          onAddToWorkout={handleAddToWorkout}
          onStartExercise={handleStartTimer}
          isInWorkoutPlan={workoutPlan.some(ex => ex.id === selectedExercise.id)}
        />
      )}

      {timerExercise && (
        <WorkoutTimerModal
          exercise={timerExercise}
          isOpen={!!timerExercise}
          onClose={() => setTimerExercise(null)}
        />
      )}

      {showWorkoutPlanModal && (
        <WorkoutPlanModal
          workoutPlan={workoutPlan}
          savedPlans={savedWorkoutPlans}
          isOpen={showWorkoutPlanModal}
          onClose={() => setShowWorkoutPlanModal(false)}
          onSave={handleSaveWorkoutPlan}
          onRemoveExercise={handleRemoveFromWorkout}
          onLoadPlan={handleLoadWorkoutPlan}
          onDeletePlan={handleDeleteSavedPlan}
          onStartWorkout={handleStartWorkout}
        />
      )}
    </div>
  );
};

export default ExerciseLibrary;