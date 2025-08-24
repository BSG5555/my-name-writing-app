// Root-level utility module to satisfy import { createPageUrl } from '@/utils'

/**
 * Ensures the path starts with a "/" so it works with Next.js router.push().
 * Accepts strings that may already include query parameters, e.g. "AdminUserDetails?userId=123".
 */
export function createPageUrl(path) {
  if (!path) return '/';
  return path.startsWith('/') ? path : `/${path}`;
}