import React from 'react';
import { Video, BookOpen, Laptop, FileCode, ExternalLink, BookmarkCheck, AlertCircle } from 'lucide-react';
import { CuratedResource } from '../types';
import { isValidExternalUrl } from '../utils/urlValidator';

interface ResourceCardProps {
  resource: CuratedResource;
}

export const ResourceCard: React.FC<ResourceCardProps> = ({ resource }) => {
  const isUrlValid = isValidExternalUrl(resource.url);
  const cleanUrl = isUrlValid ? resource.url.trim() : '';

  const getIcon = () => {
    switch (resource.type) {
      case 'video':
        return <Video className="w-4 h-4 text-[#9F1239] dark:text-rose-400" />;
      case 'interactive':
        return <Laptop className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
      case 'practice':
        return <FileCode className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
      case 'documentation':
      default:
        return <BookOpen className="w-4 h-4 text-[#9F1239] dark:text-rose-300" />;
    }
  };

  const getBadgeColor = () => {
    switch (resource.type) {
      case 'video':
        return 'bg-rose-50 text-[#9F1239] border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800/50';
      case 'interactive':
        return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800/50';
      case 'practice':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/50';
      default:
        return 'bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700';
    }
  };

  if (!isUrlValid) {
    return (
      <div className="flex items-start gap-3 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-left opacity-75 cursor-not-allowed">
        <div className="mt-0.5 p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shrink-0">
          <AlertCircle className="w-4 h-4 text-amber-500" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 line-clamp-1">
              {resource.title}
            </span>
            <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border ${getBadgeColor()}`}>
              {resource.type}
            </span>
          </div>
          <p className="text-[11px] text-zinc-400">Resource link currently unavailable</p>
        </div>
      </div>
    );
  }

  return (
    <a
      href={cleanUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-start gap-3 p-3 rounded-xl bg-white dark:bg-zinc-900/80 hover:bg-rose-50/70 dark:hover:bg-zinc-800/90 border border-rose-200/80 dark:border-zinc-800 hover:border-rose-300 dark:hover:border-rose-900/50 transition-all text-left shadow-xs cursor-pointer"
      title={`Open ${resource.title} on ${resource.platform} (opens in new tab)`}
    >
      <div className="mt-0.5 p-2 rounded-lg bg-rose-50 dark:bg-zinc-800 border border-rose-200 dark:border-zinc-700/60 group-hover:scale-105 transition-transform shrink-0">
        {getIcon()}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span className="text-xs font-semibold text-[#27272A] dark:text-zinc-200 group-hover:text-[#9F1239] dark:group-hover:text-rose-200 transition-colors line-clamp-1">
            {resource.title}
          </span>
          <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border ${getBadgeColor()}`}>
            {resource.type}
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 flex-wrap">
          <span className="font-medium text-zinc-700 dark:text-zinc-300">{resource.platform}</span>
          {resource.duration && (
            <>
              <span>•</span>
              <span>{resource.duration}</span>
            </>
          )}
          {resource.isFree && (
            <>
              <span>•</span>
              <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium">
                <BookmarkCheck className="w-3 h-3" /> Free
              </span>
            </>
          )}
        </div>
      </div>
      <div className="flex items-center gap-1 text-[11px] font-medium text-zinc-400 group-hover:text-[#9F1239] dark:group-hover:text-rose-300 transition-colors shrink-0 mt-1">
        <span className="hidden sm:inline">Open</span>
        <ExternalLink className="w-3.5 h-3.5" />
      </div>
    </a>
  );
};
