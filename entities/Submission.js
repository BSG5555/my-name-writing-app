// Entity: Submission
// Represents a user's assignment submission.

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
}

export default Submission;