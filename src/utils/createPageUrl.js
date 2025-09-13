// URL creation utilities
export const createPageUrl = (page, params = {}) => {
  // Map page names to their correct URL paths
  const pageUrlMap = {
    'Dashboard': '/dashboard',
    'DiseaseDetection': '/disease-detection',
    'CropManagement': '/crop-management',
    'ExpertTips': '/expert-tips',
    'Weather': '/weather',
    'Community': '/community',
    'Chat': '/chat'
  };
  
  const baseUrl = pageUrlMap[page] || `/${page.toLowerCase()}`;
  const queryString = new URLSearchParams(params).toString();
  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
};

export const getPageFromUrl = (url) => {
  return url.split('/')[1] || 'dashboard';
};

export const getUrlParams = (url) => {
  const urlObj = new URL(url, window.location.origin);
  const params = {};
  urlObj.searchParams.forEach((value, key) => {
    params[key] = value;
  });
  return params;
};


