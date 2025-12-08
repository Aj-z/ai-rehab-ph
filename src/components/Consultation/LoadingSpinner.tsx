'use client';

import React, { useEffect } from 'react'; // FIXED: Added useEffect import
import anime from 'animejs';

export const LoadingSpinner: React.FC = () => {
  useEffect(() => {
    anime({
      targets: '.spinner-circle',
      rotate: 360,
      duration: 1000,
      easing: 'linear',
      loop: true
    });
  }, []);

  return (
    <div className="flex items-center justify-center py-12">
      <div className="spinner-circle w-12 h-12 rounded-full border-4 border-teal-200 border-t-teal-600"></div>
    </div>
  );
};