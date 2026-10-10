import React, { useState } from 'react';
import {
  Users,
  UploadCloud,
  FileText,
  Video,
  BookOpen,
  Plus,
  Trash2,
  ExternalLink,
  Award,
  CheckCircle2,
  Sparkles,
  GraduationCap,
  Briefcase,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { mentorService } from '../services/mentorService';
import { SharedResourceItem, MentorResourceType } from '../types';

export const MentorDashboard: React.FC = () => {
  const { user, mentorProfile, updateMentorProfile } = useAuth();
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  // Form State for uploading resources
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [resourceType, setResourceType] = useState<MentorResourceType>('PDF');
  const [url, setUrl] = useState('');
  const [targetStudentId, setTargetStudentId] = useState<string>('all');
  const [fileSize, setFileSize] = useState('2.4 MB');
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Mentor's shared resources
  const mentorId = mentorProfile?.userId || user?.id || 'mentor-1';
  const myResources = mentorService.getResourcesByMentor(mentorId);

  // Sample assigned students
  const assignedStudents = [
    {
      id: 'student-demo-1',
      fullName: 'Aarav Sharma',
      college: 'National Institute of Technology',
      year: '2nd Year',
      track: 'Machine Learning Engineer',
      progress: 62,
      lastActive: 'Today, 2:15 PM',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120',
    },
    {
      id: 'student-demo-2',
      fullName: 'Neha Verma',
      college: 'Indian Institute of Technology, Delhi',
      year: '4th Year',
      track: 'AI Engineer',
      progress: 88,
      lastActive: 'Yesterday',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120',
    },
  ];

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !url) return;

    const targetStudentName =
      targetStudentId === 'all'
        ? 'All Assigned Mentees'
        : assignedStudents.find(s => s.id === targetStudentId)?.fullName || 'Assigned Student';

    mentorService.addSharedResource({
      title,
      description,
      resourceType,
      url,
      mentorId,
      mentorName: mentorProfile?.fullName || user?.fullName || 'Dr. Maya Lin',
      targetStudentId,
      targetStudentName,
      fileSize,
    });

    setUploadSuccess(true);
    setTimeout(() => {
      setUploadSuccess(false);
      setUploadModalOpen(false);
      setTitle('');
      setDescription('');
      setUrl('');
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Mentor Hero Banner */}
      <div className="rounded-2xl gradient-brand p-6 sm:p-8 text-white shadow-xl shadow-rose-950/30 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-black/30 border border-white/20 text-rose-100 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-rose-300" />
              Faculty & Industry Mentor Station
            </span>
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-black/30 border border-white/20 text-rose-100">
              {mentorProfile?.organization || 'DeepMind Research Fellow'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Mentor Workspace: {mentorProfile?.fullName || user?.fullName || 'Faculty'}
          </h1>
          <p className="text-xs sm:text-sm text-rose-100/90 mt-1.5 max-w-xl">
            Guide your assigned engineering students, review their milestone repositories, and distribute authorized research notes and lecture materials.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setUploadModalOpen(true)}
          className="py-3 px-5 rounded-xl bg-white text-[#9F1239] text-xs sm:text-sm font-bold hover:bg-rose-50 transition-colors shadow-lg flex items-center gap-2 shrink-0"
        >
          <UploadCloud className="w-4 h-4" />
          Upload & Share Resource
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl bg-white dark:bg-[#27272A] border border-rose-200/80 dark:border-[#3F3F46] p-5 shadow-sm transition-colors">
          <div className="text-xs text-[#76516B] dark:text-[#D4D4D8] mb-1 flex items-center justify-between">
            <span className="font-medium">Assigned Students</span>
            <Users className="w-4 h-4 text-[#9F1239] dark:text-rose-400" />
          </div>
          <div className="text-2xl font-bold text-[#27272A] dark:text-[#FAFAFA]">{assignedStudents.length} Students</div>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1">Cohort capacity: {mentorProfile?.maxStudents || 5} max</p>
        </div>

        <div className="rounded-2xl bg-white dark:bg-[#27272A] border border-rose-200/80 dark:border-[#3F3F46] p-5 shadow-sm transition-colors">
          <div className="text-xs text-[#76516B] dark:text-[#D4D4D8] mb-1 flex items-center justify-between">
            <span className="font-medium">Shared Learning Materials</span>
            <FileText className="w-4 h-4 text-[#9F1239] dark:text-rose-400" />
          </div>
          <div className="text-2xl font-bold text-[#27272A] dark:text-[#FAFAFA]">{myResources.length} Resources</div>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1">PDFs, notes, and starter guides</p>
        </div>

        <div className="rounded-2xl bg-white dark:bg-[#27272A] border border-rose-200/80 dark:border-[#3F3F46] p-5 shadow-sm transition-colors">
          <div className="text-xs text-[#76516B] dark:text-[#D4D4D8] mb-1 flex items-center justify-between">
            <span className="font-medium">Mentor Experience</span>
            <Award className="w-4 h-4 text-[#9F1239] dark:text-rose-400" />
          </div>
          <div className="text-2xl font-bold text-[#27272A] dark:text-[#FAFAFA]">{mentorProfile?.experienceYears || 8} Years</div>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1">Status: Accepting Mentees</p>
        </div>
      </div>

      {/* Two Column Layout: Assigned Students vs Uploaded Resources */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Assigned Students Roster */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl bg-white dark:bg-[#27272A] border border-rose-200/80 dark:border-[#3F3F46] p-6 shadow-sm transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-[#27272A] dark:text-[#FAFAFA] flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#9F1239] dark:text-rose-400" />
                  Assigned Student Mentees
                </h3>
                <p className="text-xs text-[#76516B] dark:text-zinc-400 mt-0.5">
                  Real-time academic progress and roadmap completion status for your cohort.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {assignedStudents.map(student => (
                <div
                  key={student.id}
                  className="p-4 rounded-xl bg-rose-50/40 dark:bg-zinc-950/70 border border-rose-200/70 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors"
                >
                  <div className="flex items-center gap-3.5">
                    <img
                      src={student.avatar}
                      alt={student.fullName}
                      className="w-11 h-11 rounded-xl object-cover border border-rose-200 dark:border-rose-900/50 shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm font-bold text-[#27272A] dark:text-zinc-100">{student.fullName}</h4>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-100 text-[#9F1239] border border-rose-200 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-900/50">
                          {student.year}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{student.college}</p>
                      <p className="text-[11px] text-[#9F1239] dark:text-rose-400 font-semibold">{student.track}</p>
                    </div>
                  </div>

                  <div className="w-full sm:w-48 bg-white dark:bg-zinc-900 p-3 rounded-xl border border-rose-200/70 dark:border-zinc-800 shrink-0">
                    <div className="flex justify-between text-[11px] text-zinc-600 dark:text-zinc-400 mb-1">
                      <span>Curriculum Progress</span>
                      <span className="font-bold text-[#9F1239] dark:text-rose-300">{student.progress}%</span>
                    </div>
                    <div className="w-full bg-rose-100 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                      <div className="h-full gradient-brand rounded-full" style={{ width: `${student.progress}%` }} />
                    </div>
                    <div className="text-[10px] text-zinc-500 mt-1 text-right">
                      Active: {student.lastActive}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Shared Resources Management */}
        <div className="space-y-6">
          <div className="rounded-2xl bg-white dark:bg-[#27272A] border border-rose-200/80 dark:border-[#3F3F46] p-6 shadow-sm transition-colors">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-[#27272A] dark:text-[#FAFAFA] flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#9F1239] dark:text-rose-400" />
                Materials Shared by You
              </h3>
              <button
                type="button"
                onClick={() => setUploadModalOpen(true)}
                className="text-xs font-semibold text-[#9F1239] dark:text-rose-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Upload New
              </button>
            </div>

            <div className="space-y-3">
              {myResources.map(res => (
                <div
                  key={res.id}
                  className="p-3.5 rounded-xl bg-rose-50/40 dark:bg-zinc-950/70 border border-rose-200/70 dark:border-zinc-800 flex flex-col justify-between transition-colors"
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-rose-100 text-[#9F1239] border border-rose-200 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-900/50">
                      {res.resourceType}
                    </span>
                    <span className="text-[10px] text-zinc-500">
                      Target: {res.targetStudentName || 'All'}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-[#27272A] dark:text-zinc-200 line-clamp-1 mb-1">{res.title}</h4>
                  <p className="text-[11px] text-[#76516B] dark:text-zinc-400 line-clamp-2 leading-relaxed mb-2">
                    {res.description}
                  </p>
                  <div className="flex items-center justify-between pt-2 border-t border-rose-200/60 dark:border-zinc-800 text-[11px]">
                    <span className="text-zinc-500">{res.fileSize || 'Link'}</span>
                    <a
                      href={res.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#9F1239] dark:text-rose-400 hover:underline flex items-center gap-1 font-semibold"
                    >
                      View <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Upload Resource Modal */}
      {uploadModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-rose-200 dark:border-zinc-700 shadow-2xl text-[#27272A] dark:text-zinc-100 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-[#27272A] dark:text-zinc-100">Upload & Share Learning Material</h3>
                <p className="text-xs text-[#76516B] dark:text-zinc-400">
                  Deliver exclusive notes, datasets, or lecture assignments to your students.
                </p>
              </div>
            </div>

            {uploadSuccess ? (
              <div className="p-6 text-center text-emerald-600 dark:text-emerald-400 space-y-2">
                <CheckCircle2 className="w-10 h-10 mx-auto" />
                <h4 className="font-bold text-base">Resource Distributed Successfully!</h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Target students will immediately see this item in their dashboard.
                </p>
              </div>
            ) : (
              <form onSubmit={handleUploadSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Resource Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="e.g. Deep Learning Matrix Calculus Reference Notes"
                    className="w-full bg-rose-50/50 dark:bg-zinc-950 border border-rose-200 dark:border-zinc-700 rounded-xl px-4 py-2 text-xs text-zinc-800 dark:text-zinc-100 focus:outline-none focus:border-[#9F1239] dark:focus:border-rose-500 transition-colors"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                      Resource Type
                    </label>
                    <select
                      value={resourceType}
                      onChange={e => setResourceType(e.target.value as MentorResourceType)}
                      className="w-full bg-rose-50/50 dark:bg-zinc-950 border border-rose-200 dark:border-zinc-700 rounded-xl px-3 py-2 text-xs text-zinc-800 dark:text-zinc-100 focus:outline-none focus:border-[#9F1239] dark:focus:border-rose-500 transition-colors"
                    >
                      <option value="PDF">PDF</option>
                      <option value="Notes">Notes</option>
                      <option value="Video link">Video link</option>
                      <option value="Documentation link">Documentation link</option>
                      <option value="Dataset link">Dataset link</option>
                      <option value="Assignment">Assignment</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                      Target Audience
                    </label>
                    <select
                      value={targetStudentId}
                      onChange={e => setTargetStudentId(e.target.value)}
                      className="w-full bg-rose-50/50 dark:bg-zinc-950 border border-rose-200 dark:border-zinc-700 rounded-xl px-3 py-2 text-xs text-zinc-800 dark:text-zinc-100 focus:outline-none focus:border-[#9F1239] dark:focus:border-rose-500 transition-colors"
                    >
                      <option value="all">All Assigned Mentees</option>
                      {assignedStudents.map(s => (
                        <option key={s.id} value={s.id}>
                          {s.fullName} ({s.year})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Resource Link / Storage File URL
                  </label>
                  <input
                    type="url"
                    value={url}
                    onChange={e => setUrl(e.target.value)}
                    placeholder="https://storage.supabase.co/... or https://github.com/..."
                    className="w-full bg-rose-50/50 dark:bg-zinc-950 border border-rose-200 dark:border-zinc-700 rounded-xl px-4 py-2 text-xs text-zinc-800 dark:text-zinc-100 focus:outline-none focus:border-[#9F1239] dark:focus:border-rose-500 transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Description & Instructions for Students
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Explain what specific sections the students should review or exercises they should complete..."
                    className="w-full bg-rose-50/50 dark:bg-zinc-950 border border-rose-200 dark:border-zinc-700 rounded-xl p-3 text-xs text-zinc-800 dark:text-zinc-100 focus:outline-none focus:border-[#9F1239] dark:focus:border-rose-500 transition-colors"
                    required
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setUploadModalOpen(false)}
                    className="py-2 px-4 rounded-xl text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="py-2.5 px-5 rounded-xl gradient-brand text-white text-xs font-semibold shadow-md hover:opacity-95 cursor-pointer"
                  >
                    Authorize & Upload
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
