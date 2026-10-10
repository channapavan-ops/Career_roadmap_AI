import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Award,
  AlertTriangle,
  CheckCircle2,
  BookOpen,
  FolderGit2,
  Briefcase,
  HelpCircle,
  Clock,
  ArrowRight,
  ExternalLink,
  Code2,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Sparkles,
  Bot,
  Zap,
  Target,
  FileCheck,
  Check,
  X,
  Play,
  RotateCcw,
} from 'lucide-react';
import { CareerTrack } from '../types';
import {
  getTrackReadinessData,
  SkillAssessmentRating,
  ReadinessSkillItem,
  RevisionPlanTopic,
  InterviewPrepItem,
} from '../data/careerReadinessData';
import { roadmapService } from '../services/roadmapService';
import { projectService } from '../services/projectService';
import { INITIAL_INTERNSHIPS } from '../data/internshipData';
import { ProgressBar } from './ProgressBar';

interface CareerReadinessViewProps {
  userId: string;
  careerTrack: CareerTrack;
}

export const CareerReadinessView: React.FC<CareerReadinessViewProps> = ({
  userId,
  careerTrack,
}) => {
  const navigate = useNavigate();
  const trackData = useMemo(() => getTrackReadinessData(careerTrack), [careerTrack]);

  // Assessment ratings state: skillId -> 'unassessed' | 'proficient' | 'needs_revision'
  const [assessmentRatings, setAssessmentRatings] = useState<Record<string, SkillAssessmentRating>>(() => {
    return roadmapService.getSkillAssessment(userId, careerTrack);
  });

  // Revised topic IDs
  const [revisedTopicIds, setRevisedTopicIds] = useState<string[]>(() => {
    return roadmapService.getRevisedTopicIds(userId);
  });

  // Completed interview question IDs
  const [completedInterviewIds, setCompletedInterviewIds] = useState<string[]>(() => {
    return roadmapService.getCompletedInterviewIds(userId);
  });

  // Expanded interview questions accordion
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(
    trackData.interviewQuestions[0]?.id || null
  );

  // Active filter for skills section
  const [skillFilter, setSkillFilter] = useState<'all' | 'unassessed' | 'needs_revision' | 'proficient'>('all');

  // Handle skill rating change
  const handleRateSkill = (skillId: string, rating: SkillAssessmentRating) => {
    const updated = roadmapService.saveSkillRating(userId, careerTrack, skillId, rating);
    setAssessmentRatings({ ...updated });
  };

  // Quick Diagnostic wizard: assess all unassessed skills with default prompt
  const handleRunQuickDiagnostic = () => {
    // If not assessed, let user quickly mark skills they know or need revision
    const current = { ...assessmentRatings };
    // For quick diagnostic start, leave unassessed to be evaluated, or set initial guided prompt
    trackData.skills.forEach(s => {
      if (!current[s.id]) {
        current[s.id] = 'needs_revision'; // Mark as needing review so user can revise or mark proficient
      }
    });
    const updated = roadmapService.batchSetSkillRatings(userId, careerTrack, current);
    setAssessmentRatings({ ...updated });
  };

  const handleResetAssessment = () => {
    roadmapService.resetSkillAssessment(userId, careerTrack);
    setAssessmentRatings({});
  };

  // Toggle revised topic
  const handleToggleRevisedTopic = (topicId: string) => {
    const updated = roadmapService.toggleRevisedTopic(userId, topicId);
    setRevisedTopicIds([...updated]);
  };

  // Toggle interview question practiced
  const handleToggleInterviewQuestion = (qId: string) => {
    const updated = roadmapService.toggleInterviewQuestion(userId, qId);
    setCompletedInterviewIds([...updated]);
  };

  // Derived metrics
  const totalSkills = trackData.skills.length;
  const assessedSkills = trackData.skills.filter(s => {
    const r = assessmentRatings[s.id];
    return r === 'proficient' || r === 'needs_revision';
  });
  const assessedCount = assessedSkills.length;
  const proficientCount = trackData.skills.filter(s => assessmentRatings[s.id] === 'proficient').length;
  const weakSkills = trackData.skills.filter(s => assessmentRatings[s.id] === 'needs_revision');
  const weakCount = weakSkills.length;
  const unassessedCount = totalSkills - assessedCount;

  // Filter skills by active view filter
  const displayedSkills = trackData.skills.filter(s => {
    const rating = assessmentRatings[s.id] || 'unassessed';
    if (skillFilter === 'all') return true;
    return rating === skillFilter;
  });

  // Group displayed skills by domain
  const skillsByDomain = useMemo(() => {
    const map: Record<string, ReadinessSkillItem[]> = {};
    displayedSkills.forEach(s => {
      if (!map[s.domain]) map[s.domain] = [];
      map[s.domain].push(s);
    });
    return map;
  }, [displayedSkills]);

  // Projects relevant for 4th year & current career track
  const allProjects = projectService.getProjects(userId);
  const seniorProjects = allProjects.filter(p =>
    (p.targetYear.includes('4th Year') || p.difficulty === 'Capstone' || p.difficulty === 'Advanced') &&
    p.careerTrack.includes(careerTrack)
  );

  // Internships suitable for 4th years
  const seniorInternships = INITIAL_INTERNSHIPS.filter(i =>
    i.eligibilityYears.includes('4th Year')
  );

  // Overall readiness calculation
  // Factors:
  // 1. Assessment completion (25% weight)
  // 2. Proficiency vs Gaps resolved (25% weight)
  // 3. Revision topics completed (25% weight)
  // 4. Interview questions practiced (25% weight)
  const assessmentScore = totalSkills > 0 ? (assessedCount / totalSkills) * 25 : 0;
  const proficiencyScore = totalSkills > 0 ? (proficientCount / totalSkills) * 25 : 0;
  const revisionScore = trackData.revisionTopics.length > 0
    ? (revisedTopicIds.filter(id => trackData.revisionTopics.some(t => t.id === id)).length / trackData.revisionTopics.length) * 25
    : 0;
  const interviewScore = trackData.interviewQuestions.length > 0
    ? (completedInterviewIds.filter(id => trackData.interviewQuestions.some(q => q.id === id)).length / trackData.interviewQuestions.length) * 25
    : 0;

  const totalReadinessScore = Math.round(assessmentScore + proficiencyScore + revisionScore + interviewScore);

  return (
    <div className="space-y-8">
      {/* SECTION 7 (HIGHLIGHTED): Career-Readiness & Skill-Gap Progress Tracking Bar */}
      <div className="rounded-2xl bg-white dark:bg-[#27272A] border border-rose-200/80 dark:border-[#3F3F46] p-6 shadow-sm transition-colors">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-rose-100 dark:border-zinc-800">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-400 text-black flex items-center gap-1.5 shadow-xs">
                <Target className="w-3.5 h-3.5" />
                Senior Year Sprint Mode
              </span>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-rose-100 text-[#9F1239] border border-rose-200 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-900">
                {careerTrack} Track
              </span>
            </div>
            <h2 className="text-2xl font-extrabold text-[#27272A] dark:text-[#FAFAFA]">
              Career-Readiness & Skill-Gap Dashboard
            </h2>
            <p className="text-xs sm:text-sm text-[#76516B] dark:text-[#D4D4D8] mt-1.5 max-w-2xl leading-relaxed">
              Tailored exclusively for graduating engineers. Focus your remaining preparation on closing concept gaps, deploying high-impact capstone projects, and rehearsing technical interview rounds.
            </p>
          </div>

          {/* Overall Readiness Score Dial */}
          <div className="w-full lg:w-72 bg-rose-50/60 dark:bg-zinc-950/80 p-4 rounded-2xl border border-rose-200/80 dark:border-zinc-800 shrink-0">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Job-Readiness Index</span>
              <span className="text-lg font-black text-[#9F1239] dark:text-rose-400">{totalReadinessScore}%</span>
            </div>
            <ProgressBar percentage={totalReadinessScore} showLabel={false} size="md" />
            <div className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-2 flex items-center justify-between">
              <span>{assessedCount} / {totalSkills} skills diagnosed</span>
              <span className="font-semibold text-emerald-700 dark:text-emerald-400">{proficientCount} proficient</span>
            </div>
          </div>
        </div>

        {/* 4 Pillars Activity Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-5">
          <div className="p-3 rounded-xl bg-rose-50/40 dark:bg-zinc-950/60 border border-rose-200/70 dark:border-zinc-800">
            <div className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium">1. Skill Diagnostics</div>
            <div className="text-base font-bold text-[#27272A] dark:text-zinc-100 mt-0.5">
              {assessedCount} / {totalSkills}
            </div>
            <div className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-1">
              {unassessedCount > 0 ? `${unassessedCount} unassessed` : 'All assessed'}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-rose-50/40 dark:bg-zinc-950/60 border border-rose-200/70 dark:border-zinc-800">
            <div className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium">2. Concept Gaps</div>
            <div className="text-base font-bold text-amber-700 dark:text-amber-400 mt-0.5">
              {weakCount} {weakCount === 1 ? 'Concept' : 'Concepts'}
            </div>
            <div className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-1">
              {weakCount === 0 && assessedCount > 0 ? 'No open gaps' : 'Needs revision'}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-rose-50/40 dark:bg-zinc-950/60 border border-rose-200/70 dark:border-zinc-800">
            <div className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium">3. Revision Modules</div>
            <div className="text-base font-bold text-[#27272A] dark:text-zinc-100 mt-0.5">
              {revisedTopicIds.filter(id => trackData.revisionTopics.some(t => t.id === id)).length} / {trackData.revisionTopics.length}
            </div>
            <div className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-1">
              High-yield review topics
            </div>
          </div>

          <div className="p-3 rounded-xl bg-rose-50/40 dark:bg-zinc-950/60 border border-rose-200/70 dark:border-zinc-800">
            <div className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium">4. Interview Prep</div>
            <div className="text-base font-bold text-emerald-700 dark:text-emerald-400 mt-0.5">
              {completedInterviewIds.filter(id => trackData.interviewQuestions.some(q => q.id === id)).length} / {trackData.interviewQuestions.length}
            </div>
            <div className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-1">
              Technical challenges done
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 1: Skill-Gap Assessment */}
      <div className="rounded-2xl bg-white dark:bg-[#27272A] border border-rose-200/80 dark:border-[#3F3F46] p-6 shadow-sm transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-rose-100 dark:border-zinc-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-rose-100 dark:bg-rose-950/70 text-[#9F1239] dark:text-rose-400">
                <ShieldCheck className="w-5 h-5" />
              </span>
              <h3 className="text-lg font-bold text-[#27272A] dark:text-[#FAFAFA]">
                1. Career Track Skill-Gap Assessment
              </h3>
            </div>
            <p className="text-xs text-[#76516B] dark:text-[#D4D4D8] mt-1">
              Self-evaluate your readiness across essential industry competencies for {careerTrack}. Skills default to <strong className="font-semibold">Not assessed</strong> until you evaluate them.
            </p>
          </div>

          {/* Assessment Quick Actions */}
          <div className="flex items-center gap-2 flex-wrap">
            {assessedCount === 0 ? (
              <button
                type="button"
                onClick={handleRunQuickDiagnostic}
                className="py-2 px-3.5 rounded-xl gradient-brand text-white text-xs font-semibold shadow-sm hover:opacity-95 transition-opacity flex items-center gap-1.5 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5" /> Start Diagnostic Assessment
              </button>
            ) : (
              <button
                type="button"
                onClick={handleResetAssessment}
                className="py-2 px-3 rounded-xl bg-rose-50 hover:bg-rose-100/70 border border-rose-200 text-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:border-zinc-700 dark:text-zinc-300 text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset Assessment
              </button>
            )}
          </div>
        </div>

        {/* Unassessed Banner Notice if 0 assessed */}
        {assessedCount === 0 && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50/70 dark:bg-zinc-950/70 border border-rose-200 dark:border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-[#4C0519] dark:text-rose-200">
                  Assessment Not Yet Completed (0 / {totalSkills} Evaluated)
                </h4>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">
                  To prevent misleading progress indicators, skills are marked as <span className="font-semibold">Not assessed</span>. Rate each competency below to identify your weak spots.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleRunQuickDiagnostic}
              className="py-1.5 px-3 rounded-lg gradient-brand text-white text-xs font-semibold shrink-0 cursor-pointer"
            >
              Begin Diagnostic →
            </button>
          </div>
        )}

        {/* Filter Pills */}
        <div className="flex items-center gap-2 mb-5 overflow-x-auto pb-1 text-xs">
          <span className="text-zinc-500 dark:text-zinc-400 font-medium shrink-0">Filter:</span>
          {(
            [
              { id: 'all', label: `All Skills (${totalSkills})` },
              { id: 'unassessed', label: `Not Assessed (${unassessedCount})` },
              { id: 'needs_revision', label: `Needs Revision (${weakCount})` },
              { id: 'proficient', label: `Proficient (${proficientCount})` },
            ] as const
          ).map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSkillFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all shrink-0 cursor-pointer ${
                skillFilter === tab.id
                  ? 'gradient-brand text-white shadow-xs'
                  : 'bg-rose-50 hover:bg-rose-100/60 dark:bg-zinc-800 dark:hover:bg-zinc-700/80 text-zinc-700 dark:text-zinc-300 border border-rose-200/80 dark:border-zinc-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Domains & Skill Cards */}
        <div className="space-y-6">
          {Object.entries(skillsByDomain).map(([domain, skills]) => (
            <div key={domain} className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#9F1239] dark:text-rose-300 uppercase tracking-wider">
                  {domain}
                </span>
                <span className="text-[11px] text-zinc-400">({skills.length} skills)</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {skills.map(skill => {
                  const currentRating: SkillAssessmentRating = assessmentRatings[skill.id] || 'unassessed';

                  return (
                    <div
                      key={skill.id}
                      className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                        currentRating === 'proficient'
                          ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/50'
                          : currentRating === 'needs_revision'
                          ? 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/50'
                          : 'bg-rose-50/30 dark:bg-zinc-950/60 border-rose-200/70 dark:border-zinc-800'
                      }`}
                    >
                      <div>
                        {/* Header with importance & status */}
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                              skill.importance === 'Critical'
                                ? 'bg-rose-100 text-[#9F1239] border-rose-200 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-900'
                                : 'bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700'
                            }`}
                          >
                            {skill.importance} Priority
                          </span>

                          {/* Status Badge */}
                          {currentRating === 'unassessed' && (
                            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-400">
                              Not assessed
                            </span>
                          )}
                          {currentRating === 'needs_revision' && (
                            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                              Needs Revision
                            </span>
                          )}
                          {currentRating === 'proficient' && (
                            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                              Proficient
                            </span>
                          )}
                        </div>

                        <h4 className="text-sm font-bold text-[#27272A] dark:text-zinc-100">
                          {skill.name}
                        </h4>
                        <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 leading-relaxed">
                          {skill.description}
                        </p>

                        <div className="mt-2.5 p-2 rounded-lg bg-white/80 dark:bg-zinc-900/80 border border-rose-100 dark:border-zinc-800/80 text-[11px] text-[#76516B] dark:text-zinc-400 leading-normal">
                          <strong className="text-zinc-700 dark:text-zinc-300">Recruiter Focus:</strong> {skill.interviewRelevance}
                        </div>
                      </div>

                      {/* Assessment Controls */}
                      <div className="mt-4 pt-3 border-t border-rose-200/50 dark:border-zinc-800 flex items-center justify-between gap-2">
                        <span className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">
                          Self-evaluation:
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleRateSkill(skill.id, 'needs_revision')}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors flex items-center gap-1 cursor-pointer ${
                              currentRating === 'needs_revision'
                                ? 'bg-amber-500 text-white'
                                : 'bg-rose-50 hover:bg-amber-100/70 text-amber-900 dark:bg-zinc-800 dark:text-amber-300 dark:hover:bg-zinc-700'
                            }`}
                          >
                            <AlertTriangle className="w-3 h-3" />
                            Gap / Needs Revision
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRateSkill(skill.id, 'proficient')}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors flex items-center gap-1 cursor-pointer ${
                              currentRating === 'proficient'
                                ? 'bg-emerald-600 text-white'
                                : 'bg-rose-50 hover:bg-emerald-100/70 text-emerald-900 dark:bg-zinc-800 dark:text-emerald-300 dark:hover:bg-zinc-700'
                            }`}
                          >
                            <Check className="w-3 h-3" />
                            Proficient
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: Missing or Weak Concepts That Need Revision */}
      <div className="rounded-2xl bg-white dark:bg-[#27272A] border border-amber-200 dark:border-amber-900/40 p-6 shadow-sm transition-colors">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-100 text-amber-800 border border-amber-200 dark:bg-amber-950/80 dark:text-amber-300 dark:border-amber-800/60">
              <AlertTriangle className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-lg font-bold text-[#27272A] dark:text-[#FAFAFA]">
                2. Identified Missing or Weak Concepts Needing Revision
              </h3>
              <p className="text-xs text-[#76516B] dark:text-[#D4D4D8]">
                Concepts diagnosed as needing revision in your assessment. Focus your review here before upcoming placement drives.
              </p>
            </div>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
            {weakCount} {weakCount === 1 ? 'Concept' : 'Concepts'}
          </span>
        </div>

        {weakCount > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {weakSkills.map(gap => (
              <div
                key={gap.id}
                className="p-4 rounded-xl bg-amber-50/50 dark:bg-zinc-950/70 border border-amber-200/80 dark:border-amber-900/40 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] mb-2">
                    <span className="font-semibold text-amber-800 dark:text-amber-300">{gap.domain}</span>
                    <span className="font-bold text-rose-700 dark:text-rose-400">{gap.importance} Priority</span>
                  </div>
                  <h4 className="text-sm font-bold text-[#27272A] dark:text-zinc-100 mb-1">
                    {gap.name}
                  </h4>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed mb-3">
                    {gap.description}
                  </p>

                  <div className="p-2.5 rounded-lg bg-white dark:bg-zinc-900 border border-amber-200/60 dark:border-zinc-800 text-xs">
                    <span className="font-semibold text-amber-800 dark:text-amber-300">Targeted Revision Strategy:</span>
                    <p className="text-zinc-600 dark:text-zinc-400 text-[11px] mt-0.5 leading-relaxed">
                      {gap.revisionTip}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-amber-200/60 dark:border-zinc-800 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => handleRateSkill(gap.id, 'proficient')}
                    className="py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" /> Mark Concept as Mastered
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate('/ai-assistant')}
                    className="py-1.5 px-3 rounded-lg bg-white dark:bg-zinc-800 hover:bg-rose-50 text-zinc-700 dark:text-zinc-200 border border-rose-200 dark:border-zinc-700 text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Bot className="w-3.5 h-3.5 text-[#9F1239] dark:text-rose-400" /> Ask AI Mentor
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : assessedCount === 0 ? (
          <div className="p-8 text-center rounded-xl bg-rose-50/30 dark:bg-zinc-950/60 border border-dashed border-rose-200 dark:border-zinc-800">
            <HelpCircle className="w-8 h-8 text-zinc-400 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-zinc-700 dark:text-zinc-300">
              No Concept Gaps Identified Yet
            </h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-md mx-auto mt-1">
              You haven't conducted the self-assessment yet. Click &ldquo;Start Diagnostic Assessment&rdquo; in Section 1 to populate this list with concepts that require revision.
            </p>
          </div>
        ) : (
          <div className="p-6 text-center rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mx-auto mb-1.5" />
            <h4 className="text-sm font-bold text-emerald-900 dark:text-emerald-200">
              Zero Concept Gaps Reported!
            </h4>
            <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-1 max-w-lg mx-auto">
              All assessed competencies are currently marked as Proficient. Move on to Section 3 for revision summaries and Section 6 for interview coding practice.
            </p>
          </div>
        )}
      </div>

      {/* SECTION 3: Focused Revision Plan for Important Concepts */}
      <div className="rounded-2xl bg-white dark:bg-[#27272A] border border-rose-200/80 dark:border-[#3F3F46] p-6 shadow-sm transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-rose-100 dark:border-zinc-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-rose-100 text-[#9F1239] border border-rose-200 dark:bg-rose-950/80 dark:text-rose-400 dark:border-rose-900/60">
                <BookOpen className="w-5 h-5" />
              </span>
              <h3 className="text-lg font-bold text-[#27272A] dark:text-[#FAFAFA]">
                3. Focused Revision Plan for Important Concepts
              </h3>
            </div>
            <p className="text-xs text-[#76516B] dark:text-[#D4D4D8] mt-1">
              Structured high-yield modules covering mathematical proofs, system tradeoffs, and core takeaways tested in technical screens.
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-rose-50 text-[#9F1239] border border-rose-200 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-900">
            {revisedTopicIds.length} / {trackData.revisionTopics.length} Modules Revised
          </span>
        </div>

        <div className="space-y-4">
          {trackData.revisionTopics.map(topic => {
            const isRevised = revisedTopicIds.includes(topic.id);

            return (
              <div
                key={topic.id}
                className={`p-5 rounded-2xl border transition-all ${
                  isRevised
                    ? 'bg-emerald-50/30 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/50'
                    : 'bg-rose-50/30 dark:bg-zinc-950/60 border-rose-200/70 dark:border-zinc-800'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#9F1239] dark:text-rose-400">
                      {topic.moduleName}
                    </span>
                    <h4 className="text-sm sm:text-base font-bold text-[#27272A] dark:text-zinc-100 mt-0.5">
                      {topic.title}
                    </h4>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1 bg-white dark:bg-zinc-900 px-2.5 py-1 rounded-lg border border-rose-200/70 dark:border-zinc-800">
                      <Clock className="w-3.5 h-3.5" /> ~{topic.estimatedHours} hrs
                    </span>

                    <button
                      type="button"
                      onClick={() => handleToggleRevisedTopic(topic.id)}
                      className={`text-xs px-3 py-1.5 rounded-xl font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                        isRevised
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-white dark:bg-zinc-800 border border-rose-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-[#9F1239]'
                      }`}
                    >
                      {isRevised ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-white" /> Revised
                        </>
                      ) : (
                        <>
                          <FileCheck className="w-3.5 h-3.5 text-zinc-400" /> Mark as Revised
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Core Concepts Bullet list */}
                <div className="mb-3">
                  <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    High-Yield Concepts Checklist:
                  </span>
                  <ul className="mt-1.5 grid grid-cols-1 md:grid-cols-2 gap-1.5 text-xs text-zinc-600 dark:text-zinc-400">
                    {topic.coreConcepts.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-[#9F1239] dark:text-rose-400 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Formula / Takeaway Box */}
                <div className="p-3 rounded-xl bg-white dark:bg-zinc-900 border border-rose-200/80 dark:border-zinc-800 text-xs mb-3">
                  <div className="font-semibold text-zinc-800 dark:text-zinc-200 mb-0.5 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-[#9F1239] dark:text-rose-400" />
                    Essential Formula & Interview Takeaway:
                  </div>
                  <div className="font-mono text-[11px] text-[#4C0519] dark:text-rose-300 leading-relaxed">
                    {topic.keyFormulasOrTakeaways}
                  </div>
                </div>

                {/* Resources */}
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-rose-200/60 dark:border-zinc-800 text-xs">
                  <span className="text-zinc-500 dark:text-zinc-400 font-medium text-[11px]">Revision References:</span>
                  {topic.resources.map(res => (
                    <a
                      key={res.id}
                      href={res.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100/80 text-[#9F1239] dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:text-rose-300 border border-rose-200/80 dark:border-zinc-700 text-[11px] font-medium flex items-center gap-1 transition-colors"
                    >
                      <span>{res.title}</span>
                      <ExternalLink className="w-3 h-3 shrink-0" />
                    </a>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 4: Relevant Projects to Strengthen Their Portfolio */}
      <div className="rounded-2xl bg-white dark:bg-[#27272A] border border-rose-200/80 dark:border-[#3F3F46] p-6 shadow-sm transition-colors">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-rose-100 dark:border-zinc-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-rose-100 text-[#9F1239] border border-rose-200 dark:bg-rose-950/80 dark:text-rose-400 dark:border-rose-900/60">
                <FolderGit2 className="w-5 h-5" />
              </span>
              <h3 className="text-lg font-bold text-[#27272A] dark:text-[#FAFAFA]">
                4. Production & Capstone Projects for Your Senior Portfolio
              </h3>
            </div>
            <p className="text-xs text-[#76516B] dark:text-[#D4D4D8] mt-1">
              Top tech recruiters evaluate deployment hygiene (Docker, latency, metrics, CI/CD). Reused directly from your project catalog.
            </p>
          </div>
          <Link
            to="/projects"
            className="text-xs font-semibold text-[#9F1239] dark:text-rose-400 hover:underline flex items-center gap-1"
          >
            All Projects <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {seniorProjects.map(proj => {
            const completedCount = proj.milestones.filter(m => m.completed).length;
            const percentage = Math.round((completedCount / proj.milestones.length) * 100);

            return (
              <div
                key={proj.id}
                className="p-5 rounded-2xl bg-rose-50/30 dark:bg-zinc-950/60 border border-rose-200/70 dark:border-zinc-800 flex flex-col justify-between transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 text-[#9F1239] border border-rose-200 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-900">
                      {proj.difficulty}
                    </span>
                    <span className="text-zinc-500 dark:text-zinc-400 text-xs flex items-center gap-1">
                      <Clock className="w-3 h-3" /> ~{proj.estimatedHours}h
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-[#27272A] dark:text-zinc-100 mb-1">
                    {proj.title}
                  </h4>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed mb-3">
                    {proj.shortDescription}
                  </p>

                  {/* Tech stack */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {proj.techStack.map((tech, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border border-rose-200/60 dark:border-zinc-800"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Milestone Progress */}
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-[11px] text-zinc-500 dark:text-zinc-400 mb-1">
                      <span>Milestones: {completedCount} / {proj.milestones.length} Done</span>
                      <span className="font-semibold text-[#9F1239] dark:text-rose-400">{percentage}%</span>
                    </div>
                    <ProgressBar percentage={percentage} showLabel={false} size="sm" />
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-rose-200/60 dark:border-zinc-800 flex items-center justify-between">
                  <span
                    className={`text-[11px] font-semibold ${
                      proj.status === 'Completed'
                        ? 'text-emerald-700 dark:text-emerald-400'
                        : proj.status === 'In Progress'
                        ? 'text-amber-700 dark:text-amber-400'
                        : 'text-zinc-500'
                    }`}
                  >
                    Status: {proj.status}
                  </span>
                  <Link
                    to={`/projects/${proj.id}`}
                    className="py-1.5 px-3 rounded-lg gradient-brand text-white text-xs font-semibold hover:opacity-95 transition-opacity flex items-center gap-1"
                  >
                    Open Project Milestones <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 5: Suitable Internships and Job-Preparation Resources */}
      <div className="rounded-2xl bg-white dark:bg-[#27272A] border border-rose-200/80 dark:border-[#3F3F46] p-6 shadow-sm transition-colors">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-rose-100 dark:border-zinc-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-rose-100 text-[#9F1239] border border-rose-200 dark:bg-rose-950/80 dark:text-rose-400 dark:border-rose-900/60">
                <Briefcase className="w-5 h-5" />
              </span>
              <h3 className="text-lg font-bold text-[#27272A] dark:text-[#FAFAFA]">
                5. Suitable Final-Year Internships & Job-Preparation Guides
              </h3>
            </div>
            <p className="text-xs text-[#76516B] dark:text-[#D4D4D8] mt-1">
              Eligible openings filtered from existing internship records, plus placement portfolio checklists.
            </p>
          </div>
          <Link
            to="/internships"
            className="text-xs font-semibold text-[#9F1239] dark:text-rose-400 hover:underline flex items-center gap-1"
          >
            All Internships <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Job-prep guide checklist cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          <div className="p-3.5 rounded-xl bg-rose-50/50 dark:bg-zinc-950/70 border border-rose-200/80 dark:border-zinc-800">
            <h5 className="text-xs font-bold text-[#4C0519] dark:text-rose-200 mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#9F1239] dark:text-rose-400" /> GitHub Repository Hygiene
            </h5>
            <p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Include an architectural diagram, requirements.txt, Dockerfile, latency benchmarks, and a 2-minute GIF demo.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-rose-50/50 dark:bg-zinc-950/70 border border-rose-200/80 dark:border-zinc-800">
            <h5 className="text-xs font-bold text-[#4C0519] dark:text-rose-200 mb-1 flex items-center gap-1.5">
              <FileCheck className="w-3.5 h-3.5 text-[#9F1239] dark:text-rose-400" /> Resume Action Verbs
            </h5>
            <p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Quantify outcomes: &ldquo;Reduced inference latency by 42% via quantization&rdquo; beats &ldquo;Worked on PyTorch model&rdquo;.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-rose-50/50 dark:bg-zinc-950/70 border border-rose-200/80 dark:border-zinc-800">
            <h5 className="text-xs font-bold text-[#4C0519] dark:text-rose-200 mb-1 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#9F1239] dark:text-rose-400" /> Placement Portal Readiness
            </h5>
            <p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Complete mock behavioral STAR stories (Situation, Task, Action, Result) for teamwork and technical failure scenarios.
            </p>
          </div>
        </div>

        {/* Existing Eligible Internships */}
        <div className="space-y-3">
          <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
            Active 4th-Year Eligible Opportunities:
          </span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {seniorInternships.map(intern => (
              <div
                key={intern.id}
                className="p-4 rounded-xl bg-rose-50/30 dark:bg-zinc-950/60 border border-rose-200/70 dark:border-zinc-800 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-[#9F1239] dark:text-rose-300">{intern.company}</span>
                    <span className="text-[10px] text-zinc-600 dark:text-zinc-400 bg-rose-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">
                      {intern.workplaceType}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-[#27272A] dark:text-zinc-100 line-clamp-1">
                    {intern.title}
                  </h4>
                  <div className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 mt-1">
                    {intern.stipend}
                  </div>
                  <p className="text-[11px] text-zinc-600 dark:text-zinc-400 mt-2 line-clamp-2 leading-relaxed">
                    {intern.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-rose-200/60 dark:border-zinc-800 flex items-center justify-between text-xs">
                  <span className="text-[10px] text-zinc-500 dark:text-zinc-400">
                    {intern.duration}
                  </span>
                  <a
                    href={intern.applyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-[#9F1239] dark:text-rose-400 hover:underline flex items-center gap-1"
                  >
                    Apply Now <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 6: Interview Preparation and Practical Exercises */}
      <div className="rounded-2xl bg-white dark:bg-[#27272A] border border-rose-200/80 dark:border-[#3F3F46] p-6 shadow-sm transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-rose-100 dark:border-zinc-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-rose-100 text-[#9F1239] border border-rose-200 dark:bg-rose-950/80 dark:text-rose-400 dark:border-rose-900/60">
                <Code2 className="w-5 h-5" />
              </span>
              <h3 className="text-lg font-bold text-[#27272A] dark:text-[#FAFAFA]">
                6. Technical Interview Preparation & Practical Coding Challenges
              </h3>
            </div>
            <p className="text-xs text-[#76516B] dark:text-[#D4D4D8] mt-1">
              High-frequency interview questions with model answers, whiteboard derivations, and clean NumPy/FastAPI solutions.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate('/ai-assistant')}
            className="py-2 px-3.5 rounded-xl gradient-brand text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm hover:opacity-95 transition-opacity cursor-pointer shrink-0"
          >
            <Bot className="w-4 h-4 text-rose-200" />
            Live AI Mock Interview
          </button>
        </div>

        {/* Question Cards with Expandable Solutions */}
        <div className="space-y-4">
          {trackData.interviewQuestions.map(item => {
            const isExpanded = expandedQuestionId === item.id;
            const isCompleted = completedInterviewIds.includes(item.id);

            return (
              <div
                key={item.id}
                className={`rounded-2xl border transition-all overflow-hidden ${
                  isCompleted
                    ? 'bg-emerald-50/20 dark:bg-emerald-950/10 border-emerald-200 dark:border-emerald-800/50'
                    : 'bg-rose-50/30 dark:bg-zinc-950/60 border-rose-200/70 dark:border-zinc-800'
                }`}
              >
                {/* Header row */}
                <div
                  className="p-4 flex items-start justify-between gap-3 cursor-pointer hover:bg-rose-100/40 dark:hover:bg-zinc-900/50 transition-colors"
                  onClick={() => setExpandedQuestionId(isExpanded ? null : item.id)}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 text-[#9F1239] border border-rose-200 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-900">
                        {item.category}
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
                        {item.difficulty}
                      </span>
                      {isCompleted && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex items-center gap-1">
                          <Check className="w-3 h-3 text-emerald-600" /> Practiced
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm font-bold text-[#27272A] dark:text-zinc-100 leading-snug">
                      {item.question}
                    </h4>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 mt-1">
                    <button
                      type="button"
                      onClick={e => {
                        e.stopPropagation();
                        handleToggleInterviewQuestion(item.id);
                      }}
                      className={`text-xs px-2.5 py-1 rounded-lg font-semibold transition-colors flex items-center gap-1 cursor-pointer ${
                        isCompleted
                          ? 'bg-emerald-600 text-white'
                          : 'bg-white dark:bg-zinc-800 border border-rose-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-[#9F1239]'
                      }`}
                    >
                      <Check className="w-3 h-3" />
                      {isCompleted ? 'Done' : 'Mark Done'}
                    </button>
                    <span className="text-zinc-400">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </span>
                  </div>
                </div>

                {/* Expanded Answer Content */}
                {isExpanded && (
                  <div className="p-5 pt-0 border-t border-rose-100 dark:border-zinc-800/80 space-y-4 mt-2">
                    <div className="p-3 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/50 text-xs">
                      <span className="font-bold text-amber-900 dark:text-amber-200">
                        What the Interviewer Evaluates:
                      </span>
                      <p className="text-zinc-700 dark:text-zinc-300 text-[11px] mt-0.5">
                        {item.keyEvaluationPoint}
                      </p>
                    </div>

                    <div>
                      <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                        Structured Model Answer:
                      </span>
                      <p className="text-xs text-zinc-700 dark:text-zinc-300 whitespace-pre-line mt-1.5 leading-relaxed bg-white dark:bg-zinc-900 p-4 rounded-xl border border-rose-200/70 dark:border-zinc-800 font-sans">
                        {item.sampleAnswer}
                      </p>
                    </div>

                    {item.codeSnippet && (
                      <div>
                        <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5 mb-1.5">
                          <Code2 className="w-3.5 h-3.5 text-[#9F1239] dark:text-rose-400" /> Practical Code Solution:
                        </span>
                        <pre className="p-4 rounded-xl bg-zinc-900 text-zinc-100 text-xs font-mono overflow-x-auto border border-zinc-800">
                          <code>{item.codeSnippet}</code>
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
