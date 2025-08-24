export class AdminLog {
  static async create(entry) {
    // Placeholder logging
    // eslint-disable-next-line no-console
    console.log('AdminLog entry created:', entry);
    return { id: Date.now().toString(), ...entry };
  }
}
