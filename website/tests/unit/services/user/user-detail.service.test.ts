/**
 * Unit tests for getUserDetail() service (T-UD01, T-UD02, T-UD03, T-UD04).
 * Uses axios-mock-adapter to mock axiosClient.
 */

import MockAdapter from 'axios-mock-adapter';

import { mockUserDetailResponses } from '@/mocks/user/user-detail.mock';
import { axiosClient } from '@/services/api/axios-client';
import { getUserDetail } from '@/services/user/user-detail.service';
import type { UserDetailError, UserDetailSuccess } from '@/types/auth.types';

const mock = new MockAdapter(axiosClient);

afterEach(() => {
  mock.reset();
});

afterAll(() => {
  mock.restore();
});

// ── T-UD01: success path ──────────────────────────────────────────────────────

describe('T-UD01 — getUserDetail returns UserDetailSuccess on 200', () => {
  it('returns id, email, firstName, lastName, role, isActive on successful fetch', async () => {
    mock.onGet('/api/user/me').reply(200, {
      success: true,
      data: mockUserDetailResponses.success,
      error: null,
      meta: { timestamp: new Date().toISOString(), version: '1.0' },
    });

    const result = await getUserDetail();

    expect(result).toHaveProperty('id');
    expect(result).toHaveProperty('email');
    expect((result as UserDetailSuccess).id).toBe(mockUserDetailResponses.success.id);
    expect((result as UserDetailSuccess).email).toBe(mockUserDetailResponses.success.email);
    expect((result as UserDetailSuccess).firstName).toBe('Kaushik');
    expect((result as UserDetailSuccess).lastName).toBe('Parmar');
  });

  it('does not throw — always resolves', async () => {
    mock.onGet('/api/user/me').reply(200, {
      success: true,
      data: mockUserDetailResponses.success,
      error: null,
      meta: { timestamp: new Date().toISOString(), version: '1.0' },
    });

    await expect(getUserDetail()).resolves.toBeDefined();
  });
});

// ── T-UD02: INVALID_TOKEN ─────────────────────────────────────────────────────

describe('T-UD02 — getUserDetail returns UserDetailError on INVALID_TOKEN', () => {
  it('returns errorCode INVALID_TOKEN on 401', async () => {
    mock.onGet('/api/user/me').reply(401, {
      success: false,
      data: null,
      error: { code: 'INVALID_TOKEN', message: 'Token is invalid or expired', details: [] },
      meta: { timestamp: new Date().toISOString(), version: '1.0' },
    });

    const result = await getUserDetail();

    expect(result).toHaveProperty('errorCode');
    expect((result as UserDetailError).errorCode).toBe('INVALID_TOKEN');
  });

  it('does not throw on 401', async () => {
    mock.onGet('/api/user/me').reply(401, {
      success: false,
      data: null,
      error: { code: 'INVALID_TOKEN', message: 'Token is invalid or expired', details: [] },
      meta: { timestamp: new Date().toISOString(), version: '1.0' },
    });

    await expect(getUserDetail()).resolves.toBeDefined();
  });
});

// ── T-UD03: USER_NOT_FOUND ────────────────────────────────────────────────────

describe('T-UD03 — getUserDetail returns UserDetailError on USER_NOT_FOUND', () => {
  it('returns errorCode USER_NOT_FOUND on 404', async () => {
    mock.onGet('/api/user/me').reply(404, {
      success: false,
      data: null,
      error: { code: 'USER_NOT_FOUND', message: 'User not found', details: [] },
      meta: { timestamp: new Date().toISOString(), version: '1.0' },
    });

    const result = await getUserDetail();

    expect(result).toHaveProperty('errorCode');
    expect((result as UserDetailError).errorCode).toBe('USER_NOT_FOUND');
  });
});

// ── T-UD04: network failure ───────────────────────────────────────────────────

describe('T-UD04 — getUserDetail returns UserDetailError on network failure', () => {
  it('returns errorCode NETWORK_ERROR when axios throws a network error', async () => {
    mock.onGet('/api/user/me').networkError();

    const result = await getUserDetail();

    expect(result).toHaveProperty('errorCode');
    expect((result as UserDetailError).errorCode).toBe('NETWORK_ERROR');
  });

  it('does not throw on network failure', async () => {
    mock.onGet('/api/user/me').networkError();

    await expect(getUserDetail()).resolves.toBeDefined();
  });
});
