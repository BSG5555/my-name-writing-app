import { startOfDay, isBefore, isSameDay, addDays, subDays } from 'date-fns';

/**
 * calculateMissedDays(user, submissions, payments)
 * - user.created_date should be an ISO date string or Date
 * - submissions: array with .date values (ISO or Date)
 * - payments: array with .date and .status
 *
 * Returns array of Date objects representing missed days between user.created_date and yesterday
 */
export function calculateMissedDays(user, submissions = [], payments = []) {
  if (!user || !user.created_date) return [];
  const missedDays = [];
  let currentDay = startOfDay(new Date(user.created_date));
  const yesterday = startOfDay(subDays(new Date(), 1));
  while (isBefore(currentDay, yesterday) || isSameDay(currentDay, yesterday)) {
    const hasSubmission = submissions.find((s) => isSameDay(new Date(s.date), currentDay));
    const hasPaid = payments.find((p) => isSameDay(new Date(p.date), currentDay) && p.status === 'APPROVED');
    if (!hasSubmission && !hasPaid) {
      missedDays.push(new Date(currentDay));
    }
    currentDay = addDays(currentDay, 1);
  }
  return missedDays;
}
