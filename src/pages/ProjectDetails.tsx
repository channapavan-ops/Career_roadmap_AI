import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  ArrowLeft,
  Clock,
  Code2,
  CheckCircle2,
  Circle,
  ExternalLink,
  Github,
  Award,
  Layers,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import { projectService } from '../services/projectService';
import { useAuth } from '../context/AuthContext';
import { ProjectStatus } from '../types';

export const ProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const userId = user?.id;

  const [project, setProject] = useState(() => (id ? projectService.getProjectById(id, userId) : undefined));
  const [repoInput, setRepoInput] = useState(project?.repoUrl || '');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Keep project in sync if userId changes
  React.useEffect(() => {
    if (id) {
      const current = projectService.getProjectById(id, userId);
      setProject(current);
      setRepoInput(current?.repoUrl || '');
    }
  }, [id, userId]);

  if (!project) {
    return (
      <div className="p-12 text-center rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-400">
        <h2 className="text-lg font-bold text-zinc-100 mb-2">Project Not Found</h2>
        <p className="text-xs mb-4">The project you are looking for does not exist or has been moved.</p>
        <Link to="/projects" className="py-2 px-4 rounded-xl gradient-brand text-white text-xs font-semibold">
          Back to All Projects
        </Link>
      </div>
    );
  }

  const handleToggleMilestone = (milestoneId: string) => {
    const updated = projectService.toggleMilestone(project.id, milestoneId, userId);
    if (updated) {
      setProject(updated);
      if (updated.status === 'Completed') {
        try {
          confetti({
            particleCount: 100,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#4C0519', '#9F1239', '#FDA4AF', '#D6A99A'],
          });
        } catch {}
      }
    }
  };

  const handleStatusChange = (newStatus: ProjectStatus) => {
    const updated = projectService.updateProjectStatus(project.id, newStatus, repoInput, userId);
    if (updated) {
      setProject(updated);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    }
  };

  const completedMilestones = project.milestones.filter(m => m.completed).length;
  const progressPercent = Math.round((completedMilestones / project.milestones.length) * 100);

  return (
    <div className="space-y-6">
      {/* Back button */}
      <div>
        <Link
          to="/projects"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-400 hover:text-rose-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Project Catalog
        </Link>
      </div>

      {/* Main Header Banner */}
      <div className="rounded-2xl bg-white dark:bg-[#27272A] border border-rose-200/80 dark:border-[#3F3F46] p-6 md:p-8 shadow-sm transition-colors">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-rose-100 text-[#9F1239] border border-rose-200 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-900/50">
                {project.difficulty}
              </span>
              <span className="text-xs text-zinc-600 dark:text-zinc-400 flex items-center gap-1 bg-rose-50 dark:bg-zinc-800 px-2 py-0.5 rounded-md border border-rose-200/60 dark:border-zinc-700/60">
                <Clock className="w-3.5 h-3.5 text-[#9F1239] dark:text-rose-400" /> ~{project.estimatedHours} hours
              </span>
              <span className="text-xs text-zinc-600 dark:text-zinc-400 bg-rose-50 dark:bg-zinc-800 px-2 py-0.5 rounded-md border border-rose-200/60 dark:border-zinc-700/60">
                Target: {project.targetYear.join(', ')}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#27272A] dark:text-[#FAFAFA]">{project.title}</h1>
            <p className="text-xs sm:text-sm text-[#76516B] dark:text-zinc-300 mt-3 leading-relaxed max-w-3xl">
              {project.fullDescription}
            </p>
          </div>

          {/* Status Changer Widget */}
          <div className="w-full md:w-64 bg-rose-50/50 dark:bg-zinc-950/80 p-4 rounded-2xl border border-rose-200/80 dark:border-zinc-800 shrink-0">
            <div className="text-xs text-zinc-600 dark:text-zinc-400 mb-1 font-medium">Project Status</div>
            <select
              value={project.status}
              onChange={e => handleStatusChange(e.target.value as ProjectStatus)}
              className="w-full bg-white dark:bg-zinc-900 border border-rose-200 dark:border-zinc-700 rounded-xl px-3 py-2 text-xs text-zinc-800 dark:text-zinc-100 font-semibold mb-3 focus:outline-none transition-colors"
            >
              <option value="Not Started">Not Started</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>

            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-zinc-500 dark:text-zinc-400">Milestone Progress</span>
              <span className="font-semibold text-[#9F1239] dark:text-rose-300">{progressPercent}%</span>
            </div>
            <div className="w-full bg-rose-100 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
              <div className="h-full gradient-brand rounded-full transition-all" style={{ width: `${progressPercent}%` }} />
            </div>
          </div>
        </div>

        {/* Tech Stack and Skills */}
        <div className="mt-6 pt-6 border-t border-rose-100 dark:border-zinc-800/80 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-2 flex items-center gap-1.5">
              <Code2 className="w-4 h-4 text-[#9F1239] dark:text-rose-400" /> Technologies Used
            </div>
            <div className="flex flex-wrap gap-1.5">
              {project.techStack.map((tech, i) => (
                <span
                  key={i}
                  className="text-xs px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-zinc-800 text-[#9F1239] dark:text-zinc-200 border border-rose-200/70 dark:border-zinc-700/60 font-medium"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-2 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-[#9F1239] dark:text-rose-400" /> Required Skills & Prerequisites
            </div>
            <div className="flex flex-wrap gap-1.5">
              {project.requiredSkills.map((sk, i) => (
                <span
                  key={i}
                  className="text-xs px-2.5 py-1 rounded-lg bg-rose-50/60 dark:bg-zinc-800/60 text-zinc-700 dark:text-zinc-300 border border-rose-200/50 dark:border-zinc-700/50"
                >
                  {sk}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Milestones vs Architecture Guide */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Milestones & Submission */}
        <div className="lg:col-span-2 space-y-6">
          {/* Milestones Card */}
          <div className="rounded-2xl bg-white dark:bg-[#27272A] border border-rose-200/80 dark:border-[#3F3F46] p-6 shadow-sm transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-[#27272A] dark:text-[#FAFAFA] flex items-center gap-2">
                  <Layers className="w-5 h-5 text-[#9F1239] dark:text-rose-400" />
                  Structured Engineering Milestones
                </h3>
                <p className="text-xs text-[#76516B] dark:text-zinc-400 mt-0.5">
                  Check off each milestone as you test your implementation.
                </p>
              </div>
              <span className="text-xs text-[#9F1239] dark:text-rose-300 font-semibold bg-rose-50 dark:bg-rose-950/80 px-2.5 py-1 rounded-full border border-rose-200 dark:border-rose-900/50">
                {completedMilestones} / {project.milestones.length} Done
              </span>
            </div>

            <div className="space-y-3">
              {project.milestones.map((milestone, idx) => (
                <div
                  key={milestone.id}
                  onClick={() => handleToggleMilestone(milestone.id)}
                  className={`p-4 rounded-xl border flex items-start gap-3.5 cursor-pointer transition-all ${
                    milestone.completed
                      ? 'bg-rose-50/40 dark:bg-zinc-950/50 border-rose-200/80 dark:border-rose-950/60 text-zinc-500 dark:text-zinc-400'
                      : 'bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 hover:border-rose-200 dark:hover:border-zinc-700 text-zinc-800 dark:text-zinc-200 shadow-xs'
                  }`}
                >
                  <button type="button" className="mt-0.5 shrink-0">
                    {milestone.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-rose-600 dark:text-rose-400 fill-rose-100 dark:fill-rose-950" />
                    ) : (
                      <Circle className="w-5 h-5 text-zinc-400 hover:text-[#9F1239] dark:hover:text-rose-300" />
                    )}
                  </button>
                  <div className="flex-1">
                    <span className="text-xs font-semibold block mb-0.5 text-zinc-500 dark:text-zinc-400">
                      Milestone {idx + 1}
                    </span>
                    <span className={`text-xs sm:text-sm font-medium ${milestone.completed ? 'line-through' : ''}`}>
                      {milestone.title}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* GitHub Repository Submission Card */}
          <div className="rounded-2xl bg-white dark:bg-[#27272A] border border-rose-200/80 dark:border-[#3F3F46] p-6 shadow-sm transition-colors">
            <h3 className="text-base font-bold text-[#27272A] dark:text-[#FAFAFA] flex items-center gap-2 mb-2">
              <Github className="w-5 h-5 text-[#9F1239] dark:text-zinc-300" />
              Your Project Repository
            </h3>
            <p className="text-xs text-[#76516B] dark:text-zinc-400 mb-4">
              Attach your public GitHub link so your personal mentor can review your code structure and commit history.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-2">
              <input
                type="url"
                value={repoInput}
                onChange={e => setRepoInput(e.target.value)}
                placeholder="https://github.com/yourusername/project-repo"
                className="w-full bg-rose-50/50 dark:bg-zinc-950 border border-rose-200 dark:border-zinc-800 focus:border-[#9F1239] dark:focus:border-rose-500 rounded-xl px-4 py-2.5 text-xs text-zinc-800 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none transition-colors"
              />
              <button
                type="button"
                onClick={() => handleStatusChange(project.status)}
                className="w-full sm:w-auto py-2.5 px-5 rounded-xl gradient-brand text-white text-xs font-semibold shrink-0 hover:opacity-95 transition-opacity cursor-pointer shadow-sm"
              >
                Save Repository Link
              </button>
            </div>

            {saveSuccess && (
              <div className="mt-2 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                ✓ Repository link saved successfully!
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Learning Outcomes & Starter Guide */}
        <div className="space-y-6">
          {/* Learning Outcomes */}
          <div className="rounded-2xl bg-white dark:bg-[#27272A] border border-rose-200/80 dark:border-[#3F3F46] p-6 shadow-sm transition-colors">
            <h3 className="text-sm font-bold text-[#27272A] dark:text-[#FAFAFA] mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#9F1239] dark:text-rose-400" />
              Demonstrated Skills
            </h3>
            <ul className="space-y-2.5 text-xs text-zinc-700 dark:text-zinc-300">
              {project.learningOutcomes.map((outcome, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#9F1239] dark:text-rose-400 shrink-0 mt-0.5" />
                  <span>{outcome}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Starter Architecture Guide */}
          {project.starterGuide && (
            <div className="rounded-2xl bg-white dark:bg-[#27272A] border border-rose-200/80 dark:border-[#3F3F46] p-6 shadow-sm transition-colors">
              <h3 className="text-sm font-bold text-[#27272A] dark:text-[#FAFAFA] mb-3 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#9F1239] dark:text-rose-400" />
                Architecture Blueprint
              </h3>
              <div className="p-3 rounded-xl bg-rose-50/60 dark:bg-zinc-950 font-mono text-xs text-[#9F1239] dark:text-rose-200/90 whitespace-pre-wrap overflow-x-auto leading-relaxed border border-rose-200/80 dark:border-zinc-800/80">
                {project.starterGuide}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
