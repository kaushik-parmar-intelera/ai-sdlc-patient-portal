# Research: User Detail API Integration (SCRUM-43)

**Phase**: 0 — Outline & Research  
**Date**: 2026-04-10  
**Feature**: `043-user-detail-api-integration`

---

## 1. How to Extract `accessToken` from `auth_session` httpOnly Cookie in a Next.js Proxy Route

**Decision**: Read the `auth_session` cookie server-side in the Next.js route handler via `request.cookies.get('auth_session')`, base64-decode it, parse the JSON, and extract `accessToken`.

**Rationale**: The login proxy route (`/api/auth/login/route.ts`) stores a base64-encoded JSON blob as the `auth_session` cookie:
```typescript
const cookiePayload = Buffer.from(
  JSON.stringify({ email, name, accessToken, expiresIn })
).toString('base64');
```
The user-detail proxy route must reverse this: `JSON.parse(Buffer.from(cookie.value, 'base64').toString('utf-8'))`.

**Alternatives considered**:
- Storing `accessToken` as a separate cookie: rejected — would require changing the existing login route and auth middleware, broadening scope.
- Using `getServerSideProps` or server component: rejected — the axios client pattern uses Next.js API proxy routes consistently across all auth flows.

---

## 2. React Query vs. Zustand for User Detail State

**Decision**: Use React Query `useQuery` as the primary data-fetching mechanism. Do **not** duplicate user detail into Zustand.

**Rationale**:
- User detail from `GET /api/v1/users/me` is **server state** — it lives on the backend and can change. React Query is purpose-built for server state: caching, stale-while-revalidate, background refetch, retry, loading/error states.
- Zustand `auth-session.store` already holds `{ userId, name, email }` from the login response — this is sufficient for nav/header display without an extra fetch.
- React Query with `staleTime: 300_000` (5 min) avoids redundant API calls across page navigations within the same session.
- Adding user detail to Zustand would create a two-source-of-truth problem (Zustand persists to localStorage, but React Query always validates freshness against the server).

**Alternatives considered**:
- Storing full `UserDetail` in Zustand persist: rejected — stale data risk on role/status changes; Zustand is for UI/session state, not API data.
- SWR instead of React Query: rejected — `@tanstack/react-query` v5 is already in the stack from feature 041; no need to add another dependency.

---

## 3. Error Code Mapping (Backend → Toast Messages)

**Decision**: Map backend error codes to user-friendly toast messages in the `useUserDetail` hook, not in the service.

| Backend Error Code | HTTP Status | Toast Message | Additional Action |
|--------------------|-------------|---------------|-------------------|
| `INVALID_TOKEN` | 401 | "Session expired. Please sign in again." | Redirect to `/login` |
| `USER_NOT_FOUND` | 404 | "User account not found. Please contact support." | — |
| `NETWORK_ERROR` | N/A | "Unable to load profile. Please try again." | — |
| Any other 5xx | 5xx | "Unable to load profile. Please try again." | — |

**Rationale**: Service layer remains pure (no UI side-effects, no router access). The hook owns all toast calls and navigation. This matches the pattern established in `login-form.tsx` where the component handles toast and routing, not the service.

---

## 4. Toast Availability in Private Routes

**Decision**: Add `<Toaster position="top-right" richColors closeButton />` to `src/app/(private)/layout.tsx`.

**Rationale**: The `sonner` `<Toaster>` is currently only in the public layout (`(public)/layout.tsx`). Private routes (dashboard, profile) do not share this layout tree. Adding it to `(private)/layout.tsx` ensures all authenticated pages can render toasts without modifying the root layout (which is a server component and doesn't import sonner).

**Alternatives considered**:
- Adding Toaster to root `layout.tsx`: rejected — root layout is a server component; adding `'use client'` to it would degrade SSR for the entire app.
- Using a global toast provider in `providers.tsx`: technically viable but would require `'use client'` propagation; simpler to co-locate with the `(private)/layout.tsx` which is already `'use client'`.

---

## 5. Loading State Strategy

**Decision**: Show an inline text skeleton (animated `div` with `animate-pulse` Tailwind class) in the dashboard welcome heading and profile header while `isLoading` is `true` from React Query.

**Rationale**:
- The project uses Tailwind CSS throughout; Tailwind's `animate-pulse` is the existing skeleton pattern.
- Scope is limited to the user name/email fields only (per in-scope definition). Full page skeleton is out of scope.
- React Query's `isLoading` flag (true only on initial fetch, not background refetch) prevents flash of skeleton on subsequent navigations.

---

## 6. Success Toast Strategy

**Decision**: Show `toast.success('Profile loaded successfully.')` once, on the first successful fetch only — guarded by a `useRef(false)` flag inside the hook.

**Rationale**: React Query may re-fetch in the background. Showing a success toast on every background refetch would be disruptive UX. A one-shot flag ensures the toast fires only the first time data arrives, matching the AC requirement without annoying users on page re-visits.

---

## 7. Axios Interceptors — No Changes Required

**Decision**: The existing `axiosClient` interceptors in `src/services/api/axios-client.ts` require no changes for this feature.

**Rationale**:
- Request interceptor already injects `X-Request-ID` and `Content-Type: application/json`.
- Response interceptor already unwraps the `{ success, data, error, meta }` envelope and returns `data` on success, or normalizes errors on failure.
- The `GET /api/user/me` proxy route follows the same envelope pattern as login/register.

**Note**: The Authorization header is injected by the **proxy route** (server-side), not by the axios interceptor. The axios client talks to `/api/user/me` (Next.js internal); the proxy route then forwards with the Bearer token. This keeps the JWT out of the browser's request headers, preserving the security model.
