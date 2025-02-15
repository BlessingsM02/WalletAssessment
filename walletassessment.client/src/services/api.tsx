// src/services/api.ts
import axios from 'axios';

// Create basic type definitions
interface ApiInstance {
  (config: any): Promise<any>;
  get: (url: string, config?: any) => Promise<any>;
  post: (url: string, data?: any, config?: any) => Promise<any>;
  put: (url: string, data?: any, config?: any) => Promise<any>;
  delete: (url: string, config?: any) => Promise<any>;
  interceptors: {
    request: {
      use: (onFulfilled: (config: any) => any) => void;
    };
    response: {
      use: (onFulfilled: (response: any) => any, onRejected: (error: any) => any) => void;
    };
  };
}

const api = axios.create({
  baseURL:'api',
}) as unknown as ApiInstance;

// Request interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('refreshToken');
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
    console.log('Request with token:', token);
    
  }
  return config;
});

// Response interceptor
export interface ApiResponse<T = any> {
    data: T;
    message?: string;
    success: boolean;
  }

export default api;