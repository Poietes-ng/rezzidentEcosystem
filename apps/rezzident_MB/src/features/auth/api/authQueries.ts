import { apiClient } from '@/lib/api-client'
import type {
  APIEnvelope,
  LoginResponseData,
  OTPVerifiedData,
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
  const endpoint =
    payload.purpose === 'login' ? '/auth/login/request-otp' : '/auth/register/request-otp'
  const { data } = await apiClient.post<APIEnvelope<null>>(endpoint, payload)
  return data
}

export async function verifyOtp(
  payload: VerifyOTPPayload & { purpose?: 'registration' | 'login' },
): Promise<APIEnvelope<OTPVerifiedData>> {
  // Mirror the same dynamic endpoint pattern used by requestOtp.
  // /auth/login/verify-otp    — existing user verifying OTP during login
  // /auth/register/verify-otp — new user verifying OTP during registration (returns OTPVerifiedData)
  const { purpose, ...body } = payload
  const endpoint =
    purpose === 'login' ? '/auth/login/verify-otp' : '/auth/register/verify-otp'
  const { data } = await apiClient.post<APIEnvelope<OTPVerifiedData>>(endpoint, body)
  return data
}

export async function setPin(payload: SetPINPayload): Promise<APIEnvelope<LoginResponseData>> {
  // /auth/register/set-pin issues user details + auth tokens on success.
  const { data } = await apiClient.post<APIEnvelope<LoginResponseData>>(
    '/auth/register/set-pin',
    payload,
  )
  return data
}

// Note: If the backend requires phone_number, you will need to add it to this payload later.
export async function loginWithPin(
  pin: string,
  phone_number?: string,
): Promise<APIEnvelope<LoginResponseData>> {
  const { data } = await apiClient.post<APIEnvelope<LoginResponseData>>('/auth/login/verify-pin', {
    pin,
    phone_number,
  })
  return data
}

export async function getCurrentUser(): Promise<APIEnvelope<User>> {
  const { data } = await apiClient.get('/auth/me')
  return data
}
