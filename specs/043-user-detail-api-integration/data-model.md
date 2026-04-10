# Data Model: User Detail API Integration (SCRUM-43)

**Phase**: 1 — Design & Contracts  
**Date**: 2026-04-10

---

## Entities

### `UserDetail`

Represents the authenticated user's profile as returned by `GET /api/v1/users/me`.

```typescript
// src/types/auth.types.ts (additions)

export interface UserDetail {
  id: string;           // UUID — matches LoginUser.id
  email: string;        // User's email address
  firstName: string;    // Given name
  lastName: string;     // Family name
  role: string;         // e.g. "Patient"
  isActive: boolean;    // Account status
}

export type UserDetailSuccess = UserDetail;

export interface UserDetailError {
  errorCode: string;    // "INVALID_TOKEN" | "USER_NOT_FOUND" | "NETWORK_ERROR" | "SERVER_ERROR"
  error: string;        // Human-readable message (for logs, not displayed directly)
}

// Type guards
export function isUserDetailSuccess(r: UserDetailSuccess | UserDetailError): r is UserDetailSuccess {
  return 'id' in r && 'email' in r;
}
export function isUserDetailError(r: UserDetailSuccess | UserDetailError): r is UserDetailError {
  return 'errorCode' in r;
}
```

---

### `AuthSessionCookiePayload`

Represents the shape decoded from the `auth_session` httpOnly cookie (set by `/api/auth/login/route.ts`). Not exported — internal to the proxy route only.

```typescript
// Internal to src/app/api/user/me/route.ts

interface AuthSessionCookiePayload {
  email: string;
  name: string;
  accessToken: string;
  expiresIn: number;
}
```

---

## State Shape

### React Query Cache Key

```typescript
const USER_DETAIL_QUERY_KEY = ['user', 'detail'] as const;
```

- Cached for `staleTime: 300_000` ms (5 min).
- Invalidated on logout via `queryClient.removeQueries({ queryKey: ['user'] })`.

### React Query Query State (from `useUserDetail`)

```typescript
{
  data: UserDetailSuccess | undefined;
  isLoading: boolean;       // true only on initial fetch (no cached data)
  isError: boolean;         // true if last fetch failed
  error: UserDetailError | null;
}
```

---

## Relationships

```
auth-session.store (Zustand)           React Query Cache
────────────────────────────           ─────────────────────────────────
isAuthenticated: boolean       ──────> guards useUserDetail hook (skip if false)
user: { userId, name, email }  <────── populated at login (Login flow, SCRUM-42)
                                        
                                       ['user', 'detail']: UserDetail
                                          ↑ fetched by useUserDetail hook
                                          ↑ displayed in Dashboard + Profile pages
```

---

## Validation Rules

| Field | Rule |
|-------|------|
| `id` | Non-empty string (UUID format) |
| `email` | Non-empty string (trusted from server — no client-side re-validation) |
| `firstName` | Non-empty string |
| `lastName` | String (may be empty — same as login flow) |
| `role` | Non-empty string |
| `isActive` | Boolean |

No client-side Zod schema is required for the API response — the service layer returns the parsed response as-is; the backend is the source of truth for field correctness.

---

## State Transitions

```
Page Load
   │
   ▼
useUserDetail hook
   │
   ├─ isAuthenticated = false ──► skip fetch (returns { data: undefined, isLoading: false })
   │
   ├─ isLoading = true ──────────► render skeleton in Dashboard/Profile
   │
   ├─ success ──────────────────► toast.success (first time only) → render real data
   │
   └─ error
        ├─ INVALID_TOKEN ────────► toast.error("Session expired...") → router.push('/login')
        ├─ USER_NOT_FOUND ───────► toast.error("User account not found...")
        └─ NETWORK_ERROR / 5xx ──► toast.error("Unable to load profile...")
```
