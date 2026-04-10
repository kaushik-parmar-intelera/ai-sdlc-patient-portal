# Quickstart: User Detail API Integration (SCRUM-43)

**Branch**: `043-user-detail-api-integration`  
**Prerequisites**: Feature 042 (Login API) merged; backend running on `http://localhost:8080`

---

## Setup

```bash
# 1. Create and switch to feature branch from main
git checkout main && git pull
git checkout -b 043-user-detail-api-integration

# 2. Install dependencies (none new — all in stack)
cd website && npm install

# 3. Ensure backend is running
# Open AI-SDLC-Patient-Backend in a separate terminal and run:
# dotnet run --project PatientPortal.Api
```

---

## Files to Create

```
website/src/
├── app/api/user/me/
│   └── route.ts                          ← NEW: proxy route
├── services/user/
│   └── user-detail.service.ts            ← NEW: service function
├── hooks/user/
│   └── use-user-detail.ts                ← NEW: React Query hook
└── types/
    └── auth.types.ts                     ← MODIFIED: add UserDetail types
```

## Files to Modify

```
website/src/
├── app/(private)/
│   ├── layout.tsx                        ← Add <Toaster>
│   ├── dashboard/page.tsx                ← Use useUserDetail hook
│   └── profile/page.tsx                  ← Use useUserDetail hook
```

## Tests to Create

```
website/tests/
├── services/user/
│   └── user-detail.service.test.ts       ← NEW
└── hooks/user/
    └── use-user-detail.test.ts           ← NEW
```

---

## Implementation Order

Follow this sequence to keep tests green at each step:

1. **Add types** to `auth.types.ts` — `UserDetail`, `UserDetailSuccess`, `UserDetailError`, type guards
2. **Create proxy route** `app/api/user/me/route.ts` — cookie decode → forward → envelope response
3. **Create service** `services/user/user-detail.service.ts` — `axiosClient.get` wrapper
4. **Write service tests** — mock axios, assert success/error paths
5. **Create hook** `hooks/user/use-user-detail.ts` — `useQuery` + toast + redirect
6. **Write hook tests** — mock service, assert toast calls
7. **Add Toaster** to `(private)/layout.tsx`
8. **Update Dashboard** — call `useUserDetail`, show skeleton + real name
9. **Update Profile** — call `useUserDetail`, show skeleton + real name/email
10. **Run full test suite** — `npm test && npm run lint`

---

## Proxy Route Implementation Sketch

```typescript
// src/app/api/user/me/route.ts
import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8080';

export async function GET(request: NextRequest) {
  const sessionCookie = request.cookies.get('auth_session');

  if (!sessionCookie) {
    return NextResponse.json(
      { success: false, data: null,
        error: { code: 'INVALID_TOKEN', message: 'Authentication session not found. Please sign in.' },
        meta: { timestamp: new Date().toISOString(), version: '1.0' } },
      { status: 401 }
    );
  }

  let accessToken: string;
  try {
    const payload = JSON.parse(Buffer.from(sessionCookie.value, 'base64').toString('utf-8'));
    accessToken = payload.accessToken;
  } catch {
    return NextResponse.json(
      { success: false, data: null,
        error: { code: 'INVALID_TOKEN', message: 'Session data is corrupted. Please sign in again.' },
        meta: { timestamp: new Date().toISOString(), version: '1.0' } },
      { status: 401 }
    );
  }

  try {
    const backendResponse = await fetch(`${API_BASE_URL}/api/v1/users/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const responseJson = await backendResponse.json().catch(() => ({}));
    return NextResponse.json(responseJson, { status: backendResponse.status });
  } catch {
    return NextResponse.json(
      { success: false, data: null,
        error: { code: 'NETWORK_ERROR', message: 'Unable to reach user service. Please try again.' },
        meta: { timestamp: new Date().toISOString(), version: '1.0' } },
      { status: 503 }
    );
  }
}
```

---

## Service Implementation Sketch

```typescript
// src/services/user/user-detail.service.ts
import { axiosClient } from '@/services/api/axios-client';
import { UserDetailSuccess, UserDetailError } from '@/types/auth.types';

export async function getUserDetail(): Promise<UserDetailSuccess | UserDetailError> {
  try {
    const data = await axiosClient.get<UserDetailSuccess>('/api/user/me');
    return data.data;
  } catch (err: unknown) {
    const axiosError = err as { errorCode?: string; error?: string };
    return {
      errorCode: axiosError.errorCode ?? 'NETWORK_ERROR',
      error: axiosError.error ?? 'Unknown error',
    };
  }
}
```

---

## Hook Implementation Sketch

```typescript
// src/hooks/user/use-user-detail.ts
'use client';

import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';
import { toast } from 'sonner';

import { getUserDetail } from '@/services/user/user-detail.service';
import { isUserDetailError } from '@/types/auth.types';

export function useUserDetail() {
  const router = useRouter();
  const toastFiredRef = useRef(false);

  const query = useQuery({
    queryKey: ['user', 'detail'],
    queryFn: getUserDetail,
    staleTime: 300_000,
  });

  if (query.data && !isUserDetailError(query.data) && !toastFiredRef.current) {
    toastFiredRef.current = true;
    toast.success('Profile loaded successfully.');
  }

  if (query.data && isUserDetailError(query.data)) {
    const { errorCode } = query.data;
    if (errorCode === 'INVALID_TOKEN') {
      toast.error('Session expired. Please sign in again.');
      router.push('/login');
    } else if (errorCode === 'USER_NOT_FOUND') {
      toast.error('User account not found. Please contact support.');
    } else {
      toast.error('Unable to load profile. Please try again.');
    }
  }

  return {
    userDetail: !isUserDetailError(query.data) ? query.data : undefined,
    isLoading: query.isLoading,
    isError: query.isError || (!!query.data && isUserDetailError(query.data)),
  };
}
```

---

## Manual Testing Steps

1. Start the backend: `dotnet run --project PatientPortal.Api`
2. Start the frontend: `cd website && npm run dev`
3. Navigate to `http://localhost:3000/login` and sign in with valid credentials
4. Observe: Dashboard should show your real first name in the welcome heading and a green toast "Profile loaded successfully."
5. Navigate to `/profile` — real name and email should appear
6. Sign out, sign back in with an expired or invalid token (edit cookie manually): dashboard should redirect to login with a "Session expired" toast
7. While backend is stopped, sign in and navigate to dashboard: should show "Unable to load profile" toast

---

## Running Tests

```bash
cd website

# All tests
npm test

# Watch mode
npm test -- --watch

# Specific test file
npm test -- user-detail.service

# Lint
npm run lint
```
