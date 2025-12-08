"use client";

import React, { useEffect, useState } from 'react';
import { Exercise } from './types';
import anime from 'animejs';

interface Props {
  exercise: Exercise | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToWorkout: (exercise: Exercise) => void;
  onStartExercise: (exercise: Exercise) => void;
  isInWorkoutPlan: boolean;
}

const ExerciseModal: React.FC<Props> = ({ 
  exercise, 
  isOpen, 
  onClose, 
  onAddToWorkout, 
  onStartExercise,
  isInWorkoutPlan
}) => {
  const [startSound, setStartSound] = useState<HTMLAudioElement | null>(null);

  // Load audio only on the client
  useEffect(() => {
    if (typeof window !== "undefined") {
      setStartSound(new Audio("/sounds/start.mp3"));
    }
  }, []);

  // Opening animation
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

  if (!exercise || !isOpen) return null;

  const handleStart = () => {
    startSound?.play();
    onStartExercise(exercise);
  };

  return (
    <div 
      className="modal fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-[9999]"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal-content relative bg-white rounded-2xl shadow-lg max-w-lg w-full p-6">
        
        {/* ❌ Close Button */}
        <button 
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold"
          onClick={onClose}
        >
          ✕
        </button>

        <h3 className="text-2xl font-bold text-gray-900 mb-4">{exercise.name}</h3>

        <img 
          src={exercise.image} 
          alt={exercise.name} 
          className="w-full h-48 object-cover rounded-lg mb-4" 
        />

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="font-bold text-teal-600">{exercise.duration}</div>
            <div className="text-sm text-gray-600">Duration</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-teal-600">{exercise.reps}</div>
            <div className="text-sm text-gray-600">Repetitions</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-teal-600">{exercise.sets}</div>
            <div className="text-sm text-gray-600">Sets</div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mb-6">
          <h4 className="font-semibold text-gray-900 mb-2">Instructions</h4>
          <ol className="list-decimal list-inside space-y-2 text-gray-600">
            {exercise.instructions.map((inst, idx) => (
              <li key={idx}>{inst}</li>
            ))}
          </ol>
        </div>

        {/* Benefits */}
        <div className="mb-6">
          <h4 className="font-semibold text-gray-900 mb-2">Benefits</h4>
          <ul className="list-disc list-inside space-y-1 text-gray-600">
            {exercise.benefits.map((benefit, idx) => (
              <li key={idx}>{benefit}</li>
            ))}
          </ul>
        </div>

        {/* Safety */}
        <div className="mb-6">
          <h4 className="font-semibold text-gray-900 mb-2">Safety Tips</h4>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800 text-sm">{exercise.safety}</p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex space-x-4">
          <button
            className={`px-6 py-3 rounded-lg font-semibold flex-1 ${
              isInWorkoutPlan
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'btn-primary'
            }`}
            onClick={() => !isInWorkoutPlan && onAddToWorkout(exercise)}
            disabled={isInWorkoutPlan}
          >
            {isInWorkoutPlan ? 'Already in Plan' : 'Add to Workout'}
          </button>

          <button 
            className="btn-secondary px-6 py-3 rounded-lg font-semibold flex-1"
            onClick={handleStart}
          >
            Start Exercise
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExerciseModal;
