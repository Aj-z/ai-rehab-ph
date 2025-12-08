import React, { useState, useEffect } from 'react';
import anime from 'animejs';

interface NotificationProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}

export const Notification: React.FC<NotificationProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    // Animate in
    anime({
      targets: '.notification',
      translateX: [300, 0],
      opacity: [0, 1],
      duration: 400,
      easing: 'easeOutExpo'
    });

    // Auto close after 5 seconds
    const timer = setTimeout(() => {
      handleClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    anime({
      targets: '.notification',
      translateX: [0, 300],
      opacity: [1, 0],
      duration: 300,
      easing: 'easeInExpo',
      complete: onClose
    });
  };

  const bgColor = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500'
  }[type];

  const icon = {
    success: '✓',
    error: '✕',
    info: 'i'
  }[type];

  return (
    <div className={`notification fixed top-24 right-6 ${bgColor} text-white p-4 rounded-xl shadow-2xl z-[300] max-w-sm flex items-center space-x-3`}>
      <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center font-bold">
        {icon}
      </div>
      <p className="flex-1 text-sm font-medium">{message}</p>
      <button onClick={handleClose} className="hover:bg-white/20 rounded-full p-1">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};