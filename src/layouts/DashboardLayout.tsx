import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { MobileNavigation } from '../components/MobileNavigation';
import { ThemeToggle } from '../components/ThemeToggle';
import { Sparkles, Bot, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const DashboardLayout: React.FC = () => {
  const { user, studentPrefs, isSupabaseConnected } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FFF1F2] dark:bg-[#18181B] text-[#27272A] dark:text-[#FAFAFA] flex flex-col md:flex-row transition-colors duration-150">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-16 md:pb-6">
        {/* Top bar */}
        <header className="h-16 border-b border-rose-200/80 dark:border-zinc-800 bg-white/85 dark:bg-zinc-900/60 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 transition-colors">
          {/* Mobile brand */}
          <div className="flex items-center gap-2.5 md:hidden">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4 text-rose-200" />
              </div>
              <span className="font-extrabold text-sm text-zinc-900 dark:text-zinc-100">SkillBridge AI</span>
            </Link>
          </div>

          {/* Desktop Left context indicator */}
          <div className="hidden md:flex items-center gap-3">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-rose-100 text-[#9F1239] border border-rose-200 dark:bg-rose-950/70 dark:text-rose-300 dark:border-rose-900/50 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              {user?.role === 'mentor' ? (
                <span>Mentor Faculty Station</span>
              ) : (
                <span>{studentPrefs?.academicYear} • {studentPrefs?.careerTrack}</span>
              )}
            </span>
            <span className="text-xs text-zinc-600 dark:text-zinc-400">
              {studentPrefs?.collegeName || 'Engineering Campus'}
            </span>
          </div>

          {/* Right quick tools */}
          <div className="flex items-center gap-2.5">
            {isSupabaseConnected ? (
              <span className="hidden sm:flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-800/60">
                <ShieldCheck className="w-3 h-3" /> Supabase Synced
              </span>
            ) : (
              <span className="hidden sm:flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600 border border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700">
                Demo Cache
              </span>
            )}

            {/* Clearly visible theme toggle */}
            <ThemeToggle />

            <button
              type="button"
              onClick={() => navigate('/ai-assistant')}
              className="py-1.5 px-3 rounded-xl gradient-brand text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm hover:opacity-95 transition-opacity cursor-pointer"
            >
              <Bot className="w-3.5 h-3.5 text-rose-200" />
              <span className="hidden sm:inline">Ask AI Assistant</span>
              <span className="sm:hidden">AI</span>
            </button>

            <Link
              to="/profile"
              aria-label="View Profile"
              title="View Profile"
              className="flex items-center gap-2 p-1 rounded-xl hover:bg-rose-100/60 dark:hover:bg-zinc-800 transition-colors"
            >
              <img
                src={user?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                alt={user?.fullName || 'User'}
                className="w-8 h-8 rounded-lg object-cover border border-rose-200 dark:border-zinc-700"
              />
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNavigation />
    </div>
  );
};
