import { RoadmapModule, RoadmapTopic } from '../types';

export interface ProgressSummary {
  completedTopics: number;
  totalTopics: number;
  completedRequired: number;
  totalRequired: number;
  percentage: number;
  completedHours: number;
  totalHours: number;
}

export function calculateRoadmapProgress(
  modules: RoadmapModule[],
  completedTopicIds: Set<string> | string[]
): ProgressSummary {
  const completedSet = completedTopicIds instanceof Set ? completedTopicIds : new Set(completedTopicIds);

  let totalTopics = 0;
  let completedTopics = 0;
  let totalRequired = 0;
  let completedRequired = 0;
  let totalHours = 0;
  let completedHours = 0;

  for (const module of modules) {
    for (const topic of module.topics) {
      totalTopics++;
      totalHours += topic.estimatedHours || 0;

      const isCompleted = completedSet.has(topic.id);
      if (isCompleted) {
        completedTopics++;
        completedHours += topic.estimatedHours || 0;
      }

      if (topic.isRequired !== false) {
        totalRequired++;
        if (isCompleted) {
          completedRequired++;
        }
      }
    }
  }

  const denominator = totalRequired > 0 ? totalRequired : totalTopics;
  const numerator = totalRequired > 0 ? completedRequired : completedTopics;
  const percentage = denominator > 0 ? Math.round((numerator / denominator) * 100) : 0;

  return {
    completedTopics,
    totalTopics,
    completedRequired,
    totalRequired: denominator,
    percentage: Math.min(100, Math.max(0, percentage)),
    completedHours,
    totalHours,
  };
}

export function calculateModuleProgress(
  module: RoadmapModule,
  completedTopicIds: Set<string> | string[]
): { completed: number; total: number; percentage: number } {
  const completedSet = completedTopicIds instanceof Set ? completedTopicIds : new Set(completedTopicIds);
  const total = module.topics.length;
  const completed = module.topics.filter(t => completedSet.has(t.id)).length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  return { completed, total, percentage };
}
