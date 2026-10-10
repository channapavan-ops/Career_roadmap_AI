
import { supabase } from '../lib/supabase';

export async function getMyRoadmap() {
  const { data: { user }, error: userError } =
    await supabase.auth.getUser();

  if (userError) throw userError;

  if (!user) {
    throw new Error('Please log in to view your roadmap.');
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('course, academic_year, career_goal')
    .eq('id', user.id)
    .single();

  if (profileError) throw profileError;

  if (!profile.academic_year || !profile.career_goal) {
    throw new Error(
      'Please set your academic year and career goal in your profile first.'
    );
  }

  const { data, error } = await supabase
    .from('roadmap_modules')
    .select(`
      id,
      title,
      description,
      course,
      career_goal,
      target_year,
      module_order,
      estimated_weeks,
      roadmap_topics (
        id,
        title,
        description,
        resource_url,
        topic_order,
        is_revision_topic
      )
    `)
    .eq('course', profile.course)
    .eq('career_goal', profile.career_goal)
    .eq('target_year', profile.academic_year)
    .order('module_order', { ascending: true });

  if (error) throw error;

  return data.map((module) => ({
    ...module,
    roadmap_topics: (module.roadmap_topics || []).sort(
      (a, b) => a.topic_order - b.topic_order
    ),
  }));
}
