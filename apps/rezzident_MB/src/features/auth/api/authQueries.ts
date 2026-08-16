import { apiClient } from '@/lib/api-client';
import type {
  ApiResponse,
  LoginResponse,
  RequestOtpPayload,
  VerifyOtpPayload,
  SetPinPayload,
  UserProfile,
} from '@rezzident/shared-types';

/**
 * Auth API layer — mirrors rezzident_FE/src/features/auth/api/authQueries.ts
 * but hits the phone/OTP/PIN endpoints the mobile flow uses (see
 * app/(auth)/login.tsx comment: "3-step flow: Phone -> OTP -> PIN").
 */
export async function requestOtp(payload: RequestOtpPayload): Promise<ApiResponse<null>> {
  const { data } = await apiClient.post<ApiResponse<null>>('/auth/request-otp', payload);
  return data;
}

export async function verifyOtp(payload: VerifyOtpPayload): Promise<ApiResponse<LoginResponse>> {
  const { data } = await apiClient.post<ApiResponse<LoginResponse>>('/auth/verify-otp', payload);
  return data;
}

export async function setPin(payload: SetPinPayload): Promise<ApiResponse<null>> {
  const { data } = await apiClient.post<ApiResponse<null>>('/auth/set-pin', payload);
  return data;
}

export async function loginWithPin(pin: string): Promise<ApiResponse<LoginResponse>> {
  const { data } = await apiClient.post<ApiResponse<LoginResponse>>('/auth/login-pin', { pin });
  return data;
}

export async function getCurrentUser(): Promise<ApiResponse<UserProfile>> {
  const { data } = await apiClient.get('/auth/me');
  return data;
}
