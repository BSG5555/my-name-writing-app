// Utility functions for the application

/**
 * Create a page URL based on the page name
 * @param {string} pageName - The name of the page
 * @returns {string} - The URL path for the page
 */
export function createPageUrl(pageName) {
  // Map page names to their routes in Next.js
  const pageRoutes = {
    'Home': '/',
    'AdminDashboard': '/AdminDashboard',
    'AdminUsers': '/AdminUsers',
    'AdminUserDetails': '/AdminUserDetails',
    'AdminPendingPayments': '/AdminPendingPayments',
    'MyProgress': '/MyProgress',
    'Signup': '/Signup'
  };
  
  return pageRoutes[pageName] || '/';
}

// Re-export from progress utils
export { calculateMissedDays } from './progress.js';