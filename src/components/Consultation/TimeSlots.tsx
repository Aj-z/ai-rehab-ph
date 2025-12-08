'use client';

import React, { useState, useEffect } from 'react';
import anime from 'animejs';
import { TimeSlot } from '../../types';

interface Props {
  selectedDate: Date | null;
  onTimeSelect: (time: string) => void;
  selectedTime: string | null;
  availability: string[]; // This is the data source, not a trigger
}

export const TimeSlots: React.FC<Props> = ({ selectedDate, onTimeSelect, selectedTime, availability }) => {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);

  // FIXED: Remove availability from dependencies - only regenerate when date changes
  useEffect(() => {
    if (selectedDate) {
      generateTimeSlots();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]); // Only depend on selectedDate

  useEffect(() => {
    if (timeSlots.length > 0) {
      anime({
        targets: '.time-slot',
        translateX: [-20, 0],
        opacity: [0, 1],
        delay: anime.stagger(30),
        duration: 300,
        easing: 'easeOutExpo'
      });
    }
  }, [timeSlots]);

  const generateTimeSlots = () => {
    // FIXED: Use availability directly without it being a dependency trigger
    const generatedSlots: TimeSlot[] = availability.map(time => ({
      time,
      available: Math.random() > 0.3 // Keep some randomness for demo
    }));

    setTimeSlots(generatedSlots);
  };

  const handleTimeClick = (slot: TimeSlot, event: React.MouseEvent<HTMLButtonElement>) => {
    if (!slot.available) return;
    
    onTimeSelect(slot.time);
    
    anime({
      targets: event.currentTarget,
      scale: [1, 1.05, 1],
      duration: 200,
      easing: 'easeOutQuad'
    });
  };

  if (!selectedDate) return null;

  return (
    <div className="space-y-3">
      <h4 className="font-semibold text-gray-700">Available Times</h4>
      <div className="grid grid-cols-2 gap-2">
        {timeSlots.map(slot => (
          <button
            key={slot.time}
            onClick={(e) => handleTimeClick(slot, e)}
            disabled={!slot.available}
            className={`time-slot py-3 px-4 rounded-lg text-sm font-medium transition-all
              ${slot.available 
                ? 'border-2 border-gray-200 hover:border-teal-500 hover:bg-teal-50 text-gray-700 cursor-pointer' 
                : 'border-2 border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed'
              }
              ${selectedTime === slot.time 
                ? 'bg-teal-600 border-teal-600 text-white shadow-lg' 
                : ''
              }`}
          >
            {slot.time}
            {!slot.available && <div className="text-xs mt-1 text-red-500">Booked</div>}
          </button>
        ))}
      </div>
    </div>
  );
};