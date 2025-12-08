'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase-client';
import { useRouter } from 'next/navigation';
import { Profile } from '@/types';
import { useSupabase } from '@/lib/supabase-context'; // ✅ NEW 
interface Props {
  children: React.ReactNode;
  user: Profile | null;
}

export function DashboardShell({ children, user }: Props) {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const supabase = useSupabase();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-900 via-cyan-900 to-slate-800">
      {/* Sidebar */}
      <aside className={`${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:relative z-50 w-64 h-full bg-slate-800/80 backdrop-blur-md border-r border-white/10 transition-transform`}>
        <div className="p-6">
          <h2 className="text-2xl font-bold text-cyan-300 mb-8">Rehab Dashboard</h2>
          <nav className="space-y-3">
            <NavItem icon="📊" label="Overview" active />
            <NavItem icon="🩹" label="Injuries" />
            <NavItem icon="📈" label="Progress" />
            <NavItem icon="🏋️" label="Exercises" />
            <NavItem icon="📅" label="Appointments" />
            <NavItem icon="📄" label="Reports" />
            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-red-400 hover:bg-red-500/10 transition">
              <span>🚪</span> Logout
            </button>
          </nav>
        </div>
      </aside>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-slate-800/80 rounded-lg border border-white/10"
      >
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Mobile Overlay */}
      {isMenuOpen && (
        <div
          onClick={() => setIsMenuOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
        />
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="sticky top-0 z-30 bg-slate-800/60 backdrop-blur-md border-b border-white/10 p-4">
          <div className="flex justify-between items-center max-w-7xl mx-auto">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">{user?.full_name?.[0] || 'U'}</span>
              </div>
              <div>
                <p className="text-white font-semibold">{user?.full_name || 'User'}</p>
                <p className="text-gray-400 text-sm">{user?.medical_record_number || 'No MR#'}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="p-2 hover:bg-white/10 rounded-lg transition">
                <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM10.5 3.5a6 6 0 00-6 6v1.5h12V9.5a6 6 0 00-6-6z" />
                </svg>
              </button>
              <button className="p-2 hover:bg-white/10 rounded-lg transition">
                <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </button>
            </div>
          </div>
        </header>
        
        {children}
      </div>
    </div>
  );
}

function NavItem({ icon, label, active = false }: { icon: string; label: string; active?: boolean }) {
  return (
    <button className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-left transition ${
      active ? 'bg-cyan-500/20 text-cyan-300' : 'text-gray-300 hover:bg-white/10'
    }`}>
      <span>{icon}</span>
      <span>{label}</span>
    </button>
  );
}