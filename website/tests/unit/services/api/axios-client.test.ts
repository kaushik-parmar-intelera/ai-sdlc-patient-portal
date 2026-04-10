/**
 * TDD tests for axiosClient — T007–T010.
 * Tests cover: request interceptor headers, response envelope unwrapping,
 * error normalization, and network error mapping.
 */

import MockAdapter from 'axios-mock-adapter';

import { axiosClient } from '@/services/api/axios-client';

const mock = new MockAdapter(axiosClient);

afterEach(() => {
  mock.reset();
});

afterAll(() => {
  mock.restore();
});

// ── T007: Request interceptor ─────────────────────────────────────────────────

describe('T007 — request interceptor headers', () => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  it('attaches X-Request-ID header matching UUID v4 format', async () => {
    let capturedRequestId: string | undefined;

    mock.onPost('/api/auth/register').reply((config) => {
      capturedRequestId = config.headers?.['X-Request-ID'] as string;
      return [
        201,
        {
          success: true,
          data: { userId: '1', email: 'a@b.com', firstName: 'A', lastName: 'B', message: 'ok' },
          error: null,
          meta: { timestamp: '', version: '1.0' },
        },
      ];
    });

    await axiosClient.post('/api/auth/register', {});

    expect(capturedRequestId).toBeDefined();
    expect(uuidRegex.test(capturedRequestId!)).toBe(true);
  });

  it('attaches Content-Type: application/json header', async () => {
    let capturedContentType: string | undefined;

    mock.onPost('/api/auth/register').reply((config) => {
      capturedContentType = config.headers?.['Content-Type'] as string;
      return [
        201,
        {
          success: true,
          data: { userId: '1', email: 'a@b.com', firstName: 'A', lastName: 'B', message: 'ok' },
          error: null,
          meta: { timestamp: '', version: '1.0' },
        },
      ];
    });

    await axiosClient.post('/api/auth/register', {});

    expect(capturedContentType).toContain('application/json');
  });
});

// ── T008: Response envelope unwrapping ───────────────────────────────────────

describe('T008 — response interceptor unwraps success envelope', () => {
  it('resolves with data payload when success is true', async () => {
    const successData = {
      userId: 'abc-123',
      email: 'test@test.com',
      firstName: 'Test',
      lastName: 'User',
      message: 'Account created successfully',
    };

    mock.onPost('/api/auth/register').reply(201, {
      success: true,
      data: successData,
      error: null,
      meta: { timestamp: '2026-01-01T00:00:00Z', version: '1.0' },
    });

    const result = await axiosClient.post('/api/auth/register', {});

    expect(result).toEqual(successData);
  });
});

// ── T009: Error normalization ─────────────────────────────────────────────────

describe('T009 — response interceptor throws RegistrationError when success is false', () => {
  it('throws with errorCode from error.code (EMAIL_EXISTS)', async () => {
    mock.onPost('/api/auth/register').reply(409, {
      success: false,
      data: null,
      error: {
        code: 'EMAIL_EXISTS',
        message: 'An account with this email already exists',
        details: [],
      },
      meta: { timestamp: '2026-01-01T00:00:00Z', version: '1.0' },
    });

    await expect(axiosClient.post('/api/auth/register', {})).rejects.toMatchObject({
      errorCode: 'EMAIL_EXISTS',
      error: 'An account with this email already exists',
    });
  });

  it('includes field from error.details when present (INVALID_INPUT)', async () => {
    mock.onPost('/api/auth/register').reply(400, {
      success: false,
      data: null,
      error: {
        code: 'INVALID_INPUT',
        message: 'Request validation failed',
        details: [{ field: 'ConfirmPassword', reason: 'confirmPassword must match password' }],
      },
      meta: { timestamp: '2026-01-01T00:00:00Z', version: '1.0' },
    });

    await expect(axiosClient.post('/api/auth/register', {})).rejects.toMatchObject({
      errorCode: 'INVALID_INPUT',
      field: 'ConfirmPassword',
    });
  });
});

// ── T010: Network error mapping ───────────────────────────────────────────────

describe('T010 — network error maps to NETWORK_ERROR', () => {
  it('maps network error to errorCode: NETWORK_ERROR', async () => {
    mock.onPost('/api/auth/register').networkError();

    await expect(axiosClient.post('/api/auth/register', {})).rejects.toMatchObject({
      errorCode: 'NETWORK_ERROR',
    });
  });

  it('maps timeout to errorCode: NETWORK_ERROR', async () => {
    mock.onPost('/api/auth/register').timeout();

    await expect(axiosClient.post('/api/auth/register', {})).rejects.toMatchObject({
      errorCode: 'NETWORK_ERROR',
    });
  });
});
