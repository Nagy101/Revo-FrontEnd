import apiClient from './apiClient';
import { LoginPayload, AuthResponse } from '@/types/auth';
import { ApiResponse } from '@/types/api';

export const authService = {
  login: async (payload: LoginPayload): Promise<ApiResponse<AuthResponse>> => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/Auth/login', payload);
    return response.data;
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Clear cookie for middleware
      document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }
  },

  setAuthData: (data: AuthResponse) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({
        email: data.email,
        name: data.name,
        roles: data.roles,
        isAuthenticated: data.isAuthenticated,
        expireOn: data.expireOn,
      }));
      // Set token in cookie so Next.js Middleware can read it to protect routes
      document.cookie = `token=${data.token}; path=/; max-age=86400; secure; samesite=strict`;
    }
  },
  
  getAuthData: (): Partial<AuthResponse> | null => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      if (token && userStr) {
        try {
          const user = JSON.parse(userStr);
          return {
            token,
            ...user
          };
        } catch (e) {
          return null;
        }
      }
    }
    return null;
  }
};
