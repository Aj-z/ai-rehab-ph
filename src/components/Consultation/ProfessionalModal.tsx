'use client';

import React, { useEffect } from 'react';
import anime from 'animejs';
import { Professional } from '@/types';

interface Props {
  professional: Professional | null;
  isOpen: boolean;
  onClose: () => void;
  onSelect: (professional: Professional) => void;
}

export const ProfessionalModal: React.FC<Props> = ({ professional, isOpen, onClose, onSelect }) => {
  useEffect(() => {
    if (isOpen) {
      // Prevent body scroll when modal opens
      document.body.style.overflow = 'hidden';
      
      anime({
        targets: '.modal-content',
        scale: [0.9, 1],
        opacity: [0, 1],
        duration: 300,
        easing: 'easeOutExpo'
      });
    } else {
      // Restore body scroll when modal closes
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto'; // Cleanup on unmount
    };
  }, [isOpen]);

  if (!professional) return null;

  const stars = '★'.repeat(Math.floor(professional.rating)) + (professional.rating % 1 ? '☆' : '');

  const handleSelect = () => {
    onSelect(professional);
    onClose();
  };

  return (
    <div 
      className={`modal fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-start justify-center ${isOpen ? 'active' : ''}`}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* FIXED: Added max-h-screen and overflow-y-auto */}
      <div className="modal-content bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 my-8 max-h-[90vh] overflow-y-auto">
        {/* FIXED: Sticky header with close button */}
        <div className="sticky top-0 bg-white z-10 p-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-900">{professional.name}</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-2 transition-all"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* FIXED: Scrollable content area */}
        <div className="p-6">
          {/* Profile Image and Title */}
          <div className="text-center mb-6">
            <img 
              src={professional.image} 
              alt={professional.name}
              className="w-24 h-24 rounded-full object-cover border-4 border-teal-200 mx-auto mb-4"
            />
            <div className="text-teal-600 font-semibold text-lg">{professional.specialty}</div>
            <div className="flex items-center justify-center mt-2">
              <span className="rating-stars text-xl mr-2">{stars}</span>
              <span className="text-gray-600 font-medium">{professional.rating}</span>
              <span className="text-gray-400 text-sm ml-2">(127 reviews)</span>
            </div>
            <div className="text-gray-500 mt-1">{professional.experience} experience</div>
          </div>

          {/* About */}
          <div className="mb-6">
            <h4 className="font-bold text-gray-900 mb-3 flex items-center">
              <span className="text-teal-600 mr-2">•</span>
              About Dr. {professional.name.split(' ')[1]}
            </h4>
            <p className="text-gray-700 leading-relaxed">{professional.bio}</p>
          </div>

          {/* Specializations */}
          <div className="mb-6">
            <h4 className="font-bold text-gray-900 mb-3 flex items-center">
              <span className="text-teal-600 mr-2">•</span>
              Specializations
            </h4>
            <div className="flex flex-wrap gap-3">
              {professional.specializations.map(spec => (
                <span key={spec} className="bg-teal-50 text-teal-700 px-4 py-2 rounded-full text-sm font-medium border border-teal-200">
                  {spec}
                </span>
              ))}
            </div>
          </div>

          {/* Credentials */}
          <div className="mb-6">
            <h4 className="font-bold text-gray-900 mb-3 flex items-center">
              <span className="text-teal-600 mr-2">•</span>
              Education & Certifications
            </h4>
            <ul className="space-y-2">
              {professional.credentials.map((credential, index) => (
                <li key={index} className="flex items-start text-gray-700">
                  <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {credential}
                </li>
              ))}
            </ul>
          </div>

          {/* Availability */}
          <div className="mb-0"> {/* FIXED: Removed bottom margin */}
            <h4 className="font-bold text-gray-900 mb-3 flex items-center">
              <span className="text-teal-600 mr-2">•</span>
              Available Times
            </h4>
            <div className="grid grid-cols-2 gap-2 mb-6">
              {professional.availability.map(time => (
                <div key={time} className="text-center py-2 px-3 bg-gray-50 rounded-lg text-gray-700 text-sm border border-gray-200">
                  {time}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FIXED: Sticky footer - always visible at bottom */}
        <div className="sticky bottom-0 bg-white p-4 border-t border-gray-200 shadow-inner">
          <button 
            onClick={handleSelect}
            className="btn-primary w-full py-3.5 rounded-xl font-semibold text-lg flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Select This Professional</span>
          </button>
        </div>
      </div>
    </div>
  );
};