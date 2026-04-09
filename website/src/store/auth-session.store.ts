import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type TokenState = "missing" | "valid" | "expired";

export interface AuthUser {
  userId: string;
  name: string;
  email: string;
}

interface AuthSessionState {
  isAuthenticated: boolean;
  accessTokenState: TokenState;
  refreshTokenState: TokenState;
  user: AuthUser | null;
  lastAuthCheckAt: string;
  // Actions
  setAuthenticated: (user: AuthUser) => void;
  setLoggedOut: () => void;
}

export const useAuthSessionStore = create<AuthSessionState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      accessTokenState: "missing",
      refreshTokenState: "missing",
      user: null,
      lastAuthCheckAt: new Date().toISOString(),

      setAuthenticated: (user) =>
        set({
          isAuthenticated: true,
          accessTokenState: "valid",
          refreshTokenState: "valid",
          user,
          lastAuthCheckAt: new Date().toISOString(),
        }),

      setLoggedOut: () =>
        set({
          isAuthenticated: false,
          accessTokenState: "missing",
          refreshTokenState: "missing",
          user: null,
          lastAuthCheckAt: new Date().toISOString(),
        }),
    }),
    {
      name: "cc_auth_session",          // localStorage key
      storage: createJSONStorage(() => localStorage),
      // Only persist the data fields, not the action functions
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        accessTokenState: state.accessTokenState,
        refreshTokenState: state.refreshTokenState,
        user: state.user,
        lastAuthCheckAt: state.lastAuthCheckAt,
      }),
    }
  )
);

// Standalone helper — readable outside React components (e.g., middleware, utils)
export const getAuthState = () => useAuthSessionStore.getState();
