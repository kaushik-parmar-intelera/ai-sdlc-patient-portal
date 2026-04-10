import type { UserDetailError, UserDetailSuccess } from '@/types/auth.types';

export const mockUserDetailResponses = {
  success: {
    id: '15021486-50ff-449f-8c11-94d47adf46ef',
    email: 'kaushik@healthcare.com',
    firstName: 'Kaushik',
    lastName: 'Parmar',
    role: 'Patient',
    isActive: true,
  } as UserDetailSuccess,

  invalidToken: {
    errorCode: 'INVALID_TOKEN',
    error: 'Token is invalid or expired',
  } as UserDetailError,

  userNotFound: {
    errorCode: 'USER_NOT_FOUND',
    error: 'User not found',
  } as UserDetailError,

  networkError: {
    errorCode: 'NETWORK_ERROR',
    error: 'Network error: Please check your internet connection and try again.',
  } as UserDetailError,

  serverError: {
    errorCode: 'SERVER_ERROR',
    error: 'An unexpected error occurred. Please try again.',
  } as UserDetailError,
};
