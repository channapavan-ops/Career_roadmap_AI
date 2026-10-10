import React, { useState } from 'react';
import {
  User,
  GraduationCap,
  Building,
  Briefcase,
  Award,
  Clock,
  Save,
  CheckCircle2,
  Users,
  Compass,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useRoadmapProgress } from '../hooks/useRoadmapProgress';
import { AcademicYear, CareerTrack, SkillLevel } from '../types';

export const Profile: React.FC = () => {
  const { user, studentPrefs, mentorProfile, updateStudentPrefs, updateMentorProfile } = useAuth();
  const { progressSummary } = useRoadmapProgress();

  const isMentor = user?.role === 'mentor';

  // Student form state
  const [collegeName, setCollegeName] = useState(studentPrefs?.collegeName ?? '');
  const [academicYear, setAcademicYear] = useState<AcademicYear>(studentPrefs?.academicYear || '2nd Year');
  const [careerTrack, setCareerTrack] = useState<CareerTrack>(studentPrefs?.careerTrack || 'Machine Learning Engineer');
  const [skillLevel, setSkillLevel] = useState<SkillLevel>(studentPrefs?.skillLevel || 'Intermediate');
  const [weeklyHours, setWeeklyHours] = useState<number>(studentPrefs?.weeklyHours || 15);

  // Mentor form state
  const [title, setTitle] = useState(mentorProfile?.title || 'Staff Research Scientist');
  const [organization, setOrganization] = useState(mentorProfile?.organization || 'DeepMind Research Fellow');
  const [bio, setBio] = useState(mentorProfile?.bio || '');
  const [experienceYears, setExperienceYears] = useState(mentorProfile?.experienceYears || 8);
  const [expertiseStr, setExpertiseStr] = useState(mentorProfile?.expertise?.join(', ') || '');

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (isMentor) {
      updateMentorProfile({
        title,
        organization,
        bio,
        experienceYears,
        expertise: expertiseStr.split(',').map(s => s.trim()).filter(Boolean),
      });
    } else {
      updateStudentPrefs({
        collegeName: collegeName.trim(),
        academicYear,
        careerTrack,
        skillLevel,
        weeklyHours,
        onboardingCompleted: true,
      });
    }
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header Banner */}
      <div className="rounded-2xl bg-white dark:bg-zinc-900/90 border border-rose-200/80 dark:border-zinc-800 p-6 shadow-sm dark:shadow-xl flex items-center justify-between transition-colors">
        <div className="flex items-center gap-4">
          <img
            src={user?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
            alt={user?.fullName || 'User'}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-rose-200 dark:border-rose-900/60 shadow-xs"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-[#27272A] dark:text-zinc-100">{user?.fullName}</h1>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-rose-100 text-[#9F1239] border border-rose-200 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-900/50">
                {isMentor ? 'Verified Mentor' : studentPrefs?.academicYear}
              </span>
            </div>
            <p className="text-xs text-[#76516B] dark:text-zinc-400 mt-0.5">{user?.email}</p>
            <p className="text-[11px] text-[#9F1239] dark:text-rose-300 font-medium mt-0.5">
              {isMentor ? mentorProfile?.title : studentPrefs?.careerTrack}
            </p>
          </div>
        </div>

        {!isMentor && (
          <div className="hidden sm:block text-right bg-rose-50/60 dark:bg-zinc-950/70 p-3 rounded-xl border border-rose-200/80 dark:border-zinc-800">
            <div className="text-[11px] text-[#76516B] dark:text-zinc-500">Roadmap Progress</div>
            <div className="text-lg font-bold text-[#9F1239] dark:text-rose-300">{progressSummary.percentage}%</div>
            <div className="text-[10px] text-zinc-500 dark:text-zinc-400">{progressSummary.completedRequired} Topics Mastered</div>
          </div>
        )}
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800/80 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Profile configuration saved successfully!</span>
        </div>
      )}

      {/* Profile Form */}
      <div className="rounded-2xl bg-white dark:bg-zinc-900/90 border border-rose-200/80 dark:border-zinc-800 p-6 shadow-sm dark:shadow-md transition-colors">
        <h2 className="text-base font-bold text-[#27272A] dark:text-zinc-100 mb-1">
          {isMentor ? 'Mentor Faculty Settings' : 'Academic & Career Preferences'}
        </h2>
        <p className="text-xs text-[#76516B] dark:text-zinc-400 mb-6">
          Adjusting your academic parameters dynamically re-calibrates your roadmap and project recommendations.
        </p>

        <form onSubmit={handleSave} className="space-y-5">
          {!isMentor ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    College / University
                  </label>
                  <input
                    type="text"
                    value={collegeName}
                    onChange={e => setCollegeName(e.target.value)}
                    className="w-full bg-rose-50/40 dark:bg-zinc-950 border border-rose-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-[#27272A] dark:text-zinc-100 focus:outline-none focus:border-[#9F1239] dark:focus:border-rose-500 transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Academic Year
                  </label>
                  <select
                    value={academicYear}
                    onChange={e => setAcademicYear(e.target.value as AcademicYear)}
                    className="w-full bg-rose-50/40 dark:bg-zinc-950 border border-rose-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-[#27272A] dark:text-zinc-100 focus:outline-none focus:border-[#9F1239] dark:focus:border-rose-500 transition-colors"
                  >
                    <option value="1st Year">1st Year (Complete 4-Year Roadmap: Years 1–4)</option>
                    <option value="2nd Year">2nd Year (3-Year Roadmap: Years 2–4)</option>
                    <option value="3rd Year">3rd Year (2-Year Roadmap: Years 3–4)</option>
                    <option value="4th Year">4th Year (Career-Readiness & Skill-Gap Mode)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Target Career Goal
                  </label>
                  <select
                    value={careerTrack}
                    onChange={e => setCareerTrack(e.target.value as CareerTrack)}
                    className="w-full bg-rose-50/40 dark:bg-zinc-950 border border-rose-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-[#27272A] dark:text-zinc-100 focus:outline-none focus:border-[#9F1239] dark:focus:border-rose-500 transition-colors"
                  >
                    <option value="AI Engineer">AI Engineer (LLMs, RAG, APIs)</option>
                    <option value="Machine Learning Engineer">Machine Learning Engineer (Modeling, MLOps)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Skill Level
                  </label>
                  <select
                    value={skillLevel}
                    onChange={e => setSkillLevel(e.target.value as SkillLevel)}
                    className="w-full bg-rose-50/40 dark:bg-zinc-950 border border-rose-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-[#27272A] dark:text-zinc-100 focus:outline-none focus:border-[#9F1239] dark:focus:border-rose-500 transition-colors"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Weekly Available Study Hours
                </label>
                <input
                  type="number"
                  min={5}
                  max={40}
                  value={weeklyHours}
                  onChange={e => setWeeklyHours(Number(e.target.value))}
                  className="w-full bg-rose-50/40 dark:bg-zinc-950 border border-rose-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-[#27272A] dark:text-zinc-100 focus:outline-none focus:border-[#9F1239] dark:focus:border-rose-500 transition-colors"
                />
              </div>
            </>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Professional Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    className="w-full bg-rose-50/40 dark:bg-zinc-950 border border-rose-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-[#27272A] dark:text-zinc-100 focus:outline-none focus:border-[#9F1239] dark:focus:border-rose-500 transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Organization / Lab
                  </label>
                  <input
                    type="text"
                    value={organization}
                    onChange={e => setOrganization(e.target.value)}
                    className="w-full bg-rose-50/40 dark:bg-zinc-950 border border-rose-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-[#27272A] dark:text-zinc-100 focus:outline-none focus:border-[#9F1239] dark:focus:border-rose-500 transition-colors"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Bio & Mentorship Focus
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  className="w-full bg-rose-50/40 dark:bg-zinc-950 border border-rose-200 dark:border-zinc-800 rounded-xl p-3 text-xs text-[#27272A] dark:text-zinc-100 focus:outline-none focus:border-[#9F1239] dark:focus:border-rose-500 transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Expertise Areas (comma-separated)
                </label>
                <input
                  type="text"
                  value={expertiseStr}
                  onChange={e => setExpertiseStr(e.target.value)}
                  className="w-full bg-rose-50/40 dark:bg-zinc-950 border border-rose-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-[#27272A] dark:text-zinc-100 focus:outline-none focus:border-[#9F1239] dark:focus:border-rose-500 transition-colors"
                  required
                />
              </div>
            </>
          )}

          <div className="pt-2">
            <button
              type="submit"
              className="py-2.5 px-6 rounded-xl gradient-brand text-white text-xs font-semibold shadow-md flex items-center gap-2 hover:opacity-95 cursor-pointer"
            >
              <Save className="w-4 h-4" /> Save Profile Preferences
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
