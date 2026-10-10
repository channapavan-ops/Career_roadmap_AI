
import { supabase } from '../lib/supabase';

export async function getProjects({
  careerGoal,
  academicYear,
} = {}) {
  let query = supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });

  if (careerGoal) {
    query = query.or(
      `career_goal.eq.${careerGoal},career_goal.is.null`
    );
  }

  if (academicYear) {
    query = query.or(
      `target_year.eq.${academicYear},target_year.is.null`
    );
  }

  const { data, error } = await query;

  if (error) throw error;

  return data;
}
