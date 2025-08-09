// API service for ClaimTrack backend
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Create axios instance with default config
const api = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Response error:', error.response?.data || error.message);
    
    // Handle specific error cases
    if (error.response?.status === 429) {
      throw new Error('Rate limit exceeded. Please try again later.');
    }
    
    if (error.response?.status >= 500) {
      throw new Error('Server error. Please try again later.');
    }
    
    throw error;
  }
);

/**
 * Claims API methods
 */
export const claimsApi = {
  /**
   * Create a new claim
   * @param {Object} claimData - Claim data to create
   * @returns {Promise<Object>} Created claim
   */
  createClaim: async (claimData) => {
    try {
      const response = await api.post('/claims/', claimData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to create claim');
    }
  },

  /**
   * Get paginated list of claims
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Paginated claims response
   */
  getClaims: async (params = {}) => {
    try {
      const response = await api.get('/claims/', { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to fetch claims');
    }
  },

  /**
   * Approve a claim
   * @param {number} claimId - ID of claim to approve
   * @returns {Promise<Object>} Updated claim
   */
  approveClaim: async (claimId) => {
    try {
      const response = await api.put(`/claims/${claimId}/approve`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to approve claim');
    }
  },
};

export default api;
