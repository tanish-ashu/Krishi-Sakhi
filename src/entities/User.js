// User entity class
class User {
  static async me() {
    // Mock implementation - in real app, this would fetch current user
    return {
      id: '1',
      full_name: 'Demo Farmer',
      email: 'farmer@demo.com',
      phone: '+91 9876543210',
      location: 'Punjab, India'
    };
  }

  static async create(userData) {
    // Mock implementation
    return { id: Date.now().toString(), ...userData };
  }

  static async update(id, userData) {
    // Mock implementation
    return { id, ...userData };
  }

  static async delete(id) {
    // Mock implementation
    return { success: true };
  }

  static async list() {
    // Mock implementation
    return [];
  }
}

export default User;
