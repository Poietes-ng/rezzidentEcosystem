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
  const endpoint =
    payload.purpose === 'login' ? '/auth/login/request-otp' : '/auth/register/request-otp'
  const { data } = await apiClient.post<APIEnvelope<null>>(endpoint, payload)
  return data
}

export async function verifyOtp(
  payload: VerifyOTPPayload,
): Promise<APIEnvelope<LoginResponseData>> {
  // We default to register/verify-otp as per suggestion, though ideally it should be dynamic
  const { data } = await apiClient.post<APIEnvelope<LoginResponseData>>(
    '/auth/register/verify-otp',
    payload,
  )
  return data
}

export async function setPin(payload: SetPINPayload): Promise<APIEnvelope<null>> {
  const { data } = await apiClient.post<APIEnvelope<null>>('/auth/register/set-pin', payload)
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
