// Central helper for building internal page URLs by page name.
// Extend this mapping if you later change route structure.
export function createPageUrl(pageName) {
  return `/${pageName}`;
}
