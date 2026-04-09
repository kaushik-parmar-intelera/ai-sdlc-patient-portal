import { create } from "zustand";

import type { AuthState, DemoAccount } from "../types/auth";

export const useAuthStore = create<AuthState>((set) => ({
  account: null,
  isAuthenticated: false,
  signIn: (account: DemoAccount) => set({ account, isAuthenticated: true }),
  signOut: () => set({ account: null, isAuthenticated: false }),
}));
