import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Singleton pattern to prevent multiple instances
let supabaseInstance = null;

export const supabase = () => {
  if (!supabaseInstance) {
    supabaseInstance = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: true,
      },
    });
  }
  return supabaseInstance;
};