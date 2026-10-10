import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Home, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const NotFound: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#18181B] text-[#FAFAFA] flex items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl">
        <div className="w-16 h-16 rounded-2xl gradient-brand flex items-center justify-center text-white mx-auto mb-4 shadow-lg shadow-rose-950/40">
          <Sparkles className="w-8 h-8 text-rose-200" />
        </div>
        <h1 className="text-4xl font-extrabold text-zinc-100 mb-2">404</h1>
        <h2 className="text-lg font-bold text-rose-300 mb-3">Page Not Found</h2>
        <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
          The roadmap or resource you were trying to access does not exist or may have been updated.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to={user?.role === 'mentor' ? '/mentor-dashboard' : '/dashboard'}
            className="w-full sm:w-auto py-2.5 px-5 rounded-xl gradient-brand text-white text-xs font-semibold shadow-md flex items-center justify-center gap-1.5"
          >
            <Home className="w-4 h-4" /> Go to Dashboard
          </Link>
          <Link
            to="/"
            className="w-full sm:w-auto py-2.5 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold border border-zinc-700 flex items-center justify-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" /> Return Home
          </Link>
        </div>
      </div>
    </div>
  );
};
