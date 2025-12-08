'use client';

import AuthForm from '@/components/AuthForm';
import { useSearchParams } from 'next/navigation';
import { toast, Toaster } from 'sonner';
import { useEffect } from 'react';

export default function LoginPage() {
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
            <span className="text-2xl font-bold text-white">AI</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Rehab AI</h1>
          <p className="text-gray-400">Sign in with your email</p>
        </div>

        <AuthForm />

        <div className="mt-6 pt-6 border-t border-white/10">
          <p className="text-center text-sm text-gray-400">
            New to Rehab AI?{' '}
            <a href="/register" className="text-cyan-400 hover:text-cyan-300 font-medium">
              Create an account
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}