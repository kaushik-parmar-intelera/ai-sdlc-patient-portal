/**
 * Authentication-related type definitions
 * Covers registration input, API responses, and form states
 */

/**
 * User input from registration form (client-side)
 * Validated by Zod schema before submission
 */
export interface RegistrationInput {
  firstName: string;
  lastName: string;
  email: string;
  medicalId: string;
  password: string;
  terms: boolean;
}

/**
 * Successful registration response from server (HTTP 201 Created)
 */
export interface RegistrationSuccess {
  userId: string;
  email: string;
  message: string;
}

/**
 * Error response from server (HTTP 400, 409, 500, etc.)
 * Includes user-friendly message and machine-readable error code
 */
export interface RegistrationError {
  error: string;
  errorCode: string;
  field?: string;
}

/**
 * Form submission state tracking
 * Used to manage UI feedback during registration flow
 */
export type FormState = 'idle' | 'submitting' | 'success' | 'error';

/**
 * Type guard to check if response is a success
 */
export function isRegistrationSuccess(
  response: RegistrationSuccess | RegistrationError
): response is RegistrationSuccess {
  return 'userId' in response && !('errorCode' in response);
}

/**
 * Type guard to check if response is an error
 */
export function isRegistrationError(
  response: RegistrationSuccess | RegistrationError
): response is RegistrationError {
  return 'errorCode' in response;
}
