import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kgcsmozgrpnkxjlaxqnv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtnY3Ntb3pncnBua3hqbGF4cW52Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU5NTgwMTMsImV4cCI6MjA3MTUzNDAxM30.HTGdTUsN9IAxPUfCE0obBQUbZZiRvdVrD6DhpGLHT9Y';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
