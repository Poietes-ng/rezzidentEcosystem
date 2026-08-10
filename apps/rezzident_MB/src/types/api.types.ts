/**
 * API types — shared with web frontend.
 * Mirrors backend envelope: { status_code, success, message, data }
 */

export interface ApiResponse<T = unknown> {
  status_code: number;
  success: boolean;
  message: string;
  data?: T;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export interface UserProfile {
  id: string;
  phone_number: string;
  full_name: string | null;
  email: string | null;
  role: string;
  house_number: string | null;
  profile_image: string | null;
  verification_tier: string | null;
  is_primary_holder: boolean;
}

export interface LoginResponse {
  user: UserProfile;
  tokens: TokenResponse;
}
