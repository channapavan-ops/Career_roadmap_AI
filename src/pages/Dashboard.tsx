import React from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import {
  Compass,
  Map,
  Bot,
  Users,
  FolderGit2,
  Briefcase,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  Zap,
  BookOpen,
  Calendar,
  AlertCircle,
  FileText,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useRoadmapProgress } from '../hooks/useRoadmapProgress';
import { ProgressBar } from '../components/ProgressBar';
import { projectService } from '../services/projectService';
import { mentorService } from '../services/mentorService';
import { roadmapService } from '../services/roadmapService';
import { getTrackReadinessData } from '../data/careerReadinessData';
import { INITIAL_INTERNSHIPS } from '../data/internshipData';

export const Dashboard: React.FC = () => {
  const { user, studentPrefs } = useAuth();
  const { roadmap, progressSummary, completedTopicIds } = useRoadmapProgress();
  const navigate = useNavigate();

  // If student has not completed onboarding or has no academic year, redirect to onboarding
  if (user?.role === 'student' && (!studentPrefs?.academicYear || !studentPrefs?.onboardingCompleted)) {
    return <Navigate to="/onboarding" replace />;
  }

  const isFirstYear = studentPrefs?.academicYear === '1st Year';
  const isFourthYear = studentPrefs?.academicYear === '4th Year';

  // Projects & Mentors
  const allProjects = projectService.getProjects(user?.id);
  const activeProjects = allProjects.filter(p =>
    p.targetYear.includes(studentPrefs?.academicYear || '2nd Year')
  );

  const mentors = mentorService.getMentors();
  const assignedMentor = mentors.find(m => m.userId === studentPrefs?.assignedMentorId) || mentors[0];
  const sharedResources = mentorService.getResourcesForStudent(user?.id || 'demo-student');

  // Senior Career-Readiness Metrics (for 4th year)
  const seniorReadiness = React.useMemo(() => {
    if (!isFourthYear) return null;
    const uid = user?.id || 'demo-user';
    const trk = studentPrefs?.careerTrack || 'AI Engineer';
    const trackReadiness = getTrackReadinessData(trk);
    const ratings = roadmapService.getSkillAssessment(uid, trk);
    const revisedIds = roadmapService.getRevisedTopicIds(uid);
    const interviewIds = roadmapService.getCompletedInterviewIds(uid);

    const totalSkills = trackReadiness.skills.length;
    const assessedSkills = trackReadiness.skills.filter(
      s => ratings[s.id] === 'proficient' || ratings[s.id] === 'needs_revision'
    );
    const assessedCount = assessedSkills.length;
    const proficientCount = trackReadiness.skills.filter(s => ratings[s.id] === 'proficient').length;
    const weakSkills = trackReadiness.skills.filter(s => ratings[s.id] === 'needs_revision');

    const assessmentScore = totalSkills > 0 ? (assessedCount / totalSkills) * 25 : 0;
    const proficiencyScore = totalSkills > 0 ? (proficientCount / totalSkills) * 25 : 0;
    const revisionScore = trackReadiness.revisionTopics.length > 0
      ? (revisedIds.filter(id => trackReadiness.revisionTopics.some(t => t.id === id)).length / trackReadiness.revisionTopics.length) * 25
      : 0;
    const interviewScore = trackReadiness.interviewQuestions.length > 0
      ? (interviewIds.filter(id => trackReadiness.interviewQuestions.some(q => q.id === id)).length / trackReadiness.interviewQuestions.length) * 25
      : 0;

    const totalScore = Math.round(assessmentScore + proficiencyScore + revisionScore + interviewScore);

    return {
      totalScore,
      totalSkills,
      assessedCount,
      proficientCount,
      weakSkills,
      revisedIds,
      interviewIds,
      interviewQuestions: trackReadiness.interviewQuestions,
    };
  }, [isFourthYear, user?.id, studentPrefs?.careerTrack]);

  // Next recommended topic to complete (for 1st, 2nd, and 3rd year students)
  let nextTopic = null;
  let currentModule = roadmap?.modules?.[0] || null;
  if (!isFourthYear && roadmap?.modules) {
    for (const mod of roadmap.modules) {
      const uncompleted = mod.topics.find(t => !completedTopicIds.includes(t.id));
      if (uncompleted) {
        nextTopic = uncompleted;
        currentModule = mod;
        break;
      }
    }
  }

  // Internships for eligible years
  const eligibleInternships = INITIAL_INTERNSHIPS.filter(intern =>
    intern.eligibilityYears.includes(studentPrefs?.academicYear || '2nd Year')
  );

  return (
    <div className="space-y-6">
      {/* Personalized Greeting Header */}
      <div className="rounded-2xl gradient-brand p-6 sm:p-8 text-white shadow-xl shadow-rose-950/30 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-black/30 border border-white/20 text-rose-100 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-rose-300" />
              {studentPrefs?.academicYear} Undergraduate
            </span>
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-black/30 border border-white/20 text-rose-100">
              {studentPrefs?.careerTrack}
            </span>
            {isFourthYear && (
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-400 text-black">
                Senior Job-Ready Sprint Mode
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {user?.fullName || 'Student'}! 👋
          </h1>
          <p className="text-xs sm:text-sm text-rose-100/90 mt-1.5 max-w-xl">
            {isFourthYear
              ? 'Final stretch! Focus on closing concept gaps, deploying high-throughput capstone APIs, and polishing your technical interview narrative.'
              : `You are making steady progress toward becoming a top-tier ${studentPrefs?.careerTrack}. Here is your roadmap focus for today.`}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/roadmap"
            className="py-2.5 px-4 rounded-xl bg-white text-[#9F1239] text-xs font-bold hover:bg-rose-50 transition-colors shadow-sm flex items-center gap-1.5"
          >
            <Compass className="w-4 h-4" />
            {isFourthYear ? 'Career-Readiness Dashboard' : 'Resume Roadmap'}
          </Link>
          <Link
            to="/ai-assistant"
            className="py-2.5 px-4 rounded-xl bg-black/30 hover:bg-black/40 border border-white/30 text-white text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <Bot className="w-4 h-4 text-rose-200" />
            Ask AI
          </Link>
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="rounded-2xl bg-white dark:bg-[#27272A] border border-rose-200/80 dark:border-[#3F3F46] p-5 shadow-sm transition-colors">
          <div className="flex items-center justify-between text-[#76516B] dark:text-[#D4D4D8] text-xs mb-2">
            <span className="font-medium">{isFourthYear ? 'Job-Readiness Index' : 'Overall Roadmap'}</span>
            <Compass className="w-4 h-4 text-[#9F1239] dark:text-rose-400" />
          </div>
          <div className="text-2xl font-bold text-[#27272A] dark:text-[#FAFAFA] mb-2">
            {isFourthYear ? `${seniorReadiness?.totalScore || 0}%` : `${progressSummary.percentage}%`}
          </div>
          <ProgressBar
            percentage={isFourthYear ? (seniorReadiness?.totalScore || 0) : progressSummary.percentage}
            showLabel={false}
            size="sm"
          />
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-2">
            {isFourthYear
              ? `${seniorReadiness?.assessedCount || 0} of ${seniorReadiness?.totalSkills || 12} skills diagnosed`
              : `${progressSummary.completedRequired} of ${progressSummary.totalRequired} required topics done`}
          </p>
        </div>

        {/* Metric 2 */}
        <div className="rounded-2xl bg-white dark:bg-[#27272A] border border-rose-200/80 dark:border-[#3F3F46] p-5 shadow-sm transition-colors">
          <div className="flex items-center justify-between text-[#76516B] dark:text-[#D4D4D8] text-xs mb-2">
            <span className="font-medium">{isFourthYear ? 'Interview & Revision' : 'Curriculum Hours'}</span>
            <Clock className="w-4 h-4 text-[#9F1239] dark:text-rose-400" />
          </div>
          <div className="text-2xl font-bold text-[#27272A] dark:text-[#FAFAFA] mb-1">
            {isFourthYear
              ? `${(seniorReadiness?.revisedIds?.length || 0) + (seniorReadiness?.interviewIds?.length || 0)} done`
              : `${progressSummary.completedHours}h`}
            {!isFourthYear && (
              <span className="text-xs font-normal text-zinc-500 dark:text-zinc-400 ml-1">/ {progressSummary.totalHours}h</span>
            )}
          </div>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-2">
            {isFourthYear
              ? `${seniorReadiness?.weakSkills?.length || 0} open concept gaps needing review`
              : `Target: ~${studentPrefs?.weeklyHours || 15} hours per week`}
          </p>
        </div>

        {/* Metric 3 */}
        <div className="rounded-2xl bg-white dark:bg-[#27272A] border border-rose-200/80 dark:border-[#3F3F46] p-5 shadow-sm transition-colors">
          <div className="flex items-center justify-between text-[#76516B] dark:text-[#D4D4D8] text-xs mb-2">
            <span className="font-medium">Active Projects</span>
            <FolderGit2 className="w-4 h-4 text-[#9F1239] dark:text-rose-400" />
          </div>
          <div className="text-2xl font-bold text-[#27272A] dark:text-[#FAFAFA] mb-1">
            {activeProjects.filter(p => p.status === 'Completed').length} / {activeProjects.length}
          </div>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-2">
            {activeProjects.filter(p => p.status === 'In Progress').length} projects in progress
          </p>
        </div>

        {/* Metric 4 */}
        <div className="rounded-2xl bg-white dark:bg-[#27272A] border border-rose-200/80 dark:border-[#3F3F46] p-5 shadow-sm transition-colors">
          <div className="flex items-center justify-between text-[#76516B] dark:text-[#D4D4D8] text-xs mb-2">
            <span className="font-medium">Personal Mentor</span>
            <Users className="w-4 h-4 text-[#9F1239] dark:text-rose-400" />
          </div>
          <div className="text-sm font-bold text-[#27272A] dark:text-[#FAFAFA] truncate mb-1">
            {assignedMentor ? assignedMentor.fullName : 'None Assigned'}
          </div>
          <p className="text-[11px] text-[#9F1239] dark:text-rose-300 font-medium">
            {assignedMentor ? assignedMentor.organization : 'Browse faculty list'}
          </p>
        </div>
      </div>

      {/* Main Content Split: Next Action & Current Module vs Mentor Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Next Recommended Action & Current Module */}
        <div className="lg:col-span-2 space-y-6">
          {/* Next Recommended Topic Action */}
          <div className="rounded-2xl bg-white dark:bg-[#27272A] border border-rose-200/80 dark:border-[#3F3F46] p-6 shadow-sm transition-colors">
            {isFourthYear ? (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="p-2 rounded-xl bg-rose-100 dark:bg-rose-950/70 border border-rose-200 dark:border-rose-900/50 text-[#9F1239] dark:text-rose-400">
                      <Zap className="w-4 h-4" />
                    </span>
                    <div>
                      <h3 className="text-base font-bold text-[#27272A] dark:text-[#FAFAFA]">Senior Career-Readiness Sprint</h3>
                      <p className="text-xs text-[#76516B] dark:text-[#D4D4D8]">Targeted next priority for placement season</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                    High Priority
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-rose-50/50 dark:bg-zinc-900/60 border border-rose-200/70 dark:border-zinc-800 transition-colors">
                  <h4 className="text-sm font-bold text-[#9F1239] dark:text-rose-300 mb-1">
                    {seniorReadiness && seniorReadiness.assessedCount < seniorReadiness.totalSkills
                      ? 'Diagnose Core Skill Gaps & Weak Concepts'
                      : seniorReadiness && seniorReadiness.weakSkills.length > 0
                      ? `Revise Concept Gap: ${seniorReadiness.weakSkills[0].name}`
                      : 'Master Technical Interview Problem Statements'}
                  </h4>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-3 leading-relaxed">
                    {seniorReadiness && seniorReadiness.assessedCount < seniorReadiness.totalSkills
                      ? `Evaluate your proficiency in ${seniorReadiness.totalSkills - seniorReadiness.assessedCount} unassessed technical competencies for ${studentPrefs?.careerTrack}.`
                      : seniorReadiness && seniorReadiness.weakSkills.length > 0
                      ? 'Focus your revision sprint on closing this identified concept gap with high-yield derivations and practical exercises.'
                      : 'Rehearse senior behavioral and system architecture questions with model solutions and live AI mock sessions.'}
                  </p>

                  <div className="flex items-center justify-between gap-3">
                    <Link
                      to="/roadmap"
                      className="py-2 px-4 rounded-xl gradient-brand text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm hover:opacity-95 transition-opacity"
                    >
                      Open Career-Readiness Dashboard <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => navigate('/ai-assistant')}
                      className="py-2 px-3 rounded-xl bg-white hover:bg-rose-50 text-zinc-700 border border-rose-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-300 dark:border-zinc-700 text-xs font-medium transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Bot className="w-3.5 h-3.5 text-[#9F1239] dark:text-rose-400" /> Live AI Mock Interview
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="p-2 rounded-xl bg-rose-100 dark:bg-rose-950/70 border border-rose-200 dark:border-rose-900/50 text-[#9F1239] dark:text-rose-400">
                      <Zap className="w-4 h-4" />
                    </span>
                    <div>
                      <h3 className="text-base font-bold text-[#27272A] dark:text-[#FAFAFA]">Next Recommended Action</h3>
                      <p className="text-xs text-[#76516B] dark:text-[#D4D4D8]">{currentModule?.title || 'Core Foundations'}</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-rose-50 dark:bg-zinc-800 text-[#9F1239] dark:text-zinc-300 border border-rose-200 dark:border-zinc-700">
                    ~{nextTopic?.estimatedHours || 20} hours
                  </span>
                </div>

                {nextTopic ? (
                  <div className="p-4 rounded-xl bg-rose-50/50 dark:bg-zinc-900/60 border border-rose-200/70 dark:border-zinc-800 transition-colors">
                    <h4 className="text-sm font-bold text-[#9F1239] dark:text-rose-300 mb-1">{nextTopic.title}</h4>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-3 leading-relaxed">
                      {nextTopic.description}
                    </p>

                    <div className="p-3 rounded-lg bg-white dark:bg-zinc-900 border border-rose-200/80 dark:border-zinc-800 text-xs mb-4">
                      <div className="font-semibold text-zinc-800 dark:text-zinc-200 mb-1">
                        Hands-on Task: {nextTopic.practicalExercise.title}
                      </div>
                      <div className="text-zinc-500 dark:text-zinc-400 text-[11px]">
                        {nextTopic.practicalExercise.description}
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <Link
                        to="/roadmap"
                        className="py-2 px-4 rounded-xl gradient-brand text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm hover:opacity-95 transition-opacity"
                      >
                        Open Topic in Roadmap <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => navigate('/ai-assistant')}
                        className="py-2 px-3 rounded-xl bg-white hover:bg-rose-50 text-zinc-700 border border-rose-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-300 dark:border-zinc-700 text-xs font-medium transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <Bot className="w-3.5 h-3.5 text-[#9F1239] dark:text-rose-400" /> Ask AI to Explain
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 text-center py-8">
                    <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-400 mx-auto mb-2" />
                    <h4 className="text-sm font-bold text-emerald-800 dark:text-emerald-300">Curriculum Milestone Fully Completed!</h4>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
                      You have marked all core topics complete. Check out advanced capstone projects or internships!
                    </p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Active Assigned Projects */}
          <div className="rounded-2xl bg-white dark:bg-[#27272A] border border-rose-200/80 dark:border-[#3F3F46] p-6 shadow-sm transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-[#27272A] dark:text-[#FAFAFA]">Recommended Portfolio Projects</h3>
                <p className="text-xs text-[#76516B] dark:text-[#D4D4D8]">Targeted for your {studentPrefs?.academicYear} cohort</p>
              </div>
              <Link to="/projects" className="text-xs font-semibold text-[#9F1239] dark:text-rose-400 hover:underline flex items-center gap-1">
                View All <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {activeProjects.slice(0, 2).map(proj => {
                const completedCount = proj.milestones.filter(m => m.completed).length;
                return (
                  <div
                    key={proj.id}
                    className="p-4 rounded-xl bg-rose-50/40 dark:bg-zinc-950/60 border border-rose-200/70 dark:border-zinc-800 flex flex-col justify-between transition-colors"
                  >
                    <div>
                      <div className="flex items-center justify-between text-[10px] mb-2">
                        <span className="font-semibold text-[#9F1239] bg-rose-100 dark:bg-rose-950/60 px-2 py-0.5 rounded border border-rose-200 dark:border-rose-900/40">
                          {proj.difficulty}
                        </span>
                        <span className="text-zinc-500 dark:text-zinc-400">~{proj.estimatedHours}h</span>
                      </div>
                      <h4 className="text-xs font-bold text-[#27272A] dark:text-zinc-100 line-clamp-1">{proj.title}</h4>
                      <p className="text-[11px] text-zinc-600 dark:text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                        {proj.shortDescription}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-rose-200/60 dark:border-zinc-800 flex items-center justify-between">
                      <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
                        {completedCount}/{proj.milestones.length} Milestones
                      </span>
                      <Link
                        to={`/projects/${proj.id}`}
                        className="text-xs font-semibold text-[#9F1239] dark:text-rose-400 hover:underline"
                      >
                        Details →
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Col: Mentor Station, Shared Resources, & Quick AI Assistant */}
        <div className="space-y-6">
          {/* Mentor Station Card */}
          <div className="rounded-2xl bg-white dark:bg-[#27272A] border border-rose-200/80 dark:border-[#3F3F46] p-6 shadow-sm transition-colors">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-[#27272A] dark:text-[#FAFAFA] flex items-center gap-2">
                <Users className="w-4 h-4 text-[#9F1239] dark:text-rose-400" />
                Personal Human Mentor
              </h3>
              <Link to="/mentors" className="text-xs font-semibold text-[#9F1239] dark:text-rose-400 hover:underline">
                Directory
              </Link>
            </div>

            {assignedMentor ? (
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={assignedMentor.avatarUrl}
                    alt={assignedMentor.fullName}
                    className="w-12 h-12 rounded-xl object-cover border border-rose-200 dark:border-rose-900/60 shrink-0"
                  />
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-[#27272A] dark:text-zinc-100 truncate">{assignedMentor.fullName}</h4>
                    <p className="text-xs text-[#9F1239] dark:text-rose-300 truncate">{assignedMentor.title}</p>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">{assignedMentor.organization}</p>
                  </div>
                </div>

                <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-4 line-clamp-2 leading-relaxed">
                  {assignedMentor.bio}
                </p>

                {/* Mentor shared resources */}
                <div className="pt-3 border-t border-rose-200/70 dark:border-zinc-800">
                  <div className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-2 flex items-center justify-between">
                    <span>Uploaded Resources for You:</span>
                    <span className="text-[10px] text-[#9F1239] dark:text-rose-400 bg-rose-100 dark:bg-rose-950 px-1.5 py-0.5 rounded border border-rose-200 dark:border-rose-900/50 font-semibold">
                      {sharedResources.length} Files
                    </span>
                  </div>

                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {sharedResources.map(res => (
                      <a
                        key={res.id}
                        href={res.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 rounded-lg bg-rose-50/50 hover:bg-rose-100/70 border border-rose-200/70 dark:bg-zinc-950/70 dark:border-zinc-800/80 dark:hover:border-rose-900/50 flex items-start gap-2 text-xs transition-colors group block"
                      >
                        <FileText className="w-4 h-4 text-[#9F1239] dark:text-rose-400 shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-zinc-800 dark:text-zinc-200 group-hover:text-[#9F1239] dark:group-hover:text-rose-200 truncate">
                            {res.title}
                          </div>
                          <div className="text-[10px] text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5 mt-0.5">
                            <span>{res.resourceType}</span>
                            {res.fileSize && <span>• {res.fileSize}</span>}
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-zinc-500 dark:text-zinc-400 text-xs">
                <Users className="w-8 h-8 text-zinc-400 dark:text-zinc-600 mx-auto mb-2" />
                <p>No mentor assigned yet.</p>
                <Link
                  to="/mentors"
                  className="mt-3 inline-block py-1.5 px-3 rounded-lg gradient-brand text-white text-xs font-medium"
                >
                  Browse Mentorship Directory
                </Link>
              </div>
            )}
          </div>

          {/* Quick AI Assistant Card */}
          <div className="rounded-2xl bg-white dark:bg-[#27272A] border border-rose-200/80 dark:border-rose-950/60 p-6 shadow-sm transition-colors">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-xl gradient-brand flex items-center justify-center text-white">
                <Bot className="w-5 h-5 text-rose-200" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#27272A] dark:text-zinc-100">AI Assistant Shortcut</h3>
                <span className="text-[10px] text-[#9F1239] dark:text-rose-300 font-semibold">Gemini 3.8 Flash • Always Ready</span>
              </div>
            </div>

            <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-4 leading-relaxed">
              Need an intuitive explanation of mathematical optimization, advice on your Git repo, or interview practice?
            </p>

            <button
              type="button"
              onClick={() => navigate('/ai-assistant')}
              className="w-full py-2.5 px-3 rounded-xl gradient-brand text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-md shadow-rose-950/20 dark:shadow-rose-950/40 hover:opacity-95 transition-opacity cursor-pointer"
            >
              Start Conversation with AI <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Internship Section / Year 1 Guidance */}
      <div className="rounded-2xl bg-white dark:bg-[#27272A] border border-rose-200/80 dark:border-[#3F3F46] p-6 shadow-sm transition-colors">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-[#9F1239] dark:text-rose-400" />
            <div>
              <h3 className="text-base font-bold text-[#27272A] dark:text-[#FAFAFA]">Internship & Career Opportunities</h3>
              <p className="text-xs text-[#76516B] dark:text-[#D4D4D8]">
                {isFirstYear ? 'Foundational Preparation Phase' : `Curated for ${studentPrefs?.academicYear} students`}
              </p>
            </div>
          </div>
          {!isFirstYear && (
            <Link to="/internships" className="text-xs font-semibold text-[#9F1239] dark:text-rose-400 hover:underline flex items-center gap-1">
              View All Openings <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>

        {isFirstYear ? (
          <div className="p-6 rounded-xl bg-rose-50/60 dark:bg-zinc-950/60 border border-rose-200 dark:border-rose-950/60 flex flex-col md:flex-row items-center gap-4 text-center md:text-left transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-800/80 flex items-center justify-center text-[#9F1239] dark:text-rose-300 shrink-0">
              <Compass className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-[#4C0519] dark:text-rose-200">
                First-Year Focus: Build Your Foundations & Code Small Projects First!
              </h4>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 leading-relaxed max-w-3xl">
                We purposefully hide corporate internship listings for 1st-year students. Industry recruiters require demonstrable projects and solid data structures knowledge. Your highest return on time right now is completing your Python and Linear Algebra modules and building 2 portfolio projects!
              </p>
            </div>
            <Link
              to="/projects"
              className="py-2 px-4 rounded-xl gradient-brand text-white text-xs font-semibold shrink-0"
            >
              Explore 1st Year Projects
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {eligibleInternships.slice(0, 3).map(intern => (
              <div
                key={intern.id}
                className="p-4 rounded-xl bg-rose-50/40 dark:bg-zinc-950/60 border border-rose-200/70 dark:border-zinc-800 flex flex-col justify-between transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-[#9F1239] dark:text-rose-300">{intern.company}</span>
                    <span className="text-[10px] text-zinc-700 dark:text-zinc-400 bg-rose-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded border border-rose-200/60 dark:border-zinc-700">
                      {intern.workplaceType}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-[#27272A] dark:text-zinc-100 line-clamp-1">{intern.title}</h4>
                  <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold mt-1">{intern.stipend}</div>
                </div>

                <div className="mt-3 pt-3 border-t border-rose-200/60 dark:border-zinc-800 flex items-center justify-between">
                  <span className="text-[10px] text-zinc-500 dark:text-zinc-400">{intern.duration}</span>
                  <a
                    href={intern.applyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-[#9F1239] dark:text-rose-400 hover:underline"
                  >
                    Apply Now →
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

