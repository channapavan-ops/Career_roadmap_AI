import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  FileText,
  Video,
  BookOpen,
  Send,
  CheckCircle2,
  Lock,
  Sparkles,
  UserPlus,
  ExternalLink,
} from 'lucide-react';
import { mentorService, MentorRequest } from '../services/mentorService';
import { MentorCard } from '../components/MentorCard';
import { useAuth } from '../context/AuthContext';
import { MentorProfileData, SharedResourceItem } from '../types';

export const Mentors: React.FC = () => {
  const { user, studentPrefs, updateStudentPrefs } = useAuth();
  const [activeTab, setActiveTab] = useState<'directory' | 'resources'>('directory');
  const [search, setSearch] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('all');

  const [requestModalMentor, setRequestModalMentor] = useState<MentorProfileData | null>(null);
  const [requestNote, setRequestNote] = useState('');
  const [requestSuccess, setRequestSuccess] = useState(false);

  const mentors = mentorService.getMentors();
  const requests = mentorService.getRequests();
  const sharedResources = mentorService.getResourcesForStudent(user?.id || 'demo-student');

  const filteredMentors = mentors.filter(m => {
    const matchesSearch =
      search === '' ||
      m.fullName.toLowerCase().includes(search.toLowerCase()) ||
      m.organization.toLowerCase().includes(search.toLowerCase()) ||
      m.expertise.some(e => e.toLowerCase().includes(search.toLowerCase()));

    const matchesSpec =
      selectedSpecialization === 'all' ||
      m.courseSpecialization.some(c => c.toLowerCase().includes(selectedSpecialization.toLowerCase()));

    return matchesSearch && matchesSpec;
  });

  const handleSendRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestModalMentor) return;

    mentorService.sendRequest(
      requestModalMentor.userId,
      user?.id || 'demo-student',
      user?.fullName || 'Aarav Sharma',
      requestNote || 'Interested in guidance for my AI/ML roadmap projects.'
    );

    updateStudentPrefs({ assignedMentorId: requestModalMentor.userId });
    setRequestSuccess(true);
    setTimeout(() => {
      setRequestSuccess(false);
      setRequestModalMentor(null);
      setRequestNote('');
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl bg-white dark:bg-[#27272A] border border-rose-200/80 dark:border-[#3F3F46] p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 transition-colors">
        <div>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-rose-100 text-[#9F1239] border border-rose-200 dark:bg-rose-950/80 dark:text-rose-300 dark:border-rose-900/60 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-[#9F1239] dark:text-rose-400" />
              Verified Human Faculty & Scientists
            </span>
            <span className="text-xs text-[#76516B] dark:text-zinc-400">
              Personalized Guidance System
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#27272A] dark:text-[#FAFAFA]">
            Personal Mentors & Shared Resources
          </h1>
          <p className="text-xs sm:text-sm text-[#76516B] dark:text-[#D4D4D8] mt-1 max-w-2xl leading-relaxed">
            Connect with senior researchers and production architects. Mentors can review your projects, advise on career roadmaps, and upload exclusive study materials specifically for your cohort.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex gap-2 p-1 bg-rose-50 dark:bg-zinc-950 rounded-xl border border-rose-200 dark:border-zinc-800 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('directory')}
            className={`py-2 px-3.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'directory'
                ? 'gradient-brand text-white shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" /> Mentor Directory ({mentors.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('resources')}
            className={`py-2 px-3.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'resources'
                ? 'gradient-brand text-white shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" /> Shared With Me ({sharedResources.length})
          </button>
        </div>
      </div>

      {activeTab === 'directory' ? (
        <>
          {/* Search Toolbar */}
          <div className="rounded-2xl bg-white dark:bg-[#27272A] border border-rose-200/80 dark:border-[#3F3F46] p-4 flex flex-col md:flex-row items-center justify-between gap-3 shadow-sm transition-colors">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search mentors by name, DeepMind, MLOps, PyTorch..."
                className="w-full bg-rose-50/50 dark:bg-zinc-950 border border-rose-200 dark:border-zinc-800 focus:border-[#9F1239] dark:focus:border-rose-500 rounded-xl pl-10 pr-4 py-2 text-xs text-zinc-800 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none transition-colors"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <Filter className="w-4 h-4 text-zinc-400" />
              <span className="text-xs text-zinc-600 dark:text-zinc-400">Specialization:</span>
              <select
                value={selectedSpecialization}
                onChange={e => setSelectedSpecialization(e.target.value)}
                className="bg-rose-50/50 dark:bg-zinc-950 border border-rose-200 dark:border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-zinc-800 dark:text-zinc-200 focus:outline-none transition-colors"
              >
                <option value="all">All Domains</option>
                <option value="artificial intelligence">AI & ML</option>
                <option value="computer vision">Computer Vision</option>
                <option value="cybersecurity">Cybersecurity</option>
              </select>
            </div>
          </div>

          {/* Mentors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMentors.map(mentor => {
              const req = requests.find(
                r => r.mentorId === mentor.userId && r.studentId === (user?.id || 'demo-student')
              );
              const isAssigned = studentPrefs?.assignedMentorId === mentor.userId;
              const isPending = req?.status === 'pending';

              return (
                <MentorCard
                  key={mentor.userId}
                  mentor={mentor}
                  isAssigned={isAssigned}
                  isPending={isPending}
                  onRequestMentorship={m => setRequestModalMentor(m)}
                />
              );
            })}
          </div>
        </>
      ) : (
        /* SHARED RESOURCES TAB */
        <div className="space-y-6">
          <div className="rounded-2xl bg-white dark:bg-[#27272A] border border-rose-200/80 dark:border-[#3F3F46] p-6 shadow-sm transition-colors">
            <h3 className="text-base font-bold text-[#27272A] dark:text-[#FAFAFA] mb-1">
              Authorized Mentor Materials & Notes
            </h3>
            <p className="text-xs text-[#76516B] dark:text-zinc-400 mb-6">
              These documents, lecture notes, and assignments were uploaded by verified human mentors specifically for you and your assigned cohort.
            </p>

            {sharedResources.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sharedResources.map(res => (
                  <div
                    key={res.id}
                    className="p-5 rounded-xl bg-rose-50/40 dark:bg-zinc-950/70 border border-rose-200/70 dark:border-zinc-800 hover:border-rose-300 dark:hover:border-rose-900/60 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-rose-100 text-[#9F1239] border border-rose-200 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-900/50">
                          {res.resourceType}
                        </span>
                        {res.fileSize && (
                          <span className="text-[11px] text-zinc-500">{res.fileSize}</span>
                        )}
                      </div>

                      <h4 className="text-sm font-bold text-[#27272A] dark:text-zinc-100 mb-1 line-clamp-1">
                        {res.title}
                      </h4>
                      <p className="text-xs text-[#76516B] dark:text-zinc-400 line-clamp-3 leading-relaxed mb-4">
                        {res.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-rose-200/60 dark:border-zinc-800/80 flex items-center justify-between">
                      <div className="text-[11px] text-zinc-500">
                        Uploaded by <strong className="text-[#9F1239] dark:text-rose-300">{res.mentorName}</strong>
                      </div>
                      <a
                        href={res.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-1.5 px-3 rounded-lg gradient-brand text-white text-xs font-semibold flex items-center gap-1 hover:opacity-95 shadow-xs"
                      >
                        Access <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center text-zinc-500 dark:text-zinc-400 text-xs bg-rose-50/30 dark:bg-zinc-950/40 rounded-xl border border-rose-200/70 dark:border-zinc-800">
                <FileText className="w-10 h-10 text-zinc-400 dark:text-zinc-600 mx-auto mb-2" />
                <p>No resources shared with you yet. Once your mentor uploads notes, they will appear here!</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Request Mentorship Modal */}
      {requestModalMentor && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl max-w-md w-full p-6 sm:p-8 border border-rose-200 dark:border-zinc-700 shadow-2xl text-[#27272A] dark:text-zinc-100 transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <img
                src={requestModalMentor.avatarUrl}
                alt={requestModalMentor.fullName}
                className="w-12 h-12 rounded-xl object-cover border border-rose-200 dark:border-rose-900/60"
              />
              <div>
                <h3 className="text-base font-bold text-[#27272A] dark:text-zinc-100">{requestModalMentor.fullName}</h3>
                <p className="text-xs text-[#9F1239] dark:text-rose-300 font-medium">{requestModalMentor.title}</p>
              </div>
            </div>

            {requestSuccess ? (
              <div className="p-6 text-center text-emerald-600 dark:text-emerald-400 space-y-2">
                <CheckCircle2 className="w-10 h-10 mx-auto" />
                <h4 className="font-bold text-sm">Mentorship Request Dispatched!</h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {requestModalMentor.fullName} has been assigned to your profile station.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendRequest} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Introduction Note for Mentor
                  </label>
                  <textarea
                    rows={4}
                    value={requestNote}
                    onChange={e => setRequestNote(e.target.value)}
                    placeholder="Describe your current academic year, career track goals, and what specific project guidance or review you are seeking..."
                    className="w-full bg-rose-50/50 dark:bg-zinc-950 border border-rose-200 dark:border-zinc-700 rounded-xl p-3 text-xs text-zinc-800 dark:text-zinc-100 focus:outline-none focus:border-[#9F1239] dark:focus:border-rose-500 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 transition-colors"
                    required
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setRequestModalMentor(null)}
                    className="py-2 px-4 rounded-xl text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="py-2 px-5 rounded-xl gradient-brand text-white text-xs font-semibold flex items-center gap-1.5 shadow-md hover:opacity-95 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" /> Submit Request
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
