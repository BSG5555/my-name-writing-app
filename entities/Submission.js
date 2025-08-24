export const Submission = {
  async list() {
    return [];
  },
  async filter(_query) {
    return [];
  },
  async create(data) {
    return { id: Date.now().toString(), ...data };
  }
};