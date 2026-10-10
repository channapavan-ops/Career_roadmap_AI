
import { supabase } from '../lib/supabase';

export async function getMyProgress() {
  const { data: { user }, error: userError } =
    await supabase.auth.getUser();

  if (userError) throw userError;

  if (!user) {
    throw new Error('Please log in to view your progress.');
  }

  const { data, error } = await supabase
    .from('user_progress')
    .select('id, topic_id, is_completed, completed_at, updated_at')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false });

  if (error) throw error;

  return data;
}

export async function updateTopicProgress(topicId, isCompleted) {
  if (!topicId) {
    throw new Error('A valid topic ID is required.');
  }

  if (typeof isCompleted !== 'boolean') {
    throw new Error('Completion status must be true or false.');
  }

  const { data: { user }, error: userError } =
    await supabase.auth.getUser();

  if (userError) throw userError;

  if (!user) {
    throw new Error('Please log in to update your progress.');
  }

  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from('user_progress')
    .upsert(
      {
        user_id: user.id,
        topic_id: topicId,
        is_completed: isCompleted,
        completed_at: isCompleted ? now : null,
        updated_at: now,
      },
      { onConflict: 'user_id,topic_id' }
    )
    .select()
    .single();

  if (error) throw error;

  return data;
}
