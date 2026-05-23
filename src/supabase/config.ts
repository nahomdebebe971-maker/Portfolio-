import { createClient } from '@supabase/supabase-js';

// Support both base project URL or full REST URL, replacing any rest prefix if supplied
const rawUrl = (import.meta as any).env?.VITE_SUPABASE_URL || 'https://staonupcdhcnyhlzzikx.supabase.co';
const supabaseUrl = rawUrl.replace(/\/rest\/v1\/?$/, '');

const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN0YW9udXBjZGhjbnlobHp6aWt4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk1NDQ1MjAsImV4cCI6MjA5NTEyMDUyMH0.Yn5FwbBkZrCHC98uFHaKsdro39I1BgCBM4kA8msqdl4';

console.log('Initializing Supabase client with URL:', supabaseUrl);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
