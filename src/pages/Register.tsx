import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Sparkles, User, Mail, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

export const Register: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [termsAccepted, setTermsAccepted] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const { register, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!fullName || !email || !password) {
      setErrorMessage('Please fill in all required fields');
      return;
    }
    if (!termsAccepted) {
      setErrorMessage('You must accept the terms of service to continue');
      return;
    }

    const res = await register(fullName, email, password, role);
    if (res.success) {
      navigate('/onboarding');
    } else {
      setErrorMessage(res.error || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF1F2] dark:bg-[#18181B] text-[#27272A] dark:text-[#FAFAFA] flex flex-col font-sans transition-colors duration-150">
      <Navbar />

      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md bg-white dark:bg-[#27272A] rounded-3xl p-6 sm:p-8 border border-rose-200/80 dark:border-[#3F3F46] shadow-xl shadow-rose-950/5 dark:shadow-black/40 transition-colors">
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-2xl gradient-brand flex items-center justify-center text-white mx-auto mb-3 shadow-md shadow-rose-950/20">
              <Sparkles className="w-6 h-6 text-rose-200" />
            </div>
            <h2 className="text-2xl font-bold text-[#4C0519] dark:text-[#FAFAFA]">Join SkillBridge AI</h2>
            <p className="text-xs sm:text-sm text-[#76516B] dark:text-zinc-400 mt-1">
              Start your personalized career journey today
            </p>
          </div>

          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-rose-100 dark:bg-rose-950/80 border border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role selector */}
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                Select Your Role
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('student')}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    role === 'student'
                      ? 'gradient-brand text-white border-transparent shadow-sm'
                      : 'bg-zinc-50 dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:bg-rose-50 dark:hover:bg-zinc-700'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  Engineering Student
                </button>
                <button
                  type="button"
                  onClick={() => setRole('mentor')}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    role === 'mentor'
                      ? 'gradient-brand text-white border-transparent shadow-sm'
                      : 'bg-zinc-50 dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:bg-rose-50 dark:hover:bg-zinc-700'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Personal Mentor
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="Aarav Sharma"
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-zinc-800 dark:text-zinc-100 focus:outline-none focus:border-[#9F1239] dark:focus:border-rose-500 transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="aarav.sharma@college.edu"
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-zinc-800 dark:text-zinc-100 focus:outline-none focus:border-[#9F1239] dark:focus:border-rose-500 transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Create Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Minimum 8 characters"
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-zinc-800 dark:text-zinc-100 focus:outline-none focus:border-[#9F1239] dark:focus:border-rose-500 transition-colors"
                  required
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="terms"
                checked={termsAccepted}
                onChange={e => setTermsAccepted(e.target.checked)}
                className="rounded border-zinc-300 dark:border-zinc-700 text-[#9F1239] focus:ring-[#9F1239] h-4 w-4"
              />
              <label htmlFor="terms" className="text-xs text-zinc-600 dark:text-zinc-400">
                I agree to the SkillBridge AI Terms of Service and Privacy Policy
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl gradient-brand text-white font-semibold text-xs sm:text-sm shadow-md shadow-rose-950/20 hover:opacity-95 transition-opacity flex items-center justify-center gap-1.5 mt-2 cursor-pointer"
            >
              <span>Create Account & Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-zinc-500 dark:text-zinc-400">
            Already registered?{' '}
            <Link to="/login" className="font-semibold text-[#9F1239] dark:text-rose-400 hover:underline">
              Log in to your account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
