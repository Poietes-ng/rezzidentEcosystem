/**
 * Secure storage wrapper — uses expo-secure-store for auth tokens.
 *
 * Tokens are encrypted at rest on both iOS (Keychain) and Android (EncryptedSharedPreferences).
 */

import * as SecureStore from 'expo-secure-store';

const KEYS = {
  ACCESS_TOKEN: 'rezzident_access_token',
  REFRESH_TOKEN: 'rezzident_refresh_token',
  USER_PROFILE: 'rezzident_user_profile',
  PIN_SET: 'rezzident_pin_set',
  BIOMETRICS_ENABLED: 'rezzident_biometrics_enabled',
} as const;

export const secureStorage = {
  // ── Tokens ──
  async setTokens(accessToken: string, refreshToken: string): Promise<void> {
    await SecureStore.setItemAsync(KEYS.ACCESS_TOKEN, accessToken);
    await SecureStore.setItemAsync(KEYS.REFRESH_TOKEN, refreshToken);
  },

  async getAccessToken(): Promise<string | null> {
    return SecureStore.getItemAsync(KEYS.ACCESS_TOKEN);
  },

  async getRefreshToken(): Promise<string | null> {
    return SecureStore.getItemAsync(KEYS.REFRESH_TOKEN);
  },

  async clearTokens(): Promise<void> {
    await SecureStore.deleteItemAsync(KEYS.ACCESS_TOKEN);
    await SecureStore.deleteItemAsync(KEYS.REFRESH_TOKEN);
  },

  // ── User Profile ──
  async setUserProfile(profile: object): Promise<void> {
    await SecureStore.setItemAsync(KEYS.USER_PROFILE, JSON.stringify(profile));
  },

  async getUserProfile(): Promise<object | null> {
    const raw = await SecureStore.getItemAsync(KEYS.USER_PROFILE);
    return raw ? JSON.parse(raw) : null;
  },

  // ── Biometrics ──
  async setBiometricsEnabled(enabled: boolean): Promise<void> {
    await SecureStore.setItemAsync(
      KEYS.BIOMETRICS_ENABLED,
      enabled ? 'true' : 'false'
    );
  },

  async isBiometricsEnabled(): Promise<boolean> {
    const raw = await SecureStore.getItemAsync(KEYS.BIOMETRICS_ENABLED);
    return raw === 'true';
  },

  // ── Clear All ──
  async clearAll(): Promise<void> {
    await Promise.all(
      Object.values(KEYS).map((key) => SecureStore.deleteItemAsync(key))
    );
  },
};
