export type DemoAccount = {
  displayName: string;
  email: string;
  password: string;
};

export type AuthState = {
  account: DemoAccount | null;
  isAuthenticated: boolean;
  signIn: (account: DemoAccount) => void;
  signOut: () => void;
};
