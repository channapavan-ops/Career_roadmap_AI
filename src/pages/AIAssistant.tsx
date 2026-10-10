import React from 'react';
import { Bot, Sparkles, MessageSquare, Zap, BookOpen } from 'lucide-react';
import { ChatWindow } from '../components/ChatWindow';
import { useAuth } from '../context/AuthContext';

export const AIAssistant: React.FC = () => {
  const { studentPrefs } = useAuth();

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl bg-white dark:bg-[#27272A] border border-rose-200/80 dark:border-[#3F3F46] p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors">
        <div>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-rose-100 text-[#9F1239] border border-rose-200 dark:bg-rose-950/80 dark:text-rose-300 dark:border-rose-900/60 flex items-center gap-1.5">
              <Bot className="w-3.5 h-3.5 text-[#9F1239] dark:text-rose-400" />
              Gemini 3.8 Flash • AI Career Assistant
            </span>
            <span className="text-xs text-[#76516B] dark:text-zinc-400">
              Personalized for {studentPrefs?.academicYear} • {studentPrefs?.careerTrack}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#27272A] dark:text-[#FAFAFA]">
            24/7 AI Career & Study Assistant
          </h1>
          <p className="text-xs sm:text-sm text-[#76516B] dark:text-[#D4D4D8] mt-1 max-w-2xl leading-relaxed">
            Get instant, mathematically sound explanations, code reviews, project architectures, and step-by-step guidance tailored to your ongoing roadmap modules.
          </p>
        </div>
      </div>

      {/* Embedded Chat Window */}
      <ChatWindow />
    </div>
  );
};
