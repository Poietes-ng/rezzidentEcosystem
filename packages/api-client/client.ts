// ──────────────────────────────────────────────────────────
// API client — typed fetch wrapper for rezzident_BE
//
// Works in both web (Vite → import.meta.env) and React Native
// (process.env via Expo's dotenv plugin).
// ──────────────────────────────────────────────────────────

import type { APIEnvelope } from "@rezzident/shared-types";

/** Resolve the base URL from the environment. */
function getBaseUrl(): string {
  // Vite (rezzident_FE)
  if (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  // React Native / Node (rezzident_MB)
  if (typeof process !== "undefined" && process.env?.API_URL) {
    return process.env.API_URL;
  }
  // Fallback for dev
  return "http://localhost:7001";
}

/** In-memory token store — apps override this with their own storage. */
let _accessToken: string | null = null;

export function setAccessToken(token: string | null) {
  _accessToken = token;
}

export function getAccessToken(): string | null {
  return _accessToken;
}

/**
 * Typed fetch wrapper that:
 * 1. Prepends the API base URL
 * 2. Attaches Authorization header if a token is set
 * 3. Unwraps the APIEnvelope and returns `.data`
 * 4. Throws with the BE's error message on non-2xx responses
 */
export async function apiFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const baseUrl = getBaseUrl();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init?.headers as Record<string, string>),
  };

  if (_accessToken) {
    headers["Authorization"] = `Bearer ${_accessToken}`;
  }

  const res = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers,
  });

  const json: APIEnvelope<T> = await res.json();

  if (!res.ok) {
    throw new Error(json.message || `API error ${res.status}`);
  }

  return json.data;
}

/**
 * POST helper — stringifies the body automatically.
 */
export async function apiPost<T>(
  path: string,
  body: unknown,
  init?: RequestInit,
): Promise<T> {
  return apiFetch<T>(path, {
    method: "POST",
    body: JSON.stringify(body),
    ...init,
  });
}

/**
 * GET helper.
 */
export async function apiGet<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  return apiFetch<T>(path, { method: "GET", ...init });
}
