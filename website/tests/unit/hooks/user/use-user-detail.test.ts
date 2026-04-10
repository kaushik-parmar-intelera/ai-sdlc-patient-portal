/**
 * Unit tests for useUserDetail() hook (T-UD05, T-UD06, T-UD07).
 * Mocks getUserDetail service, sonner toast, and next/navigation router.
 */

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import React from 'react';
import { toast } from 'sonner';

import { useUserDetail } from '@/hooks/user/use-user-detail';
import { mockUserDetailResponses } from '@/mocks/user/user-detail.mock';
import { getUserDetail } from '@/services/user/user-detail.service';

jest.mock('@/services/user/user-detail.service');
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

const mockGetUserDetail = getUserDetail as jest.MockedFunction<typeof getUserDetail>;

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, staleTime: 0 } },
  });
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(QueryClientProvider, { client: queryClient }, children);
  };
}

beforeEach(() => {
  jest.clearAllMocks();
});

// ── T-UD05: success toast ────────────────────────────────────────────────────

describe('T-UD05 — useUserDetail calls toast.success on first successful fetch', () => {
  it('fires toast.success with "Profile loaded successfully." when data resolves', async () => {
    mockGetUserDetail.mockResolvedValue(mockUserDetailResponses.success);

    const { result } = renderHook(() => useUserDetail(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(toast.success).toHaveBeenCalledWith('Profile loaded successfully.');
    expect(result.current.userDetail).toEqual(mockUserDetailResponses.success);
    expect(result.current.isError).toBe(false);
  });

  it('fires toast.success only once (not on re-renders)', async () => {
    mockGetUserDetail.mockResolvedValue(mockUserDetailResponses.success);

    const { result, rerender } = renderHook(() => useUserDetail(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    rerender();

    expect(toast.success).toHaveBeenCalledTimes(1);
  });
});

// ── T-UD06: INVALID_TOKEN toast + redirect ───────────────────────────────────

describe('T-UD06 — useUserDetail calls toast.error and redirects on INVALID_TOKEN', () => {
  it('fires toast.error with session message and pushes to /login', async () => {
    mockGetUserDetail.mockResolvedValue(mockUserDetailResponses.invalidToken);

    const { result } = renderHook(() => useUserDetail(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(toast.error).toHaveBeenCalledWith('Session expired. Please sign in again.');
    expect(mockPush).toHaveBeenCalledWith('/login');
    expect(result.current.userDetail).toBeUndefined();
    expect(result.current.isError).toBe(true);
  });
});

// ── T-UD07: NETWORK_ERROR toast ──────────────────────────────────────────────

describe('T-UD07 — useUserDetail calls toast.error on NETWORK_ERROR', () => {
  it('fires toast.error with retry message on NETWORK_ERROR', async () => {
    mockGetUserDetail.mockResolvedValue(mockUserDetailResponses.networkError);

    const { result } = renderHook(() => useUserDetail(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(toast.error).toHaveBeenCalledWith('Unable to load profile. Please try again.');
    expect(mockPush).not.toHaveBeenCalled();
    expect(result.current.userDetail).toBeUndefined();
    expect(result.current.isError).toBe(true);
  });

  it('fires toast.error with support message on USER_NOT_FOUND', async () => {
    mockGetUserDetail.mockResolvedValue(mockUserDetailResponses.userNotFound);

    const { result } = renderHook(() => useUserDetail(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(toast.error).toHaveBeenCalledWith(
      'User account not found. Please contact support.'
    );
    expect(mockPush).not.toHaveBeenCalled();
  });
});
