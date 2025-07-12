import axios from 'axios';
import type { AxiosResponse } from 'axios';
import { config } from '../config/env';
import type {
  MatchRequest,
  MatchResponse,
  BatchMatchResult,
  HealthResponse,
  ApiError
} from '../types/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: config.api.baseUrl,
  timeout: config.api.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const apiError: ApiError = {
      message: error.response?.data?.message || error.message || 'An unexpected error occurred',
      status: error.response?.status,
    };
    return Promise.reject(apiError);
  }
);

export const apiService = {
  // Health check
  async checkHealth(): Promise<HealthResponse> {
    const response: AxiosResponse<HealthResponse> = await apiClient.get('/health');
    return response.data;
  },

  // Single entity matching
  async matchEntity(request: MatchRequest): Promise<MatchResponse> {
    const response: AxiosResponse<MatchResponse> = await apiClient.post('/match', request);
    return response.data;
  },

  // Batch matching via file upload
  async batchMatch(file: File): Promise<BatchMatchResult[]> {
    const formData = new FormData();
    formData.append('file', file);

    const response: AxiosResponse<BatchMatchResult[]> = await apiClient.post('/match/batch', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

export default apiService; 