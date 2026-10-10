import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, CheckCircle2, ChevronRight, Code2 } from 'lucide-react';
import { ProjectItem } from '../types';

interface ProjectCardProps {
  project: ProjectItem;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const completedMilestones = project.milestones.filter(m => m.completed).length;
  const totalMilestones = project.milestones.length;
  const progressPercent = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;

  const getDifficultyColor = () => {
    switch (project.difficulty) {
      case 'Beginner':
        return 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60';
      case 'Intermediate':
        return 'bg-amber-950/60 text-amber-300 border-amber-800/60';
      case 'Advanced':
        return 'bg-rose-950/60 text-rose-300 border-rose-800/60';
      case 'Capstone':
        return 'bg-purple-950/60 text-purple-300 border-purple-800/60';
      default:
        return 'bg-zinc-800 text-zinc-300 border-zinc-700';
    }
  };

  const getStatusBadge = () => {
    switch (project.status) {
      case 'Completed':
        return 'bg-emerald-950/70 text-emerald-300 border-emerald-800/80';
      case 'In Progress':
        return 'bg-amber-950/70 text-amber-300 border-amber-800/80';
      default:
        return 'bg-zinc-800 text-zinc-400 border-zinc-700';
    }
  };

  return (
    <div className="rounded-2xl bg-white dark:bg-[#27272A] border border-rose-200/80 dark:border-[#3F3F46] hover:border-rose-300 dark:hover:border-zinc-700/80 p-5 flex flex-col justify-between transition-all group shadow-sm hover:shadow-md">
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getDifficultyColor()}`}>
              {project.difficulty}
            </span>
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getStatusBadge()}`}>
              {project.status}
            </span>
          </div>
          <span className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-zinc-400" />
            ~{project.estimatedHours}h
          </span>
        </div>

        <h3 className="text-base font-bold text-[#27272A] dark:text-zinc-100 group-hover:text-[#9F1239] dark:group-hover:text-rose-200 transition-colors line-clamp-1">
          {project.title}
        </h3>

        <p className="text-xs text-[#76516B] dark:text-zinc-400 mt-2 line-clamp-2 leading-relaxed">
          {project.shortDescription}
        </p>

        {/* Tech Stack Pills */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {project.techStack.slice(0, 4).map((tech, i) => (
            <span
              key={i}
              className="text-[11px] px-2 py-0.5 rounded bg-rose-50 dark:bg-zinc-800/90 text-[#9F1239] dark:text-zinc-300 border border-rose-200/70 dark:border-zinc-700/60"
            >
              {tech}
            </span>
          ))}
          {project.techStack.length > 4 && (
            <span className="text-[11px] px-1.5 py-0.5 rounded bg-rose-50/70 dark:bg-zinc-800/50 text-zinc-500 dark:text-zinc-400">
              +{project.techStack.length - 4}
            </span>
          )}
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-rose-200/60 dark:border-zinc-800/90">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="text-zinc-600 dark:text-zinc-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#9F1239] dark:text-rose-400" />
            {completedMilestones}/{totalMilestones} Milestones
          </span>
          <span className="font-semibold text-[#9F1239] dark:text-rose-300">{progressPercent}%</span>
        </div>
        <div className="w-full bg-rose-100 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden mb-4">
          <div className="h-full gradient-brand rounded-full transition-all" style={{ width: `${progressPercent}%` }} />
        </div>

        <Link
          to={`/projects/${project.id}`}
          className="w-full py-2 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-[#9F1239] dark:bg-zinc-800 dark:hover:bg-zinc-700/90 dark:text-zinc-200 dark:hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 border border-rose-200 dark:border-zinc-700 transition-colors cursor-pointer"
        >
          <Code2 className="w-3.5 h-3.5 text-[#9F1239] dark:text-rose-400" />
          View Project Blueprint & Milestones
          <ChevronRight className="w-3.5 h-3.5 text-zinc-400 ml-auto group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
};
