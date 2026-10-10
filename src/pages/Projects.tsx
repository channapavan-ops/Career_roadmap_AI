import React, { useState } from 'react';
import { FolderGit2, Search, Filter, Sparkles, CheckCircle2 } from 'lucide-react';
import { projectService } from '../services/projectService';
import { ProjectCard } from '../components/ProjectCard';
import { useAuth } from '../context/AuthContext';
import { ProjectDifficulty } from '../types';

export const Projects: React.FC = () => {
  const { studentPrefs, user } = useAuth();
  const [search, setSearch] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<string>('all');

  const allProjects = projectService.getProjects(user?.id);

  const filteredProjects = allProjects.filter(p => {
    const matchesSearch =
      search === '' ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.shortDescription.toLowerCase().includes(search.toLowerCase()) ||
      p.techStack.some(t => t.toLowerCase().includes(search.toLowerCase()));

    const matchesDiff =
      selectedDifficulty === 'all' || p.difficulty.toLowerCase() === selectedDifficulty.toLowerCase();

    const matchesYear =
      selectedYear === 'all' || p.targetYear.includes(selectedYear as any);

    return matchesSearch && matchesDiff && matchesYear;
  });

  const completedCount = allProjects.filter(p => p.status === 'Completed').length;
  const inProgressCount = allProjects.filter(p => p.status === 'In Progress').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl bg-white dark:bg-[#27272A] border border-rose-200/80 dark:border-[#3F3F46] p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 transition-colors">
        <div>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-rose-100 text-[#9F1239] border border-rose-200 dark:bg-rose-950/80 dark:text-rose-300 dark:border-rose-900/60 flex items-center gap-1.5">
              <FolderGit2 className="w-3.5 h-3.5 text-[#9F1239] dark:text-rose-400" />
              Practical Portfolio Catalog
            </span>
            <span className="text-xs text-[#76516B] dark:text-zinc-400">
              Personalized for {studentPrefs?.careerTrack}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#27272A] dark:text-[#FAFAFA]">
            Hands-on Engineering Projects
          </h1>
          <p className="text-xs sm:text-sm text-[#76516B] dark:text-[#D4D4D8] mt-1 max-w-2xl leading-relaxed">
            Move past toy tutorials. Build verifiable GitHub repositories featuring automated tests, data pipelines, and production APIs to impress technical recruiters.
          </p>
        </div>

        {/* Status Pills */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="p-3 rounded-xl bg-rose-50/50 dark:bg-zinc-950 border border-rose-200/80 dark:border-zinc-800 text-xs">
            <div className="text-zinc-500 dark:text-zinc-400">Completed</div>
            <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{completedCount}</div>
          </div>
          <div className="p-3 rounded-xl bg-rose-50/50 dark:bg-zinc-950 border border-rose-200/80 dark:border-zinc-800 text-xs">
            <div className="text-zinc-500 dark:text-zinc-400">In Progress</div>
            <div className="text-lg font-bold text-amber-600 dark:text-amber-400">{inProgressCount}</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-2xl bg-white dark:bg-[#27272A] border border-rose-200/80 dark:border-[#3F3F46] p-4 flex flex-col md:flex-row items-center justify-between gap-3 shadow-sm transition-colors">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search projects, PyTorch, FastAPI, RAG..."
            className="w-full bg-rose-50/50 dark:bg-zinc-950 border border-rose-200 dark:border-zinc-800 focus:border-[#9F1239] dark:focus:border-rose-500 rounded-xl pl-10 pr-4 py-2 text-xs text-zinc-800 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none transition-colors"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-600 dark:text-zinc-400">Year Level:</span>
            <select
              value={selectedYear}
              onChange={e => setSelectedYear(e.target.value)}
              className="bg-rose-50/50 dark:bg-zinc-950 border border-rose-200 dark:border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-zinc-800 dark:text-zinc-200 focus:outline-none transition-colors"
            >
              <option value="all">All Years</option>
              <option value="1st Year">1st Year</option>
              <option value="2nd Year">2nd Year</option>
              <option value="3rd Year">3rd Year</option>
              <option value="4th Year">4th Year</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-600 dark:text-zinc-400">Difficulty:</span>
            <select
              value={selectedDifficulty}
              onChange={e => setSelectedDifficulty(e.target.value)}
              className="bg-rose-50/50 dark:bg-zinc-950 border border-rose-200 dark:border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-zinc-800 dark:text-zinc-200 focus:outline-none transition-colors"
            >
              <option value="all">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="capstone">Capstone</option>
            </select>
          </div>
        </div>
      </div>

      {/* Project Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map(project => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
};
