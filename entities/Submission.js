// Entity: Submission
// Represents a user's assignment submission.

import { supabase } from '../supabaseClient.js';

class Submission {
  /**
   * @param {Object} data
   * @param {string} data.submissionId - Unique identifier for the submission
   * @param {string} data.userId - The ID of the user who made the submission (required)
   * @param {string} data.date - The date of the submission (UTC, required)
   * @param {string} data.timestamp - Exact time of submission
   * @param {string} data.fileUrl - URL of the uploaded assignment file (required)
   * @param {string} data.userNotes - Optional notes from the user
   * @param {string} data.submissionStatus - "PENDING" | "APPROVED" | "REJECTED" (default: "PENDING")
   * @param {string} data.paymentStatus - "PENDING" | "APPROVED" | "REJECTED" | "MANUAL_REQUIRED" (default: "PENDING")
   * @param {string} data.proofUrl - URL of the payment proof for missed days
   * @param {string} data.adminNotes - Notes from the admin regarding this submission
   */
  constructor({
    submissionId,
    userId,
    date,
    timestamp,
    fileUrl,
    userNotes = '',
    submissionStatus = 'PENDING',
    paymentStatus = 'PENDING',
    proofUrl = '',
    adminNotes = ''
  }) {
    this.submissionId = submissionId;
    this.userId = userId;
    this.date = date;
    this.timestamp = timestamp;
    this.fileUrl = fileUrl;
    this.userNotes = userNotes;
    this.submissionStatus = submissionStatus;
    this.paymentStatus = paymentStatus;
    this.proofUrl = proofUrl;
    this.adminNotes = adminNotes;
  }

  /**
   * Create a new submission
   * @param {Object} submissionData - Submission data
   * @returns {Promise<Submission>} - Created submission object
   */
  static async create(submissionData) {
    try {
      const { data, error } = await supabase
        .from('submissions')
        .insert([submissionData])
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return new Submission(data);
    } catch (error) {
      console.error('Error creating submission:', error);
      throw error;
    }
  }

  /**
   * Get all submissions
   * @returns {Promise<Submission[]>} - Array of submission objects
   */
  static async list() {
    try {
      const { data, error } = await supabase
        .from('submissions')
        .select('*')
        .order('date', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return data.map(submissionData => new Submission(submissionData));
    } catch (error) {
      console.error('Error listing submissions:', error);
      throw error;
    }
  }

  /**
   * Filter submissions based on criteria
   * @param {Object} filters - Filter criteria
   * @returns {Promise<Submission[]>} - Array of filtered submission objects
   */
  static async filter(filters = {}) {
    try {
      let query = supabase.from('submissions').select('*');

      // Apply filters
      if (filters.userId) {
        query = query.eq('userId', filters.userId);
      }
      if (filters.date) {
        query = query.eq('date', filters.date);
      }
      if (filters.submissionStatus) {
        query = query.eq('submissionStatus', filters.submissionStatus);
      }

      const { data, error } = await query.order('date', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return data.map(submissionData => new Submission(submissionData));
    } catch (error) {
      console.error('Error filtering submissions:', error);
      throw error;
    }
  }
}

export default Submission;
export { Submission };