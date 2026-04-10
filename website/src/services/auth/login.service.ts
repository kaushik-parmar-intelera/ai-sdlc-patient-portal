import type { LoginInput } from '@/schemas/login.schema';
import { axiosClient } from '@/services/api/axios-client';
import type { LoginSuccess, LoginError } from '@/types/auth.types';

/**
 * Authenticate a user via the BFF proxy route.
 *
 * Posts { email, password } to /api/auth/login (Next.js proxy).
 * The proxy forwards to the real backend and sets the auth_session httpOnly cookie.
 * axiosClient interceptors unwrap the { success, data, error, meta } envelope.
 *
 * Never throws — always resolves with LoginSuccess or LoginError.
 *
 * @param input - { email, password } from login form
 * @returns LoginSuccess on 200, LoginError on any failure
 */
export async function loginUser(
  input: LoginInput
): Promise<LoginSuccess | LoginError> {
  try {
    const data = await axiosClient.post<LoginSuccess>('/api/auth/login', {
      email: input.email,
      password: input.password,
    });
    return data as unknown as LoginSuccess;
  } catch (err) {
    const loginError = err as LoginError;
    if (loginError.errorCode) return loginError;
    return {
      errorCode: 'NETWORK_ERROR',
      error: 'An unexpected error occurred. Please try again.',
    };
  }
}
