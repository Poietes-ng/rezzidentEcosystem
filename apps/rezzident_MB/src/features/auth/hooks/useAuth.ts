/**
 * Auth store — Zustand + secure storage.
 * Persists auth state to encrypted storage.
 */

import { create } from 'zustand';
import type { UserProfile, TokenResponse } from '@/types/api.types';
import { secureStorage } from '@/lib/secure-storage';

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  setAuth: (user: UserProfile, tokens: TokenResponse) => Promise<void>;
  logout: () => Promise<void>;
  loadFromStorage: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  setAuth: async (user, tokens) => {
    await secureStorage.setTokens(tokens.access_token, tokens.refresh_token);
    await secureStorage.setUserProfile(user);
    set({ user, isAuthenticated: true, isLoading: false });
  },

  logout: async () => {
    await secureStorage.clearAll();
    set({ user: null, isAuthenticated: false, isLoading: false });
  },

  loadFromStorage: async () => {
    try {
      const token = await secureStorage.getAccessToken();
      const profile = await secureStorage.getUserProfile();

      if (token && profile) {
        set({
          user: profile as UserProfile,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({ isLoading: false });
      }
    } catch {
      set({ isLoading: false });
    }
  },
}));
