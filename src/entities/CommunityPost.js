// CommunityPost entity class
class CommunityPost {
  static async create(postData) {
    // Mock implementation
    return { 
      id: Date.now().toString(), 
      ...postData,
      created_date: new Date().toISOString(),
      created_by: 'Demo Farmer',
      likes_count: 0,
      replies_count: 0,
      is_resolved: false
    };
  }

  static async update(id, postData) {
    // Mock implementation
    return { id, ...postData };
  }

  static async delete(id) {
    // Mock implementation
    return { success: true };
  }

  static async list(orderBy = '-created_date', limit = null) {
    // Mock implementation - return sample posts
    const samplePosts = [
      {
        id: '1',
        title: 'Best time to plant tomatoes in Punjab?',
        content: 'I am planning to start tomato cultivation this season. What would be the best time to plant tomatoes in Punjab region? Any specific variety recommendations?',
        category: 'question',
        location: 'Punjab',
        tags: ['tomatoes', 'planting', 'punjab'],
        created_by: 'Rajesh Kumar',
        created_date: '2024-01-20T10:00:00Z',
        likes_count: 5,
        replies_count: 3,
        is_resolved: false
      },
      {
        id: '2',
        title: 'Organic pest control for wheat',
        content: 'Has anyone tried neem oil spray for wheat pest control? I want to avoid chemical pesticides and go organic. Share your experiences.',
        category: 'tip',
        location: 'Haryana',
        tags: ['wheat', 'organic', 'pest-control', 'neem'],
        created_by: 'Priya Sharma',
        created_date: '2024-01-18T15:30:00Z',
        likes_count: 8,
        replies_count: 2,
        is_resolved: true
      }
    ];
    
    return limit ? samplePosts.slice(0, limit) : samplePosts;
  }

  static async filter(filters = {}, orderBy = '-created_date', limit = null) {
    // Mock implementation
    let posts = await this.list(orderBy);
    
    // Apply filters
    if (filters.category) {
      posts = posts.filter(post => post.category === filters.category);
    }
    
    return limit ? posts.slice(0, limit) : posts;
  }
}

export default CommunityPost;