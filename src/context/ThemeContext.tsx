import React, { createContext, useContext, useState, useEffect } from 'react';

export type ThemeMode = 'system' | 'light' | 'dark';
export type Theme = 'light' | 'dark';
export type AccentColor = 'crimson' | 'blue' | 'emerald' | 'amber' | 'violet';
export type DensityMode = 'comfortable' | 'compact';
export type FontScale = 'small' | 'medium' | 'large';

export interface AccentPalette {
  name: string;
  label: string;
  dark: string;
  primary: string;
  rose: string;
  dustyRose: string;
  blush: string;
  mauve: string;
  previewHex: string;
}

export const ACCENT_PALETTES: Record<AccentColor, AccentPalette> = {
  crimson: {
    name: 'SkillBridge Crimson',
    label: 'Deep burgundy and rose accents',
    dark: '#4C0519',
    primary: '#9F1239',
    rose: '#FDA4AF',
    dustyRose: '#D6A99A',
    blush: '#FFF1F2',
    mauve: '#76516B',
    previewHex: '#9F1239',
  },
  blue: {
    name: 'Google Royal Blue',
    label: 'Material dynamic blue and indigo accents',
    dark: '#1E3A8A',
    primary: '#2563EB',
    rose: '#93C5FD',
    dustyRose: '#60A5FA',
    blush: '#EFF6FF',
    mauve: '#3B82F6',
    previewHex: '#2563EB',
  },
  emerald: {
    name: 'Google Emerald',
    label: 'Natural forest and jade green accents',
    dark: '#064E3B',
    primary: '#059669',
    rose: '#6EE7B7',
    dustyRose: '#34D399',
    blush: '#ECFDF5',
    mauve: '#10B981',
    previewHex: '#059669',
  },
  amber: {
    name: 'Google Amber & Coral',
    label: 'Warm sunset and amber gold accents',
    dark: '#78350F',
    primary: '#D97706',
    rose: '#FCD34D',
    dustyRose: '#F59E0B',
    blush: '#FFFBEB',
    mauve: '#B45309',
    previewHex: '#D97706',
  },
  violet: {
    name: 'Google Amethyst',
    label: 'Deep purple and vibrant lavender accents',
    dark: '#4C1D95',
    primary: '#7C3AED',
    rose: '#C4B5FD',
    dustyRose: '#A78BFA',
    blush: '#FAF5FF',
    mauve: '#8B5CF6',
    previewHex: '#7C3AED',
  },
};

export interface AppearancePreferences {
  themeMode: ThemeMode;
  accentColor: AccentColor;
  density: DensityMode;
  highContrast: boolean;
  fontScale: FontScale;
  reduceMotion: boolean;
}

const DEFAULT_PREFERENCES: AppearancePreferences = {
  themeMode: 'system',
  accentColor: 'crimson',
  density: 'comfortable',
  highContrast: false,
  fontScale: 'medium',
  reduceMotion: false,
};

interface ThemeContextType {
  // Theme computation
  theme: Theme;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;

  // Global appearance customization
  accentColor: AccentColor;
  setAccentColor: (accent: AccentColor) => void;
  density: DensityMode;
  setDensity: (density: DensityMode) => void;
  highContrast: boolean;
  setHighContrast: (hc: boolean) => void;
  fontScale: FontScale;
  setFontScale: (scale: FontScale) => void;
  reduceMotion: boolean;
  setReduceMotion: (rm: boolean) => void;
  resetAppearance: () => void;

  // Active palette definition
  activePalette: AccentPalette;
}

const APPEARANCE_STORAGE_KEY = 'skillbridge_appearance_settings';
const LEGACY_THEME_STORAGE_KEY = 'skillbridge_theme';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const getSystemTheme = (): Theme => {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [preferences, setPreferences] = useState<AppearancePreferences>(() => {
    try {
      const stored = localStorage.getItem(APPEARANCE_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          themeMode: parsed.themeMode || 'system',
          accentColor: parsed.accentColor || 'crimson',
          density: parsed.density || 'comfortable',
          highContrast: !!parsed.highContrast,
          fontScale: parsed.fontScale || 'medium',
          reduceMotion: !!parsed.reduceMotion,
        };
      }

      // Check legacy key for migration
      const legacyTheme = localStorage.getItem(LEGACY_THEME_STORAGE_KEY);
      if (legacyTheme === 'dark' || legacyTheme === 'light') {
        return {
          ...DEFAULT_PREFERENCES,
          themeMode: legacyTheme,
        };
      }
    } catch {
      // Fallback to default preferences
    }
    return DEFAULT_PREFERENCES;
  });

  const [systemTheme, setSystemTheme] = useState<Theme>(getSystemTheme);

  // Listen to OS dark/light mode changes
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const updateSystemTheme = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', updateSystemTheme);
    return () => mediaQuery.removeEventListener('change', updateSystemTheme);
  }, []);

  // Determine effective computed theme
  const effectiveTheme: Theme = preferences.themeMode === 'system' ? systemTheme : preferences.themeMode;

  // Apply attributes and CSS variables to the document root
  useEffect(() => {
    const root = document.documentElement;

    // 1. Dark mode class and attribute
    if (effectiveTheme === 'dark') {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
    } else {
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
    }

    // 2. Data attributes for theme mode and accessibility
    root.setAttribute('data-theme-mode', preferences.themeMode);
    root.setAttribute('data-accent', preferences.accentColor);
    root.setAttribute('data-density', preferences.density);
    root.setAttribute('data-contrast', preferences.highContrast ? 'high' : 'normal');
    root.setAttribute('data-font-scale', preferences.fontScale);
    root.setAttribute('data-reduce-motion', preferences.reduceMotion ? 'true' : 'false');

    // 3. Dynamic accent colors
    const palette = ACCENT_PALETTES[preferences.accentColor] || ACCENT_PALETTES.crimson;
    root.style.setProperty('--brand-dark', palette.dark);
    root.style.setProperty('--brand-primary', palette.primary);
    root.style.setProperty('--brand-rose', palette.rose);
    root.style.setProperty('--brand-dusty-rose', palette.dustyRose);
    root.style.setProperty('--brand-blush', palette.blush);
    root.style.setProperty('--brand-mauve', palette.mauve);

    // 4. Font scale
    if (preferences.fontScale === 'small') {
      root.style.fontSize = '14.5px';
    } else if (preferences.fontScale === 'large') {
      root.style.fontSize = '17.5px';
    } else {
      root.style.fontSize = '';
    }

    // 5. Persist to storage
    try {
      localStorage.setItem(APPEARANCE_STORAGE_KEY, JSON.stringify(preferences));
      localStorage.setItem(LEGACY_THEME_STORAGE_KEY, effectiveTheme);
    } catch (e) {
      console.warn('Failed saving appearance settings to localStorage:', e);
    }
  }, [preferences, effectiveTheme]);

  const setThemeMode = (mode: ThemeMode) => {
    setPreferences(prev => ({ ...prev, themeMode: mode }));
  };

  const toggleTheme = () => {
    setPreferences(prev => {
      const nextTheme: ThemeMode = effectiveTheme === 'light' ? 'dark' : 'light';
      return { ...prev, themeMode: nextTheme };
    });
  };

  const setTheme = (newTheme: Theme) => {
    setThemeMode(newTheme);
  };

  const setAccentColor = (accent: AccentColor) => {
    setPreferences(prev => ({ ...prev, accentColor: accent }));
  };

  const setDensity = (density: DensityMode) => {
    setPreferences(prev => ({ ...prev, density }));
  };

  const setHighContrast = (highContrast: boolean) => {
    setPreferences(prev => ({ ...prev, highContrast }));
  };

  const setFontScale = (fontScale: FontScale) => {
    setPreferences(prev => ({ ...prev, fontScale }));
  };

  const setReduceMotion = (reduceMotion: boolean) => {
    setPreferences(prev => ({ ...prev, reduceMotion }));
  };

  const resetAppearance = () => {
    setPreferences(DEFAULT_PREFERENCES);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme: effectiveTheme,
        themeMode: preferences.themeMode,
        setThemeMode,
        toggleTheme,
        setTheme,
        accentColor: preferences.accentColor,
        setAccentColor,
        density: preferences.density,
        setDensity,
        highContrast: preferences.highContrast,
        setHighContrast,
        fontScale: preferences.fontScale,
        setFontScale,
        reduceMotion: preferences.reduceMotion,
        setReduceMotion,
        resetAppearance,
        activePalette: ACCENT_PALETTES[preferences.accentColor] || ACCENT_PALETTES.crimson,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
