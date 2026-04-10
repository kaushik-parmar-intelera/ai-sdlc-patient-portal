import { create } from "zustand";

import { setAuthToken } from "../lib/api-client";
import type { AuthState, UserAccount } from "../types/auth";

export const useAuthStore = create<AuthState>((set) => ({
  account: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  signIn: (account: UserAccount, accessToken: string, refreshToken: string) => {
    setAuthToken(accessToken);
    set({ account, accessToken, refreshToken, isAuthenticated: true });
  },
  signOut: () => {
    setAuthToken(null);
    set({ account: null, accessToken: null, refreshToken: null, isAuthenticated: false });
  },
}));
