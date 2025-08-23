// Entity: Payment
// Represents a payment for a submission, including manual and Razorpay modes.

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
}

export default Payment;