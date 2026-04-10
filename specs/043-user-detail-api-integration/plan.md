# Implementation Plan: User Detail API Integration

**Branch**: `043-user-detail-api-integration` | **Date**: 2026-04-10 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `/specs/043-user-detail-api-integration/spec.md`

## Summary

Integrate the `GET /api/v1/users/me` backend endpoint into the Next.js patient portal via a server-side proxy route, a typed service function, and a React Query hook. Replace hardcoded user data (name, email) on the Dashboard and Profile pages with real API responses. Surface success and failure states through `sonner` toast notifications. Add `<Toaster>` to the private layout to enable toasts across all authenticated routes.

## Technical Context

**Language/Version**: TypeScript 5 / Node.js 20  
**Primary Dependencies**: Next.js 14.2, React 18, axios (existing), sonner (existing), Zustand 5 (existing), @tanstack/react-query 5 (existing from 041)  
**Storage**: N/A (no new storage; React Query in-memory cache; Zustand localStorage persist unchanged)  
**Testing**: Jest + React Testing Library (existing)  
**Target Platform**: Web — Next.js App Router on Node.js server  
**Project Type**: Web application (Next.js frontend + ASP.NET Core backend)  
**Performance Goals**: User detail cached for 5 min (`staleTime: 300_000`); no redundant API calls on page re-visits within cache window  
**Constraints**: JWT Bearer token must not appear in browser-side request headers — proxy route injects it server-side from the `auth_session` httpOnly cookie  
**Scale/Scope**: 1 new proxy route, 1 service, 1 hook, 2 page updates, 1 layout update, 2 test files

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Based on `.specify/memory/constitution.md`, verify:

- [x] **Code Quality (Principle I)**: TypeScript 5 strict mode; ESLint with Next.js ruleset configured → YES
  - Linting tool identified: ESLint (existing `eslint.config.mjs` in `website/`)
  - Code coverage target: 80% business logic (`user-detail.service.ts`, `use-user-detail.ts`); 70% UI (dashboard/profile updates)

- [x] **Test-Driven (Principle II)**: Jest + RTL pre-selected → YES
  - Testing tool identified: Jest + React Testing Library (existing)
  - Unit test strategy defined: T-UD01–T-UD07 for service + hook; T-UD08–T-UD10 for page components
  - Integration test scope: proxy route `/api/user/me` tested via MSW or supertest

- [x] **UX Consistency (Principle III)**: Web feature
  - Design system applied: YES — Tailwind CSS + Material Symbols (consistent with all private pages)
  - Platform consistency: Web only; no mobile platform in scope
  - Accessibility: skeleton uses `aria-busy`; toasts via sonner ARIA live regions; WCAG 2.1 AA maintained

- [x] **Performance (Principle IV)**: SLA targets documented
  - Response time: p95 ≤ 200ms for `GET /api/v1/users/me` (simple DB lookup, per constitution)
  - React Query cache eliminates redundant fetches; LCP unaffected (user name non-critical render path)
  - Performance testing: Lighthouse for web vitals (existing CI check)

**Gate Status**: ✅ PASS (all gates checked)

## Project Structure

### Documentation (this feature)

```text
specs/043-user-detail-api-integration/
├── plan.md              ← This file
├── spec.md              ← Feature specification
├── research.md          ← Phase 0 output
├── data-model.md        ← Phase 1 output
├── quickstart.md        ← Phase 1 output
├── contracts/
│   └── user-detail-api.md  ← Phase 1 output
└── tasks.md             ← Phase 2 output (/speckit.tasks — NOT created here)
```

### Source Code (repository root)

```text
website/src/
├── app/
│   ├── api/
│   │   └── user/
│   │       └── me/
│   │           └── route.ts                   ← NEW: GET proxy route
│   └── (private)/
│       ├── layout.tsx                          ← MODIFIED: add <Toaster>
│       ├── dashboard/
│       │   └── page.tsx                        ← MODIFIED: useUserDetail hook
│       └── profile/
│           └── page.tsx                        ← MODIFIED: useUserDetail hook
├── hooks/
│   └── user/
│       └── use-user-detail.ts                  ← NEW: React Query hook
├── services/
│   └── user/
│       └── user-detail.service.ts              ← NEW: service function
└── types/
    └── auth.types.ts                           ← MODIFIED: add UserDetail types

website/tests/
├── services/user/
│   └── user-detail.service.test.ts             ← NEW
└── hooks/user/
    └── use-user-detail.test.ts                 ← NEW
```

**Structure Decision**: Web application (Next.js frontend). New files follow the existing `services/auth/` → `hooks/` → `app/(private)/` layering pattern established in features 041–042. No new directories outside established convention.

## Complexity Tracking

> No constitution violations — no entries required.

---

## Phase 0: Research Summary

All NEEDS CLARIFICATION items resolved. Full rationale in [research.md](./research.md).

| # | Question | Decision |
|---|----------|----------|
| 1 | How to extract `accessToken` from `auth_session` cookie? | Base64-decode → JSON.parse → `payload.accessToken` in proxy route |
| 2 | React Query vs Zustand for user detail? | React Query — server state; Zustand only for session auth flags (no change) |
| 3 | Error code → toast message mapping? | `INVALID_TOKEN` → redirect to `/login`; `USER_NOT_FOUND` → support msg; else → generic retry |
| 4 | How to enable toasts in private routes? | Add `<Toaster>` to `(private)/layout.tsx` (already `'use client'`) |
| 5 | Loading state strategy? | Tailwind `animate-pulse` skeleton on name/email fields only |
| 6 | Success toast strategy? | Fire once on initial fetch via `useRef(false)` guard |
| 7 | Axios interceptor changes needed? | None — existing interceptors handle `X-Request-ID` + envelope unwrap |

---

## Phase 1: Design

### New Types (`auth.types.ts`)

```typescript
export interface UserDetail {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive: boolean;
}

export type UserDetailSuccess = UserDetail;

export interface UserDetailError {
  errorCode: string;  // "INVALID_TOKEN" | "USER_NOT_FOUND" | "NETWORK_ERROR" | "SERVER_ERROR"
  error: string;
}

export function isUserDetailSuccess(r: UserDetailSuccess | UserDetailError): r is UserDetailSuccess
export function isUserDetailError(r: UserDetailSuccess | UserDetailError): r is UserDetailError
```

### New Files

| File | Responsibility |
|------|----------------|
| `app/api/user/me/route.ts` | Server-side: decode `auth_session` cookie → inject `Authorization: Bearer` → proxy `GET /api/v1/users/me` → return envelope |
| `services/user/user-detail.service.ts` | `axiosClient.get('/api/user/me')` → return `UserDetailSuccess \| UserDetailError` |
| `hooks/user/use-user-detail.ts` | `useQuery(['user','detail'], getUserDetail, { staleTime: 300_000 })` + toast + redirect |

### Modified Files

| File | Change |
|------|--------|
| `types/auth.types.ts` | Add `UserDetail`, `UserDetailSuccess`, `UserDetailError`, `isUserDetailSuccess`, `isUserDetailError` |
| `app/(private)/layout.tsx` | Add `import { Toaster } from 'sonner'`; render `<Toaster position="top-right" richColors closeButton />`; add `queryClient.removeQueries({ queryKey: ['user'] })` in `handleSignOut` |
| `app/(private)/dashboard/page.tsx` | Add `'use client'`; call `useUserDetail()`; replace `"Sarah"` with `userDetail?.firstName`; add skeleton while `isLoading` |
| `app/(private)/profile/page.tsx` | Add `'use client'`; call `useUserDetail()`; replace hardcoded name/email with real data; add skeleton while `isLoading` |

### React Query Key & Cache Policy

```typescript
queryKey: ['user', 'detail']
staleTime: 300_000    // 5 minutes — prevents redundant fetches on route transitions
retry: 1              // One automatic retry on failure (matches query-client.ts default)
```

Cache invalidation: call `queryClient.removeQueries({ queryKey: ['user'] })` on sign-out to prevent stale user data in the next session.

### Error → Toast Map

| Error Code | HTTP | Toast Message | Side Effect |
|------------|------|---------------|-------------|
| `INVALID_TOKEN` | 401 | "Session expired. Please sign in again." | `router.push('/login')` |
| `USER_NOT_FOUND` | 404 | "User account not found. Please contact support." | — |
| `NETWORK_ERROR` / other | 5xx | "Unable to load profile. Please try again." | — |

---

## Post-Design Constitution Check

- [x] **Principle I**: All new files use TypeScript strict mode; no `any` types; `const` throughout; ESLint clean
- [x] **Principle II**: TDD order preserved — types → proxy route → service → tests → hook → tests → UI updates → tests
- [x] **Principle III**: Skeleton loading + consistent toast messages; no raw error codes in UI; sonner ARIA live regions for accessibility
- [x] **Principle IV**: React Query cache prevents repeated fetches; proxy route is thin pass-through; no added LCP regression

**Gate Status**: ✅ PASS

---

## Implementation Notes

1. **Cookie decode safety**: Wrap both `Buffer.from(..., 'base64').toString()` and `JSON.parse()` in try/catch in the proxy route. Malformed cookies must return `INVALID_TOKEN` 401, not an unhandled 500.

2. **Service error propagation**: The axios response interceptor already normalizes backend errors to `{ errorCode, error }`. The service `catch` block just returns this object — no extra mapping.

3. **Hook toast deduplication**: Use `useRef(false)` (not `useState`) for the one-shot success flag to avoid triggering a re-render.

4. **Dashboard `'use client'` requirement**: `dashboard/page.tsx` must have `'use client'` to call `useUserDetail`. Add the directive if absent before adding hook calls.

5. **Toaster placement**: Add `<Toaster ... />` just before `</div>` closing tag in `(private)/layout.tsx` — after `<main>` — to keep DOM structure consistent with the public layout.

6. **Sign-out cache purge**: Import `useQueryClient` from `@tanstack/react-query` in `(private)/layout.tsx` and call `queryClient.removeQueries({ queryKey: ['user'] })` inside `handleSignOut` before `router.push('/login')`.

7. **Scope boundary**: Only replace `name` and `email` fields in Dashboard and Profile pages. Vitals, appointments, health records, medications, and billing remain hardcoded — separate Jira tasks.
