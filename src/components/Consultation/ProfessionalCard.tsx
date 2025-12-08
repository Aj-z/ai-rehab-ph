'use client';

import React from 'react';
import anime from 'animejs';
import { Professional } from '../../types';

interface Props {
  professional: Professional;
  onSelect: (professional: Professional) => void;
  onDetailClick: (professional: Professional) => void;
}

export const ProfessionalCard: React.FC<Props> = ({ professional, onSelect, onDetailClick }) => {
  const handleCardClick = (event: React.MouseEvent<HTMLDivElement>) => {
    anime({
      targets: event.currentTarget,
      scale: [1, 0.98, 1],
      duration: 150,
      easing: 'easeOutQuad'
    });
    onDetailClick(professional);
  };

  const handleSelectClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    anime({
      targets: event.currentTarget,
      scale: [1, 1.05, 1],
      duration: 200,
      easing: 'easeOutQuad'
    });
    onSelect(professional);
  };

  const stars = '★'.repeat(Math.floor(professional.rating)) + (professional.rating % 1 ? '☆' : '');

  return (
    <div 
      className="professional-card glass-card rounded-2xl overflow-hidden cursor-pointer group hover:shadow-2xl transition-all duration-300"
      onClick={handleCardClick}
    >
      <div className="p-6">
        <div className="flex items-start mb-5">
          <img 
            src={professional.image} 
            alt={professional.name}
            className="w-20 h-20 rounded-full object-cover mr-4 border-4 border-teal-100 group-hover:border-teal-200 transition-all"
          />
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-1">{professional.name}</h3>
            <div className="text-teal-600 font-semibold mb-1">{professional.specialty}</div>
            <div className="text-sm text-gray-500">{professional.experience} experience</div>
          </div>
        </div>

        <div className="flex items-center mb-4">
          <div className="rating-stars text-lg mr-2">{stars}</div>
          <span className="text-gray-600 font-medium">{professional.rating}</span>
          <span className="text-gray-400 text-sm ml-2">(127 reviews)</span>
        </div>

        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {professional.specializations.slice(0, 2).map(spec => (
              <span key={spec} className="specialization-tag">
                {spec}
              </span>
            ))}
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-5 line-clamp-3 leading-relaxed">
          {professional.bio}
        </p>

        <button 
          onClick={handleSelectClick}
          className="btn-primary w-full py-3 rounded-xl font-semibold flex items-center justify-center space-x-2 group-hover:shadow-lg transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Select Professional</span>
        </button>
      </div>
    </div>
  );
};