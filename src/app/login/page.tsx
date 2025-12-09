'use client';

import AuthForm from '@/components/AuthForm';
import { useSearchParams } from 'next/navigation';
import { toast, Toaster } from 'sonner';
import { useEffect } from 'react';
import { Suspense } from 'react';

function LoginContent() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const error = searchParams.get('error');
    const errorCode = searchParams.get('error_code');
    
    if (error) {
      switch (error) {
        case 'access_denied':
          toast.error('Authentication failed', {
            description: 'Session expired or invalid. Please sign in again.',
          });
          break;
        case 'profile_not_found':
          toast.error('Profile not found', {
            description: 'Your account needs setup. Please contact support.',
          });
          break;
        case 'profile_create_failed':
          toast.error('Account setup failed', {
            description: 'Please try again or contact support.',
          });
          break;
        case 'session_error':
          toast.error('Session error', {
            description: 'Please sign in again.',
          });
          break;
        default:
          toast.error('Error', {
            description: 'Something went wrong. Please try again.',
          });
      }
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-cyan-900 to-slate-800 flex items-center justify-center p-4">
      <Toaster position="top-right" theme="dark" />
      
      <div className="w-full max-w-md glass-card rounded-2xl p-8 border border-white/10 shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-black mb-2">Rehab AI</h1>
          <p className="text-gray-400">Sign up with your email</p>
        </div>
         
        <AuthForm />
        <button 
          className="w-full mt-6 bg-cyan-600 text-white py-2 rounded-lg hover:cyan-700"
          onClick={() => window.location.href = "/dashboard"}
        >
          <p className="text-center text-sm text-gray-200">
            Already have magic link? {' '}
            <button 
              className="text-white hover:text-cyan-400 font-medium"
              onClick={() => window.location.href = "/dashboard"}
            >
              then go to the dashboard 
            </button>
          </p>
        </button>
         
        <div className="mt-6 pt-6 border-t border-white/10">
          
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-cyan-900 to-slate-800 flex items-center justify-center p-4">
        <div className="w-full max-w-md glass-card rounded-2xl p-8 border border-white/10 shadow-2xl">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
              <span className="text-2xl font-bold text-white">AI</span>
            </div>
            <p className="text-gray-400">Loading...</p>
          </div>
        </div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}