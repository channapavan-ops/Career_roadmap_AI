
import { supabase } from '../lib/supabase';

export async function registerUser({
  email,
  password,
  fullName,
}) {
  if (!email?.trim() || !password || !fullName?.trim()) {
    throw new Error('Name, email and password are required.');
  }

  if (password.length < 8) {
    throw new Error('Password must be at least 8 characters.');
  }

  const { data, error } = await supabase.auth.signUp({
    email: email.trim(),
    password,
    options: {
      data: {
        full_name: fullName.trim(),
      },
    },
  });

  if (error) throw error;

  return data;
}

export async function loginUser({ email, password }) {
  if (!email?.trim() || !password) {
    throw new Error('Email and password are required.');
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });

  if (error) throw error;

  return data;
}

export async function logoutUser() {
  const { error } = await supabase.auth.signOut();

  if (error) throw error;
}

export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser();

  if (error) throw error;

  return data.user;
}
