import { create } from "zustand";

export type TokenState = "missing" | "valid" | "expired";

interface AuthSessionState {
  isAuthenticated: boolean;
  accessTokenState: TokenState;
  refreshTokenState: TokenState;
  userId: string | null;
  lastAuthCheckAt: string;
  setAuthenticated: (userId: string) => void;
  setLoggedOut: () => void;
}

export const useAuthSessionStore = create<AuthSessionState>((set) => ({
  isAuthenticated: false,
  accessTokenState: "missing",
  refreshTokenState: "missing",
  userId: null,
  lastAuthCheckAt: new Date().toISOString(),
  setAuthenticated: (userId) =>
    set({
      isAuthenticated: true,
      accessTokenState: "valid",
      refreshTokenState: "valid",
      userId,
      lastAuthCheckAt: new Date().toISOString(),
    }),
  setLoggedOut: () =>
    set({
      isAuthenticated: false,
      accessTokenState: "missing",
      refreshTokenState: "missing",
      userId: null,
      lastAuthCheckAt: new Date().toISOString(),
    }),
}));
