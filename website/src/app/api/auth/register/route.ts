import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/auth/register
 *
 * Proxy route: forwards the registration request to the backend API,
 * avoiding CORS issues (browser → Next.js proxy → backend).
 *
 * The backend URL is configured via NEXT_PUBLIC_API_BASE_URL env variable.
 */
export async function POST(request: NextRequest) {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8080';

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      {
        success: false,
        data: null,
        error: { code: 'INVALID_INPUT', message: 'Invalid request body.' },
        meta: { timestamp: new Date().toISOString(), version: '1.0' },
      },
      { status: 400 }
    );
  }

  try {
    const backendResponse = await fetch(`${apiBaseUrl}/api/v1/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(body),
    });

    const responseData = await backendResponse.json().catch(() => null);

    return NextResponse.json(responseData, { status: backendResponse.status });
  } catch {
    return NextResponse.json(
      {
        success: false,
        data: null,
        error: {
          code: 'NETWORK_ERROR',
          message: 'Unable to reach the registration service. Please try again later.',
        },
        meta: { timestamp: new Date().toISOString(), version: '1.0' },
      },
      { status: 503 }
    );
  }
}
