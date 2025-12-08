'use client';

import React, { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isBefore, isSameDay } from 'date-fns';
import anime from 'animejs';

interface Props {
  onDateSelect: (date: Date) => void;
  selectedDate: Date | null;
}

export const Calendar: React.FC<Props> = ({ onDateSelect, selectedDate }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const today = new Date();

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startingDayOfWeek = monthStart.getDay();
  const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  useEffect(() => {
    anime({
      targets: '.calendar-day',
      translateY: [20, 0],
      opacity: [0, 1],
      delay: anime.stagger(20),
      duration: 300,
      easing: 'easeOutExpo'
    });
  }, [currentMonth]);

  const handleDateClick = (date: Date, event: React.MouseEvent<HTMLButtonElement>) => {
    if (isBefore(date, today) && !isSameDay(date, today)) return;
    onDateSelect(date);
    
    anime({
      targets: event.currentTarget,
      scale: [1, 1.1, 1],
      duration: 200,
      easing: 'easeOutQuad'
    });
  };

  const isDateSelected = (date: Date) => selectedDate ? isSameDay(date, selectedDate) : false;
  const isDateDisabled = (date: Date) => isBefore(date, today) && !isSameDay(date, today);

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))} 
                className="p-2 hover:bg-gray-100 rounded-lg">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h3 className="text-lg font-bold">{format(currentMonth, 'MMMM yyyy')}</h3>
        <button onClick={() => setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))} 
                className="p-2 hover:bg-gray-100 rounded-lg">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayHeaders.map(day => (
          <div key={day} className="text-center py-2 text-xs font-semibold text-gray-500 uppercase">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: startingDayOfWeek }).map((_, i) => (
          <div key={`empty-${i}`} className="calendar-day" />
        ))}
        {days.map(day => {
          const disabled = isDateDisabled(day);
          const selected = isDateSelected(day);
          return (
            <button
              key={day.toString()}
              onClick={(e) => handleDateClick(day, e)}
              disabled={disabled}
              className={`calendar-day rounded-lg p-2 text-sm font-medium transition-all
                ${disabled ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-teal-50 text-gray-700 cursor-pointer'}
                ${selected ? 'bg-teal-600 text-white' : ''}`}>
              {format(day, 'd')}
            </button>
          );
        })}
      </div>
    </div>
  );
};