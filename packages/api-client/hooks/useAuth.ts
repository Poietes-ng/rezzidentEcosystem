// ──────────────────────────────────────────────────────────
// Auth hooks — React Query mutations for the auth flow
//
// Consumed by both rezzident_FE and rezzident_MB.
// Each hook wraps a single BE auth endpoint.
//
// Auth flow:
//   Registration: useRequestOTP → useVerifyOTP → useSetPIN
//   Login:        useRequestOTP → useVerifyOTP → useVerifyPIN
//   Session:      useRefreshToken, useLogout, useMe
// ──────────────────────────────────────────────────────────

import { useMutation, useQuery } from "@tanstack/react-query";
import { apiPost, apiGet, setAccessToken } from "../client";
import type {
  RequestOTPPayload,
  VerifyOTPPayload,
  SetPINPayload,
  VerifyPINPayload,
  RefreshTokenPayload,
  OTPResponseData,
  OTPVerifiedData,
  RegisterResponseData,
  LoginResponseData,
  RefreshResponseData,
  User,
} from "@rezzident/shared-types";

// ── Registration Flow ──

export function useRequestOTP() {
  return useMutation({
    mutationFn: (payload: RequestOTPPayload) =>
      apiPost<OTPResponseData>("/api/v1/auth/register/request-otp", payload),
  });
}

export function useVerifyOTP(purpose: "registration" | "login" = "registration") {
  const path =
    purpose === "login"
      ? "/api/v1/auth/login/verify-otp"
      : "/api/v1/auth/register/verify-otp";

  return useMutation({
    mutationFn: (payload: VerifyOTPPayload) =>
      apiPost<OTPVerifiedData>(path, payload),
  });
}

export function useSetPIN() {
  return useMutation({
    mutationFn: (payload: SetPINPayload) =>
      apiPost<RegisterResponseData>("/api/v1/auth/register/set-pin", payload),
    onSuccess: (data) => {
      // Auto-store access token after successful registration
      setAccessToken(data.tokens.access_token);
    },
  });
}

// ── Login Flow ──

export function useLoginRequestOTP() {
  return useMutation({
    mutationFn: (payload: RequestOTPPayload) =>
      apiPost<OTPResponseData>("/api/v1/auth/login/request-otp", payload),
  });
}

export function useVerifyPIN() {
  return useMutation({
    mutationFn: (payload: VerifyPINPayload) =>
      apiPost<LoginResponseData>("/api/v1/auth/login/verify-pin", payload),
    onSuccess: (data) => {
      setAccessToken(data.tokens.access_token);
    },
  });
}

// ── Token Management ──

export function useRefreshToken() {
  return useMutation({
    mutationFn: (payload: RefreshTokenPayload) =>
      apiPost<RefreshResponseData>("/api/v1/auth/refresh", payload),
    onSuccess: (data) => {
      setAccessToken(data.tokens.access_token);
    },
  });
}

export function useLogout() {
  return useMutation({
    mutationFn: () => apiPost<void>("/api/v1/auth/logout", {}),
    onSuccess: () => {
      setAccessToken(null);
    },
  });
}

// ── User Info ──

export function useMe(enabled = true) {
  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: () => apiGet<User>("/api/v1/auth/me"),
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  });
}
