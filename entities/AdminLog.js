export const AdminLog = {
  async create(entry) {
    return { id: Date.now().toString(), ...entry };
  }
};