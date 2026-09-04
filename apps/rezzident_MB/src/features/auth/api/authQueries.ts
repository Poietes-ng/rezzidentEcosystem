import { apiClient } from '@/lib/api-client'
import type {
  APIEnvelope,
  LoginResponseData,
  RequestOTPPayload,
  VerifyOTPPayload,
  SetPINPayload,
  User,
} from '@rezzident/shared-types'

/**
 * Auth API layer — mirrors rezzident_FE/src/features/auth/api/authQueries.ts
 * but hits the phone/OTP/PIN endpoints the mobile flow uses (see
 * app/(auth)/login.tsx comment: "3-step flow: Phone -> OTP -> PIN").
 */
export async function requestOtp(payload: RequestOTPPayload): Promise<APIEnvelope<null>> {
  const { data } = await apiClient.post<APIEnvelope<null>>('/auth/request-otp', payload)
  return data
}

export async function verifyOtp(
  payload: VerifyOTPPayload,
): Promise<APIEnvelope<LoginResponseData>> {
  const { data } = await apiClient.post<APIEnvelope<LoginResponseData>>('/auth/verify-otp', payload)
  return data
}

export async function setPin(payload: SetPINPayload): Promise<APIEnvelope<null>> {
  const { data } = await apiClient.post<APIEnvelope<null>>('/auth/set-pin', payload)
  return data
}

export async function loginWithPin(pin: string): Promise<APIEnvelope<LoginResponseData>> {
  const { data } = await apiClient.post<APIEnvelope<LoginResponseData>>('/auth/login-pin', { pin })
  return data
}

export async function getCurrentUser(): Promise<APIEnvelope<User>> {
  const { data } = await apiClient.get('/auth/me')
  return data
}
