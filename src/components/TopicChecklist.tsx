import React, { useState } from 'react';
import { CheckCircle2, Circle, ChevronDown, ChevronUp, Clock, Award, Terminal, BookOpen, AlertCircle } from 'lucide-react';
import { RoadmapTopic } from '../types';
import { ResourceCard } from './ResourceCard';

interface TopicChecklistProps {
  topic: RoadmapTopic;
  isCompleted: boolean;
  onToggle: (topicId: string, moduleId: string) => void;
}

export const TopicChecklist: React.FC<TopicChecklistProps> = ({
  topic,
  isCompleted,
  onToggle,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getDifficultyColor = () => {
    switch (topic.difficulty) {
      case 'Beginner':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/60';
      case 'Intermediate':
        return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800/60';
      case 'Advanced':
        return 'bg-rose-50 text-[#9F1239] border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800/60';
      default:
        return 'bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700';
    }
  };

  return (
    <div
      className={`rounded-xl border transition-all ${
        isCompleted
          ? 'bg-rose-50/40 dark:bg-zinc-900/40 border-rose-200/80 dark:border-rose-950/60'
          : 'bg-white dark:bg-zinc-900/90 border-zinc-200 dark:border-zinc-800 hover:border-rose-200 dark:hover:border-zinc-700 shadow-xs'
      }`}
    >
      <div className="p-4 flex items-start gap-3.5">
        <button
          type="button"
          onClick={() => onToggle(topic.id, topic.moduleId)}
          className="mt-0.5 text-zinc-400 hover:text-[#9F1239] dark:hover:text-rose-400 focus:outline-none transition-colors shrink-0 cursor-pointer"
          title={isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
        >
          {isCompleted ? (
            <CheckCircle2 className="w-5 h-5 text-rose-600 dark:text-rose-400 fill-rose-100 dark:fill-rose-950/80" />
          ) : (
            <Circle className="w-5 h-5 hover:text-[#9F1239] dark:hover:text-rose-300" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <h4
              onClick={() => setIsExpanded(!isExpanded)}
              className={`text-sm font-semibold cursor-pointer transition-colors ${
                isCompleted ? 'line-through text-zinc-400 dark:text-zinc-500' : 'text-zinc-900 dark:text-zinc-100 hover:text-[#9F1239] dark:hover:text-rose-200'
              }`}
            >
              {topic.title}
            </h4>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${getDifficultyColor()}`}>
                {topic.difficulty}
              </span>
              <span className="text-[11px] text-zinc-600 dark:text-zinc-400 flex items-center gap-1 bg-rose-50 dark:bg-zinc-800/80 px-2 py-0.5 rounded-md border border-rose-200/60 dark:border-zinc-700/50">
                <Clock className="w-3 h-3 text-zinc-500 dark:text-zinc-400" />
                {topic.estimatedHours}h
              </span>
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1 rounded text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-rose-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                title={isExpanded ? 'Collapse' : 'Expand details'}
              >
                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
            {topic.description}
          </p>

          {isExpanded && (
            <div className="mt-4 pt-4 border-t border-rose-100 dark:border-zinc-800/80 space-y-4">
              {/* Learning Objectives */}
              {topic.learningObjectives && topic.learningObjectives.length > 0 && (
                <div>
                  <h5 className="text-[11px] font-semibold uppercase tracking-wider text-[#9F1239] dark:text-rose-300 mb-2 flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-[#9F1239] dark:text-rose-400" /> Key Learning Objectives
                  </h5>
                  <ul className="space-y-1.5 text-xs text-zinc-700 dark:text-zinc-300 pl-4 list-disc marker:text-rose-600 dark:marker:text-rose-500">
                    {topic.learningObjectives.map((obj, i) => (
                      <li key={i}>{obj}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Prerequisites */}
              {topic.prerequisites && topic.prerequisites.length > 0 && (
                <div>
                  <h5 className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-500" /> Prerequisites
                  </h5>
                  <div className="flex flex-wrap gap-1.5">
                    {topic.prerequisites.map((pre, idx) => (
                      <span key={idx} className="text-[11px] px-2 py-0.5 rounded bg-rose-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-rose-200 dark:border-zinc-700/60">
                        {pre}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Curated Resources */}
              {topic.resources && topic.resources.length > 0 && (
                <div>
                  <h5 className="text-[11px] font-semibold uppercase tracking-wider text-[#9F1239] dark:text-rose-300 mb-2 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-[#9F1239] dark:text-rose-400" /> Curated Free Resources
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {topic.resources.map(res => (
                      <ResourceCard key={res.id} resource={res} />
                    ))}
                  </div>
                </div>
              )}

              {/* Practical Exercise */}
              {topic.practicalExercise && (
                <div className="p-3.5 rounded-xl bg-rose-50/60 dark:bg-zinc-950/70 border border-rose-200/80 dark:border-zinc-800">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Terminal className="w-4 h-4 text-[#9F1239] dark:text-rose-400" />
                    <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-200">
                      Practical Exercise: {topic.practicalExercise.title}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-2 leading-relaxed">
                    {topic.practicalExercise.description}
                  </p>
                  <div className="text-[11px] text-[#9F1239] dark:text-rose-300 bg-rose-100/70 dark:bg-rose-950/30 p-2 rounded-lg border border-rose-200 dark:border-rose-900/40">
                    <strong>Expected Outcome:</strong> {topic.practicalExercise.expectedOutcome}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
