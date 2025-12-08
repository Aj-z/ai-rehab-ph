'use client';

import React, { useState, useEffect } from 'react';
import anime from 'animejs';
import { Professional, ConsultationType } from '../../types';
import { Calendar } from './Calendar';
import { TimeSlots } from './TimeSlots';

interface Props {
  selectedProfessional: Professional | null;
  onProfessionalClear: () => void;
  onBookingSummary: (data: { // NEW: Renamed from onBookingComplete
    consultationType: ConsultationType;
    date: Date;
    time: string;
    userName: string;
    userEmail: string;
  }) => void;
}

const consultationTypes: ConsultationType[] = [
  { id: 'initial', name: 'Initial Consultation', description: 'Comprehensive assessment', price: '$150', duration: '60 minutes' },
  { id: 'followup', name: 'Follow-up Session', description: 'Progress review', price: '$75', duration: '30 minutes' },
  { id: 'urgent', name: 'Urgent Consultation', description: 'Same-day priority', price: '$200', duration: '45 minutes' }
];

export const BookingPanel: React.FC<Props> = ({ selectedProfessional, onProfessionalClear, onBookingSummary }) => {
  const [selectedConsultationType, setSelectedConsultationType] = useState<ConsultationType | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState(''); // NEW: Email state

  // Reset selections when professional changes
  useEffect(() => {
    setSelectedConsultationType(null);
    setSelectedDate(null);
    setSelectedTime(null);
    setUserName('');
    setUserEmail('');
  }, [selectedProfessional]);

  if (!selectedProfessional) {
    return (
      <div className="glass-card rounded-2xl p-6 sticky top-28 shadow-lg border border-white/50">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Book Your Consultation</h3>
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <p className="text-gray-600 font-medium">Please select a professional first</p>
        </div>
      </div>
    );
  }

  const handleConsultationTypeSelect = (type: ConsultationType, event: React.MouseEvent<HTMLDivElement>) => {
    setSelectedConsultationType(type);
    anime({ targets: event.currentTarget, scale: [1, 1.02, 1], duration: 200, easing: 'easeOutQuad' });
  };

  const handleDateSelect = (date: Date) => setSelectedDate(date);
  const handleTimeSelect = (time: string) => setSelectedTime(time);
  const handleClearProfessional = () => onProfessionalClear();

  const handleBookingSummary = () => {
    if (selectedConsultationType && selectedDate && selectedTime && userName.trim() && userEmail.trim()) {
      onBookingSummary({
        consultationType: selectedConsultationType,
        date: selectedDate,
        time: selectedTime,
        userName: userName.trim(),
        userEmail: userEmail.trim()
      });
    }
  };

  return (
    <div className="glass-card rounded-2xl p-6 sticky top-28 shadow-lg border border-white/50">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">Book Your Consultation</h3>

      {/* Name Input */}
      <div className="mb-6">
        <label htmlFor="user-name" className="block text-sm font-medium text-gray-700 mb-2">Your Full Name *</label>
        <input id="user-name" value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="Enter your full name" 
               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" />
      </div>

      {/* Email Input */}
      <div className="mb-6">
        <label htmlFor="user-email" className="block text-sm font-medium text-gray-700 mb-2">Your Email Address *</label>
        <input type="email" id="user-email" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} 
               placeholder="your@email.com" 
               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" />
        <p className="text-xs text-gray-500 mt-1">Confirmation will be sent to this email</p>
      </div>

      {/* Consultation Types */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-700 mb-3">Consultation Type</h4>
        <div className="space-y-3">
          {consultationTypes.map(type => (
            <div key={type.id} onClick={(e) => handleConsultationTypeSelect(type, e)} 
                 className={`consultation-type border-2 rounded-xl p-4 cursor-pointer transition-all
                   ${selectedConsultationType?.id === type.id ? 'border-teal-600 bg-teal-600 text-white shadow-lg' : 'border-gray-200 hover:border-teal-300 hover:bg-teal-50'}`}>
              <div className="font-bold text-lg mb-1">{type.name}</div>
              <div className={`text-sm ${selectedConsultationType?.id === type.id ? 'text-white/90' : 'text-gray-500'}`}>{type.description}</div>
              <div className={`font-bold mt-1 ${selectedConsultationType?.id === type.id ? 'text-white' : 'text-teal-600'}`}>{type.price} • {type.duration}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Calendar */}
      {selectedConsultationType && (
        <div className="mb-6 animate-fade-in">
          <Calendar selectedDate={selectedDate} onDateSelect={handleDateSelect} />
        </div>
      )}

      {/* Time Slots */}
      {selectedDate && selectedProfessional && (
        <div className="mb-6 animate-fade-in">
          <TimeSlots selectedDate={selectedDate} selectedTime={selectedTime} onTimeSelect={handleTimeSelect} 
                     availability={selectedProfessional.availability} />
        </div>
      )}

      {/* Selected Professional */}
      {selectedProfessional && (
        <div id="selected-professional" className="mt-6 p-4 bg-gradient-to-r from-teal-50 to-blue-50 rounded-xl border border-teal-200">
          <div className="flex items-center justify-between mb-3">
            <h5 className="font-semibold text-gray-900 mb-2">Selected Professional</h5>
            <button onClick={handleClearProfessional} className="text-gray-400 hover:text-red-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex items-center space-x-3">
            <img src={selectedProfessional.image} alt={selectedProfessional.name} 
                 className="w-12 h-12 rounded-full object-cover border-2 border-teal-200" />
            <div>
              <div className="font-bold text-gray-900">{selectedProfessional.name}</div>
              <div className="text-sm text-gray-600">{selectedProfessional.specialty}</div>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={handleBookingSummary}
        disabled={!selectedConsultationType || !selectedDate || !selectedTime || !userName.trim() || !userEmail.trim()}
        className="btn-primary w-full py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        {selectedConsultationType && selectedDate && selectedTime && userName.trim() && userEmail.trim() ? 'Review & Confirm Booking' : 'Fill all fields to Continue'}
      </button>
    </div>
  );
};