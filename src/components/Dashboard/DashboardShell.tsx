'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSupabase } from "@/lib/supabase-context"; // ✅ NEW

interface Props {
  children: React.ReactNode;
  user: Profile | null;
}

export function DashboardShell({ children, user }: Props) {
  const router = useRouter();
  const supabase = useSupabase();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  const navItems = [
    { icon: '📊', label: 'Overview', path: '/dashboard', component: 'home' },
    { icon: '🩹', label: 'Injuries', path: '/dashboard/injuries', component: 'injuries' },
    { icon: '📈', label: 'Progress', path: '/dashboard/progress', component: 'progress' },
    { icon: '🏋️', label: 'Exercises', path: '/dashboard/exercises', component: 'exercises' },
    { icon: '📅', label: 'Appointments', path: '/dashboard/appointments', component: 'appointments' },
    { icon: '🤖', label: 'AI Analysis', path: '/dashboard/reports', component: 'reports' },
  ];

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-teal-50">
      {/* Sidebar */}
      <aside className={`${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:relative z-50 w-64 h-full bg-white/90 backdrop-blur-md border-r border-teal-100 transition-transform duration-300`}>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-r from-teal-600 to-teal-700 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Rehab Dashboard</h2>
          </div>
          <nav className="space-y-2">
            {navItems.map((item) => (
              <a
                key={item.path}
                href={item.path}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition group
                  ${router.pathname === item.path ? 'bg-teal-100 text-teal-900 border-l-4 border-teal-600' : 'text-gray-700 hover:bg-teal-50 hover:text-teal-700'}`}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </a>
            ))}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-orange-600 hover:bg-orange-50 transition mt-8"
            >
              <span>🚪</span> <span className="font-medium">Logout</span>
            </button>
          </nav>
        </div>
      </aside>

      {/* Mobile Toggle */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white/80 rounded-lg border border-teal-100"
      >
        <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Overlay */}
      {isMenuOpen && <div onClick={() => setIsMenuOpen(false)} className="lg:hidden fixed inset-0 bg-black/50 z-40" />}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className={`sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-teal-100 transition-shadow ${scrolled ? 'shadow-lg' : ''}`}>
          <div className="flex justify-between items-center p-4 max-w-7xl mx-auto">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-teal-600 to-teal-700 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">{user?.full_name?.[0] || 'U'}</span>
              </div>
              <div>
                <p className="text-gray-900 font-semibold">{user?.full_name || 'User'}</p>
                <p className="text-gray-600 text-sm">{user?.medical_record_number || 'No MR#'}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="p-2 hover:bg-teal-50 rounded-lg transition" title="Notifications">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM10.5 3.5a6 6 0 00-6 6v1.5h12V9.5a6 6 0 00-6-6z" />
                </svg>
              </button>
              <button className="p-2 hover:bg-teal-50 rounded-lg transition" title="Settings">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}