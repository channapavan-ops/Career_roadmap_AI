import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Map,
  FolderGit2,
  Briefcase,
  Users,
  Bot,
  User,
  Settings,
  LogOut,
  Sparkles,
  GraduationCap,
  UploadCloud,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Sidebar: React.FC = () => {
  const { user, studentPrefs, logout, switchDemoPersona } = useAuth();
  const navigate = useNavigate();

  const isMentor = user?.role === 'mentor';

  const isFourthYear = studentPrefs?.academicYear === '4th Year';

  const studentNavItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, end: true },
    {
      label: isFourthYear ? 'Career Readiness' : 'Learning Roadmap',
      path: '/roadmap',
      icon: Map,
      end: false,
    },
    { label: 'Projects', path: '/projects', icon: FolderGit2, end: false },
    { label: 'Internships', path: '/internships', icon: Briefcase, end: true },
    { label: 'Mentors & Resources', path: '/mentors', icon: Users, end: false },
    { label: 'AI Assistant', path: '/ai-assistant', icon: Bot, end: true },
    { label: 'My Profile', path: '/profile', icon: User, end: true },
    { label: 'Settings', path: '/settings', icon: Settings, end: true },
  ];

  const mentorNavItems = [
    { label: 'Mentor Dashboard', path: '/mentor-dashboard', icon: LayoutDashboard, end: true },
    { label: 'Mentees & Directory', path: '/mentors', icon: Users, end: false },
    { label: 'AI Career Assistant', path: '/ai-assistant', icon: Bot, end: true },
    { label: 'Mentor Profile', path: '/profile', icon: User, end: true },
    { label: 'Settings', path: '/settings', icon: Settings, end: true },
  ];

  const navItems = isMentor ? mentorNavItems : studentNavItems;

  return (
    <aside className="w-64 bg-white dark:bg-zinc-950 border-r border-rose-200/80 dark:border-zinc-800/80 flex flex-col justify-between h-screen sticky top-0 shrink-0 select-none transition-colors">
      <div>
        {/* Brand header */}
        <div className="p-5 border-b border-rose-200/80 dark:border-zinc-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl gradient-brand flex items-center justify-center text-white shadow-md shadow-rose-950/30">
              <Sparkles className="w-4 h-4 text-rose-200" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base text-zinc-900 dark:text-zinc-100 tracking-tight">
                  SkillBridge
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-rose-100 text-[#9F1239] dark:bg-rose-950 dark:text-rose-300 border border-rose-200 dark:border-rose-850">
                  AI
                </span>
              </div>
              <p className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium -mt-0.5">
                {isMentor ? 'Mentor Workspace' : 'Student Platform'}
              </p>
            </div>
          </div>
        </div>

        {/* User Card */}
        <div className="p-3 mx-3 mt-3 rounded-xl bg-rose-50/70 dark:bg-zinc-900/80 border border-rose-200/80 dark:border-zinc-800 flex items-center gap-3 transition-colors">
          <img
            src={user?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120'}
            alt={user?.fullName || 'User'}
            className="w-9 h-9 rounded-lg object-cover border border-rose-300 dark:border-rose-900/50 shrink-0"
          />
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold text-zinc-900 dark:text-zinc-200 truncate">{user?.fullName || 'User'}</div>
            <div className="text-[10px] text-[#9F1239] dark:text-rose-300 font-medium truncate flex items-center gap-1">
              {isMentor ? (
                <span>Staff Mentor</span>
              ) : (
                <span>
                  {studentPrefs?.academicYear || '2nd Year'} • {studentPrefs?.careerTrack === 'AI Engineer' ? 'AI Eng.' : 'ML Eng.'}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="p-3 space-y-1 mt-2">
          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path + item.label}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'gradient-brand text-white shadow-md shadow-rose-950/30'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-rose-50 dark:hover:bg-zinc-900'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer & Persona Switcher */}
      <div className="p-3 border-t border-rose-200/80 dark:border-zinc-800/80 space-y-2">
        {/* Persona quick switch for hackathon testing */}
        <div className="p-2.5 rounded-xl bg-rose-50/60 dark:bg-zinc-900/60 border border-rose-200/70 dark:border-zinc-800 text-[11px] transition-colors">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5 flex items-center gap-1">
            <GraduationCap className="w-3 h-3 text-[#9F1239] dark:text-rose-400" /> Switch Demo Role
          </div>
          <div className="grid grid-cols-2 gap-1 mb-1">
            <button
              type="button"
              onClick={() => {
                switchDemoPersona('student-2nd');
                navigate('/dashboard');
              }}
              className="py-1 px-1.5 rounded bg-white dark:bg-zinc-800 hover:bg-rose-100/60 dark:hover:bg-zinc-700 border border-rose-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-300 text-[10px] font-medium text-center truncate cursor-pointer"
            >
              2nd Yr ML
            </button>
            <button
              type="button"
              onClick={() => {
                switchDemoPersona('student-4th');
                navigate('/dashboard');
              }}
              className="py-1 px-1.5 rounded bg-white dark:bg-zinc-800 hover:bg-rose-100/60 dark:hover:bg-zinc-700 border border-rose-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-300 text-[10px] font-medium text-center truncate cursor-pointer"
            >
              4th Yr AI
            </button>
          </div>
          <button
            type="button"
            onClick={() => {
              switchDemoPersona('mentor');
              navigate('/mentor-dashboard');
            }}
            className="w-full py-1 px-1.5 rounded bg-rose-100 hover:bg-rose-200/80 dark:bg-rose-950/50 dark:hover:bg-rose-900/60 border border-rose-300 dark:border-rose-900/50 text-[#9F1239] dark:text-rose-300 text-[10px] font-semibold text-center truncate cursor-pointer"
          >
            Dr. Maya Lin (Mentor)
          </button>
        </div>

        <button
          type="button"
          onClick={() => {
            logout();
            navigate('/');
          }}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-zinc-600 dark:text-zinc-400 hover:text-rose-700 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-zinc-900 text-xs font-semibold transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
