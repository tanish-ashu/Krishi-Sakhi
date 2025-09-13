// Crop entity class
class Crop {
  static async create(cropData) {
    // Mock implementation
    return { 
      id: Date.now().toString(), 
      ...cropData,
      created_date: new Date().toISOString(),
      status: cropData.status || 'active'
    };
  }

  static async update(id, cropData) {
    // Mock implementation
    return { id, ...cropData };
  }

  static async delete(id) {
    // Mock implementation
    return { success: true };
  }

  static async list(orderBy = '-created_date', limit = null) {
    // Mock implementation - return sample crops
    const sampleCrops = [
      {
        id: '1',
        name: 'Tomatoes',
        variety: 'Cherry',
        planting_date: '2024-01-15',
        expected_harvest_date: '2024-04-15',
        field_size: 2.5,
        growth_stage: 'fruiting',
        location: 'Field A',
        notes: 'Using organic fertilizers',
        status: 'active',
        created_date: '2024-01-15T00:00:00Z'
      },
      {
        id: '2',
        name: 'Wheat',
        variety: 'Durum',
        planting_date: '2024-02-01',
        expected_harvest_date: '2024-06-01',
        field_size: 5.0,
        growth_stage: 'vegetative',
        location: 'Field B',
        notes: 'Irrigated crop',
        status: 'active',
        created_date: '2024-02-01T00:00:00Z'
      }
    ];
    
    return limit ? sampleCrops.slice(0, limit) : sampleCrops;
  }

  static async filter(filters = {}, orderBy = '-created_date', limit = null) {
    // Mock implementation - filter the sample data
    let crops = await this.list(orderBy);
    
    // Apply filters
    if (filters.status) {
      crops = crops.filter(crop => crop.status === filters.status);
    }
    
    return limit ? crops.slice(0, limit) : crops;
  }
}

export default Crop;