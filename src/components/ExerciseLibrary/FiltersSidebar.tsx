import React from 'react';

interface FilterProps {
  currentFilters: {
    bodyPart: string;
    difficulty: string;
    equipment: string;
  };
  onChange: (filterType: 'bodyPart' | 'difficulty' | 'equipment', value: string) => void;
  onCreateWorkoutPlan: () => void;
  workoutPlanCount: number;
}

const FiltersSidebar: React.FC<FilterProps> = ({ currentFilters, onChange, onCreateWorkoutPlan, workoutPlanCount }) => {
  const filterData: Record<string, string[]> = {
    bodyPart: ['all', 'back', 'neck', 'shoulder', 'knee', 'hip', 'ankle'],
    difficulty: ['all', 'beginner', 'intermediate', 'advanced'],
    equipment: ['all', 'none', 'resistance-band', 'weights', 'mat']
  };

  return (
    <div className="glass-card rounded-2xl p-6 sticky top-28">
      <h3 className="text-lg font-bold text-gray-900 mb-6">Filter Exercises</h3>
      
      {Object.entries(filterData).map(([type, values]) => (
        <div key={type} className="mb-6">
          <h4 className="font-semibold text-gray-700 mb-3">
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </h4>
          <div className="space-y-2">
            {values.map((value) => {
              const currentValue = currentFilters?.[type as keyof typeof currentFilters] ?? 'all';
              return (
                <div
                  key={value}
                  className={`filter-tag px-3 py-2 rounded-lg text-sm cursor-pointer ${
                    currentValue === value ? 'bg-blue-300 text-white' : 'bg-gray-100 text-gray-700'
                  }`}
                  onClick={() => onChange(type as 'bodyPart' | 'difficulty' | 'equipment', value)}
                >
                  {value.replace('-', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                </div>
              );
            })}
          </div>
        </div>
      ))}
      
      <button 
        className="btn-primary w-full py-3 rounded-lg font-semibold mt-4 relative"
        onClick={onCreateWorkoutPlan}
      >
        Create Workout Plan
        {workoutPlanCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
            {workoutPlanCount}
          </span>
        )}
      </button>
    </div>
  );
};

export default FiltersSidebar;
