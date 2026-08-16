export type { UserProfile, TokenResponse, LoginResponse, RequestOtpPayload, VerifyOtpPayload, SetPinPayload } from '@rezzident/shared-types';

export type AuthStep = 'phone' | 'otp' | 'pin';

export interface AuthFormState {
  phone: string;
  otp: string;
  pin: string;
  confirmPin: string;
  errors: Partial<Record<'phone' | 'otp' | 'pin' | 'confirmPin', string>>;
}
