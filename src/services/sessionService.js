
import { supabase } from '../lib/supabase';

export async function getSession() {
  const { data, error } = await supabase.auth.getSession();

  if (error) throw error;

  return data.session;
}

export function listenToAuthChanges(callback) {
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((event, session) => {
    callback({ event, session });
  });

  return () => subscription.unsubscribe();
}
