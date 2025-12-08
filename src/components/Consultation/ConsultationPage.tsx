'use client';

import React, { useState, useEffect, Suspense } from 'react';
import anime from 'animejs';
import { Professional, BookingData, ConsultationType } from '@/types';
import {
  DisclaimerModal,
  Navigation,
  ProfessionalCard,
  ProfessionalModal,
  BookingPanel,
  BookingConfirmationModal,
  LoadingSpinner,
  ErrorBoundary,
  Notification
} from '@/components/Consultation';
import { professionalsData } from '@/data/professionalsData';
import { debugEmailJS } from '@/utils'; // Import debug function

export const ConsultationPage: React.FC = () => {
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null);
  const [modalProfessional, setModalProfessional] = useState<Professional | null>(null);
  const [booking, setBooking] = useState<BookingData | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Attach debug function to window for console access
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).debugEmailJS = debugEmailJS;
      console.log('🔧 Debug: Type window.debugEmailJS() in console to test EmailJS');
    }
  }, []);

  useEffect(() => {
    const accepted = localStorage.getItem('disclaimerAccepted') === 'true';
    if (accepted) {
      setShowDisclaimer(false);
    }
    setIsLoading(false);
    
    if (!showDisclaimer) {
      anime({
        targets: '.professional-card',
        translateY: [50, 0],
        opacity: [0, 1],
        delay: anime.stagger(150),
        duration: 600,
        easing: 'easeOutExpo'
      });
    }
  }, [showDisclaimer]);

  const handleAcceptDisclaimer = () => {
    localStorage.setItem('disclaimerAccepted', 'true');
    setShowDisclaimer(false);
  };

  const showNotificationMessage = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 5000);
  };

  const handleProfessionalSelect = (professional: Professional) => {
    setSelectedProfessional(professional);
    showNotificationMessage(`${professional.name} selected successfully!`);
  };

  const handleProfessionalClear = () => {
    setSelectedProfessional(null);
    setModalProfessional(null);
  };

  const handleBackClick = () => {
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  };

  const handleBookingSummary = (data: {
    consultationType: ConsultationType;
    date: Date;
    time: string;
    userName: string;
    userEmail: string;
  }) => {
    if (!selectedProfessional) return;

    const bookingData: BookingData = {
      professional: selectedProfessional,
      consultationType: data.consultationType,
      date: data.date,
      time: data.time,
      price: data.consultationType.price,
      userName: data.userName,
      userEmail: data.userEmail
    };

    setBooking(bookingData);
    setShowConfirmation(true);
  };

  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
    setBooking(null);
    setNotification('Booking completed. Thank you!');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50">
        {showDisclaimer && (
          <DisclaimerModal isOpen={showDisclaimer} onAccept={handleAcceptDisclaimer} />
        )}

        {notification && (
          <Notification message={notification} type="success" onClose={() => setNotification(null)} />
        )}

        <Navigation onBackClick={handleBackClick} />

        <main className={`pt-24 pb-16 ${showDisclaimer ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
                Professional Healthcare Consultation
              </h1>
              <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Connect with certified healthcare professionals for personalized treatment plans, expert guidance, and ongoing support throughout your recovery journey.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <span className="w-2 h-8 bg-teal-600 rounded-full mr-3"></span>
                  Available Healthcare Professionals
                </h2>
                
                <Suspense fallback={<LoadingSpinner />}>
                  <div className="grid md:grid-cols-2 gap-6">
                    {professionalsData.map((professional) => (
                      <ProfessionalCard
                        key={professional.id}
                        professional={professional}
                        onSelect={handleProfessionalSelect}
                        onDetailClick={setModalProfessional}
                      />
                    ))}
                  </div>
                </Suspense>
              </div>

              <div className="lg:col-span-1">
                <BookingPanel 
                  selectedProfessional={selectedProfessional}
                  onProfessionalClear={handleProfessionalClear}
                  onBookingSummary={handleBookingSummary}
                />
              </div>
            </div>
          </div>
        </main>

        <ProfessionalModal
          professional={modalProfessional}
          isOpen={!!modalProfessional}
          onClose={() => setModalProfessional(null)}
          onSelect={handleProfessionalSelect}
        />

        <BookingConfirmationModal
          booking={booking}
          isOpen={showConfirmation}
          onClose={handleCloseConfirmation}
        />

        <footer className="bg-gray-900 text-white py-8 mt-16">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <p className="text-gray-400">&copy; 2024 AI Rehab PH. Professional healthcare platform for optimal recovery outcomes.</p>
          </div>
        </footer>
      </div>
    </ErrorBoundary>
  );
};