// Entity: User
// Represents a user in the application with authentication and user management methods.

import { supabase } from '../supabaseClient.js';

class User {
  /**
   * @param {Object} data
   * @param {string} data.id - Unique identifier for the user
   * @param {string} data.email - User's email address (required)
   * @param {string} data.full_name - User's full name
   * @param {string} data.phone - User's phone number
   * @param {string} data.role - User's role ('user' | 'admin')
   * @param {string} data.created_date - Date when user was created
   * @param {string} data.profilePhotoUrl - URL of user's profile photo
   */
  constructor({
    id,
    email,
    full_name = '',
    phone = '',
    role = 'user',
    created_date,
    profilePhotoUrl = ''
  }) {
    this.id = id;
    this.email = email;
    this.full_name = full_name;
    this.phone = phone;
    this.role = role;
    this.created_date = created_date;
    this.profilePhotoUrl = profilePhotoUrl;
  }

  /**
   * Login user with email and password
   * @param {string} email - User's email address
   * @param {string} password - User's password
   * @returns {Promise<User>} - Returns user object on success
   * @throws {Error} - Throws error if authentication fails
   */
  static async login(email, password) {
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
      });

      if (error) {
        throw new Error(error.message);
      }

      if (!data.user) {
        throw new Error('Authentication failed');
      }

      // Get user profile data from database
      const { data: userProfile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (profileError) {
        // If profile doesn't exist, create a basic one
        const newUser = {
          id: data.user.id,
          email: data.user.email,
          full_name: data.user.user_metadata?.full_name || '',
          phone: data.user.user_metadata?.phone || '',
          role: 'user',
          created_date: new Date().toISOString()
        };

        const { data: createdProfile, error: createError } = await supabase
          .from('users')
          .insert([newUser])
          .select()
          .single();

        if (createError) {
          console.warn('Could not create user profile:', createError.message);
        }

        return new User(createdProfile || newUser);
      }

      return new User(userProfile);
    } catch (error) {
      throw new Error(`Login failed: ${error.message}`);
    }
  }

  /**
   * Get current authenticated user
   * @returns {Promise<User|null>} - Returns user object if authenticated, null otherwise
   */
  static async me() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error || !user) {
        return null;
      }

      // Get user profile data from database
      const { data: userProfile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) {
        return null;
      }

      return new User(userProfile);
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  /**
   * Logout current user
   * @returns {Promise<void>}
   */
  static async logout() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw new Error(error.message);
      }
    } catch (error) {
      throw new Error(`Logout failed: ${error.message}`);
    }
  }

  /**
   * Get a specific user by ID
   * @param {string} userId - The ID of the user to retrieve
   * @returns {Promise<User|null>} - Returns user object if found, null otherwise
   */
  static async get(userId) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error || !data) {
        return null;
      }

      return new User(data);
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  }

  /**
   * Get all users
   * @returns {Promise<User[]>} - Returns array of user objects
   */
  static async list() {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_date', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return data.map(userData => new User(userData));
    } catch (error) {
      console.error('Error listing users:', error);
      throw error;
    }
  }

  /**
   * Create a new user (signup)
   * @param {Object} userData - User data for registration
   * @param {string} userData.email - User's email
   * @param {string} userData.password - User's password
   * @param {string} userData.full_name - User's full name
   * @param {string} userData.phone - User's phone number
   * @returns {Promise<User>} - Returns created user object
   */
  static async create({ email, password, full_name, phone }) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            full_name: full_name,
            phone: phone
          }
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      if (!data.user) {
        throw new Error('User creation failed');
      }

      // Create user profile in database
      const userProfile = {
        id: data.user.id,
        email: email,
        full_name: full_name || '',
        phone: phone || '',
        role: 'user',
        created_date: new Date().toISOString()
      };

      const { data: createdProfile, error: profileError } = await supabase
        .from('users')
        .insert([userProfile])
        .select()
        .single();

      if (profileError) {
        console.warn('Could not create user profile:', profileError.message);
        return new User(userProfile);
      }

      return new User(createdProfile);
    } catch (error) {
      throw new Error(`User creation failed: ${error.message}`);
    }
  }

  /**
   * Filter users based on criteria
   * @param {Object} filters - Filter criteria
   * @returns {Promise<User[]>} - Returns array of filtered users
   */
  static async filter(filters = {}) {
    try {
      let query = supabase.from('users').select('*');

      // Apply filters
      if (filters.userId) {
        query = query.eq('id', filters.userId);
      }
      if (filters.email) {
        query = query.eq('email', filters.email);
      }
      if (filters.role) {
        query = query.eq('role', filters.role);
      }

      const { data, error } = await query.order('created_date', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return data.map(userData => new User(userData));
    } catch (error) {
      console.error('Error filtering users:', error);
      throw error;
    }
  }
}

export { User };