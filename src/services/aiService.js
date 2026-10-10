
import { supabase } from '../lib/supabase';

export async function askCareerAssistant(message) {
  if (!message?.trim()) {
    throw new Error('Please enter a question.');
  }

  const { data: { user }, error: userError } =
    await supabase.auth.getUser();

  if (userError) throw userError;

  if (!user) {
    throw new Error(
      'Please log in to use the AI career assistant.'
    );
  }

  const { data, error } = await supabase.functions.invoke(
    'ai-assistant',
    {
      body: {
        message: message.trim(),
      },
    }
  );

  if (error) throw error;

  if (!data?.reply) {
    throw new Error('The AI assistant returned no response.');
  }

  return data.reply;
}
