import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, Menu, X, ArrowRight, User, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ThemeToggle } from './ThemeToggle';

export const Navbar: React.FC = () => {
  const { user, logout, switchDemoPersona } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoMenuOpen, setDemoMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isPublicPage = ['/', '/login', '/register'].includes(location.pathname);

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/90 dark:bg-zinc-950/90 border-b border-rose-100 dark:border-zinc-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl gradient-brand flex items-center justify-center text-white shadow-md shadow-rose-950/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-rose-200" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight text-[#4C0519] dark:text-rose-200">
                  SkillBridge
                </span>
                <span className="text-xs font-bold px-1.5 py-0.2 rounded bg-rose-100 text-[#9F1239] border border-rose-200 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-800">
                  AI
                </span>
              </div>
              <p className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium -mt-1 hidden sm:block">
                Curriculum to Career Engine
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-700 dark:text-zinc-300">
            <a href="/#features" className="hover:text-[#9F1239] dark:hover:text-rose-400 transition-colors">
              Features
            </a>
            <a href="/#how-it-works" className="hover:text-[#9F1239] dark:hover:text-rose-400 transition-colors">
              How It Works
            </a>
            <a href="/#ai-guidance" className="hover:text-[#9F1239] dark:hover:text-rose-400 transition-colors">
              AI Guidance
            </a>
            <Link to="/mentors" className="hover:text-[#9F1239] dark:hover:text-rose-400 transition-colors">
              Mentorship Directory
            </Link>
          </div>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Quick Demo Switcher Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setDemoMenuOpen(!demoMenuOpen)}
                className="text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-[#9F1239] dark:text-rose-300 border border-rose-200 dark:border-zinc-700 flex items-center gap-1 transition-colors cursor-pointer"
                title="Switch test personas instantly"
              >
                <span>Demo Personas</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
              {demoMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-zinc-900 rounded-xl shadow-xl border border-zinc-200 dark:border-zinc-700 p-2 z-50 text-xs">
                  <div className="px-2 py-1 font-semibold text-zinc-400 uppercase tracking-wider text-[10px]">
                    Quick Switch Personas
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      switchDemoPersona('student-2nd');
                      setDemoMenuOpen(false);
                      navigate('/dashboard');
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-rose-50 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 transition-colors flex flex-col cursor-pointer"
                  >
                    <span className="font-semibold text-[#4C0519] dark:text-rose-300">Aarav Sharma</span>
                    <span className="text-[11px] text-zinc-500 dark:text-zinc-400">2nd Year • Machine Learning Engineer</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      switchDemoPersona('student-4th');
                      setDemoMenuOpen(false);
                      navigate('/dashboard');
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-rose-50 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 transition-colors flex flex-col cursor-pointer"
                  >
                    <span className="font-semibold text-[#4C0519] dark:text-rose-300">Neha Verma</span>
                    <span className="text-[11px] text-zinc-500 dark:text-zinc-400">4th Year • AI Engineer (Job-Ready Sprint)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      switchDemoPersona('mentor');
                      setDemoMenuOpen(false);
                      navigate('/mentor-dashboard');
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-rose-50 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 transition-colors flex flex-col border-t border-zinc-100 dark:border-zinc-800 mt-1 pt-1.5 cursor-pointer"
                  >
                    <span className="font-semibold text-[#9F1239] dark:text-rose-400">Dr. Maya Lin (Mentor)</span>
                    <span className="text-[11px] text-zinc-500 dark:text-zinc-400">Staff Scientist • Resource Uploader</span>
                  </button>
                </div>
              )}
            </div>

            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  to={user.role === 'mentor' ? '/mentor-dashboard' : '/dashboard'}
                  className="py-2 px-4 rounded-xl gradient-brand text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm hover:opacity-95 transition-opacity"
                >
                  <User className="w-3.5 h-3.5" />
                  {user.role === 'mentor' ? 'Mentor Dashboard' : 'Open Dashboard'}
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                  className="p-2 rounded-lg text-zinc-500 hover:text-rose-700 hover:bg-rose-50 dark:text-zinc-400 dark:hover:text-rose-300 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="py-2 px-3.5 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:text-[#9F1239] dark:hover:text-rose-400 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="py-2 px-4 rounded-xl gradient-brand text-white text-xs font-semibold flex items-center gap-1 shadow-sm hover:opacity-95 transition-opacity"
                >
                  Get Started <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-zinc-700 dark:text-zinc-300 hover:text-[#9F1239] hover:bg-rose-50 dark:hover:bg-zinc-800 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-rose-100 bg-white px-4 pt-3 pb-6 space-y-3 shadow-lg">
          <div className="flex flex-col space-y-2 text-sm font-medium text-zinc-700">
            <a
              href="/#features"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-rose-50 text-zinc-800"
            >
              Features
            </a>
            <a
              href="/#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-rose-50 text-zinc-800"
            >
              How It Works
            </a>
            <a
              href="/#ai-guidance"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-rose-50 text-zinc-800"
            >
              AI Guidance
            </a>
            <Link
              to="/mentors"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-rose-50 text-zinc-800"
            >
              Mentorship Directory
            </Link>
          </div>

          <div className="pt-3 border-t border-rose-100 flex flex-col gap-2">
            {user ? (
              <>
                <Link
                  to={user.role === 'mentor' ? '/mentor-dashboard' : '/dashboard'}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 px-4 rounded-xl gradient-brand text-white text-xs font-semibold text-center"
                >
                  Go to {user.role === 'mentor' ? 'Mentor Dashboard' : 'Student Dashboard'}
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                    navigate('/');
                  }}
                  className="w-full py-2 px-4 rounded-xl border border-zinc-200 text-xs font-semibold text-zinc-600 text-center"
                >
                  Log Out
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 text-center text-xs font-semibold rounded-xl border border-zinc-200 text-zinc-800"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 text-center text-xs font-semibold rounded-xl gradient-brand text-white"
                >
                  Register Free
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
