
import { supabase } from '../lib/supabase';

export async function getMyMentors() {
  const { data: { user }, error: userError } =
    await supabase.auth.getUser();

  if (userError) throw userError;

  if (!user) {
    throw new Error('Please log in to view your mentors.');
  }

  const { data, error } = await supabase
    .from('mentor_assignments')
    .select(`
      id,
      assigned_at,
      mentor:profiles!mentor_assignments_mentor_id_fkey (
        id,
        full_name,
        course,
        avatar_url
      )
    `)
    .eq('student_id', user.id)
    .order('assigned_at', { ascending: false });

  if (error) throw error;

  return data;
}

export async function getMentorResources(assignmentId) {
  if (!assignmentId) {
    throw new Error('A mentor assignment ID is required.');
  }

  const { data, error } = await supabase
    .from('mentor_resources')
    .select('*')
    .eq('assignment_id', assignmentId)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return data;
}


export async function createMentorResource({
  assignmentId,
  title,
  description,
  resourceType,
  resourceUrl = null,
}) {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) throw userError;

  if (!user) {
    throw new Error('Please log in to add a resource.');
  }

  if (!assignmentId || !title?.trim() || !description?.trim() || !resourceType?.trim()) {
    throw new Error('Assignment, title, description, and resource type are required.');
  }

  const { data, error } = await supabase
    .from('mentor_resources')
    .insert({
      assignment_id: assignmentId,
      uploaded_by: user.id,
      title: title.trim(),
      description: description.trim(),
      resource_type: resourceType.trim(),
      resource_url: resourceUrl?.trim() || null,
    })
    .select()
    .single();

  if (error) throw error;

  return data;
}
