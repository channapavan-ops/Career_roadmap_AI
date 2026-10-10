import { useState, useEffect, useMemo, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { useAuth } from '../context/AuthContext';
import { roadmapService } from '../services/roadmapService';
import { calculateRoadmapProgress, ProgressSummary } from '../utils/calculateProgress';
import { CareerRoadmap } from '../types';

export function useRoadmapProgress() {
  const { user, studentPrefs } = useAuth();
  const userId = user?.id || 'demo-user';
  const track = studentPrefs?.careerTrack || 'Machine Learning Engineer';
  const year = studentPrefs?.academicYear || '2nd Year';

  const roadmap: CareerRoadmap = useMemo(() => {
    return roadmapService.getRoadmap(track, year);
  }, [track, year]);

  const [completedTopicIds, setCompletedTopicIds] = useState<string[]>(() => {
    return roadmapService.getCompletedTopics(userId);
  });

  useEffect(() => {
    setCompletedTopicIds(roadmapService.getCompletedTopics(userId));
  }, [userId]);

  const progressSummary: ProgressSummary = useMemo(() => {
    return calculateRoadmapProgress(roadmap.modules, completedTopicIds);
  }, [roadmap, completedTopicIds]);

  const toggleTopic = useCallback(async (topicId: string, moduleId: string) => {
    const isCurrentlyDone = completedTopicIds.includes(topicId);
    const updated = await roadmapService.toggleTopic(userId, topicId, moduleId);
    setCompletedTopicIds(updated);

    // Fire celebration if newly marked done
    if (!isCurrentlyDone) {
      const newSummary = calculateRoadmapProgress(roadmap.modules, updated);
      if (newSummary.percentage === 100 || newSummary.percentage === 50 || updated.length % 3 === 0) {
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#4C0519', '#9F1239', '#FDA4AF', '#D6A99A'],
          });
        } catch {
          // ignore in headless environments
        }
      }
    }
  }, [userId, completedTopicIds, roadmap]);

  const isTopicCompleted = useCallback((topicId: string) => {
    return completedTopicIds.includes(topicId);
  }, [completedTopicIds]);

  return {
    roadmap,
    completedTopicIds,
    progressSummary,
    toggleTopic,
    isTopicCompleted,
  };
}
