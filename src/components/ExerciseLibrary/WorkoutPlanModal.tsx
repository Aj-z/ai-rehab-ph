import React, { useState, useEffect } from 'react';
import { Exercise, WorkoutPlan } from './types';
import anime from 'animejs';

interface Props {
  workoutPlan: Exercise[];
  savedPlans: WorkoutPlan[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string) => void;
  onRemoveExercise: (exerciseId: number) => void;
  onLoadPlan: (plan: WorkoutPlan) => void;
  onDeletePlan: (planId: string) => void;
  onStartWorkout: () => void;
}

const WorkoutPlanModal: React.FC<Props> = ({ 
  workoutPlan, 
  savedPlans, 
  isOpen, 
  onClose, 
  onSave, 
  onRemoveExercise,
  onLoadPlan,
  onDeletePlan,
  onStartWorkout
}) => {
  const [planName, setPlanName] = useState('');
  const [showSavedPlans, setShowSavedPlans] = useState(false);

  useEffect(() => {
    if (isOpen) {
      anime({
        targets: '.modal-content',
        scale: [0.9, 1],
        opacity: [0, 1],
        duration: 300,
        easing: 'easeOutExpo',
      });
    }
  }, [isOpen]);

  const handleSave = () => {
    if (planName.trim()) {
      onSave(planName.trim());
      setPlanName('');
    }
  };

  const handleLoad = (plan: WorkoutPlan) => {
    onLoadPlan(plan);
    setShowSavedPlans(false);
  };

  const handleDelete = (planId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onDeletePlan(planId);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="modal fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 active" 
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal-content relative bg-white rounded-2xl shadow-lg max-w-2xl w-full p-6 max-h-screen overflow-y-auto">
        {/* Close button */}
        <button 
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold"
          onClick={onClose}
        >
          ✕
        </button>

        <h3 className="text-2xl font-bold text-gray-900 mb-6">Workout Plan Builder</h3>

        {/* Saved Plans Section */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-semibold text-gray-700">Saved Workout Plans</h4>
            <button
              className="text-sm text-teal-600 hover:text-teal-700 font-medium"
              onClick={() => setShowSavedPlans(!showSavedPlans)}
            >
              {showSavedPlans ? 'Hide' : 'Show'} ({savedPlans.length})
            </button>
          </div>
          
          {showSavedPlans && (
            <div className="space-y-2 mb-4 max-h-40 overflow-y-auto">
              {savedPlans.length === 0 ? (
                <p className="text-gray-500 text-sm">No saved plans yet</p>
              ) : (
                savedPlans.map(plan => (
                  <div 
                    key={plan.id} 
                    className="flex items-center justify-between bg-gray-50 rounded-lg p-3 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleLoad(plan)}
                  >
                    <div>
                      <span className="font-medium text-gray-900">{plan.name}</span>
                      <span className="text-gray-500 text-sm ml-2">({plan.exercises.length} exercises)</span>
                    </div>
                    <button
                      className="text-red-500 hover:text-red-600 text-sm font-medium"
                      onClick={(e) => handleDelete(plan.id, e)}
                    >
                      Delete
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Current Plan Section */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-semibold text-gray-700">Current Plan ({workoutPlan.length} exercises)</h4>
          </div>

          {workoutPlan.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No exercises added yet. Browse the library and click "Add to Workout" on exercises.</p>
          ) : (
            <div className="space-y-3">
              {workoutPlan.map((exercise, index) => (
                <div key={exercise.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center space-x-3">
                    <span className="font-bold text-teal-600">{index + 1}.</span>
                    <img src={exercise.image} alt={exercise.name} className="w-12 h-12 object-cover rounded-lg" />
                    <div>
                      <h5 className="font-medium text-gray-900">{exercise.name}</h5>
                      <p className="text-sm text-gray-500">{exercise.duration} • {exercise.sets} sets</p>
                    </div>
                  </div>
                  <button
                    className="text-red-500 hover:text-red-600 text-sm font-medium"
                    onClick={() => onRemoveExercise(exercise.id)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Save Plan Section */}
        {workoutPlan.length > 0 && (
          <div className="border-t pt-4">
            <h4 className="font-semibold text-gray-700 mb-3">Save Workout Plan</h4>
            <input
              type="text"
              placeholder="Enter plan name..."
              value={planName}
              onChange={(e) => setPlanName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <div className="flex space-x-3">
              <button
                className={`px-6 py-2 rounded-lg font-semibold flex-1 ${
                  planName.trim() ? 'btn-primary' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                onClick={handleSave}
                disabled={!planName.trim()}
              >
                Save Plan
              </button>
              <button
                className="btn-secondary px-6 py-2 rounded-lg font-semibold flex-1"
                onClick={onStartWorkout}
              >
                Start Workout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkoutPlanModal;