import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'https://your-project.supabase.co' &&
  !supabaseUrl.includes('placeholder')
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Local storage keys for reliable demo persistence
const STORAGE_PREFIX = 'skillbridge_';

export const storageHelper = {
  get<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(`${STORAGE_PREFIX}${key}`);
      return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
      console.warn(`Failed reading ${key} from localStorage:`, e);
      return defaultValue;
    }
  },
  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(value));
    } catch (e) {
      console.warn(`Failed writing ${key} to localStorage:`, e);
    }
  },
  remove(key: string): void {
    try {
      localStorage.removeItem(`${STORAGE_PREFIX}${key}`);
    } catch (e) {
      console.warn(`Failed removing ${key} from localStorage:`, e);
    }
  },
};
