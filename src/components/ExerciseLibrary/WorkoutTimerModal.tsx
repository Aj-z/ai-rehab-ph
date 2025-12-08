'use client';

import React, { useEffect, useState } from 'react';
import { Exercise } from './types';
import { parseDurationSeconds } from './utils';
import anime from 'animejs';

interface Props {
  exercise: Exercise | null;
  isOpen: boolean;
  onClose: () => void;
}

const WorkoutTimerModal: React.FC<Props> = ({ exercise, isOpen, onClose }) => {
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [isRunning, setIsRunning] = useState(false);
  const [startSound, setStartSound] = useState<HTMLAudioElement | null>(null);
  const [endSound, setEndSound] = useState<HTMLAudioElement | null>(null);

  // Initialize audio on client side only
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setStartSound(new Audio('/sounds/start.mp3'));
      setEndSound(new Audio('/sounds/end.mp3'));
    }
  }, []);

  useEffect(() => {
    if (exercise && isOpen) {
      setTimerSeconds(parseDurationSeconds(exercise.duration));
      setCurrentSet(1);
      setIsRunning(true);
      startSound?.play();
    }
  }, [exercise, isOpen, startSound]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && timerSeconds > 0) {
      interval = setInterval(() => setTimerSeconds((prev) => prev - 1), 1000);
    } else if (timerSeconds === 0 && isRunning && exercise) {
      if (currentSet < exercise.sets) {
        setCurrentSet((prev) => prev + 1);
        setTimerSeconds(parseDurationSeconds(exercise.duration));
        startSound?.play();
      } else {
        setIsRunning(false);
        endSound?.play();
      }
    }
    return () => clearInterval(interval);
  }, [isRunning, timerSeconds, exercise, currentSet, startSound, endSound]);

  const toggleTimer = () => setIsRunning((prev) => !prev);

  if (!exercise) return null;

  const minutes = Math.floor(timerSeconds / 60).toString().padStart(2, '0');
  const seconds = (timerSeconds % 60).toString().padStart(2, '0');

  return (
    <div className={`modal fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${isOpen ? 'active' : ''}`} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-content relative bg-white rounded-2xl shadow-lg max-w-md w-full p-6">
        <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold" onClick={onClose}>✕</button>
        <h3 className="text-2xl font-bold text-gray-900 mb-6">{exercise.name} Timer</h3>
        <div className="workout-timer mx-auto mb-6 flex items-center justify-center">
          <div className="text-3xl font-bold">{minutes}</div>
          <div className="text-lg mx-1">:</div>
          <div className="text-3xl font-bold">{seconds}</div>
        </div>
        <div className="mb-6 text-center">
          <div className="text-lg font-semibold text-gray-700 mb-2">Current Set: {currentSet} of {exercise.sets}</div>
          <div className="text-gray-600">Repetitions: {exercise.reps}</div>
        </div>
        <div className="flex space-x-4 justify-center">
          <button className="btn-secondary px-6 py-3 rounded-lg font-semibold" onClick={toggleTimer}>
            {isRunning ? 'Pause' : 'Resume'}
          </button>
          <button className="btn-primary px-6 py-3 rounded-lg font-semibold" onClick={() => {
            if (currentSet < exercise.sets) {
              setCurrentSet((prev) => prev + 1);
              setTimerSeconds(parseDurationSeconds(exercise.duration));
              setIsRunning(true);
              startSound?.play();
            } else {
              setIsRunning(false);
              endSound?.play();
              onClose();
            }
          }}>Next Set</button>
        </div>
      </div>
    </div>
  );
};

export default WorkoutTimerModal;