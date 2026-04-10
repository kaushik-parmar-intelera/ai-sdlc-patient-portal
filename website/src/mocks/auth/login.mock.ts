import { LoginSuccess, LoginError } from '@/types/auth.types';

export const validLoginInput = {
  email: 'kaushik@healthcare.com',
  password: 'Test@123',
};

export const mockLoginResponses = {
  success: {
    accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock-access-token',
    refreshToken: 'mock-refresh-token-opaque',
    expiresIn: 3600,
    user: {
      id: '15021486-50ff-449f-8c11-94d47adf46ef',
      email: 'kaushik@healthcare.com',
      firstName: 'Kaushik',
      lastName: 'Parmar',
      role: 'Patient',
      isActive: true,
    },
  } as LoginSuccess,

  invalidCredentials: {
    errorCode: 'INVALID_CREDENTIALS',
    error: 'Incorrect email or password. Please try again.',
  } as LoginError,

  serverError: {
    errorCode: 'SERVER_ERROR',
    error: 'Unable to sign in. Please try again later.',
  } as LoginError,

  networkError: {
    errorCode: 'NETWORK_ERROR',
    error: 'An unexpected error occurred. Please try again.',
  } as LoginError,
};
