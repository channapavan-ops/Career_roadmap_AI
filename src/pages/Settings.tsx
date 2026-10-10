import React, { useState } from 'react';
import {
  Palette,
  Sun,
  Moon,
  Laptop,
  Check,
  RotateCcw,
  Sparkles,
  Layers,
  Sliders,
  Eye,
  CheckCircle2,
  Maximize2,
  Minimize2,
  Type,
  Zap,
} from 'lucide-react';
import {
  useTheme,
  ThemeMode,
  AccentColor,
  DensityMode,
  FontScale,
  ACCENT_PALETTES,
} from '../context/ThemeContext';

export const Settings: React.FC = () => {
  const {
    theme,
    themeMode,
    setThemeMode,
    accentColor,
    setAccentColor,
    density,
    setDensity,
    highContrast,
    setHighContrast,
    fontScale,
    setFontScale,
    reduceMotion,
    setReduceMotion,
    resetAppearance,
    activePalette,
  } = useTheme();

  const [notification, setNotification] = useState<string | null>(null);

  const showFeedback = (message: string) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(null);
    }, 2200);
  };

  const handleModeChange = (mode: ThemeMode) => {
    setThemeMode(mode);
    showFeedback(`Theme set to ${mode === 'system' ? 'Device default' : mode === 'dark' ? 'Dark theme' : 'Light theme'}`);
  };

  const handleAccentChange = (accent: AccentColor) => {
    setAccentColor(accent);
    showFeedback(`Palette changed to ${ACCENT_PALETTES[accent].name}`);
  };

  const handleDensityChange = (d: DensityMode) => {
    setDensity(d);
    showFeedback(`Layout density set to ${d}`);
  };

  const handleReset = () => {
    resetAppearance();
    showFeedback('Appearance settings restored to system defaults');
  };

  return (
    <div className="space-y-8 max-w-5xl pb-12">
      {/* Google-Inspired Header */}
      <div className="rounded-2xl bg-white dark:bg-zinc-900/90 border border-rose-200/80 dark:border-zinc-800 p-6 sm:p-7 shadow-xs transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl gradient-brand flex items-center justify-center text-white shadow-md shadow-rose-950/20 shrink-0">
              <Palette className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight">
                  Appearance & Display
                </h1>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-rose-100 text-[#9F1239] border border-rose-200 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-900/60">
                  Google Design
                </span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-1 max-w-xl">
                Customize how SkillBridge AI looks and feels on this device. Changes apply instantly across the entire platform and save to your browser.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-start sm:self-center shrink-0">
            <button
              type="button"
              onClick={handleReset}
              className="px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Reset all appearance preferences to defaults"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>
          </div>
        </div>

        {/* Live status alert toast */}
        {notification && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-medium flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{notification}</span>
          </div>
        )}
      </div>

      {/* Live Interactive Preview Box */}
      <div className="rounded-2xl bg-white dark:bg-zinc-900/90 border border-rose-200/80 dark:border-zinc-800 p-6 shadow-xs transition-colors">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-[#9F1239] dark:text-rose-400" />
            <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
              Live Interface Preview
            </h2>
          </div>
          <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
            Active Theme: <strong className="capitalize text-zinc-800 dark:text-zinc-200">{theme}</strong>
            {' · '}
            Palette: <strong className="text-zinc-800 dark:text-zinc-200">{activePalette.name}</strong>
          </span>
        </div>

        {/* Miniature mockup */}
        <div className="rounded-xl border border-rose-200/80 dark:border-zinc-800 bg-[#FFF1F2] dark:bg-[#18181B] p-4 transition-colors">
          <div className="rounded-lg bg-white dark:bg-zinc-900 border border-rose-200/60 dark:border-zinc-800 p-4 shadow-xs space-y-3.5">
            <div className="flex items-center justify-between pb-3 border-b border-rose-100 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg gradient-brand flex items-center justify-center text-white">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100">SkillBridge AI Workspace</div>
                  <div className="text-[10px] text-zinc-500 dark:text-zinc-400">Machine Learning & Career Track</div>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold gradient-brand text-white shadow-xs">
                Active Component
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-rose-50/50 dark:bg-zinc-800/50 border border-rose-200/60 dark:border-zinc-700/60">
                <div className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">Curriculum Progress</div>
                <div className="text-base font-extrabold text-zinc-900 dark:text-zinc-100 mt-0.5">74% Complete</div>
                <div className="w-full bg-zinc-200 dark:bg-zinc-700 h-1.5 rounded-full overflow-hidden mt-2">
                  <div className="h-full gradient-brand rounded-full transition-all duration-300" style={{ width: '74%' }} />
                </div>
              </div>

              <div className="p-3 rounded-lg bg-rose-50/50 dark:bg-zinc-800/50 border border-rose-200/60 dark:border-zinc-700/60 flex flex-col justify-between">
                <div className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">Primary Interactive Button</div>
                <button
                  type="button"
                  className="mt-2 py-1.5 px-3 rounded-lg gradient-brand text-white text-xs font-semibold shadow-xs hover:opacity-90 transition-opacity text-center"
                >
                  Explore Next Milestone
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Part 1: Theme & Display Mode */}
      <div className="rounded-2xl bg-white dark:bg-zinc-900/90 border border-rose-200/80 dark:border-zinc-800 p-6 shadow-xs transition-colors space-y-4">
        <div>
          <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Sun className="w-4 h-4 text-[#9F1239] dark:text-rose-400" />
            <span>Theme & Display Mode</span>
          </h2>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">
            Choose whether to automatically synchronize with your device preferences or lock a specific brightness mode.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {/* System Default Option */}
          <button
            type="button"
            onClick={() => handleModeChange('system')}
            className={`p-4 rounded-xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between relative ${
              themeMode === 'system'
                ? 'border-[#9F1239] dark:border-rose-400 bg-rose-50/50 dark:bg-zinc-800/70 shadow-sm'
                : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-white dark:bg-zinc-950'
            }`}
          >
            {themeMode === 'system' && (
              <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[#9F1239] dark:bg-rose-400 text-white dark:text-zinc-950 flex items-center justify-center">
                <Check className="w-3 h-3 stroke-[3]" />
              </span>
            )}
            <div>
              <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-3 text-zinc-700 dark:text-zinc-300">
                <Laptop className="w-4 h-4" />
              </div>
              <div className="font-bold text-sm text-zinc-900 dark:text-zinc-100">Device Default</div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                Synchronizes automatically with your system display settings.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-zinc-200/60 dark:border-zinc-800 flex items-center justify-between text-[11px] text-zinc-500">
              <span>Automatic sync</span>
              <span className="font-semibold text-[#9F1239] dark:text-rose-400 capitalize">
                (Currently {theme})
              </span>
            </div>
          </button>

          {/* Light Theme Option */}
          <button
            type="button"
            onClick={() => handleModeChange('light')}
            className={`p-4 rounded-xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between relative ${
              themeMode === 'light'
                ? 'border-[#9F1239] dark:border-rose-400 bg-rose-50/50 dark:bg-zinc-800/70 shadow-sm'
                : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-white dark:bg-zinc-950'
            }`}
          >
            {themeMode === 'light' && (
              <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[#9F1239] dark:bg-rose-400 text-white dark:text-zinc-950 flex items-center justify-center">
                <Check className="w-3 h-3 stroke-[3]" />
              </span>
            )}
            <div>
              <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center mb-3 text-amber-700">
                <Sun className="w-4 h-4" />
              </div>
              <div className="font-bold text-sm text-zinc-900 dark:text-zinc-100">Light Theme</div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                Clean, crisp white backgrounds with soft rose accents for daylight environments.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-zinc-200/60 dark:border-zinc-800 flex items-center justify-between text-[11px] text-zinc-500">
              <span>High brightness</span>
              <span className="font-semibold">Daylight</span>
            </div>
          </button>

          {/* Dark Theme Option */}
          <button
            type="button"
            onClick={() => handleModeChange('dark')}
            className={`p-4 rounded-xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between relative ${
              themeMode === 'dark'
                ? 'border-[#9F1239] dark:border-rose-400 bg-rose-50/50 dark:bg-zinc-800/70 shadow-sm'
                : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-white dark:bg-zinc-950'
            }`}
          >
            {themeMode === 'dark' && (
              <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[#9F1239] dark:bg-rose-400 text-white dark:text-zinc-950 flex items-center justify-center">
                <Check className="w-3 h-3 stroke-[3]" />
              </span>
            )}
            <div>
              <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center mb-3 text-rose-300">
                <Moon className="w-4 h-4" />
              </div>
              <div className="font-bold text-sm text-zinc-900 dark:text-zinc-100">Dark Theme</div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                Deep slate backgrounds with low glare designed for late-night coding and focus.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-zinc-200/60 dark:border-zinc-800 flex items-center justify-between text-[11px] text-zinc-500">
              <span>Low glare</span>
              <span className="font-semibold">Night study</span>
            </div>
          </button>
        </div>
      </div>

      {/* Part 2: Material You Dynamic Accent Palette */}
      <div className="rounded-2xl bg-white dark:bg-zinc-900/90 border border-rose-200/80 dark:border-zinc-800 p-6 shadow-xs transition-colors space-y-4">
        <div>
          <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#9F1239] dark:text-rose-400" />
            <span>Material Accent Palette</span>
          </h2>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">
            Inspired by Google Material Design. Select an accent palette to customize highlights, navigation bars, and buttons.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {(Object.keys(ACCENT_PALETTES) as AccentColor[]).map(key => {
            const pal = ACCENT_PALETTES[key];
            const isSelected = accentColor === key;

            return (
              <button
                key={key}
                type="button"
                onClick={() => handleAccentChange(key)}
                className={`p-4 rounded-xl border-2 text-left transition-all cursor-pointer flex items-center gap-3.5 relative ${
                  isSelected
                    ? 'border-[#9F1239] dark:border-rose-400 bg-rose-50/40 dark:bg-zinc-800/60 shadow-xs'
                    : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-white dark:bg-zinc-950'
                }`}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-xs shrink-0 transition-transform"
                  style={{ backgroundColor: pal.primary }}
                >
                  {isSelected ? <Check className="w-5 h-5 stroke-[2.5]" /> : null}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">
                    {pal.name}
                  </div>
                  <div className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
                    {pal.label}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Part 3: Interface Density & Spacing */}
      <div className="rounded-2xl bg-white dark:bg-zinc-900/90 border border-rose-200/80 dark:border-zinc-800 p-6 shadow-xs transition-colors space-y-4">
        <div>
          <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#9F1239] dark:text-rose-400" />
            <span>Display Density</span>
          </h2>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">
            Adjust information density for comfortable browsing or compact power-user efficiency.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <button
            type="button"
            onClick={() => handleDensityChange('comfortable')}
            className={`p-4 rounded-xl border-2 text-left transition-all cursor-pointer flex items-start gap-3 relative ${
              density === 'comfortable'
                ? 'border-[#9F1239] dark:border-rose-400 bg-rose-50/50 dark:bg-zinc-800/70 shadow-xs'
                : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-white dark:bg-zinc-950'
            }`}
          >
            <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
              <Maximize2 className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                <span>Comfortable</span>
                {density === 'comfortable' && (
                  <span className="text-[10px] font-semibold text-[#9F1239] dark:text-rose-400">(Default)</span>
                )}
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                Generous margins and spacious touch targets. Recommended for laptops and tablets.
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleDensityChange('compact')}
            className={`p-4 rounded-xl border-2 text-left transition-all cursor-pointer flex items-start gap-3 relative ${
              density === 'compact'
                ? 'border-[#9F1239] dark:border-rose-400 bg-rose-50/50 dark:bg-zinc-800/70 shadow-xs'
                : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-white dark:bg-zinc-950'
            }`}
          >
            <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
              <Minimize2 className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                Compact
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                Tighter padding and condensed layouts to display more roadmaps, projects, and data on screen.
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Part 4: Accessibility & Reading Comfort */}
      <div className="rounded-2xl bg-white dark:bg-zinc-900/90 border border-rose-200/80 dark:border-zinc-800 p-6 shadow-xs transition-colors space-y-5">
        <div>
          <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#9F1239] dark:text-rose-400" />
            <span>Accessibility & Reading Comfort</span>
          </h2>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">
            Optimize text scaling, border contrast, and motion reduction based on personal visual needs.
          </p>
        </div>

        {/* Font Scale Selection */}
        <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/60 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Type className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
              <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">Interface Font Size</span>
            </div>
            <span className="text-xs text-zinc-500 capitalize">
              {fontScale === 'small' ? 'Compact (90%)' : fontScale === 'large' ? 'Large (110%)' : 'Standard (100%)'}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {(['small', 'medium', 'large'] as FontScale[]).map(scale => (
              <button
                key={scale}
                type="button"
                onClick={() => {
                  setFontScale(scale);
                  showFeedback(`Font scale set to ${scale}`);
                }}
                className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                  fontScale === scale
                    ? 'border-[#9F1239] dark:border-rose-400 bg-white dark:bg-zinc-900 text-[#9F1239] dark:text-rose-400 shadow-xs'
                    : 'border-zinc-200 dark:border-zinc-700 bg-transparent text-zinc-600 dark:text-zinc-400 hover:bg-white dark:hover:bg-zinc-800'
                }`}
              >
                {scale === 'small' ? 'A- Small' : scale === 'medium' ? 'A Standard' : 'A+ Large'}
              </button>
            ))}
          </div>
        </div>

        {/* High Contrast Toggle */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/60">
          <div>
            <div className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
              Enhanced High Contrast
            </div>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5 max-w-lg">
              Reinforces element boundaries, enhances divider borders, and sharpens text contrast for better legibility in bright sunlight.
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={highContrast}
            onClick={() => {
              setHighContrast(!highContrast);
              showFeedback(`High contrast ${!highContrast ? 'enabled' : 'disabled'}`);
            }}
            className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 ${
              highContrast ? 'bg-[#9F1239] dark:bg-rose-500' : 'bg-zinc-300 dark:bg-zinc-700'
            }`}
          >
            <span
              className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                highContrast ? 'left-6' : 'left-1'
              }`}
            />
          </button>
        </div>

        {/* Reduce Motion Toggle */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/60">
          <div>
            <div className="text-xs font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>Reduce Motion & Animations</span>
            </div>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5 max-w-lg">
              Disables smooth page transitions and pulse animations for users who prefer minimal visual movement.
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={reduceMotion}
            onClick={() => {
              setReduceMotion(!reduceMotion);
              showFeedback(`Reduced motion ${!reduceMotion ? 'enabled' : 'disabled'}`);
            }}
            className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 ${
              reduceMotion ? 'bg-[#9F1239] dark:bg-rose-500' : 'bg-zinc-300 dark:bg-zinc-700'
            }`}
          >
            <span
              className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                reduceMotion ? 'left-6' : 'left-1'
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
};
