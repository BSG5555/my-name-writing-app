export const User = {
  async list() {
    return [
      { id: 'u1', full_name: 'Alice Example', email: 'alice@example.com', role: 'user' },
      { id: 'u2', full_name: 'Bob Sample', email: 'bob@example.com', role: 'user' }
    ];
  },
  async me() {
    // Mark as admin to allow admin page navigation during testing
    return { id: 'u1', full_name: 'Alice Example', email: 'alice@example.com', role: 'admin', created_date: new Date().toISOString() };
  },
  async get(id) {
    return { id, full_name: `User ${id}`, email: `${id}@example.com`, role: 'user', created_date: new Date().toISOString() };
  },
  login() {
    // placeholder
  },
  logout() {
    // placeholder
  }
};