import { NextRequest, NextResponse } from 'next/server';

// Sample test users — credentials: testuser@healthcare.com / Test@123
const TEST_USERS = [
  {
    email: 'testuser@healthcare.com',
    password: 'Test@123',
    name: 'Sarah Jenkins',
    patientId: 'CC-88291',
  },
] as const;

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const { email, password } = body as { email?: string; password?: string };

  if (!email || !password) {
    return NextResponse.json(
      { error: 'Email and password are required.' },
      { status: 400 }
    );
  }

  const user = TEST_USERS.find(
    (u) =>
      u.email.toLowerCase() === email.toLowerCase() &&
      u.password === password
  );

  if (!user) {
    return NextResponse.json(
      { error: 'Invalid email or password.' },
      { status: 401 }
    );
  }

  const sessionPayload = Buffer.from(
    JSON.stringify({ email: user.email, name: user.name, patientId: user.patientId })
  ).toString('base64');

  const response = NextResponse.json(
    { success: true, user: { email: user.email, name: user.name } },
    { status: 200 }
  );

  response.cookies.set('auth_session', sessionPayload, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 8, // 8 hours
    path: '/',
  });

  return response;
}
