import axios, { AxiosInstance } from 'axios';
import { extractApiErrorMessage } from './api/http-client';

const getBaseUrl = () => {
  const base = process.env.NEXT_PUBLIC_API_URL || 'https://revo-media.net/api';
  return base.replace(/\/+$/, '');
};

// Create an Axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response.status === 401 || error.response.status === 403) {
        if (typeof window !== 'undefined') {
          // Clear storage, cookie, and redirect
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
          window.location.href = '/admin/auth';
        }
      }

      const detailedMessage = extractApiErrorMessage(error.response.data, error.response.status);
      if (detailedMessage) {
        error.message = detailedMessage;
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
