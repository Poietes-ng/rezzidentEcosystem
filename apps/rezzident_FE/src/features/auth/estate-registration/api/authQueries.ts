import type { User, LoginPayload, RegisterPayload } from '../types/auth.types'
import type { ApiResponse } from '#/shared/types/api.types'
import { apiClient } from '#/shared/lib/apiClient'

/**
 * Auth API layer — all authentication-related calls to the FastAPI backend.
 * Uses the shared apiClient instance for consistent error handling and base URL.
 */

export async function login(payload: LoginPayload): Promise<ApiResponse<User>> {
  return apiClient.post<ApiResponse<User>>('/api/v1/auth/login', payload)
}

export async function register(payload: RegisterPayload): Promise<ApiResponse<User>> {
  return apiClient.post<ApiResponse<User>>('/api/v1/auth/register', payload)
}

export async function logout(): Promise<void> {
  await apiClient.post('/api/v1/auth/logout')
}

export async function getCurrentUser(): Promise<ApiResponse<User>> {
  return apiClient.get<ApiResponse<User>>('/api/v1/auth/me')
}
