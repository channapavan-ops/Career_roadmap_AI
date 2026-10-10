import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '', showLabel = true }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      title={isDark ? 'Dark Mode enabled (Click to switch to Light Mode)' : 'Light Mode enabled (Click to switch to Dark Mode)'}
      className={`px-2.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer font-medium text-xs ${
        isDark
          ? 'bg-zinc-800/90 text-rose-300 hover:text-rose-200 hover:bg-zinc-700/80 border border-zinc-700 shadow-xs'
          : 'bg-white text-[#9F1239] hover:text-[#4C0519] hover:bg-rose-50 border border-rose-200 shadow-xs'
      } ${className}`}
    >
      {isDark ? (
        <Moon className="w-4 h-4 text-rose-300 transition-transform duration-200 hover:-rotate-12" />
      ) : (
        <Sun className="w-4 h-4 text-amber-500 transition-transform duration-200 hover:rotate-45" />
      )}
      {showLabel && (
        <span className="hidden sm:inline font-semibold">
          {isDark ? 'Dark' : 'Light'}
        </span>
      )}
    </button>
  );
};

