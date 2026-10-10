import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Map, FolderGit2, Users, Bot } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const MobileNavigation: React.FC = () => {
  const { user, studentPrefs } = useAuth();
  const isMentor = user?.role === 'mentor';
  const isFourthYear = studentPrefs?.academicYear === '4th Year';

  const items = isMentor
    ? [
        { label: 'Overview', path: '/mentor-dashboard', icon: LayoutDashboard },
        { label: 'Directory', path: '/mentors', icon: Users },
        { label: 'AI', path: '/ai-assistant', icon: Bot },
      ]
    : [
        { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { label: isFourthYear ? 'Readiness' : 'Roadmap', path: '/roadmap', icon: Map },
        { label: 'Projects', path: '/projects', icon: FolderGit2 },
        { label: 'Mentors', path: '/mentors', icon: Users },
        { label: 'AI', path: '/ai-assistant', icon: Bot },
      ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md border-t border-rose-200 dark:border-zinc-800 px-2 py-1.5 flex justify-around items-center transition-colors">
      {items.map(item => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center py-1 px-2.5 rounded-lg text-[10px] font-medium transition-colors ${
                isActive ? 'text-[#9F1239] dark:text-rose-400 font-bold' : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`
            }
          >
            <Icon className="w-4 h-4 mb-0.5" />
            <span>{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
};
