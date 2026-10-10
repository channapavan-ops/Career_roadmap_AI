import React from 'react';

interface ProgressBarProps {
  percentage: number;
  completed?: number;
  total?: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  percentage,
  completed,
  total,
  size = 'md',
  showLabel = true,
  className = '',
}) => {
  const clamped = Math.min(100, Math.max(0, percentage));

  const heightClass = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  }[size];

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center text-xs font-medium mb-1.5 text-zinc-700 dark:text-zinc-300">
          <span>
            {completed !== undefined && total !== undefined ? (
              <span className="text-zinc-600 dark:text-zinc-400">
                <strong className="text-[#9F1239] dark:text-rose-300 font-semibold">{completed}</strong> of {total} topics completed
              </span>
            ) : (
              <span>Overall Completion</span>
            )}
          </span>
          <span className="font-semibold text-[#9F1239] dark:text-rose-300">{clamped}%</span>
        </div>
      )}
      <div className={`w-full bg-rose-100 dark:bg-zinc-800 rounded-full overflow-hidden border border-rose-200 dark:border-zinc-700/60 p-0.5 ${heightClass}`}>
        <div
          className="h-full rounded-full transition-all duration-500 ease-out gradient-brand"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
};
