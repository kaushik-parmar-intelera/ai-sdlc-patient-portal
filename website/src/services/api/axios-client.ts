import axios, { AxiosError } from 'axios';

import type { ApiEnvelope, RegistrationError } from '@/types/auth.types';

/** Generate a UUID v4 — works in Node.js test env (no crypto.randomUUID needed) */
function generateRequestId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Central axios instance for all API calls.
 * - Base URL: '/' (routes through Next.js proxy routes)
 * - Request interceptor: injects X-Request-ID and Content-Type
 * - Response interceptor: unwraps { success, data, error, meta } envelope
 * - Error interceptor: normalizes AxiosError → RegistrationError
 */
export const axiosClient = axios.create({
  baseURL: '/',
  headers: {
    'Content-Type': 'application/json',
  },
});

// ── Request interceptor: inject X-Request-ID ─────────────────────────────────
axiosClient.interceptors.request.use((config) => {
  config.headers['X-Request-ID'] = generateRequestId();
  config.headers['Content-Type'] = 'application/json';
  return config;
});

// ── Response interceptor: unwrap envelope ────────────────────────────────────
axiosClient.interceptors.response.use(
  (response) => {
    const envelope = response.data as ApiEnvelope<unknown>;

    if (envelope && typeof envelope === 'object' && 'success' in envelope) {
      if (envelope.success) {
        // Unwrap: return only the data payload
        return envelope.data as never;
      }

      // success: false — normalize to RegistrationError and throw
      const apiError = envelope.error;
      const normalized: RegistrationError = {
        errorCode: apiError?.code ?? 'SERVER_ERROR',
        error: apiError?.message ?? 'An unexpected error occurred.',
        field: apiError?.details?.[0]?.field,
      };
      return Promise.reject(normalized);
    }

    // Not an envelope — return raw response data
    return response.data as never;
  },

  // ── Error interceptor: map AxiosError → RegistrationError ──────────────────
  (error: AxiosError<ApiEnvelope<unknown>>) => {
    // Network error: request was sent but no response received (includes timeout)
    if (!error.response) {
      const networkError: RegistrationError = {
        errorCode: 'NETWORK_ERROR',
        error: 'Network error: Please check your internet connection and try again.',
      };
      return Promise.reject(networkError);
    }

    // HTTP error with a response body
    if (error.response?.data) {
      const envelope = error.response.data;

      if (envelope && typeof envelope === 'object' && 'error' in envelope && envelope.error) {
        const normalized: RegistrationError = {
          errorCode: envelope.error.code ?? 'SERVER_ERROR',
          error: envelope.error.message ?? 'An unexpected error occurred.',
          field: envelope.error.details?.[0]?.field,
        };
        return Promise.reject(normalized);
      }
    }

    // Fallback: unknown error shape
    const fallback: RegistrationError = {
      errorCode: 'SERVER_ERROR',
      error: 'An unexpected error occurred. Please try again.',
    };
    return Promise.reject(fallback);
  }
);
