

import React, { useState, useEffect } from 'react';
import anime from 'animejs';

interface Props {
  isOpen: boolean;
  onAccept: () => void;
}

export const DisclaimerModal: React.FC<Props> = ({ isOpen, onAccept }) => {
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    if (isOpen) {
      anime({
        targets: '.disclaimer-content',
        scale: [0.8, 1],
        opacity: [0, 1],
        duration: 400,
        easing: 'easeOutExpo'
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000] flex items-center justify-center p-4">
      <div className="disclaimer-content max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 text-white text-center">
          <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-white/20 flex items-center justify-center">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-1">Important Notice</h2>
          <p className="text-sm opacity-90">Please read before proceeding</p>
        </div>

        <div className="p-6">
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-5 rounded-r-lg">
            <p className="text-yellow-800 font-medium">
              The healthcare professionals displayed on this platform are for demonstration purposes only. 
              All profiles, photos, and credentials shown are fictional and can be replaced with real professionals.
            </p>
          </div>

          <div className="space-y-3 text-sm text-gray-600 mb-6">
            <p className="flex items-start"><span className="text-teal-600 mr-2 mt-0.5">•</span>These are placeholder profiles to showcase the platform's capabilities</p>
            <p className="flex items-start"><span className="text-teal-600 mr-2 mt-0.5">•</span>Replace with verified, licensed healthcare providers in production</p>
            <p className="flex items-start"><span className="text-teal-600 mr-2 mt-0.5">•</span>All appointment data is stored locally for demo purposes</p>
          </div>

          <div className="flex items-center mb-6 p-3 bg-gray-50 rounded-lg">
            <input 
              type="checkbox" 
              id="disclaimer-check" 
              checked={isChecked}
              onChange={(e) => setIsChecked(e.target.checked)}
              className="w-5 h-5 mr-3 text-teal-600 rounded" 
            />
            <label htmlFor="disclaimer-check" className="text-sm text-gray-700 cursor-pointer">
              I understand this is a demo platform
            </label>
          </div>

          <button
            onClick={() => isChecked && onAccept()}
            disabled={!isChecked}
            className="btn-primary w-full py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Proceed to Platform
          </button>
        </div>
      </div>
    </div>
  );
};