import React from 'react';

interface Props {
  onBackClick: () => void;
}

export const Navigation: React.FC<Props> = ({ onBackClick }) => {
  return (
    <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-md z-50 border-b border-gray-200/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-600 to-teal-700 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-teal-800 bg-clip-text text-transparent">
              AI Rehab PH
            </span>
          </div>

          {/* Center Links */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="/" className="nav-link text-gray-700 hover:text-teal-600 font-medium px-3 py-2 rounded-lg hover:bg-teal-50 transition-all">
              Home
            </a>
            <a href="/assessment" className="nav-link text-gray-700 hover:text-teal-600 font-medium px-3 py-2 rounded-lg hover:bg-teal-50 transition-all">
              Assessment
            </a>
            <a href="/exercises" className="nav-link text-gray-700 hover:text-teal-600 font-medium px-3 py-2 rounded-lg hover:bg-teal-50 transition-all">
              Exercises
            </a>
            <a href="/consultation" className="nav-link text-gray-700 hover:text-teal-600 font-medium px-3 py-2 rounded-lg hover:bg-teal-50 transition-all">
              Consultation
            </a>
          </div>

          {/* Back Button */}
          <button 
            onClick={onBackClick}
            className="btn-primary px-6 py-2.5 rounded-xl font-semibold flex items-center space-x-2 shadow-md hover:shadow-lg transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to Home</span>
          </button>
        </div>
      </div>
    </nav>
  );
};