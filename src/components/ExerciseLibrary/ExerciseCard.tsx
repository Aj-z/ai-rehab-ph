import React from 'react';
import { Exercise } from './types';

interface Props {
  exercise: Exercise;
  onOpenModal: (exercise: Exercise) => void;
  onStartTimer: (exercise: Exercise) => void;
  viewMode?: 'grid' | 'list';
}

const difficultyClasses = {
  beginner: 'bg-green-500',
  intermediate: 'bg-yellow-500',
  advanced: 'bg-red-500',
};

const ExerciseCard: React.FC<Props> = ({
  exercise,
  onOpenModal,
  onStartTimer,
  viewMode = 'grid',
}) => {
  return (
    <div
      className={`exercise-card glass-card rounded-2xl overflow-hidden shadow-lg cursor-pointer transition-transform hover:scale-105 ${
        viewMode === 'list' ? 'flex gap-4 items-center' : ''
      }`}
      onClick={() => onOpenModal(exercise)}
    >
      <div className={viewMode === 'list' ? 'w-1/3 relative' : 'relative'}>
        <img
          src={exercise.image}
          alt={exercise.name}
          className="w-full h-48 object-cover rounded-xl"
        />
        <div className={`absolute top-2 right-2 px-2 py-1 rounded-md text-xs font-semibold text-white ${difficultyClasses[exercise.difficulty]}`}
        >
          {exercise.difficulty}
        </div>
      </div>

      <div className={`p-6 ${viewMode === 'list' ? 'flex-1' : ''}`}>
        <h3 className="text-xl font-bold text-gray-900 mb-2">{exercise.name}</h3>
        <p className="text-gray-600 mb-4">{exercise.instructions[0]}</p>

        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <span>⏱️ {exercise.duration}</span>
          <span>🔄 {exercise.sets} sets</span>
          <span>📍 {exercise.bodyPart}</span>
        </div>

        <button
          className="btn-primary w-full py-2 rounded-lg font-semibold"
          onClick={(e) => {
            e.stopPropagation();
            onStartTimer(exercise);
          }}
        >
          Start Exercise
        </button>
      </div>
    </div>
  );
};

export default ExerciseCard;
