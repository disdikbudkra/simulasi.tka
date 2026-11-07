import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://dqrzxvjsjjibyllvinre.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRxcnp4dmpzamppYnlsbHZpbnJlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE0Mzk5MDEsImV4cCI6MjEwNzAxNTkwMX0.3mCKWJ3LLQE6h9tXAyFDiuwNZVoQKcuCCDn2HMp77KM'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
})
