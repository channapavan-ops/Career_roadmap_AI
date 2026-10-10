import React from 'react';
import { Award, Briefcase, GraduationCap, Users, UserPlus, Check } from 'lucide-react';
import { MentorProfileData } from '../types';

interface MentorCardProps {
  mentor: MentorProfileData;
  isAssigned?: boolean;
  isPending?: boolean;
  onRequestMentorship: (mentor: MentorProfileData) => void;
  isLightMode?: boolean;
}

export const MentorCard: React.FC<MentorCardProps> = ({
  mentor,
  isAssigned = false,
  isPending = false,
  onRequestMentorship,
}) => {
  return (
    <div className="rounded-2xl border border-rose-200/80 dark:border-[#3F3F46] bg-white dark:bg-[#27272A] text-[#27272A] dark:text-[#FAFAFA] p-5 flex flex-col justify-between transition-all group shadow-sm hover:shadow-md">
      <div>
        <div className="flex items-start gap-4 mb-4">
          <img
            src={mentor.avatarUrl}
            alt={mentor.fullName}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-rose-200 dark:border-rose-900/40 shadow-sm shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-bold text-[#27272A] dark:text-[#FAFAFA] truncate">{mentor.fullName}</h3>
              {mentor.isAcceptingMentees ? (
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/60">
                  Accepting Mentees
                </span>
              ) : (
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600 border border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700">
                  Mentee Cohort Full
                </span>
              )}
            </div>
            <p className="text-xs font-semibold text-[#9F1239] dark:text-rose-400 mt-0.5">{mentor.title}</p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{mentor.organization}</p>
          </div>
        </div>

        <p className="text-xs leading-relaxed line-clamp-3 mb-4 text-[#76516B] dark:text-zinc-400">
          {mentor.bio}
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl border border-rose-200/70 dark:border-zinc-800/80 bg-rose-50/50 dark:bg-zinc-950/60 text-xs mb-4">
          <div className="flex items-center gap-1.5 text-zinc-700 dark:text-zinc-300">
            <Briefcase className="w-3.5 h-3.5 text-[#9F1239] dark:text-rose-400" />
            <span>{mentor.experienceYears} Years Exp.</span>
          </div>
          <div className="flex items-center gap-1.5 text-zinc-700 dark:text-zinc-300">
            <Users className="w-3.5 h-3.5 text-[#9F1239] dark:text-rose-400" />
            <span>{mentor.assignedStudentIds.length}/{mentor.maxStudents} Mentees</span>
          </div>
        </div>

        {/* Expertise Pills */}
        <div className="mb-4">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-[#9F1239] dark:text-rose-400 mb-1.5 flex items-center gap-1">
            <Award className="w-3.5 h-3.5" /> Key Expertise
          </div>
          <div className="flex flex-wrap gap-1.5">
            {mentor.expertise.map((exp, i) => (
              <span key={i} className="text-[11px] px-2 py-0.5 rounded-md border border-rose-200/80 dark:border-zinc-700/60 bg-rose-50 dark:bg-zinc-800 text-[#9F1239] dark:text-zinc-300 font-medium">
                {exp}
              </span>
            ))}
          </div>
        </div>

        {/* Courses Guided */}
        <div className="mb-4">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1 flex items-center gap-1">
            <GraduationCap className="w-3.5 h-3.5 text-zinc-400" /> Specializations
          </div>
          <div className="flex flex-wrap gap-1">
            {mentor.courseSpecialization.map((c, i) => (
              <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-300">
                {c}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-rose-100 dark:border-zinc-800">
        {isAssigned ? (
          <div className="w-full py-2 px-3 rounded-xl bg-rose-100 text-[#9F1239] border border-rose-300 dark:bg-rose-950/60 dark:border-rose-800/60 dark:text-rose-300 text-xs font-semibold flex items-center justify-center gap-1.5">
            <Check className="w-4 h-4 text-[#9F1239] dark:text-rose-400" />
            Assigned Personal Mentor
          </div>
        ) : isPending ? (
          <div className="w-full py-2 px-3 rounded-xl bg-amber-100 text-amber-800 border border-amber-300 dark:bg-amber-950/60 dark:border-amber-800/60 dark:text-amber-300 text-xs font-semibold flex items-center justify-center gap-1.5">
            Request Pending Review
          </div>
        ) : (
          <button
            type="button"
            onClick={() => onRequestMentorship(mentor)}
            disabled={!mentor.isAcceptingMentees}
            className="w-full py-2 px-3 rounded-xl gradient-brand text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-md shadow-rose-950/20 dark:shadow-rose-950/40 hover:opacity-95 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            Request Mentorship Guidance
          </button>
        )}
      </div>
    </div>
  );
};
