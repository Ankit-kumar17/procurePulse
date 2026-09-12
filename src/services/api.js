// Future-ready API client structure for direct transition to live backend
export const API_BASE_URL = 'https://api.procurepulse.mp.gov.in/v1';

export const apiClient = {
  get: async (endpoint) => {
    console.log(`[API MOCK] GET -> ${API_BASE_URL}${endpoint}`);
  },
  post: async (endpoint, data) => {
    console.log(`[API MOCK] POST -> ${API_BASE_URL}${endpoint}`, data);
  }
};
