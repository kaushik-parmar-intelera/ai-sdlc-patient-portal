/**
 * Unit tests for loginUser() service (T-L01, T-L02, T-L03).
 * Uses axios-mock-adapter to mock axiosClient.
 */

import MockAdapter from 'axios-mock-adapter';

import { validLoginInput, mockLoginResponses } from '@/mocks/auth/login.mock';
import { axiosClient } from '@/services/api/axios-client';
import { loginUser } from '@/services/auth/login.service';
import type { LoginError, LoginSuccess } from '@/types/auth.types';

const mock = new MockAdapter(axiosClient);

afterEach(() => {
  mock.reset();
});

afterAll(() => {
  mock.restore();
});

// ── T-L01: success path ───────────────────────────────────────────────────────

describe('T-L01 — loginUser returns LoginSuccess on 200', () => {
  it('returns accessToken and user data on successful login', async () => {
    mock.onPost('/api/auth/login').reply(200, {
      success: true,
      data: mockLoginResponses.success,
      error: null,
      meta: { timestamp: new Date().toISOString(), version: '1.0' },
    });

    const result = await loginUser(validLoginInput);

    expect(result).toHaveProperty('accessToken');
    expect(result).toHaveProperty('user');
    expect((result as LoginSuccess).accessToken).toBe(mockLoginResponses.success.accessToken);
    expect((result as LoginSuccess).user.id).toBe(mockLoginResponses.success.user.id);
    expect((result as LoginSuccess).user.email).toBe(validLoginInput.email);
  });

  it('does not throw — always resolves', async () => {
    mock.onPost('/api/auth/login').reply(200, {
      success: true,
      data: mockLoginResponses.success,
      error: null,
      meta: { timestamp: new Date().toISOString(), version: '1.0' },
    });

    await expect(loginUser(validLoginInput)).resolves.toBeDefined();
  });

  it('sends POST to /api/auth/login with email and password', async () => {
    mock.onPost('/api/auth/login').reply(200, {
      success: true,
      data: mockLoginResponses.success,
      error: null,
      meta: { timestamp: new Date().toISOString(), version: '1.0' },
    });

    await loginUser(validLoginInput);

    const requestBody = JSON.parse(mock.history.post[0].data as string);
    expect(requestBody).toEqual({ email: validLoginInput.email, password: validLoginInput.password });
  });
});

// ── T-L02: INVALID_CREDENTIALS ────────────────────────────────────────────────

describe('T-L02 — loginUser returns LoginError on INVALID_CREDENTIALS', () => {
  it('returns LoginError with INVALID_CREDENTIALS errorCode on 400', async () => {
    mock.onPost('/api/auth/login').reply(400, {
      success: false,
      data: null,
      error: { code: 'INVALID_CREDENTIALS', message: 'Email or password is incorrect', details: [] },
      meta: { timestamp: new Date().toISOString(), version: '1.0' },
    });

    const result = await loginUser(validLoginInput);

    expect((result as LoginError).errorCode).toBe('INVALID_CREDENTIALS');
  });

  it('does not throw on 400 — returns error object', async () => {
    mock.onPost('/api/auth/login').reply(400, {
      success: false,
      data: null,
      error: { code: 'INVALID_CREDENTIALS', message: 'Email or password is incorrect', details: [] },
      meta: { timestamp: new Date().toISOString(), version: '1.0' },
    });

    await expect(loginUser(validLoginInput)).resolves.toHaveProperty('errorCode');
  });
});

// ── T-L03: network failure ────────────────────────────────────────────────────

describe('T-L03 — loginUser returns LoginError on network failure', () => {
  it('returns NETWORK_ERROR when no response received', async () => {
    mock.onPost('/api/auth/login').networkError();

    const result = await loginUser(validLoginInput);

    expect((result as LoginError).errorCode).toBe('NETWORK_ERROR');
  });

  it('does not throw on network error — returns error object', async () => {
    mock.onPost('/api/auth/login').networkError();

    await expect(loginUser(validLoginInput)).resolves.toHaveProperty('errorCode', 'NETWORK_ERROR');
  });

  it('returns NETWORK_ERROR on timeout', async () => {
    mock.onPost('/api/auth/login').timeout();

    const result = await loginUser(validLoginInput);

    expect((result as LoginError).errorCode).toBe('NETWORK_ERROR');
  });
});
