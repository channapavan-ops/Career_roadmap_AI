import { CareerRoadmap, AcademicYear, CareerTrack } from '../types';
import { getRoadmapForStudent } from '../data/roadmapData';
import { supabase, isSupabaseConfigured, storageHelper } from './supabase';

const COMPLETED_TOPICS_KEY = 'completed_topics_';

export const roadmapService = {
  getRoadmap(track: CareerTrack, year: AcademicYear): CareerRoadmap {
    return getRoadmapForStudent(track, year);
  },

  getCompletedTopics(userId: string): string[] {
    const defaultInitial = ['ai-topic-python-core', 'ai-topic-git'];
    return storageHelper.get<string[]>(`${COMPLETED_TOPICS_KEY}${userId}`, defaultInitial);
  },

  async toggleTopic(userId: string, topicId: string, moduleId: string): Promise<string[]> {
    const current = this.getCompletedTopics(userId);
    const isCompleted = current.includes(topicId);
    const updated = isCompleted ? current.filter(id => id !== topicId) : [...current, topicId];

    // Local storage persistence
    storageHelper.set(`${COMPLETED_TOPICS_KEY}${userId}`, updated);

    // Supabase sync if connected
    if (isSupabaseConfigured && supabase) {
      try {
        if (isCompleted) {
          await supabase
            .from('topic_completions')
            .delete()
            .match({ user_id: userId, topic_id: topicId });
        } else {
          await supabase
            .from('topic_completions')
            .upsert({ user_id: userId, topic_id: topicId, module_id: moduleId });
        }
      } catch (e) {
        console.warn('Supabase topic completion sync error:', e);
      }
    }

    return updated;
  },

  // Fourth-Year Career-Readiness & Skill-Gap Assessment Persistence
  getSkillAssessment(userId: string, track: CareerTrack): Record<string, 'unassessed' | 'proficient' | 'needs_revision'> {
    const key = `skill_assessment_${userId}_${track.replace(/\s+/g, '_')}`;
    return storageHelper.get<Record<string, 'unassessed' | 'proficient' | 'needs_revision'>>(key, {});
  },

  saveSkillRating(
    userId: string,
    track: CareerTrack,
    skillId: string,
    rating: 'unassessed' | 'proficient' | 'needs_revision'
  ): Record<string, 'unassessed' | 'proficient' | 'needs_revision'> {
    const key = `skill_assessment_${userId}_${track.replace(/\s+/g, '_')}`;
    const current = this.getSkillAssessment(userId, track);
    const updated = { ...current, [skillId]: rating };
    storageHelper.set(key, updated);
    return updated;
  },

  batchSetSkillRatings(
    userId: string,
    track: CareerTrack,
    ratings: Record<string, 'unassessed' | 'proficient' | 'needs_revision'>
  ): Record<string, 'unassessed' | 'proficient' | 'needs_revision'> {
    const key = `skill_assessment_${userId}_${track.replace(/\s+/g, '_')}`;
    storageHelper.set(key, ratings);
    return ratings;
  },

  resetSkillAssessment(userId: string, track: CareerTrack): void {
    const key = `skill_assessment_${userId}_${track.replace(/\s+/g, '_')}`;
    storageHelper.remove(key);
  },

  getRevisedTopicIds(userId: string): string[] {
    const key = `revised_topics_${userId}`;
    return storageHelper.get<string[]>(key, []);
  },

  toggleRevisedTopic(userId: string, topicId: string): string[] {
    const key = `revised_topics_${userId}`;
    const current = this.getRevisedTopicIds(userId);
    const updated = current.includes(topicId) ? current.filter(id => id !== topicId) : [...current, topicId];
    storageHelper.set(key, updated);
    return updated;
  },

  getCompletedInterviewIds(userId: string): string[] {
    const key = `completed_interview_questions_${userId}`;
    return storageHelper.get<string[]>(key, []);
  },

  toggleInterviewQuestion(userId: string, questionId: string): string[] {
    const key = `completed_interview_questions_${userId}`;
    const current = this.getCompletedInterviewIds(userId);
    const updated = current.includes(questionId) ? current.filter(id => id !== questionId) : [...current, questionId];
    storageHelper.set(key, updated);
    return updated;
  },
};

