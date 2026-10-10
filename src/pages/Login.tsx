import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Sparkles, Eye, EyeOff, Lock, Mail, ArrowRight, UserCheck, GraduationCap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [forgotModal, setForgotModal] = useState(false);
  const { login, switchDemoPersona, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!email) {
      setErrorMessage('Please enter your email address');
      return;
    }

    const res = await login(email, password);
    if (res.success) {
      const isMentor = email.toLowerCase().includes('mentor');
      if (from && from !== '/login') {
        const isStudentOnly = from.startsWith('/dashboard') || from.startsWith('/roadmap') || from.startsWith('/projects') || from.startsWith('/internships');
        const isMentorOnly = from.startsWith('/mentor-dashboard');
        if (isMentor && !isStudentOnly) {
          navigate(from, { replace: true });
          return;
        } else if (!isMentor && !isMentorOnly) {
          navigate(from, { replace: true });
          return;
        }
      }

      if (isMentor) {
        navigate('/mentor-dashboard', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    } else {
      setErrorMessage(res.error || 'Authentication error');
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF1F2] dark:bg-[#18181B] text-[#27272A] dark:text-[#FAFAFA] flex flex-col font-sans transition-colors duration-150">
      <Navbar />

      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md bg-white dark:bg-[#27272A] rounded-3xl p-6 sm:p-8 border border-rose-200/80 dark:border-[#3F3F46] shadow-xl shadow-rose-950/5 dark:shadow-black/40 transition-colors">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-2xl gradient-brand flex items-center justify-center text-white mx-auto mb-3 shadow-md shadow-rose-950/20">
              <Sparkles className="w-6 h-6 text-rose-200" />
            </div>
            <h2 className="text-2xl font-bold text-[#4C0519] dark:text-[#FAFAFA]">Welcome Back</h2>
            <p className="text-xs sm:text-sm text-[#76516B] dark:text-zinc-400 mt-1">
              Sign in to continue your career roadmap journey
            </p>
          </div>

          {/* Quick Demo Accounts for Hackathon Judges */}
          <div className="mb-6 p-3.5 rounded-2xl bg-rose-50/70 dark:bg-zinc-950/70 border border-rose-200/80 dark:border-zinc-800 text-xs">
            <div className="font-semibold text-[#9F1239] dark:text-rose-300 mb-2 flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4" /> Quick Hackathon Evaluation Sign-In
            </div>
            <div className="grid grid-cols-2 gap-2 mb-2">
              <button
                type="button"
                onClick={() => {
                  switchDemoPersona('student-2nd');
                  if (from && !from.startsWith('/mentor-dashboard')) {
                    navigate(from, { replace: true });
                  } else {
                    navigate('/dashboard', { replace: true });
                  }
                }}
                className="py-1.5 px-2 rounded-xl bg-white dark:bg-zinc-800 hover:bg-rose-100/70 dark:hover:bg-zinc-700 border border-rose-200 dark:border-zinc-700 text-[#4C0519] dark:text-zinc-200 font-medium text-[11px] transition-colors truncate shadow-xs cursor-pointer"
              >
                2nd Yr ML Student
              </button>
              <button
                type="button"
                onClick={() => {
                  switchDemoPersona('student-4th');
                  if (from && !from.startsWith('/mentor-dashboard')) {
                    navigate(from, { replace: true });
                  } else {
                    navigate('/dashboard', { replace: true });
                  }
                }}
                className="py-1.5 px-2 rounded-xl bg-white dark:bg-zinc-800 hover:bg-rose-100/70 dark:hover:bg-zinc-700 border border-rose-200 dark:border-zinc-700 text-[#4C0519] dark:text-zinc-200 font-medium text-[11px] transition-colors truncate shadow-xs cursor-pointer"
              >
                4th Yr AI Student
              </button>
            </div>
            <button
              type="button"
              onClick={() => {
                switchDemoPersona('mentor');
                const isStudentOnly = from && (from.startsWith('/dashboard') || from.startsWith('/roadmap') || from.startsWith('/projects') || from.startsWith('/internships'));
                if (from && !isStudentOnly) {
                  navigate(from, { replace: true });
                } else {
                  navigate('/mentor-dashboard', { replace: true });
                }
              }}
              className="w-full py-1.5 px-2 rounded-xl gradient-brand text-white font-medium text-[11px] transition-opacity hover:opacity-95 text-center shadow-xs cursor-pointer"
            >
              Dr. Maya Lin (Staff Mentor Profile)
            </button>
          </div>

          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-rose-100 dark:bg-rose-950/80 border border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="student@university.edu"
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-zinc-800 dark:text-zinc-100 focus:outline-none focus:border-[#9F1239] dark:focus:border-rose-500 transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">Password</label>
                <button
                  type="button"
                  onClick={() => setForgotModal(true)}
                  className="text-xs text-[#9F1239] dark:text-rose-400 hover:underline cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 rounded-xl pl-10 pr-10 py-2.5 text-xs sm:text-sm text-zinc-800 dark:text-zinc-100 focus:outline-none focus:border-[#9F1239] dark:focus:border-rose-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 absolute right-2.5 top-1/2 -translate-y-1/2 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl gradient-brand text-white font-semibold text-xs sm:text-sm shadow-md shadow-rose-950/20 hover:opacity-95 transition-opacity flex items-center justify-center gap-1.5 mt-2 cursor-pointer"
            >
              <span>Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-zinc-500 dark:text-zinc-400">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-semibold text-[#9F1239] dark:text-rose-400 hover:underline">
              Create an account
            </Link>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {forgotModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-rose-200 dark:border-zinc-700 text-[#27272A] dark:text-zinc-100 transition-colors">
            <h3 className="text-base font-bold text-[#4C0519] dark:text-rose-300 mb-2">Password Reset</h3>
            <p className="text-xs text-[#76516B] dark:text-zinc-400 mb-4 leading-relaxed">
              In demo and hackathon mode, password recovery emails are routed through Supabase Auth. To continue without waiting for email verification, simply use one of the one-click demo personas above!
            </p>
            <button
              type="button"
              onClick={() => setForgotModal(false)}
              className="w-full py-2 rounded-xl gradient-brand text-white text-xs font-semibold cursor-pointer"
            >
              Understood, Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
