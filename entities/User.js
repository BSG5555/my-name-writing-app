import { supabase } from '@/supabaseClient';

export const User = {
  async list() {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching users:', error);
      // Fallback to placeholder data for development
      return [
        { id: 'u1', full_name: 'Alice Example', email: 'alice@example.com', role: 'user' },
        { id: 'u2', full_name: 'Bob Sample', email: 'bob@example.com', role: 'user' }
      ];
    }
  },
  
  async me() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      
      // If user not found in database, return user with default role
      if (!data) {
        return { 
          id: user.id, 
          full_name: user.user_metadata?.full_name || user.email, 
          email: user.email, 
          role: 'user',
          created_date: user.created_at 
        };
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching current user:', error);
      // Fallback for development - return admin user
      return { 
        id: 'u1', 
        full_name: 'Alice Example', 
        email: 'alice@example.com', 
        role: 'admin', 
        created_date: new Date().toISOString() 
      };
    }
  },
  
  async get(id) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching user:', error);
      // Fallback to placeholder data
      return { 
        id, 
        full_name: `User ${id}`, 
        email: `${id}@example.com`, 
        role: 'user', 
        created_date: new Date().toISOString() 
      };
    }
  },
  
  async login() {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      
      if (error) throw error;
    } catch (error) {
      console.error('Error during login:', error);
      alert('Login failed. Please try again.');
    }
  },
  
  async logout() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      window.location.href = '/';
    } catch (error) {
      console.error('Error during logout:', error);
      alert('Logout failed. Please try again.');
    }
  }
};