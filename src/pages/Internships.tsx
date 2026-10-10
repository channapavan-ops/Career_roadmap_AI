import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  Search,
  Filter,
  Bookmark,
  ExternalLink,
  Compass,
  AlertCircle,
  Clock,
  Sparkles,
  BookmarkCheck,
} from 'lucide-react';
import { INITIAL_INTERNSHIPS } from '../data/internshipData';
import { InternshipCard } from '../components/InternshipCard';
import { useAuth } from '../context/AuthContext';
import { storageHelper } from '../services/supabase';

const SAVED_INTERNSHIPS_KEY = 'saved_internship_ids';

export const Internships: React.FC = () => {
  const { studentPrefs } = useAuth();
  const isFirstYear = studentPrefs?.academicYear === '1st Year';

  const [search, setSearch] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedWorkplace, setSelectedWorkplace] = useState('all');
  const [showSavedOnly, setShowSavedOnly] = useState(false);

  const [savedIds, setSavedIds] = useState<string[]>(() => {
    return storageHelper.get<string[]>(SAVED_INTERNSHIPS_KEY, ['intern-1']);
  });

  const toggleSave = (id: string) => {
    const updated = savedIds.includes(id)
      ? savedIds.filter(item => item !== id)
      : [...savedIds, id];
    setSavedIds(updated);
    storageHelper.set(SAVED_INTERNSHIPS_KEY, updated);
  };

  const filteredInternships = INITIAL_INTERNSHIPS.filter(item => {
    const matchesSearch =
      search === '' ||
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.company.toLowerCase().includes(search.toLowerCase()) ||
      item.requiredSkills.some(s => s.toLowerCase().includes(search.toLowerCase()));

    const matchesRole =
      selectedRole === 'all' || item.title.toLowerCase().includes(selectedRole.toLowerCase());

    const matchesWorkplace =
      selectedWorkplace === 'all' || item.workplaceType.toLowerCase() === selectedWorkplace.toLowerCase();

    const matchesSaved = !showSavedOnly || savedIds.includes(item.id);

    return matchesSearch && matchesRole && matchesWorkplace && matchesSaved;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl bg-white dark:bg-[#27272A] border border-rose-200/80 dark:border-[#3F3F46] p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 transition-colors">
        <div>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-rose-100 text-[#9F1239] border border-rose-200 dark:bg-rose-950/80 dark:text-rose-300 dark:border-rose-900/60 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-[#9F1239] dark:text-rose-400" />
              Explore Internship Opportunities
            </span>
            <span className="text-xs text-[#76516B] dark:text-zinc-400">
              Filtered for {studentPrefs?.academicYear}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#27272A] dark:text-[#FAFAFA]">
            Internship Discovery & Hiring Tracks
          </h1>
          <p className="text-xs sm:text-sm text-[#76516B] dark:text-[#D4D4D8] mt-1 max-w-2xl leading-relaxed">
            Curated machine learning and AI openings matching your current academic standing. All opportunities clearly indicate eligibility and technical requirements.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setShowSavedOnly(!showSavedOnly)}
            className={`py-2 px-3.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              showSavedOnly
                ? 'gradient-brand text-white shadow-sm'
                : 'bg-rose-50 hover:bg-rose-100 text-[#9F1239] border border-rose-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-300 dark:border-zinc-700'
            }`}
          >
            <BookmarkCheck className="w-4 h-4 text-[#9F1239] dark:text-rose-300" />
            <span>Saved ({savedIds.length})</span>
          </button>
        </div>
      </div>

      {/* First-Year Focus Notice */}
      {isFirstYear ? (
        <div className="rounded-2xl bg-white dark:bg-[#27272A] border border-rose-200 dark:border-rose-950/80 p-8 text-center max-w-3xl mx-auto shadow-sm transition-colors">
          <div className="w-16 h-16 rounded-3xl gradient-brand flex items-center justify-center text-white mx-auto mb-4 shadow-lg shadow-rose-950/20">
            <Compass className="w-8 h-8 text-rose-200" />
          </div>
          <h2 className="text-xl font-bold text-[#4C0519] dark:text-zinc-100 mb-2">
            First-Year Recommendation: Prioritize Foundations & Portfolio Projects
          </h2>
          <p className="text-xs sm:text-sm text-[#76516B] dark:text-zinc-400 max-w-xl mx-auto leading-relaxed mb-6">
            In our curriculum philosophy, first-year engineering students receive the highest career return by mastering Python, Linear Algebra, and building 2–3 demonstrable CLI/data analysis repositories rather than prematurely applying to corporate internships.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/projects"
              className="w-full sm:w-auto py-2.5 px-5 rounded-xl gradient-brand text-white text-xs font-semibold shadow-md"
            >
              Explore 1st-Year Projects
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* Filters Bar */}
          <div className="rounded-2xl bg-white dark:bg-[#27272A] border border-rose-200/80 dark:border-[#3F3F46] p-4 flex flex-col md:flex-row items-center justify-between gap-3 shadow-sm transition-colors">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search company, PyTorch, RAG, research..."
                className="w-full bg-rose-50/50 dark:bg-zinc-950 border border-rose-200 dark:border-zinc-800 focus:border-[#9F1239] dark:focus:border-rose-500 rounded-xl pl-10 pr-4 py-2 text-xs text-zinc-800 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none transition-colors"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-600 dark:text-zinc-400">Role:</span>
                <select
                  value={selectedRole}
                  onChange={e => setSelectedRole(e.target.value)}
                  className="bg-rose-50/50 dark:bg-zinc-950 border border-rose-200 dark:border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-zinc-800 dark:text-zinc-200 focus:outline-none transition-colors"
                >
                  <option value="all">All Roles</option>
                  <option value="machine learning">Machine Learning</option>
                  <option value="ai">AI Engineering</option>
                  <option value="data">Data Science</option>
                  <option value="vision">Computer Vision</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-600 dark:text-zinc-400">Workplace:</span>
                <select
                  value={selectedWorkplace}
                  onChange={e => setSelectedWorkplace(e.target.value)}
                  className="bg-rose-50/50 dark:bg-zinc-950 border border-rose-200 dark:border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-zinc-800 dark:text-zinc-200 focus:outline-none transition-colors"
                >
                  <option value="all">All Types</option>
                  <option value="remote">Remote</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="on-site">On-site</option>
                </select>
              </div>
            </div>
          </div>

          {/* Internships List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInternships.map(internship => (
              <InternshipCard
                key={internship.id}
                internship={internship}
                isSaved={savedIds.includes(internship.id)}
                onToggleSave={toggleSave}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};
