import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8080';

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const { email, password } = body as { email?: string; password?: string };

  if (!email || !password) {
    return NextResponse.json(
      {
        success: false,
        data: null,
        error: { code: 'INVALID_INPUT', message: 'Email and password are required.' },
        meta: { timestamp: new Date().toISOString(), version: '1.0' },
      },
      { status: 400 }
    );
  }

  try {
    const backendResponse = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const responseJson = await backendResponse.json().catch(() => ({}));

    if (backendResponse.ok && responseJson.success === true) {
      const data = responseJson.data;
      const cookiePayload = Buffer.from(
        JSON.stringify({
          email: data.user.email,
          name: `${data.user.firstName} ${data.user.lastName}`.trim(),
          accessToken: data.accessToken,
          expiresIn: data.expiresIn,
        })
      ).toString('base64');

      const response = NextResponse.json(responseJson, { status: 200 });
      response.cookies.set('auth_session', cookiePayload, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: data.expiresIn ?? 3600,
        path: '/',
      });
      return response;
    }

    // Forward backend error responses as-is
    return NextResponse.json(responseJson, { status: backendResponse.status });
  } catch {
    return NextResponse.json(
      {
        success: false,
        data: null,
        error: {
          code: 'NETWORK_ERROR',
          message: 'Unable to reach authentication service. Please try again.',
        },
        meta: { timestamp: new Date().toISOString(), version: '1.0' },
      },
      { status: 503 }
    );
  }
}
