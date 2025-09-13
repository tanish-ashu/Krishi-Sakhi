// ExpertTip entity class
class ExpertTip {
  static async create(tipData) {
    // Mock implementation
    return { 
      id: Date.now().toString(), 
      ...tipData,
      created_date: new Date().toISOString()
    };
  }

  static async update(id, tipData) {
    // Mock implementation
    return { id, ...tipData };
  }

  static async delete(id) {
    // Mock implementation
    return { success: true };
  }

  static async list(orderBy = '-created_date', limit = null) {
    // Mock implementation - return sample tips
    const sampleTips = [
      {
        id: '1',
        title: 'Organic Soil Preparation for Vegetables',
        content: 'Proper soil preparation is crucial for healthy vegetable growth. Mix 3 parts garden soil, 2 parts compost, and 1 part sand. Add organic matter like leaf mold or well-rotted manure. Test soil pH and adjust to 6.0-7.0 range. This creates optimal conditions for root development and nutrient uptake.',
        category: 'soil_management',
        difficulty_level: 'beginner',
        estimated_cost: 'low',
        season: 'all_seasons',
        crop_types: ['tomatoes', 'peppers', 'lettuce', 'spinach'],
        image_url: '/images/soil-prep.jpg',
        created_date: '2024-01-15T08:00:00Z'
      },
      {
        id: '2',
        title: 'Natural Pest Control with Companion Planting',
        content: 'Companion planting is an effective way to control pests naturally. Plant marigolds around tomatoes to repel nematodes, basil near peppers to deter aphids, and nasturtiums to attract beneficial insects. This method reduces the need for chemical pesticides while promoting biodiversity.',
        category: 'pest_control',
        difficulty_level: 'intermediate',
        estimated_cost: 'low',
        season: 'spring',
        crop_types: ['tomatoes', 'peppers', 'cabbage', 'broccoli'],
        image_url: '/images/companion-planting.jpg',
        created_date: '2024-01-12T14:20:00Z'
      },
      {
        id: '3',
        title: 'Drip Irrigation System Setup',
        content: 'Drip irrigation delivers water directly to plant roots, reducing waste and preventing disease. Install main line, connect emitters every 12-18 inches, and use a timer for consistent watering. This system can reduce water usage by 30-50% while improving plant health.',
        category: 'irrigation',
        difficulty_level: 'intermediate',
        estimated_cost: 'medium',
        season: 'all_seasons',
        crop_types: ['all'],
        image_url: '/images/drip-irrigation.jpg',
        created_date: '2024-01-10T11:45:00Z'
      },
      {
        id: '4',
        title: 'Composting for Nutrient-Rich Soil',
        content: 'Create nutrient-rich compost using kitchen scraps, yard waste, and manure. Layer green materials (nitrogen-rich) with brown materials (carbon-rich) in a 1:3 ratio. Turn the pile weekly and maintain moisture. In 2-3 months, you\'ll have dark, crumbly compost perfect for your garden.',
        category: 'fertilization',
        difficulty_level: 'beginner',
        estimated_cost: 'low',
        season: 'all_seasons',
        crop_types: ['all'],
        image_url: '/images/composting.jpg',
        created_date: '2024-01-08T16:30:00Z'
      }
    ];
    
    return limit ? sampleTips.slice(0, limit) : sampleTips;
  }

  static async filter(filters = {}, orderBy = '-created_date', limit = null) {
    // Mock implementation
    let tips = await this.list(orderBy);
    
    // Apply filters
    if (filters.category) {
      tips = tips.filter(tip => tip.category === filters.category);
    }
    
    if (filters.difficulty_level) {
      tips = tips.filter(tip => tip.difficulty_level === filters.difficulty_level);
    }
    
    return limit ? tips.slice(0, limit) : tips;
  }
}

export default ExpertTip;