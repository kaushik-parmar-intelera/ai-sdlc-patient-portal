export type UserAccount = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
  role: string;
};

export type AuthState = {
  account: UserAccount | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  signIn: (account: UserAccount, accessToken: string, refreshToken: string) => void;
  signOut: () => void;
};

export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    isActive: boolean;
  };
};

export type RegisterResponse = {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  message: string;
};

export type ApiResponse<T> = {
  success: boolean;
  data: T | null;
  error?: {
    code: string;
    message: string;
    details?: { field: string; reason: string }[];
  };
  meta: { timestamp: string; version: string };
};
