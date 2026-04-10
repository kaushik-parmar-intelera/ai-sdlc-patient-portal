/**
 * TDD component tests for LoginForm — T-L04 through T-L09.
 * Written FIRST (Red phase) — tests must fail before T011 implementation.
 *
 * Tests cover:
 * T-L04: form fields render correctly
 * T-L05: toast.success on LoginSuccess
 * T-L06: toast.error on INVALID_CREDENTIALS
 * T-L07: toast.error on NETWORK_ERROR
 * T-L08: loginUser NOT called when email is empty
 * T-L09: Zustand store isAuthenticated = true after success
 */

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
// Mock the login service so we can control responses
jest.mock('@/services/auth/login.service');
// Mock sonner toast
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
  Toaster: () => null,
}));

import { toast } from 'sonner';

import { LoginForm } from '@/components/molecules/login-form';
import { mockLoginResponses } from '@/mocks/auth/login.mock';
import { loginUser } from '@/services/auth/login.service';
import { useAuthSessionStore } from '@/store/auth-session.store';

const mockLoginUser = loginUser as jest.MockedFunction<typeof loginUser>;
const mockToastSuccess = toast.success as jest.MockedFunction<typeof toast.success>;
const mockToastError = toast.error as jest.MockedFunction<typeof toast.error>;

async function fillAndSubmitForm(email = 'kaushik@healthcare.com', password = 'Test@123') {
  const user = userEvent.setup();
  if (email) await user.type(screen.getByLabelText(/institutional email/i), email);
  if (password) await user.type(screen.getByLabelText(/security key/i), password);
  await user.click(screen.getByRole('button', { name: /sign in/i }));
}

beforeEach(() => {
  jest.clearAllMocks();
  // Reset Zustand store
  useAuthSessionStore.getState().setLoggedOut();
});

// ── T-L04: form renders ───────────────────────────────────────────────────────

describe('T-L04 — LoginForm renders required fields', () => {
  it('renders email input with label "Institutional Email"', () => {
    render(<LoginForm />);
    expect(screen.getByLabelText(/institutional email/i)).toBeInTheDocument();
  });

  it('renders password input with label "Security Key"', () => {
    render(<LoginForm />);
    expect(screen.getByLabelText(/security key/i)).toBeInTheDocument();
  });

  it('renders a submit button', () => {
    render(<LoginForm />);
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });
});

// ── T-L05: success toast ──────────────────────────────────────────────────────

describe('T-L05 — shows toast.success on LoginSuccess', () => {
  it('calls toast.success with "Signed in successfully!" when loginUser resolves LoginSuccess', async () => {
    mockLoginUser.mockResolvedValueOnce(mockLoginResponses.success);
    render(<LoginForm />);

    await fillAndSubmitForm();

    await waitFor(() => {
      expect(mockToastSuccess).toHaveBeenCalledWith('Signed in successfully!');
    });
  });

  it('calls onSuccess callback after successful login', async () => {
    mockLoginUser.mockResolvedValueOnce(mockLoginResponses.success);
    const onSuccess = jest.fn();
    render(<LoginForm onSuccess={onSuccess} />);

    await fillAndSubmitForm();

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalled();
    });
  });
});

// ── T-L06: INVALID_CREDENTIALS toast ─────────────────────────────────────────

describe('T-L06 — shows toast.error on INVALID_CREDENTIALS', () => {
  it('calls toast.error with credentials message when loginUser returns INVALID_CREDENTIALS', async () => {
    mockLoginUser.mockResolvedValueOnce(mockLoginResponses.invalidCredentials);
    render(<LoginForm />);

    await fillAndSubmitForm();

    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith(
        'Incorrect email or password. Please try again.'
      );
    });
  });
});

// ── T-L07: NETWORK_ERROR toast ────────────────────────────────────────────────

describe('T-L07 — shows toast.error on NETWORK_ERROR', () => {
  it('calls toast.error with network message when loginUser returns NETWORK_ERROR', async () => {
    mockLoginUser.mockResolvedValueOnce(mockLoginResponses.networkError);
    render(<LoginForm />);

    await fillAndSubmitForm();

    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith(
        'Network error: Please check your internet connection and try again.'
      );
    });
  });
});

// ── T-L08: no API call when email is empty ────────────────────────────────────

describe('T-L08 — loginUser NOT called when email is empty', () => {
  it('does not call loginUser when email field is empty on submit', async () => {
    mockLoginUser.mockResolvedValueOnce(mockLoginResponses.success);
    render(<LoginForm />);

    // Submit without filling email
    await fillAndSubmitForm('', 'Test@123');

    await waitFor(() => {
      expect(mockLoginUser).not.toHaveBeenCalled();
    });
  });
});

// ── T-L09: Zustand store populated after login ────────────────────────────────

describe('T-L09 — Zustand store isAuthenticated after login', () => {
  it('sets isAuthenticated to true in store after successful login', async () => {
    mockLoginUser.mockResolvedValueOnce(mockLoginResponses.success);
    render(<LoginForm />);

    await fillAndSubmitForm();

    await waitFor(() => {
      expect(useAuthSessionStore.getState().isAuthenticated).toBe(true);
    });
  });

  it('stores correct user data with UUID (not email) as userId', async () => {
    mockLoginUser.mockResolvedValueOnce(mockLoginResponses.success);
    render(<LoginForm />);

    await fillAndSubmitForm();

    await waitFor(() => {
      const { user } = useAuthSessionStore.getState();
      expect(user?.userId).toBe(mockLoginResponses.success.user.id);
      expect(user?.email).toBe(mockLoginResponses.success.user.email);
      expect(user?.name).toBe(
        `${mockLoginResponses.success.user.firstName} ${mockLoginResponses.success.user.lastName}`.trim()
      );
    });
  });
});
