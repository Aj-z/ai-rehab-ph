'use client';

import React, { useState, useEffect } from 'react';
import anime from 'animejs';
import { BookingData } from '@/types';
import { generateAppointmentPDF, sendAppointmentEmail, formatDate, isEmailJSConfigured, getEmailJSConfigStatus } from '@/utils';

interface Props {
  booking: BookingData | null;
  isOpen: boolean;
  onClose: () => void;
}

export const BookingConfirmationModal: React.FC<Props> = ({ booking, isOpen, onClose }) => {
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [emailSuccess, setEmailSuccess] = useState(false);
  const [emailError, setEmailError] = useState('');

  useEffect(() => {
    if (isOpen) {
      anime({ targets: '.confirmation-content', scale: [0.8, 1], opacity: [0, 1], duration: 400, easing: 'easeOutExpo' });
    }
  }, [isOpen]);

  if (!booking) return null;

  const consultationTypeText = {
    'initial': 'Initial Consultation',
    'followup': 'Follow-up Session',
    'urgent': 'Urgent Consultation'
  };

  const handleDownloadPDF = () => {
    try {
      generateAppointmentPDF(booking);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 2000);
    } catch (error) {
      setEmailError('Failed to generate PDF: ' + (error instanceof Error ? error.message : 'Unknown error'));
      setTimeout(() => setEmailError(''), 5000);
    }
  };

  const handleConfirmBooking = async () => {
    // Don't proceed if not configured in production
    if (process.env.NODE_ENV === 'production' && !isEmailJSConfigured()) {
      setEmailError('Email service not configured. Please contact support.');
      setTimeout(() => setEmailError(''), 5000);
      return;
    }
    
    setIsSending(true);
    setEmailError('');
    
    console.log('🚀 Confirming booking and sending email...');
    console.log('To:', booking.userEmail);
    console.log('Patient:', booking.userName);
    
    const success = await sendAppointmentEmail(booking, booking.userEmail);
    
    setIsSending(false);
    if (success) {
      setEmailSuccess(true);
      setTimeout(() => {
        setEmailSuccess(false);
        onClose();
      }, 2000);
    } else {
      const configStatus = getEmailJSConfigStatus();
      setEmailError(`Email failed: ${configStatus}. Check browser console for details.`);
      setTimeout(() => setEmailError(''), 5000);
    }
  };

  return (
    <div className={`modal fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center ${isOpen ? 'active' : ''}`}
         onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="confirmation-content bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 overflow-hidden">
        {/* Success Icon */}
        <div className="relative bg-gradient-to-r from-green-500 to-emerald-500 p-8 text-center">
          <div className="w-20 h-20 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-3xl font-bold text-white mb-2">Confirm Your Booking</h3>
          <p className="text-white/90">Please review your appointment details</p>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Configuration Status Warning */}
          {!isEmailJSConfigured() && (
            <div className="mb-5 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800 text-sm">
                ⚠️ EmailJS not configured. Emails will be logged to console only.
                <button onClick={() => window.open('https://dashboard.emailjs.com/admin/integration', '_blank')}
                        className="text-teal-600 ml-1 underline">Set up EmailJS</button>
              </p>
            </div>
          )}

          {/* Details */}
          <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-xl p-5 mb-6 border border-teal-200">
            <h4 className="font-bold text-gray-900 mb-4 flex items-center">
              <svg className="w-5 h-5 text-teal-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Appointment Summary
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-600">Patient:</span><span className="font-semibold text-gray-900">{booking.userName}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Professional:</span><span className="font-semibold text-gray-900">{booking.professional.name}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Type:</span><span className="font-semibold text-teal-600">{consultationTypeText[booking.consultationType.id as keyof typeof consultationTypeText]}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Date:</span><span className="font-semibold text-gray-900">{formatDate(booking.date)}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Time:</span><span className="font-semibold text-gray-900">{booking.time}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Duration:</span><span className="font-semibold text-gray-900">{booking.consultationType.duration}</span></div>
              <div className="flex justify-between pt-2 border-t border-white/50"><span className="text-gray-600">Total:</span><span className="font-bold text-lg text-teal-600">{booking.price}</span></div>
            </div>
          </div>

          {/* Email Confirmation */}
          <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Confirmation will be sent to:</strong><br/>
              <span className="font-mono">{booking.userEmail}</span>
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button onClick={handleDownloadPDF} className={`download-btn flex-1 py-3 rounded-xl font-semibold flex items-center justify-center space-x-2 ${downloadSuccess ? 'bg-green-600 text-white' : 'btn-secondary'}`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>{downloadSuccess ? 'Downloaded!' : 'Download PDF'}</span>
            </button>
            
            <button onClick={handleConfirmBooking} disabled={isSending} className="btn-primary flex-1 py-3 rounded-xl font-semibold disabled:opacity-50">
              {isSending ? 'Confirming...' : 'Confirm & Send Email'}
            </button>

            <button onClick={onClose} className="btn-secondary px-6 py-3 rounded-xl font-semibold">
              Cancel
            </button>
          </div>

          {emailSuccess && <p className="text-green-600 text-sm mt-3 text-center">✅ Email sent successfully!</p>}
          {emailError && <p className="text-red-600 text-sm mt-3 text-center">{emailError}</p>}
        </div>
      </div>
    </div>
  );
};