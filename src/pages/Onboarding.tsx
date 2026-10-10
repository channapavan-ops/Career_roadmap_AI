import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import {
  Sparkles,
  GraduationCap,
  Briefcase,
  Clock,
  Award,
  ArrowRight,
  ShieldAlert,
  Building,
  Check,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AcademicYear, CareerTrack, CourseSelection, SkillLevel } from '../types';

export const Onboarding: React.FC = () => {
  const { user, studentPrefs, mentorProfile, updateStudentPrefs, updateMentorProfile } = useAuth();
  const navigate = useNavigate();

  const isMentor = user?.role === 'mentor';

  // Check whether the user has genuinely saved profile information
  const hasSavedStudentPrefs = Boolean(
    studentPrefs &&
    studentPrefs.onboardingCompleted === true &&
    studentPrefs.academicYear &&
    (studentPrefs.userId === user?.id || !user?.id)
  );

  const hasSavedMentorProfile = Boolean(
    mentorProfile &&
    mentorProfile.userId === user?.id &&
    mentorProfile.title &&
    mentorProfile.organization
  );

  // Student Form State: Do NOT pre-fill arbitrary defaults for new users
  const [collegeName, setCollegeName] = useState(
    hasSavedStudentPrefs ? (studentPrefs?.collegeName || '') : ''
  );
  const [academicYear, setAcademicYear] = useState<AcademicYear | null>(
    hasSavedStudentPrefs ? (studentPrefs?.academicYear || null) : null
  );
  const [course, setCourse] = useState<CourseSelection | null>(
    hasSavedStudentPrefs ? (studentPrefs?.course || null) : null
  );
  const [careerTrack, setCareerTrack] = useState<CareerTrack | null>(
    hasSavedStudentPrefs ? (studentPrefs?.careerTrack || null) : null
  );
  const [skillLevel, setSkillLevel] = useState<SkillLevel | null>(
    hasSavedStudentPrefs ? (studentPrefs?.skillLevel || null) : null
  );
  const [weeklyHours, setWeeklyHours] = useState<number | null>(
    hasSavedStudentPrefs && studentPrefs?.weeklyHours !== undefined ? studentPrefs.weeklyHours : null
  );

  // Mentor Form State: Clean initial state for new mentors
  const [mentorTitle, setMentorTitle] = useState(
    hasSavedMentorProfile ? (mentorProfile?.title || '') : ''
  );
  const [organization, setOrganization] = useState(
    hasSavedMentorProfile ? (mentorProfile?.organization || '') : ''
  );
  const [bio, setBio] = useState(
    hasSavedMentorProfile ? (mentorProfile?.bio || '') : ''
  );
  const [experienceYears, setExperienceYears] = useState<number | ''>(
    hasSavedMentorProfile ? (mentorProfile?.experienceYears || '') : ''
  );
  const [expertiseInput, setExpertiseInput] = useState(
    hasSavedMentorProfile ? (mentorProfile?.expertise?.join(', ') || '') : ''
  );

  // Form validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submittedAttempt, setSubmittedAttempt] = useState(false);

  const handleFinish = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedAttempt(true);

    if (isMentor) {
      const newErrors: Record<string, string> = {};
      if (!mentorTitle.trim()) {
        newErrors.mentorTitle = 'Please specify your professional title.';
      }
      if (!organization.trim()) {
        newErrors.organization = 'Please specify your organization or university.';
      }
      if (experienceYears === '' || Number(experienceYears) < 1) {
        newErrors.experienceYears = 'Please specify your years of experience (at least 1 year).';
      }
      if (!expertiseInput.trim()) {
        newErrors.expertiseInput = 'Please list at least one area of technical expertise.';
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      updateMentorProfile({
        userId: user?.id,
        fullName: user?.fullName || 'Mentor',
        title: mentorTitle.trim(),
        organization: organization.trim(),
        bio: bio.trim(),
        experienceYears: Number(experienceYears),
        expertise: expertiseInput.split(',').map(s => s.trim()).filter(Boolean),
      });
      navigate('/mentor-dashboard');
    } else {
      const newErrors: Record<string, string> = {};

      if (!academicYear) {
        newErrors.academicYear = 'Please select your academic year to calibrate your roadmap.';
      }
      if (!course) {
        newErrors.course = 'Please select your course or specialization.';
      }
      if (!careerTrack) {
        newErrors.careerTrack = 'Please select your target career track.';
      }
      if (!skillLevel) {
        newErrors.skillLevel = 'Please select your current coding & math skill level.';
      }

      if (Object.keys(newErrors).length > 0 || !academicYear || !course || !careerTrack || !skillLevel) {
        setErrors(newErrors);
        return;
      }

      updateStudentPrefs({
        userId: user?.id,
        collegeName: collegeName.trim(),
        academicYear,
        course,
        careerTrack,
        skillLevel,
        weeklyHours: weeklyHours !== null ? weeklyHours : 0,
        onboardingCompleted: true,
      });
      navigate('/dashboard');
    }
  };

  const isLimitedPreview = course && course !== 'Artificial Intelligence & Machine Learning';

  return (
    <div className="min-h-screen bg-[#FFF1F2] dark:bg-[#18181B] text-[#27272A] dark:text-[#FAFAFA] flex flex-col font-sans transition-colors duration-150">
      <Navbar />

      <div className="flex-1 max-w-3xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex items-center">
        <div className="w-full bg-white dark:bg-[#27272A] rounded-3xl p-6 sm:p-10 border border-rose-200 dark:border-[#3F3F46] shadow-xl shadow-rose-950/5 dark:shadow-black/40 transition-colors">
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/70 text-[#9F1239] dark:text-rose-300 text-xs font-semibold mb-3 border border-rose-200 dark:border-rose-900/60">
              <Sparkles className="w-3.5 h-3.5" />
              {isMentor ? 'Mentor Profile Configuration' : 'Personalize Your Student Roadmap'}
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#4C0519] dark:text-rose-200">
              {isMentor ? 'Set Up Your Mentorship Station' : 'Tell Us About Your Academic Profile'}
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              {isMentor
                ? 'Specify the domains and specializations you guide students in.'
                : 'We will calibrate your curriculum modules, project difficulty, and internship eligibility.'}
            </p>
          </div>

          {/* Validation Alert Banner if user attempted submission with missing required fields */}
          {submittedAttempt && Object.keys(errors).length > 0 && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/70 border border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold">Incomplete Profile Information:</strong> Please select or fill in all required fields indicated below before proceeding.
              </div>
            </div>
          )}

          <form onSubmit={handleFinish} className="space-y-6">
            {!isMentor ? (
              <>
                {/* College Name (Optional) */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                      <Building className="w-4 h-4 text-[#9F1239] dark:text-rose-400" />
                      <span>College or University Name</span>
                    </label>
                    <span className="text-[11px] text-zinc-400 dark:text-zinc-500 font-medium">(Optional)</span>
                  </div>
                  <input
                    type="text"
                    value={collegeName}
                    onChange={e => setCollegeName(e.target.value)}
                    placeholder="e.g. Indian Institute of Technology / Stanford / NIT (leave blank if independent)"
                    className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 focus:outline-none focus:border-[#9F1239] dark:focus:border-rose-500 transition-colors"
                  />
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1">
                    Optional. Used to display your institution badge on project submissions and mentor discovery.
                  </p>
                </div>

                {/* Academic Year Selection (Required) */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                      <GraduationCap className="w-4 h-4 text-[#9F1239] dark:text-rose-400" />
                      <span>Current Academic Year</span>
                      <span className="text-rose-600 dark:text-rose-400 font-bold">*</span>
                    </label>
                    <span className="text-[11px] text-[#9F1239] dark:text-rose-300 font-medium">Required</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {(['1st Year', '2nd Year', '3rd Year', '4th Year'] as AcademicYear[]).map(yr => (
                      <button
                        key={yr}
                        type="button"
                        onClick={() => {
                          setAcademicYear(yr);
                          setErrors(prev => {
                            const updated = { ...prev };
                            delete updated.academicYear;
                            return updated;
                          });
                        }}
                        className={`p-3 rounded-xl border text-xs font-semibold transition-all text-center flex flex-col items-center gap-1 cursor-pointer ${
                          academicYear === yr
                            ? 'gradient-brand text-white border-transparent shadow-sm'
                            : 'bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-rose-50 dark:hover:bg-zinc-800'
                        }`}
                      >
                        <span className="font-bold">{yr}</span>
                        <span className={`text-[10px] ${academicYear === yr ? 'text-rose-200' : 'text-zinc-500 dark:text-zinc-400'}`}>
                          {yr === '1st Year'
                            ? 'Years 1–4'
                            : yr === '2nd Year'
                            ? 'Years 2–4'
                            : yr === '3rd Year'
                            ? 'Years 3–4'
                            : 'Career Ready'}
                        </span>
                      </button>
                    ))}
                  </div>
                  {errors.academicYear ? (
                    <p className="text-xs text-rose-600 dark:text-rose-400 mt-1.5 flex items-center gap-1 font-medium">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.academicYear}
                    </p>
                  ) : (
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1">
                      Calibrates roadmap duration (Years 1–4 for 1st Year, Years 2–4 for 2nd Year, Years 3–4 for 3rd Year, or Career-Readiness Dashboard for 4th Year).
                    </p>
                  )}
                </div>

                {/* Course Selection (Required) */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                      <Briefcase className="w-4 h-4 text-[#9F1239] dark:text-rose-400" />
                      <span>Course / Specialization</span>
                      <span className="text-rose-600 dark:text-rose-400 font-bold">*</span>
                    </label>
                    <span className="text-[11px] text-[#9F1239] dark:text-rose-300 font-medium">Required</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {(
                      [
                        'Artificial Intelligence & Machine Learning',
                        'Data Science',
                        'Cybersecurity',
                      ] as CourseSelection[]
                    ).map(c => {
                      const isSelected = course === c;

                      return (
                        <button
                          key={c}
                          type="button"
                          onClick={() => {
                            setCourse(c);
                            setErrors(prev => {
                              const updated = { ...prev };
                              delete updated.course;
                              return updated;
                            });
                          }}
                          className={`p-3 rounded-xl border text-xs font-semibold text-left transition-all cursor-pointer ${
                            isSelected
                              ? 'gradient-brand text-white border-transparent shadow-sm'
                              : 'bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-rose-50 dark:hover:bg-zinc-800'
                          }`}
                        >
                          <div>{c}</div>
                        </button>
                      );
                    })}
                  </div>

                  {errors.course && (
                    <p className="text-xs text-rose-600 dark:text-rose-400 mt-1.5 flex items-center gap-1 font-medium">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.course}
                    </p>
                  )}

                  {isLimitedPreview && (
                    <div className="mt-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/80 text-amber-900 dark:text-amber-200 text-xs flex items-start gap-2">
                      <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <strong>Limited Preview Notice:</strong> Full 4-year curricula and step-by-step topic checklists are currently active for <em>Artificial Intelligence & Machine Learning</em>. Other fields will display preview modules.
                      </div>
                    </div>
                  )}
                </div>

                {/* Target Career Track (Required) */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-[#9F1239] dark:text-rose-400" />
                      <span>Career Target Track</span>
                      <span className="text-rose-600 dark:text-rose-400 font-bold">*</span>
                    </label>
                    <span className="text-[11px] text-[#9F1239] dark:text-rose-300 font-medium">Required</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setCareerTrack('AI Engineer');
                        setErrors(prev => {
                          const updated = { ...prev };
                          delete updated.careerTrack;
                          return updated;
                        });
                      }}
                      className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                        careerTrack === 'AI Engineer'
                          ? 'border-[#9F1239] dark:border-rose-500 bg-rose-50/70 dark:bg-rose-950/40 shadow-xs'
                          : 'border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 hover:bg-rose-50/40 dark:hover:bg-zinc-800'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-bold text-[#4C0519] dark:text-rose-200">AI Engineer</span>
                        {careerTrack === 'AI Engineer' && (
                          <span className="p-1 rounded-full gradient-brand text-white">
                            <Check className="w-3 h-3" />
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                        Foundation models, LLM apps, RAG pipelines, prompt engineering, vector databases, and API development.
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setCareerTrack('Machine Learning Engineer');
                        setErrors(prev => {
                          const updated = { ...prev };
                          delete updated.careerTrack;
                          return updated;
                        });
                      }}
                      className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                        careerTrack === 'Machine Learning Engineer'
                          ? 'border-[#9F1239] dark:border-rose-500 bg-rose-50/70 dark:bg-rose-950/40 shadow-xs'
                          : 'border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 hover:bg-rose-50/40 dark:hover:bg-zinc-800'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-bold text-[#4C0519] dark:text-rose-200">Machine Learning Engineer</span>
                        {careerTrack === 'Machine Learning Engineer' && (
                          <span className="p-1 rounded-full gradient-brand text-white">
                            <Check className="w-3 h-3" />
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                        Statistical modeling, Scikit-learn, deep neural architectures, MLflow experiment tracking, and MLOps deployment.
                      </p>
                    </button>
                  </div>
                  {errors.careerTrack && (
                    <p className="text-xs text-rose-600 dark:text-rose-400 mt-1.5 flex items-center gap-1 font-medium">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.careerTrack}
                    </p>
                  )}
                </div>

                {/* Skill Level & Hours */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                        Current Coding & Math Level <span className="text-rose-600 dark:text-rose-400 font-bold">*</span>
                      </label>
                      <span className="text-[11px] text-[#9F1239] dark:text-rose-300 font-medium">Required</span>
                    </div>
                    <select
                      value={skillLevel || ''}
                      onChange={e => {
                        const val = e.target.value as SkillLevel;
                        setSkillLevel(val || null);
                        setErrors(prev => {
                          const updated = { ...prev };
                          delete updated.skillLevel;
                          return updated;
                        });
                      }}
                      className={`w-full bg-zinc-50 dark:bg-zinc-900 border rounded-xl px-3 py-2.5 text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 focus:outline-none focus:border-[#9F1239] dark:focus:border-rose-500 transition-colors ${
                        errors.skillLevel ? 'border-rose-400 dark:border-rose-600' : 'border-zinc-200 dark:border-zinc-700'
                      }`}
                    >
                      <option value="">-- Select your coding & math level --</option>
                      <option value="Beginner">Beginner (Basic programming knowledge)</option>
                      <option value="Intermediate">Intermediate (Familiar with Python & calculus)</option>
                      <option value="Advanced">Advanced (Prior ML/PyTorch projects)</option>
                    </select>
                    {errors.skillLevel && (
                      <p className="text-xs text-rose-600 dark:text-rose-400 mt-1.5 flex items-center gap-1 font-medium">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {errors.skillLevel}
                      </p>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
                        <span>Weekly Learning Hours Available</span>
                      </label>
                      <span className="text-[11px] text-zinc-400 dark:text-zinc-500 font-medium">(Optional)</span>
                    </div>
                    <select
                      value={weeklyHours !== null ? weeklyHours : ''}
                      onChange={e => {
                        const val = e.target.value;
                        setWeeklyHours(val ? Number(val) : null);
                      }}
                      className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 focus:outline-none focus:border-[#9F1239] dark:focus:border-rose-500 transition-colors"
                    >
                      <option value="">-- Optional (specify weekly commitment) --</option>
                      <option value={8}>8–10 Hours / Week (Light)</option>
                      <option value={15}>12–15 Hours / Week (Recommended)</option>
                      <option value={20}>18–20 Hours / Week (Intensive)</option>
                      <option value={25}>25+ Hours / Week (Full-time Sprint)</option>
                    </select>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1">
                      Optional weekly pace calibration. Can be modified later in Profile.
                    </p>
                  </div>
                </div>
              </>
            ) : (
              /* MENTOR ONBOARDING FIELDS */
              <>
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                      Professional Title & Affiliation <span className="text-rose-600 dark:text-rose-400 font-bold">*</span>
                    </label>
                    <span className="text-[11px] text-[#9F1239] dark:text-rose-300 font-medium">Required</span>
                  </div>
                  <input
                    type="text"
                    value={mentorTitle}
                    onChange={e => {
                      setMentorTitle(e.target.value);
                      setErrors(prev => {
                        const updated = { ...prev };
                        delete updated.mentorTitle;
                        return updated;
                      });
                    }}
                    placeholder="e.g. Staff Research Scientist / Associate Professor"
                    className={`w-full bg-zinc-50 dark:bg-zinc-900 border rounded-xl px-4 py-2.5 text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 focus:outline-none focus:border-[#9F1239] dark:focus:border-rose-500 ${
                      errors.mentorTitle ? 'border-rose-400 dark:border-rose-600' : 'border-zinc-200 dark:border-zinc-700'
                    }`}
                  />
                  {errors.mentorTitle && (
                    <p className="text-xs text-rose-600 dark:text-rose-400 mt-1.5 flex items-center gap-1 font-medium">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.mentorTitle}
                    </p>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                      Organization / University <span className="text-rose-600 dark:text-rose-400 font-bold">*</span>
                    </label>
                    <span className="text-[11px] text-[#9F1239] dark:text-rose-300 font-medium">Required</span>
                  </div>
                  <input
                    type="text"
                    value={organization}
                    onChange={e => {
                      setOrganization(e.target.value);
                      setErrors(prev => {
                        const updated = { ...prev };
                        delete updated.organization;
                        return updated;
                      });
                    }}
                    placeholder="e.g. DeepMind / IIT Madras / Microsoft Research"
                    className={`w-full bg-zinc-50 dark:bg-zinc-900 border rounded-xl px-4 py-2.5 text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 focus:outline-none focus:border-[#9F1239] dark:focus:border-rose-500 ${
                      errors.organization ? 'border-rose-400 dark:border-rose-600' : 'border-zinc-200 dark:border-zinc-700'
                    }`}
                  />
                  {errors.organization && (
                    <p className="text-xs text-rose-600 dark:text-rose-400 mt-1.5 flex items-center gap-1 font-medium">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.organization}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                    Professional Bio & Mentorship Style (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={bio}
                    onChange={e => setBio(e.target.value)}
                    placeholder="Share how you guide mentees through project implementations, paper reading, or interview preparation..."
                    className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 focus:outline-none focus:border-[#9F1239] dark:focus:border-rose-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                        Years of Experience <span className="text-rose-600 dark:text-rose-400 font-bold">*</span>
                      </label>
                      <span className="text-[11px] text-[#9F1239] dark:text-rose-300 font-medium">Required</span>
                    </div>
                    <input
                      type="number"
                      min={1}
                      max={40}
                      value={experienceYears}
                      onChange={e => {
                        const val = e.target.value === '' ? '' : Number(e.target.value);
                        setExperienceYears(val);
                        setErrors(prev => {
                          const updated = { ...prev };
                          delete updated.experienceYears;
                          return updated;
                        });
                      }}
                      placeholder="e.g. 5"
                      className={`w-full bg-zinc-50 dark:bg-zinc-900 border rounded-xl px-4 py-2.5 text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 focus:outline-none focus:border-[#9F1239] dark:focus:border-rose-500 ${
                        errors.experienceYears ? 'border-rose-400 dark:border-rose-600' : 'border-zinc-200 dark:border-zinc-700'
                      }`}
                    />
                    {errors.experienceYears && (
                      <p className="text-xs text-rose-600 dark:text-rose-400 mt-1.5 flex items-center gap-1 font-medium">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {errors.experienceYears}
                      </p>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                        Core Expertise (Comma-Separated) <span className="text-rose-600 dark:text-rose-400 font-bold">*</span>
                      </label>
                      <span className="text-[11px] text-[#9F1239] dark:text-rose-300 font-medium">Required</span>
                    </div>
                    <input
                      type="text"
                      value={expertiseInput}
                      onChange={e => {
                        setExpertiseInput(e.target.value);
                        setErrors(prev => {
                          const updated = { ...prev };
                          delete updated.expertiseInput;
                          return updated;
                        });
                      }}
                      placeholder="e.g. PyTorch, MLOps, LLMs, Computer Vision"
                      className={`w-full bg-zinc-50 dark:bg-zinc-900 border rounded-xl px-4 py-2.5 text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 focus:outline-none focus:border-[#9F1239] dark:focus:border-rose-500 ${
                        errors.expertiseInput ? 'border-rose-400 dark:border-rose-600' : 'border-zinc-200 dark:border-zinc-700'
                      }`}
                    />
                    {errors.expertiseInput && (
                      <p className="text-xs text-rose-600 dark:text-rose-400 mt-1.5 flex items-center gap-1 font-medium">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {errors.expertiseInput}
                      </p>
                    )}
                  </div>
                </div>
              </>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl gradient-brand text-white font-semibold text-sm shadow-md shadow-rose-950/20 hover:opacity-95 transition-opacity flex items-center justify-center gap-2 mt-4 cursor-pointer"
            >
              <span>{isMentor ? 'Launch Mentor Workspace' : 'GENERATE MY ROADMAP'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
