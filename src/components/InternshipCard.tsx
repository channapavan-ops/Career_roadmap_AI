import React from 'react';
import { MapPin, Briefcase, Calendar, DollarSign, Bookmark, ExternalLink, BookmarkCheck } from 'lucide-react';
import { InternshipItem } from '../types';
import { isUsableApplicationUrl } from '../utils/urlValidator';

interface InternshipCardProps {
  internship: InternshipItem;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
}

export const InternshipCard: React.FC<InternshipCardProps> = ({
  internship,
  isSaved,
  onToggleSave,
}) => {
  const isUsable = isUsableApplicationUrl(internship.applyUrl);
  const cleanUrl = isUsable ? internship.applyUrl.trim() : '';

  return (
    <div className="rounded-2xl bg-white dark:bg-[#27272A] border border-rose-200/80 dark:border-[#3F3F46] hover:border-rose-300 dark:hover:border-zinc-700/80 p-5 flex flex-col justify-between transition-all group shadow-sm hover:shadow-md">
      <div>
        <div className="flex items-start justify-between gap-3 mb-2">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="text-xs font-semibold text-[#9F1239] dark:text-rose-300">{internship.company}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-rose-200 dark:border-zinc-700">
                {internship.workplaceType}
              </span>
              {internship.isDemoListing ? (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60">
                  Demo Listing
                </span>
              ) : (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
                  Verified Opportunity
                </span>
              )}
            </div>
            <h3 className="text-base font-bold text-[#27272A] dark:text-zinc-100 group-hover:text-[#9F1239] dark:group-hover:text-rose-200 transition-colors">
              {internship.title}
            </h3>
          </div>

          <button
            type="button"
            onClick={() => onToggleSave(internship.id)}
            className={`p-2 rounded-lg border transition-colors cursor-pointer ${
              isSaved
                ? 'bg-rose-100 text-[#9F1239] border-rose-300 dark:bg-rose-950/80 dark:text-rose-300 dark:border-rose-800/80'
                : 'bg-rose-50 text-zinc-600 hover:text-[#9F1239] border-rose-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:text-rose-300 dark:border-zinc-700'
            }`}
            title={isSaved ? 'Remove from saved' : 'Save internship'}
          >
            {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
          </button>
        </div>

        <p className="text-xs text-[#76516B] dark:text-zinc-400 mt-2 line-clamp-2 leading-relaxed">
          {internship.description}
        </p>

        {/* Details grid */}
        <div className="grid grid-cols-2 gap-2 my-4 text-xs text-zinc-700 dark:text-zinc-300 bg-rose-50/50 dark:bg-zinc-950/60 p-3 rounded-xl border border-rose-200/70 dark:border-zinc-800/80">
          <div className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400">
            <DollarSign className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="text-zinc-800 dark:text-zinc-200 font-medium">{internship.stipend}</span>
          </div>
          <div className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400">
            <Calendar className="w-3.5 h-3.5 text-[#9F1239] dark:text-rose-400" />
            <span className="text-zinc-800 dark:text-zinc-200">{internship.duration}</span>
          </div>
          <div className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400">
            <MapPin className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span className="text-zinc-800 dark:text-zinc-200">{internship.location}</span>
          </div>
          <div className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400">
            <Briefcase className="w-3.5 h-3.5 text-[#9F1239] dark:text-rose-400" />
            <span className="text-zinc-800 dark:text-zinc-200">
              {internship.eligibilityYears.join(', ')}
            </span>
          </div>
        </div>

        {/* Skills */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {internship.requiredSkills.map((sk, i) => (
            <span
              key={i}
              className="text-[11px] px-2 py-0.5 rounded bg-rose-50 dark:bg-zinc-800/90 text-[#9F1239] dark:text-zinc-300 border border-rose-200/70 dark:border-zinc-700/60"
            >
              {sk}
            </span>
          ))}
        </div>
      </div>

      <div className="pt-3 border-t border-rose-100 dark:border-zinc-800 flex items-center justify-between gap-3">
        {internship.deadline && (
          <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
            Deadline: <strong className="text-zinc-800 dark:text-zinc-300">{internship.deadline}</strong>
          </span>
        )}
        {isUsable ? (
          <a
            href={cleanUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto py-2 px-4 rounded-xl gradient-brand text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-rose-950/20 dark:shadow-rose-950/40 hover:opacity-95 transition-opacity cursor-pointer"
            title={`Apply for ${internship.title} at ${internship.company} (opens in new tab)`}
          >
            Apply Now <ExternalLink className="w-3.5 h-3.5" />
          </a>
        ) : (
          <button
            type="button"
            disabled
            aria-disabled="true"
            className="ml-auto py-2 px-3.5 rounded-xl bg-rose-50/80 dark:bg-zinc-800/80 text-zinc-400 dark:text-zinc-500 text-xs font-medium border border-rose-200/60 dark:border-zinc-700/60 cursor-not-allowed opacity-80"
            title="Application link unavailable"
          >
            Application link unavailable
          </button>
        )}
      </div>
    </div>
  );
};

