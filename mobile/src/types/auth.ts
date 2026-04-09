export type DemoAccount = {
  displayName: string;
  password: string;
  username: string;
};

export type AuthState = {
  account: DemoAccount | null;
  isAuthenticated: boolean;
  signIn: (account: DemoAccount) => void;
  signOut: () => void;
};
