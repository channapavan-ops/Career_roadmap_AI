import React from 'react';
import { Layers, Calendar, CheckCircle } from 'lucide-react';
import { RoadmapModule } from '../types';
import { TopicChecklist } from './TopicChecklist';
import { ProgressBar } from './ProgressBar';

interface RoadmapCardProps {
  module: RoadmapModule;
  completedTopicIds: Set<string> | string[];
  onToggleTopic: (topicId: string, moduleId: string) => void;
}

export const RoadmapCard: React.FC<RoadmapCardProps> = ({
  module,
  completedTopicIds,
  onToggleTopic,
}) => {
  const completedSet = completedTopicIds instanceof Set ? completedTopicIds : new Set(completedTopicIds);
  const total = module.topics.length;
  const completed = module.topics.filter(t => completedSet.has(t.id)).length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  const isModuleDone = total > 0 && completed === total;

  return (
    <div className="rounded-2xl bg-white dark:bg-zinc-900/70 border border-rose-200/80 dark:border-zinc-800 p-5 md:p-6 shadow-md dark:shadow-lg dark:shadow-black/20 transition-colors">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-rose-100 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-rose-100 text-[#9F1239] border border-rose-200 dark:bg-rose-950/70 dark:text-rose-300 dark:border-rose-900/50 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#9F1239] dark:text-rose-400" />
              Module {module.order} • {module.yearLevel}
            </span>
            <span className="text-xs text-zinc-600 dark:text-zinc-400 flex items-center gap-1 bg-rose-50 dark:bg-zinc-800/80 px-2 py-0.5 rounded-md border border-rose-200/60 dark:border-zinc-700/50">
              <Calendar className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
              ~{module.estimatedWeeks} weeks
            </span>
            {isModuleDone && (
              <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-400 flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800/60">
                <CheckCircle className="w-3.5 h-3.5" /> Module Mastered
              </span>
            )}
          </div>
          <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">{module.title}</h3>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 max-w-2xl">{module.description}</p>
        </div>

        <div className="w-full md:w-56 shrink-0 bg-rose-50/50 dark:bg-zinc-950/50 p-3 rounded-xl border border-rose-200/80 dark:border-zinc-800/80">
          <ProgressBar percentage={percentage} completed={completed} total={total} size="sm" />
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {module.topics.map(topic => (
          <TopicChecklist
            key={topic.id}
            topic={topic}
            isCompleted={completedSet.has(topic.id)}
            onToggle={onToggleTopic}
          />
        ))}
      </div>
    </div>
  );
};
