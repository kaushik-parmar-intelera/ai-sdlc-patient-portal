import type { RegistrationInput, RegistrationSuccess, RegistrationError } from '@/types/auth.types';

/**
 * Configuration for retry logic
 */
const RETRY_CONFIG = {
  maxAttempts: 3,
  delays: [0, 2000, 5000], // Exponential backoff: immediate, 2s, 5s
};

/**
 * HTTP status codes that should trigger a retry
 */
const RETRYABLE_STATUS_CODES = new Set([408, 429, 500, 502, 503, 504]);

/**
 * Call the registration API endpoint with error handling and exponential backoff retry
 *
 * @param input - Registration form data (fullName, email, password)
 * @returns Either RegistrationSuccess or RegistrationError
 * @throws Never - always returns a response object (success or error)
 *
 * Features:
 * - POST to /api/auth/register with JSON request body
 * - Exponential backoff retry on network failures:
 *   - Attempt 1: Immediate (0ms delay)
 *   - Attempt 2: After 2000ms
 *   - Attempt 3: After 5000ms
 * - Returns typed RegistrationSuccess on 201
 * - Returns typed RegistrationError for 4xx/5xx responses
 * - Returns NETWORK_ERROR on network failures after all retries
 * - All client-side errors (NETWORK_ERROR) logged to console
 *
 * Success Response (201):
 *   { userId: string, email: string, message?: string }
 *
 * Error Responses:
 *   - 400 (INVALID_INPUT): Validation errors from server
 *   - 409 (EMAIL_EXISTS): Email already registered
 *   - 500 (SERVER_ERROR): Unexpected server error
 *   - Network: NETWORK_ERROR with retry attempts exhausted
 *
 * @example
 * const result = await registerUser({
 *   fullName: 'John Doe',
 *   email: 'john@example.com',
 *   password: 'SecurePass123!'
 * });
 *
 * if (result.errorCode) {
 *   // Handle error
 * } else {
 *   // Handle success
 *   console.log('User created:', result.userId);
 * }
 */
export async function registerUser(
  input: RegistrationInput
): Promise<RegistrationSuccess | RegistrationError> {
  const { maxAttempts, delays } = RETRY_CONFIG;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(input),
      });

      // Parse response body
      let data: RegistrationSuccess | RegistrationError;
      try {
        data = await response.json();
      } catch {
        return {
          errorCode: 'SERVER_ERROR',
          error: 'Unable to parse server response. Please try again later.',
        };
      }

      // Check if response is retryable based on status code
      const isRetryable = RETRYABLE_STATUS_CODES.has(response.status);

      if (!response.ok) {
        // Non-2xx response
        if (isRetryable && attempt < maxAttempts - 1) {
          // Retry on server errors (5xx) and specific 4xx codes (429, 408)
          const delay = delays[attempt];
          if (delay > 0) {
            await new Promise((resolve) => setTimeout(resolve, delay));
          }
          continue;
        }

        // Return error (either non-retryable or final attempt)
        return data;
      }

      // Success (2xx response)
      return data;
    } catch (err) {
      // Network error (fetch error, timeout, etc.)
      const isLastAttempt = attempt === maxAttempts - 1;

      if (!isLastAttempt) {
        // Retry on network error
        const delay = delays[attempt];
        if (delay > 0) {
          console.warn(
            `Registration request attempt ${attempt + 1} failed, retrying in ${delay}ms...`
          );
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
        continue;
      }

      // Final attempt - return NETWORK_ERROR
      console.error(
        `Registration request failed after ${maxAttempts} attempts. Last error:`,
        err
      );

      return {
        errorCode: 'NETWORK_ERROR',
        error: 'Network error: Please check your internet connection and try again.',
      };
    }
  }

  // Should never reach here (covered by loop logic above)
  return {
    errorCode: 'NETWORK_ERROR',
    error: 'An unexpected error occurred. Please try again.',
  };
}
