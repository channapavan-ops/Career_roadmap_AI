-- ==============================================================================
-- SKILLBRIDGE AI — SUPABASE POSTGRESQL DATABASE SCHEMA & ROW LEVEL SECURITY
-- ==============================================================================
-- Run this script in the Supabase SQL Editor to initialize all tables,
-- foreign key relationships, triggers, indexes, and Row Level Security policies.
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. USER ROLES ENUM
CREATE TYPE app_role AS ENUM ('student', 'mentor', 'admin');
CREATE TYPE academic_year_type AS ENUM ('1st Year', '2nd Year', '3rd Year', '4th Year');
CREATE TYPE career_track_type AS ENUM ('AI Engineer', 'Machine Learning Engineer');
CREATE TYPE resource_category_type AS ENUM ('PDF', 'Notes', 'Video link', 'Documentation link', 'Dataset link', 'Assignment');

-- 3. PROFILES TABLE (Synced with Supabase Auth users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    role app_role NOT NULL DEFAULT 'student',
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

-- 4. STUDENT PREFERENCES TABLE
CREATE TABLE IF NOT EXISTS public.student_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
    college_name TEXT NOT NULL,
    academic_year academic_year_type NOT NULL DEFAULT '2nd Year',
    course TEXT NOT NULL DEFAULT 'Artificial Intelligence & Machine Learning',
    career_track career_track_type NOT NULL DEFAULT 'AI Engineer',
    skill_level TEXT NOT NULL DEFAULT 'Intermediate',
    weekly_hours INTEGER NOT NULL DEFAULT 15,
    assigned_mentor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

-- 5. MENTOR PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.mentor_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
    title TEXT NOT NULL,
    organization TEXT NOT NULL,
    bio TEXT NOT NULL,
    expertise TEXT[] DEFAULT '{}',
    course_specialization TEXT[] DEFAULT '{}',
    experience_years INTEGER NOT NULL DEFAULT 5,
    skills TEXT[] DEFAULT '{}',
    max_students INTEGER NOT NULL DEFAULT 5,
    is_accepting_mentees BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

-- 6. MENTOR ASSIGNMENTS & REQUESTS
CREATE TABLE IF NOT EXISTS public.mentor_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    mentor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    status TEXT NOT NULL CHECK (status IN ('pending', 'accepted', 'rejected', 'completed')) DEFAULT 'pending',
    request_note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
    UNIQUE(student_id, mentor_id)
);

-- 7. TOPIC COMPLETIONS TABLE
CREATE TABLE IF NOT EXISTS public.topic_completions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    topic_id TEXT NOT NULL,
    module_id TEXT NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
    notes TEXT,
    UNIQUE(user_id, topic_id)
);

-- 8. STUDENT PROJECT PROGRESS
CREATE TABLE IF NOT EXISTS public.student_projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    project_id TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('Not Started', 'In Progress', 'Completed')) DEFAULT 'Not Started',
    completed_milestones TEXT[] DEFAULT '{}',
    repo_url TEXT,
    notes TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
    UNIQUE(user_id, project_id)
);

-- 9. SAVED INTERNSHIPS
CREATE TABLE IF NOT EXISTS public.saved_internships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    internship_id TEXT NOT NULL,
    saved_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
    UNIQUE(user_id, internship_id)
);

-- 10. MENTOR SHARED RESOURCES
CREATE TABLE IF NOT EXISTS public.resources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mentor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    target_student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE, -- NULL or specific student
    title TEXT NOT NULL,
    description TEXT,
    resource_type resource_category_type NOT NULL DEFAULT 'PDF',
    url TEXT NOT NULL,
    file_size TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

-- 11. AI CONVERSATIONS TABLE
CREATE TABLE IF NOT EXISTS public.ai_conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

-- ==============================================================================
-- INDEXES FOR PERFORMANCE
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_topic_completions_user_id ON public.topic_completions(user_id);
CREATE INDEX IF NOT EXISTS idx_student_projects_user_id ON public.student_projects(user_id);
CREATE INDEX IF NOT EXISTS idx_mentor_assignments_student ON public.mentor_assignments(student_id);
CREATE INDEX IF NOT EXISTS idx_mentor_assignments_mentor ON public.mentor_assignments(mentor_id);
CREATE INDEX IF NOT EXISTS idx_resources_mentor ON public.resources(mentor_id);
CREATE INDEX IF NOT EXISTS idx_resources_target_student ON public.resources(target_student_id);
CREATE INDEX IF NOT EXISTS idx_ai_conversations_user ON public.ai_conversations(user_id);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentor_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.topic_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_internships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_conversations ENABLE ROW LEVEL SECURITY;

-- PROFILES POLICIES:
-- 1. Anyone authenticated can read user profiles (needed for mentor directory & student displays)
CREATE POLICY "Public profiles are readable by authenticated users"
ON public.profiles FOR SELECT TO authenticated USING (true);

-- 2. Users can only update their own profile
CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

-- STUDENT PREFERENCES POLICIES:
CREATE POLICY "Students can read their own preferences"
ON public.student_preferences FOR SELECT TO authenticated
USING (auth.uid() = user_id OR EXISTS (
    SELECT 1 FROM public.mentor_assignments
    WHERE mentor_id = auth.uid() AND student_id = public.student_preferences.user_id AND status = 'accepted'
));

CREATE POLICY "Students can insert/update their own preferences"
ON public.student_preferences FOR ALL TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- MENTOR PROFILES POLICIES:
CREATE POLICY "Mentor profiles are readable by all authenticated users"
ON public.mentor_profiles FOR SELECT TO authenticated USING (true);

CREATE POLICY "Mentors can manage their own mentor profile"
ON public.mentor_profiles FOR ALL TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- TOPIC COMPLETIONS:
CREATE POLICY "Users can manage their own topic completions"
ON public.topic_completions FOR ALL TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Mentors can view their assigned students topic completions"
ON public.topic_completions FOR SELECT TO authenticated
USING (EXISTS (
    SELECT 1 FROM public.mentor_assignments
    WHERE mentor_id = auth.uid() AND student_id = public.topic_completions.user_id AND status = 'accepted'
));

-- RESOURCES (STORAGE & METADATA):
CREATE POLICY "Mentors can insert and manage their uploaded resources"
ON public.resources FOR ALL TO authenticated
USING (auth.uid() = mentor_id)
WITH CHECK (auth.uid() = mentor_id);

CREATE POLICY "Students can read resources addressed to them or all mentees"
ON public.resources FOR SELECT TO authenticated
USING (
    target_student_id IS NULL 
    OR target_student_id = auth.uid()
    OR mentor_id = auth.uid()
);

-- ==============================================================================
-- SUPABASE STORAGE BUCKET & POLICIES FOR 'mentor-resources'
-- ==============================================================================
-- INSERT INTO storage.buckets (id, name, public) VALUES ('mentor-resources', 'mentor-resources', false);
-- CREATE POLICY "Mentors can upload resources" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'mentor-resources');
-- CREATE POLICY "Authorized students can read resources" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'mentor-resources');
