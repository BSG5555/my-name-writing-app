// Entity: AdminLog
// Represents admin activity logs.

import { supabase } from '../supabaseClient.js';

class AdminLog {
  /**
   * @param {Object} data
   * @param {string} data.id - Unique identifier for the log entry
   * @param {string} data.action - The action performed by the admin
   * @param {string} data.adminId - The ID of the admin who performed the action
   * @param {string} data.userId - The ID of the user affected by the action (optional)
   * @param {string} data.paymentId - The ID of the payment affected by the action (optional)
   * @param {string} data.timestamp - Timestamp of the action
   * @param {Object} data.metadata - Additional metadata for the action
   */
  constructor({
    id,
    action,
    adminId,
    userId = '',
    paymentId = '',
    timestamp,
    metadata = {}
  }) {
    this.id = id;
    this.action = action;
    this.adminId = adminId;
    this.userId = userId;
    this.paymentId = paymentId;
    this.timestamp = timestamp;
    this.metadata = metadata;
  }

  /**
   * Create a new admin log entry
   * @param {Object} logData - Log entry data
   * @returns {Promise<AdminLog>} - Created log entry object
   */
  static async create(logData) {
    try {
      const { data, error } = await supabase
        .from('admin_logs')
        .insert([logData])
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return new AdminLog(data);
    } catch (error) {
      console.error('Error creating admin log:', error);
      throw error;
    }
  }

  /**
   * Get all admin logs
   * @returns {Promise<AdminLog[]>} - Array of log entry objects
   */
  static async list() {
    try {
      const { data, error } = await supabase
        .from('admin_logs')
        .select('*')
        .order('timestamp', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return data.map(logData => new AdminLog(logData));
    } catch (error) {
      console.error('Error listing admin logs:', error);
      throw error;
    }
  }

  /**
   * Filter admin logs based on criteria
   * @param {Object} filters - Filter criteria
   * @returns {Promise<AdminLog[]>} - Array of filtered log entry objects
   */
  static async filter(filters = {}) {
    try {
      let query = supabase.from('admin_logs').select('*');

      // Apply filters
      if (filters.adminId) {
        query = query.eq('adminId', filters.adminId);
      }
      if (filters.userId) {
        query = query.eq('userId', filters.userId);
      }
      if (filters.action) {
        query = query.eq('action', filters.action);
      }

      const { data, error } = await query.order('timestamp', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return data.map(logData => new AdminLog(logData));
    } catch (error) {
      console.error('Error filtering admin logs:', error);
      throw error;
    }
  }
}

export { AdminLog };