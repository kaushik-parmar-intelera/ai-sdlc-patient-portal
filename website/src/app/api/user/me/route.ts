import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8080';

interface AuthSessionCookiePayload {
  email: string;
  name: string;
  accessToken: string;
  expiresIn: number;
}

export async function GET(request: NextRequest) {
  const sessionCookie = request.cookies.get('auth_session');

  if (!sessionCookie) {
    return NextResponse.json(
      {
        success: false,
        data: null,
        error: {
          code: 'INVALID_TOKEN',
          message: 'Authentication session not found. Please sign in.',
        },
        meta: { timestamp: new Date().toISOString(), version: '1.0' },
      },
      { status: 401 }
    );
  }

  let payload: AuthSessionCookiePayload;
  try {
    payload = JSON.parse(
      Buffer.from(sessionCookie.value, 'base64').toString('utf-8')
    ) as AuthSessionCookiePayload;
  } catch {
    return NextResponse.json(
      {
        success: false,
        data: null,
        error: {
          code: 'INVALID_TOKEN',
          message: 'Session data is corrupted. Please sign in again.',
        },
        meta: { timestamp: new Date().toISOString(), version: '1.0' },
      },
      { status: 401 }
    );
  }

  try {
    const backendResponse = await fetch(`${API_BASE_URL}/api/v1/users/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${payload.accessToken}`,
      },
    });

    const responseJson = await backendResponse.json().catch(() => ({}));
    return NextResponse.json(responseJson, { status: backendResponse.status });
  } catch {
    return NextResponse.json(
      {
        success: false,
        data: null,
        error: {
          code: 'NETWORK_ERROR',
          message: 'Unable to reach user service. Please try again.',
        },
        meta: { timestamp: new Date().toISOString(), version: '1.0' },
      },
      { status: 503 }
    );
  }
}
