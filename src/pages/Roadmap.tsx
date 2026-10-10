import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import {
  Compass,
  Filter,
  Search,
  Sparkles,
  Calendar,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useRoadmapProgress } from '../hooks/useRoadmapProgress';
import { RoadmapCard } from '../components/RoadmapCard';
import { ProgressBar } from '../components/ProgressBar';
import { CareerReadinessView } from '../components/CareerReadinessView';
import { AcademicYear, CareerTrack } from '../types';

export const Roadmap: React.FC = () => {
  const { studentPrefs, updateStudentPrefs, user } = useAuth();
  const { roadmap, completedTopicIds, progressSummary, toggleTopic } = useRoadmapProgress();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  // Prevent accessing roadmap if student has not completed onboarding
  if (!studentPrefs?.academicYear || !studentPrefs?.onboardingCompleted) {
    return <Navigate to="/onboarding" replace />;
  }

  const currentYear = studentPrefs.academicYear;
  const currentTrack = studentPrefs.careerTrack || 'Machine Learning Engineer';
  const isFourthYear = currentYear === '4th Year';

  // Filter modules/topics by search query or difficulty for 1st, 2nd, and 3rd year students
  const filteredModules = (!isFourthYear && roadmap?.modules)
    ? roadmap.modules.map(mod => {
        const matchingTopics = mod.topics.filter(t => {
          const matchesSearch =
            searchQuery === '' ||
            t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.description.toLowerCase().includes(searchQuery.toLowerCase());

          const matchesDiff =
            selectedDifficulty === 'all' || t.difficulty.toLowerCase() === selectedDifficulty.toLowerCase();

          return matchesSearch && matchesDiff;
        });

        return {
          ...mod,
          topics: matchingTopics,
        };
      }).filter(mod => mod.topics.length > 0)
    : [];

  return (
    <div className="space-y-6">
      {/* Header with Track & Academic Year Control Bar */}
      <div className="rounded-2xl bg-white dark:bg-[#27272A] border border-rose-200/80 dark:border-[#3F3F46] p-6 shadow-sm transition-colors">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-rose-100 dark:border-zinc-800">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-rose-100 text-[#9F1239] border border-rose-200 dark:bg-rose-950/80 dark:text-rose-300 dark:border-rose-900/60 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#9F1239] dark:text-rose-400" />
                {currentTrack}
              </span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-rose-50 text-zinc-700 border border-rose-200/80 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {currentYear === '1st Year'
                  ? 'Years 1–4 (4-Year Curriculum)'
                  : currentYear === '2nd Year'
                  ? 'Years 2–4 (3-Year Curriculum)'
                  : currentYear === '3rd Year'
                  ? 'Years 3–4 (2-Year Curriculum)'
                  : '4th Year (Senior Class)'}
              </span>
              {isFourthYear && (
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-400 text-black shadow-xs">
                  Career-Readiness & Skill-Gap Mode
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#27272A] dark:text-[#FAFAFA]">
              {isFourthYear
                ? `${currentTrack} — Senior Year Career-Readiness & Skill-Gap Dashboard`
                : roadmap.title}
            </h1>
            <p className="text-xs sm:text-sm text-[#76516B] dark:text-[#D4D4D8] mt-1.5 max-w-2xl leading-relaxed">
              {isFourthYear
                ? 'Designed exclusively for graduating engineers. Evaluates missing concepts, sets high-yield revision milestones, showcases capstone portfolios, and preps for technical hiring interviews.'
                : roadmap.description}
            </p>
          </div>

          {/* Quick Progress Dial (Shown ONLY for 1st, 2nd, and 3rd year students) */}
          {!isFourthYear && (
            <div className="w-full md:w-64 bg-rose-50/50 dark:bg-zinc-950/70 p-4 rounded-2xl border border-rose-200/80 dark:border-zinc-800 shrink-0">
              <ProgressBar
                percentage={progressSummary.percentage}
                completed={progressSummary.completedRequired}
                total={progressSummary.totalRequired}
                size="md"
              />
              <div className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-2 text-right">
                {progressSummary.completedHours} of {progressSummary.totalHours} estimated study hours
              </div>
            </div>
          )}
        </div>

        {/* Dynamic Controls: Switch Year & Track instantly */}
        <div className="pt-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">Academic Year:</span>
            {(['1st Year', '2nd Year', '3rd Year', '4th Year'] as AcademicYear[]).map(yr => (
              <button
                key={yr}
                type="button"
                onClick={() => updateStudentPrefs({ academicYear: yr })}
                className={`text-xs px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer ${
                  currentYear === yr
                    ? 'gradient-brand text-white shadow-sm'
                    : 'bg-rose-50 hover:bg-rose-100/70 text-zinc-700 border border-rose-200/80 dark:bg-zinc-800 dark:hover:bg-zinc-700/80 dark:text-zinc-300 dark:border-zinc-700'
                }`}
              >
                {yr}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">Career Goal:</span>
            {(['AI Engineer', 'Machine Learning Engineer'] as CareerTrack[]).map(trk => (
              <button
                key={trk}
                type="button"
                onClick={() => updateStudentPrefs({ careerTrack: trk })}
                className={`text-xs px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer ${
                  currentTrack === trk
                    ? 'gradient-brand text-white shadow-sm'
                    : 'bg-rose-50 hover:bg-rose-100/70 text-zinc-700 border border-rose-200/80 dark:bg-zinc-800 dark:hover:bg-zinc-700/80 dark:text-zinc-300 dark:border-zinc-700'
                }`}
              >
                {trk}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Conditionally Render Experience:
          For 4th Year: Show ONLY Career-Readiness & Skill-Gap Dashboard with NO regular roadmap entry points.
          For 1st, 2nd, 3rd Year: Show regular multi-year / tailored roadmap modules.
      */}
      {isFourthYear ? (
        <CareerReadinessView
          userId={user?.id || 'demo-user'}
          careerTrack={currentTrack}
        />
      ) : (
        <>
          {/* Search and Difficulty Filter Toolbar for regular roadmaps */}
          <div className="rounded-2xl bg-white dark:bg-[#27272A] border border-rose-200/80 dark:border-[#3F3F46] p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm transition-colors">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search topics, algorithms, exercises..."
                className="w-full bg-rose-50/50 dark:bg-zinc-950 border border-rose-200 dark:border-zinc-800 focus:border-[#9F1239] dark:focus:border-rose-500 rounded-xl pl-10 pr-4 py-2 text-xs text-zinc-800 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none transition-colors"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="w-4 h-4 text-zinc-400" />
              <span className="text-xs text-zinc-600 dark:text-zinc-400">Difficulty:</span>
              <select
                value={selectedDifficulty}
                onChange={e => setSelectedDifficulty(e.target.value)}
                className="bg-rose-50/50 dark:bg-zinc-950 border border-rose-200 dark:border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-zinc-800 dark:text-zinc-200 focus:outline-none transition-colors"
              >
                <option value="all">All Difficulties</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>

          {/* Module Cards List for 1st, 2nd, and 3rd year students */}
          <div className="space-y-6">
            {filteredModules.length > 0 ? (
              filteredModules.map(module => (
                <RoadmapCard
                  key={module.id}
                  module={module}
                  completedTopicIds={completedTopicIds}
                  onToggleTopic={toggleTopic}
                />
              ))
            ) : (
              <div className="p-12 text-center rounded-2xl bg-white dark:bg-zinc-900/60 border border-rose-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400">
                <Compass className="w-10 h-10 mx-auto text-zinc-400 dark:text-zinc-600 mb-2" />
                <p className="text-sm">No topics match your current search or difficulty filter.</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
