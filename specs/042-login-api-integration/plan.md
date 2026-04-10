# Implementation Plan: Login Screen API Integration

**Branch**: `042-login-api-integration` | **Date**: 2026-04-10 | **Spec**: [spec.md](./spec.md)  
**Jira**: [SCRUM-42](https://intelera-team-gbifcm47.atlassian.net/browse/SCRUM-42)  
**Input**: Feature specification from `/specs/042-login-api-integration/spec.md`

## Summary

Connect the existing login form (`login-form.tsx`) to the real backend API (`POST http://localhost:8080/api/v1/auth/login`) using the existing Axios client with request/response interceptors. Replace the inline `formError` banner with `sonner` toast notifications. Create a `login.service.ts` that mirrors the registration service pattern. Update the Next.js proxy route to forward to the real backend and set the `auth_session` httpOnly cookie for the server-side route guard. Fix the Zustand store population (currently stores email as userId — bug).

## Technical Context

**Language/Version**: TypeScript 5 / Node.js 20  
**Primary Dependencies**: Next.js 14.2, React 18, axios (existing), sonner (existing), Zustand 5, react-hook-form 7, Zod 3.22  
**Storage**: httpOnly cookie (`auth_session`) for JWT; Zustand persist (localStorage) for user metadata  
**Testing**: Jest + React Testing Library (existing)  
**Target Platform**: Web — Next.js App Router, localhost dev  
**Project Type**: Web application (frontend + BFF proxy)  
**Performance Goals**: Login round-trip ≤ 500ms p95  
**Constraints**: No CORS from browser → backend; `accessToken` must not be accessible from JS  
**Scale/Scope**: Single login flow; 1 API endpoint re-integrated (mock → real)

## Constitution Check

- [x] **Code Quality (Principle I)**: TypeScript strict mode, ESLint enforced
  - Linting tool: ESLint (existing)
  - Code coverage target: 80% service logic, 70% UI component

- [x] **Test-Driven (Principle II)**: Tests written before implementation
  - Testing tool: Jest + React Testing Library
  - Unit tests: `login.service.ts`, `login-form.tsx` (success + error paths)
  - Integration tests: `LoginForm` → service → mock response → toast
  
- [x] **UX Consistency (Principle III)**:
  - Design system applied: YES — existing Tailwind Clinical Curator tokens preserved
  - Toast pattern: sonner, already used in registration form — consistent
  - WCAG 2.1 AA: `aria-invalid`, label associations preserved in existing form

- [x] **Performance (Principle IV)**:
  - No new dependencies (axios + sonner already installed from SCRUM-41)
  - No additional bundle impact
  - No retry (by design — login failures are deterministic)

**Gate Status**: ✅ PASS

## Project Structure

### Documentation (this feature)

```text
specs/042-login-api-integration/
├── plan.md              ← This file
├── spec.md              ← Feature specification (from SCRUM-42)
├── research.md          ← Phase 0: library decisions + architecture choices
├── data-model.md        ← Phase 1: type shapes + state transitions
├── quickstart.md        ← Phase 1: dev setup guide
├── contracts/
│   └── login-api.md     ← Phase 1: API + service contracts
└── tasks.md             ← Phase 2 output (/speckit.tasks — NOT created here)
```

### Source Code Changes

```text
website/
├── src/
│   ├── types/
│   │   └── auth.types.ts                          MOD  Add LoginSuccess, LoginUser, LoginError types
│   ├── schemas/
│   │   └── login.schema.ts                        NEW  Extract loginSchema + LoginInput from login-form.tsx
│   ├── services/
│   │   └── auth/
│   │       └── login.service.ts                   NEW  loginUser() using axiosClient
│   ├── mocks/
│   │   └── auth/
│   │       └── login.mock.ts                      NEW  Test fixtures for login service tests
│   ├── components/
│   │   └── molecules/
│   │       └── login-form.tsx                     MOD  fetch → axiosClient service, formError → toast
│   └── app/
│       └── api/
│           └── auth/
│               └── login/
│                   └── route.ts                   MOD  mock → real backend proxy
│
└── tests/
    ├── unit/
    │   ├── services/
    │   │   └── auth/
    │   │       └── login.service.test.ts           NEW  Unit tests for loginUser service
    │   └── components/
    │       └── molecules/
    │           └── login-form.test.tsx             NEW  Component tests (T-L04 to T-L09)
    └── integration/
        └── login-flow.test.tsx                    NEW  End-to-end form → toast integration
```

### Files NOT Changed
- `src/services/api/axios-client.ts` — already generic; no changes needed
- `src/store/auth-session.store.ts` — existing `setAuthenticated` shape matches
- `src/middleware.ts` — reads `auth_session` cookie; no change needed
- `src/lib/auth/route-guard.ts` — no change needed
- `src/app/(public)/layout.tsx` — `<Toaster>` already mounted

## Implementation Notes

### 1. `auth.types.ts` additions
```typescript
// NEW — Login response types
export interface LoginUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive: boolean;
}

export interface LoginSuccess {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: LoginUser;
}

export type LoginError = RegistrationError;  // same shape: { errorCode, error, field? }

export function isLoginSuccess(r: LoginSuccess | LoginError): r is LoginSuccess {
  return 'accessToken' in r && !('errorCode' in r);
}

export function isLoginError(r: LoginSuccess | LoginError): r is LoginError {
  return 'errorCode' in r;
}
```

### 2. `login.service.ts` structure
```typescript
export async function loginUser(
  input: LoginInput
): Promise<LoginSuccess | LoginError> {
  try {
    const data = await axiosClient.post<LoginSuccess>('/api/auth/login', {
      email: input.email,
      password: input.password,
    });
    return data as unknown as LoginSuccess;
  } catch (err) {
    const loginError = err as LoginError;
    if (loginError.errorCode) return loginError;
    return { errorCode: 'NETWORK_ERROR', error: 'An unexpected error occurred. Please try again.' };
  }
}
```

### 3. Proxy route update (cookie payload extension)
```typescript
// On success: set auth_session cookie with accessToken included
const cookiePayload = Buffer.from(
  JSON.stringify({
    email: data.user.email,
    name: `${data.user.firstName} ${data.user.lastName}`.trim(),
    accessToken: data.accessToken,
    expiresIn: data.expiresIn,
  })
).toString('base64');

response.cookies.set('auth_session', cookiePayload, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: data.expiresIn,  // 3600
  path: '/',
});
```

### 4. `login-form.tsx` changes
- Remove: `formError` state, `setFormError`, error banner JSX
- Add: `import { loginUser } from '@/services/auth/login.service'`
- Add: `import { toast } from 'sonner'`
- Add: `import { isLoginSuccess, isLoginError } from '@/types/auth.types'`
- Change: `fetch('/api/auth/login')` → `loginUser(data)`
- Change: error handling to `switch(response.errorCode)` with `toast.error()`
- Change: `userId: body.user?.email` → `userId: data.user.id` (bug fix)
- Change: `name: body.user?.name` → `name: \`\${data.user.firstName} \${data.user.lastName}\`.trim()`

## Complexity Tracking

No violations to justify. This feature is a straightforward service extraction and UI cleanup following the exact same pattern as SCRUM-41.
