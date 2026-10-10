
import { supabase } from '../lib/supabase';

export async function getInternships({
  academicYear,
  careerGoal,
} = {}) {
  let query = supabase
    .from('internships')
    .select('*')
    .order('deadline', { ascending: true, nullsFirst: false });

  if (academicYear) {
    query = query.contains('eligibility_years', [academicYear]);
  }

  if (careerGoal) {
    query = query.contains('career_goals', [careerGoal]);
  }

  const { data, error } = await query;

  if (error) throw error;

  return data;
}
