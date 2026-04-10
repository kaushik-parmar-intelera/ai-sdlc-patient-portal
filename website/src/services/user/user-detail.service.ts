import { axiosClient } from '@/services/api/axios-client';
import type { UserDetailError, UserDetailSuccess } from '@/types/auth.types';

/**
 * Fetch the authenticated user's profile from the BFF proxy route.
 *
 * Calls GET /api/user/me (Next.js proxy).
 * The proxy reads the auth_session httpOnly cookie and forwards
 * Authorization: Bearer <accessToken> to GET /api/v1/users/me.
 * axiosClient interceptors unwrap the { success, data, error, meta } envelope.
 *
 * Never throws — always resolves with UserDetailSuccess or UserDetailError.
 *
 * @returns UserDetailSuccess on 200, UserDetailError on any failure
 */
export async function getUserDetail(): Promise<UserDetailSuccess | UserDetailError> {
  try {
    const data = await axiosClient.get<UserDetailSuccess>('/api/user/me');
    return data as unknown as UserDetailSuccess;
  } catch (err) {
    const detailError = err as UserDetailError;
    if (detailError.errorCode) return detailError;
    return {
      errorCode: 'NETWORK_ERROR',
      error: 'An unexpected error occurred. Please try again.',
    };
  }
}
