import { createClient } from '@supabase/supabase-js'

const supabaseUrl =  'https://eiaxxveryhfulkpnjqci.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpYXh4dmVyeWhmdWxrcG5qcWNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMjU3NDUsImV4cCI6MjA2MjcwMTc0NX0.Zj6-kNg4VQc_TRvM403bd0vYxJUeey--Mn5QCf3JEJI'

export const supabase = createClient(supabaseUrl, supabaseAnonKey) 