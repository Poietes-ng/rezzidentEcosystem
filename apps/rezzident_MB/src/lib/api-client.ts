/**
 * API client for mobile — Axios with secure token injection.
 */

import axios, { type InternalAxiosRequestConfig } from 'axios';
import { secureStorage } from './secure-storage';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:7001/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ── Request Interceptor: Attach token from secure storage ──
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await secureStorage.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response Interceptor: Handle 401 refresh ──
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await secureStorage.getRefreshToken();
        if (!refreshToken) throw new Error('No refresh token');

        const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refresh_token: refreshToken,
        });

        const newTokens = data.data.tokens;
        await secureStorage.setTokens(
          newTokens.access_token,
          newTokens.refresh_token
        );

        originalRequest.headers.Authorization = `Bearer ${newTokens.access_token}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        await secureStorage.clearTokens();
        // TODO: Navigate to login screen
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
