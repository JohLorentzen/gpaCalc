import { createClient } from '@supabase/supabase-js';
import getConfig from 'next/config';

// Use runtime config if available (for server components)
const { publicRuntimeConfig } = getConfig() || { publicRuntimeConfig: {} };

// Initialize the Supabase client with fallback options
const supabaseUrl = publicRuntimeConfig.NEXT_PUBLIC_SUPABASE_URL || 
                   process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = publicRuntimeConfig.SUPABASE_ANON_KEY || 
                       process.env.SUPABASE_ANON_KEY || '';

// Check if Supabase credentials are available
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase credentials. Some features may not work correctly.');
}

export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null; 