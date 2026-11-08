import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ovhkyvvmrcminxjnjlbq.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im92aGt5dnZtcmNtaW54am5qbGJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQxMDEyMDAsImV4cCI6MjEwOTY3NzIwMH0.8WsDTW6qVTDMFL8_Cs0VOPvgQu3iVQVjrOUj357bKuc'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
})
