import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, StudentPreferences, MentorProfileData, UserRole, AcademicYear, CareerTrack } from '../types';
import { supabase, isSupabaseConfigured, storageHelper } from '../services/supabase';
import { INITIAL_MENTORS } from '../data/mentorData';
import { projectService } from '../services/projectService';

export interface AuthContextType {
  user: UserProfile | null;
  studentPrefs: StudentPreferences | null;
  mentorProfile: MentorProfileData | null;
  isLoading: boolean;
  isSupabaseConnected: boolean;
  login: (email: string, password?: string, role?: UserRole) => Promise<{ success: boolean; error?: string }>;
  register: (fullName: string, email: string, password: string, role: UserRole) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateStudentPrefs: (prefs: Partial<StudentPreferences>) => void;
  updateMentorProfile: (profile: Partial<MentorProfileData>) => void;
  switchDemoPersona: (persona: 'student-2nd' | 'student-4th' | 'mentor') => void;
}

const DEFAULT_STUDENT_PREFS: StudentPreferences = {
  userId: 'student-demo-1',
  collegeName: 'National Institute of Technology',
  academicYear: '2nd Year',
  course: 'Artificial Intelligence & Machine Learning',
  careerTrack: 'Machine Learning Engineer',
  skillLevel: 'Intermediate',
  weeklyHours: 15,
  assignedMentorId: 'mentor-1',
  onboardingCompleted: true,
};

const DEFAULT_STUDENT_USER: UserProfile = {
  id: 'student-demo-1',
  email: 'aarav.sharma@nit.ac.in',
  fullName: 'Aarav Sharma',
  role: 'student',
  avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=240&auto=format&fit=crop&q=80',
  createdAt: '2026-08-15T10:00:00Z',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    return storageHelper.get<UserProfile | null>('current_user', DEFAULT_STUDENT_USER);
  });

  const [studentPrefs, setStudentPrefs] = useState<StudentPreferences | null>(() => {
    return storageHelper.get<StudentPreferences | null>('student_prefs', DEFAULT_STUDENT_PREFS);
  });

  const [mentorProfile, setMentorProfile] = useState<MentorProfileData | null>(() => {
    return storageHelper.get<MentorProfileData | null>('mentor_profile', INITIAL_MENTORS[0]);
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      storageHelper.set('current_user', user);
    } else {
      storageHelper.remove('current_user');
    }
  }, [user]);

  useEffect(() => {
    if (studentPrefs) {
      storageHelper.set('student_prefs', studentPrefs);
    }
  }, [studentPrefs]);

  useEffect(() => {
    if (mentorProfile) {
      storageHelper.set('mentor_profile', mentorProfile);
    }
  }, [mentorProfile]);

  const login = async (email: string, password?: string, role: UserRole = 'student'): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password: password || 'TestPassword123!',
        });
        if (error) {
          // Fallback to demo mode if auth fails or user wants instant preview
          console.warn('Supabase login error, falling back to local session:', error.message);
        } else if (data.user) {
          const loggedInUser: UserProfile = {
            id: data.user.id,
            email: data.user.email || email,
            fullName: data.user.user_metadata?.full_name || email.split('@')[0],
            role: (data.user.user_metadata?.role as UserRole) || role,
            createdAt: data.user.created_at,
          };
          setUser(loggedInUser);
          setIsLoading(false);
          return { success: true };
        }
      }

      // Demo login
      const isMentor = email.toLowerCase().includes('mentor') || role === 'mentor';
      if (isMentor) {
        const mentor = INITIAL_MENTORS[0];
        setUser({
          id: mentor.userId,
          email,
          fullName: mentor.fullName,
          role: 'mentor',
          avatarUrl: mentor.avatarUrl,
          createdAt: new Date().toISOString(),
        });
        setMentorProfile(mentor);
      } else {
        setUser({
          id: 'student-user-' + Date.now(),
          email,
          fullName: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          role: 'student',
          avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=240&auto=format&fit=crop&q=80',
          createdAt: new Date().toISOString(),
        });
      }
      setIsLoading(false);
      return { success: true };
    } catch (e: any) {
      setIsLoading(false);
      return { success: false, error: e.message || 'Login failed' };
    }
  };

  const register = async (fullName: string, email: string, password: string, role: UserRole): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      const newUser: UserProfile = {
        id: 'usr-' + Date.now(),
        email,
        fullName,
        role,
        avatarUrl: role === 'mentor' 
          ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=240&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=240&auto=format&fit=crop&q=80',
        createdAt: new Date().toISOString(),
      };
      setUser(newUser);

      if (role === 'student') {
        const newPrefs: StudentPreferences = {
          userId: newUser.id,
          collegeName: '',
          academicYear: undefined,
          course: undefined,
          careerTrack: undefined,
          skillLevel: undefined,
          weeklyHours: undefined,
          onboardingCompleted: false,
        };
        setStudentPrefs(newPrefs);
        storageHelper.set('student_prefs', newPrefs);
      } else {
        const newMentor: MentorProfileData = {
          userId: newUser.id,
          fullName,
          title: '',
          organization: '',
          bio: '',
          expertise: [],
          courseSpecialization: ['Artificial Intelligence & Machine Learning'],
          experienceYears: 1,
          skills: [],
          avatarUrl: newUser.avatarUrl || '',
          maxStudents: 5,
          assignedStudentIds: [],
          isAcceptingMentees: true,
        };
        setMentorProfile(newMentor);
        storageHelper.set('mentor_profile', newMentor);
      }

      setIsLoading(false);
      return { success: true };
    } catch (e: any) {
      setIsLoading(false);
      return { success: false, error: e.message || 'Registration failed' };
    }
  };

  const logout = () => {
    projectService.clearSessionState();
    setUser(null);
    setStudentPrefs(null);
    setMentorProfile(null);
    storageHelper.remove('current_user');
    storageHelper.remove('student_prefs');
    storageHelper.remove('mentor_profile');
  };

  const updateStudentPrefs = (prefs: Partial<StudentPreferences>) => {
    setStudentPrefs(prev => {
      const updated = prev ? { ...prev, ...prefs } : ({
        userId: user?.id || 'usr-temp',
        onboardingCompleted: true,
        ...prefs,
      } as StudentPreferences);
      storageHelper.set('student_prefs', updated);
      return updated;
    });
  };

  const updateMentorProfile = (profile: Partial<MentorProfileData>) => {
    setMentorProfile(prev => {
      const updated = prev ? { ...prev, ...profile } : null;
      if (updated) {
        storageHelper.set('mentor_profile', updated);
      }
      return updated;
    });
  };

  const switchDemoPersona = (persona: 'student-2nd' | 'student-4th' | 'mentor') => {
    if (persona === 'student-2nd') {
      setUser({
        id: 'student-demo-1',
        email: 'aarav.sharma@nit.ac.in',
        fullName: 'Aarav Sharma',
        role: 'student',
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=240&auto=format&fit=crop&q=80',
        createdAt: '2026-08-15T10:00:00Z',
      });
      setStudentPrefs({
        userId: 'student-demo-1',
        collegeName: 'National Institute of Technology',
        academicYear: '2nd Year',
        course: 'Artificial Intelligence & Machine Learning',
        careerTrack: 'Machine Learning Engineer',
        skillLevel: 'Intermediate',
        weeklyHours: 15,
        assignedMentorId: 'mentor-1',
        onboardingCompleted: true,
      });
    } else if (persona === 'student-4th') {
      setUser({
        id: 'student-demo-2',
        email: 'neha.verma@iit.ac.in',
        fullName: 'Neha Verma',
        role: 'student',
        avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=240&auto=format&fit=crop&q=80',
        createdAt: '2026-06-10T10:00:00Z',
      });
      setStudentPrefs({
        userId: 'student-demo-2',
        collegeName: 'Indian Institute of Technology, Delhi',
        academicYear: '4th Year',
        course: 'Artificial Intelligence & Machine Learning',
        careerTrack: 'AI Engineer',
        skillLevel: 'Advanced',
        weeklyHours: 20,
        assignedMentorId: 'mentor-1',
        onboardingCompleted: true,
      });
    } else if (persona === 'mentor') {
      const mentor = INITIAL_MENTORS[0];
      setUser({
        id: mentor.userId,
        email: 'maya.lin@deepmind.example.com',
        fullName: mentor.fullName,
        role: 'mentor',
        avatarUrl: mentor.avatarUrl,
        createdAt: '2025-01-10T10:00:00Z',
      });
      setMentorProfile(mentor);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        studentPrefs,
        mentorProfile,
        isLoading,
        isSupabaseConnected: isSupabaseConfigured,
        login,
        register,
        logout,
        updateStudentPrefs,
        updateMentorProfile,
        switchDemoPersona,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
