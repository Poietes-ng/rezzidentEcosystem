// ──────────────────────────────────────────────────────────
// Auth types — mirrors the BE's api/v1/schemas/auth.py
//
// Used by: rezzident_FE, rezzident_MB, packages/api-client
// Source of truth: apps/rezzident_BE/api/v1/schemas/auth.py
// ──────────────────────────────────────────────────────────

// ── Generic API envelope (every BE response wraps data in this) ──

export interface APIEnvelope<T = unknown> {
  status: string;
  status_code: number;
  message: string;
  data: T;
}

// ── User roles (matches BE UserRole enum) ──

export type UserRole =
  | "SUPER_ADMIN"
  | "ADMIN"
  | "TREASURER"
  | "ADMIN_SECRETARY"
  | "SECRETARY"
  | "SECURITY"
  | "RESIDENT";

export type VerificationTier =
  "PRE_VERIFIED" | "SELF_REGISTERED" | "NIN_VERIFIED";

// ── User ──

export interface User {
  id: string;
  phone_number: string;
  full_name: string | null;
  email: string | null;
  role: UserRole;
  house_number: string | null;
  profile_image: string | null;
  verification_tier: VerificationTier | null;
  dashboard_tier?: string | null;
  is_primary_holder?: boolean;
}

// ── Tokens ──

export interface TokenPair {
  access_token: string;
  refresh_token: string;
  token_type: "bearer";
  expires_in: number; // seconds
}

// ── Registration flow request payloads ──

export interface RequestOTPPayload {
  phone_number: string;
  purpose?: "registration" | "login";
}

export interface VerifyOTPPayload {
  phone_number: string;
  otp_code: string;
}

export interface SetPINPayload {
  phone_number: string;
  pin: string;
  confirm_pin: string;
  full_name?: string;
  estate_code?: string;
}

// ── Login flow request payloads ──

export interface VerifyPINPayload {
  phone_number: string;
  pin: string;
}

export interface RefreshTokenPayload {
  refresh_token: string;
}

export interface AdminLoginPayload {
  email: string;
  password: string;
  otp_code?: string;
}

// ── Response data shapes (unwrapped from APIEnvelope) ──

export interface OTPResponseData {
  phone_number: string;
  expires_in_seconds: number;
}

export interface OTPVerifiedData {
  phone_number: string;
  verified: boolean;
  requires_pin?: boolean;
}

export interface RegisterResponseData {
  user: User;
  tokens: TokenPair;
}

export interface LoginResponseData {
  user: User;
  tokens: TokenPair;
}

export interface RefreshResponseData {
  tokens: TokenPair;
}
