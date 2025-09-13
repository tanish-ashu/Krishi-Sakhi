// DiseaseDetection entity class
class DiseaseDetection {
  static async create(detectionData) {
    // Mock implementation
    return { 
      id: Date.now().toString(), 
      ...detectionData,
      created_date: new Date().toISOString()
    };
  }

  static async update(id, detectionData) {
    // Mock implementation
    return { id, ...detectionData };
  }

  static async delete(id) {
    // Mock implementation
    return { success: true };
  }

  static async list(orderBy = '-created_date', limit = null) {
    // Mock implementation - return sample detections
    const sampleDetections = [
      {
        id: '1',
        image_url: '/images/sample-plant.jpg',
        detected_disease: 'Early Blight',
        plant_type: 'Tomato',
        confidence_score: 85,
        symptoms: ['Yellow spots on leaves', 'Brown lesions', 'Leaf wilting'],
        treatment_recommendations: [
          'Remove affected leaves immediately',
          'Apply copper fungicide spray',
          'Improve air circulation around plants'
        ],
        prevention_tips: [
          'Water plants at soil level, avoid wetting leaves',
          'Ensure proper spacing between plants',
          'Rotate crops annually'
        ],
        severity: 'moderate',
        created_date: '2024-01-19T14:30:00Z'
      },
      {
        id: '2',
        image_url: '/images/sample-plant2.jpg',
        detected_disease: 'Rust',
        plant_type: 'Wheat',
        confidence_score: 92,
        symptoms: ['Orange-brown pustules on leaves', 'Yellowing of foliage'],
        treatment_recommendations: [
          'Apply sulfur-based fungicide',
          'Remove and burn infected plant debris'
        ],
        prevention_tips: [
          'Plant rust-resistant varieties',
          'Avoid overhead irrigation',
          'Maintain proper crop rotation'
        ],
        severity: 'high',
        created_date: '2024-01-17T09:15:00Z'
      }
    ];
    
    return limit ? sampleDetections.slice(0, limit) : sampleDetections;
  }

  static async filter(filters = {}, orderBy = '-created_date', limit = null) {
    // Mock implementation
    let detections = await this.list(orderBy);
    
    // Apply filters
    if (filters.severity) {
      detections = detections.filter(detection => detection.severity === filters.severity);
    }
    
    return limit ? detections.slice(0, limit) : detections;
  }
}

export default DiseaseDetection;