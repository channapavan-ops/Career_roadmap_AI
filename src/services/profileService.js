
import { supabase } from '../lib/supabase';

export async function getMyProfile() {
  const { data: { user }, error: userError } =
    await supabase.auth.getUser();

  if (userError) throw userError;

  if (!user) {
    throw new Error('Please log in to view your profile.');
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) throw error;

  return data;
}

export async function updateMyProfile(updates) {
  const { data: { user }, error: userError } =
    await supabase.auth.getUser();

  if (userError) throw userError;

  if (!user) {
    throw new Error('Please log in to update your profile.');
  }

  const allowedFields = {
    full_name: updates.full_name,
    course: updates.course,
    academic_year: updates.academic_year,
    career_goal: updates.career_goal,
    avatar_url: updates.avatar_url,
  };

  const cleanUpdates = Object.fromEntries(
    Object.entries(allowedFields).filter(
      ([, value]) => value !== undefined
    )
  );

  const { data, error } = await supabase
    .from('profiles')
    .update({
      ...cleanUpdates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id)
    .select()
    .single();

  if (error) throw error;

  return data;
}
