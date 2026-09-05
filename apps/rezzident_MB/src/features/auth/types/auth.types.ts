export type {
  User as UserProfile,
  TokenPair as TokenResponse,
  LoginResponseData as LoginResponse,
  RequestOTPPayload as RequestOtpPayload,
  VerifyOTPPayload as VerifyOtpPayload,
  SetPINPayload as SetPinPayload,
} from '@rezzident/shared-types'

export type AuthStep = 'phone' | 'otp' | 'pin'

export interface AuthFormState {
  phone: string
  otp: string
  pin: string
  confirmPin: string
  errors: Partial<Record<'phone' | 'otp' | 'pin' | 'confirmPin', string>>
}
