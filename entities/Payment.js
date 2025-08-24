export const Payment = {
  async list() {
    return [];
  },
  async update(id, fields) {
    return { id, ...fields };
  },
  async filter(_query) {
    return [];
  },
  async bulkCreate(rows) {
    return rows.map((r, i) => ({ id: `bulk_${i}`, ...r }));
  }
};