// Entity: Payment
// Represents a payment for a submission, including manual and Razorpay modes.

import { supabase } from '../supabaseClient.js';

class Payment {
  /**
   * @param {Object} data
   * @param {string} data.paymentId - Unique identifier for the payment
   * @param {string} data.userId - The ID of the user making the payment (required)
   * @param {string} data.date - The date of the payment (required)
   * @param {string} data.timestamp - Exact time of payment
   * @param {number} data.amount - Payment amount (required)
   * @param {string} data.mode - "MANUAL" | "RAZORPAY" (default: "MANUAL")
   * @param {string} data.status - "PENDING" | "APPROVED" | "REJECTED" | "CREATED" (default: "PENDING", required)
   * @param {string} data.transactionId - Transaction ID for the payment
   * @param {string} data.proofUrl - URL of the payment proof
   * @param {string} data.razorpay_order_id - Order ID from Razorpay
   * @param {string} data.razorpay_payment_id - Payment ID from Razorpay
   * @param {string} data.razorpay_signature - Signature from Razorpay to verify payment
   * @param {string} data.submissionDate - Date of the missed submission this payment is for
   * @param {string} data.notes - Optional notes related to the payment
   */
  constructor({
    paymentId,
    userId,
    date,
    timestamp,
    amount,
    mode = "MANUAL",
    status = "PENDING",
    transactionId = "",
    proofUrl = "",
    razorpay_order_id = "",
    razorpay_payment_id = "",
    razorpay_signature = "",
    submissionDate = "",
    notes = ""
  }) {
    this.paymentId = paymentId;
    this.userId = userId;
    this.date = date;
    this.timestamp = timestamp;
    this.amount = amount;
    this.mode = mode;
    this.status = status;
    this.transactionId = transactionId;
    this.proofUrl = proofUrl;
    this.razorpay_order_id = razorpay_order_id;
    this.razorpay_payment_id = razorpay_payment_id;
    this.razorpay_signature = razorpay_signature;
    this.submissionDate = submissionDate;
    this.notes = notes;
  }

  /**
   * Create a new payment
   * @param {Object} paymentData - Payment data
   * @returns {Promise<Payment>} - Created payment object
   */
  static async create(paymentData) {
    try {
      const { data, error } = await supabase
        .from('payments')
        .insert([paymentData])
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return new Payment(data);
    } catch (error) {
      console.error('Error creating payment:', error);
      throw error;
    }
  }

  /**
   * Create multiple payments
   * @param {Array} paymentsData - Array of payment data
   * @returns {Promise<Payment[]>} - Array of created payment objects
   */
  static async bulkCreate(paymentsData) {
    try {
      const { data, error } = await supabase
        .from('payments')
        .insert(paymentsData)
        .select();

      if (error) {
        throw new Error(error.message);
      }

      return data.map(paymentData => new Payment(paymentData));
    } catch (error) {
      console.error('Error bulk creating payments:', error);
      throw error;
    }
  }

  /**
   * Update a payment
   * @param {string} paymentId - Payment ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Payment>} - Updated payment object
   */
  static async update(paymentId, updateData) {
    try {
      const { data, error } = await supabase
        .from('payments')
        .update(updateData)
        .eq('id', paymentId)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return new Payment(data);
    } catch (error) {
      console.error('Error updating payment:', error);
      throw error;
    }
  }

  /**
   * Get all payments
   * @returns {Promise<Payment[]>} - Array of payment objects
   */
  static async list() {
    try {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .order('date', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return data.map(paymentData => new Payment(paymentData));
    } catch (error) {
      console.error('Error listing payments:', error);
      throw error;
    }
  }

  /**
   * Filter payments based on criteria
   * @param {Object} filters - Filter criteria
   * @returns {Promise<Payment[]>} - Array of filtered payment objects
   */
  static async filter(filters = {}) {
    try {
      let query = supabase.from('payments').select('*');

      // Apply filters
      if (filters.userId) {
        query = query.eq('userId', filters.userId);
      }
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      if (filters.mode) {
        query = query.eq('mode', filters.mode);
      }

      const { data, error } = await query.order('date', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return data.map(paymentData => new Payment(paymentData));
    } catch (error) {
      console.error('Error filtering payments:', error);
      throw error;
    }
  }
}

export default Payment;
export { Payment };