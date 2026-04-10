# API Contracts: User Detail (SCRUM-43)

**Phase**: 1 — Design & Contracts  
**Date**: 2026-04-10

---

## Contract 1 — Frontend Axios Client → Next.js Proxy

**Interface**: Browser `axiosClient` → Next.js route handler

### Request

```
GET /api/user/me
Headers:
  X-Request-ID: <uuid-v4>          ← injected by axios request interceptor
  Content-Type: application/json   ← injected by axios request interceptor
```

No request body.

### Success Response (HTTP 200)

The axios **response interceptor** unwraps the envelope and resolves with `data` only:

```typescript
// Resolved value after interceptor unwrap:
UserDetailSuccess = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive: boolean;
}
```

### Error Response

The axios **error interceptor** normalizes to:

```typescript
UserDetailError = {
  errorCode: string;   // "INVALID_TOKEN" | "USER_NOT_FOUND" | "NETWORK_ERROR" | "SERVER_ERROR"
  error: string;       // e.g. "Token is invalid or expired"
}
```

---

## Contract 2 — Next.js Proxy Route → Backend API

**Interface**: Next.js server-side route → ASP.NET Core backend

### Request

```
GET http://localhost:8080/api/v1/users/me
Headers:
  Authorization: Bearer <accessToken>    ← decoded from auth_session cookie
  Content-Type: application/json
```

The `accessToken` is extracted by decoding the `auth_session` httpOnly cookie:

```typescript
// Cookie decoding logic in /api/user/me/route.ts
const cookie = request.cookies.get('auth_session');
if (!cookie) return 401;
const payload = JSON.parse(Buffer.from(cookie.value, 'base64').toString('utf-8'));
// payload: { email, name, accessToken, expiresIn }
```

### Success Response (HTTP 200)

```json
{
  "success": true,
  "data": {
    "id": "15021486-50ff-449f-8c11-94d47adf46ef",
    "email": "kaushik@healthcare.com",
    "firstName": "Kaushik",
    "lastName": "Parmar",
    "role": "Patient",
    "isActive": true
  },
  "error": null,
  "meta": {
    "timestamp": "2026-04-10T11:04:55.6265095Z",
    "version": "1.0"
  }
}
```

### Error Responses

| HTTP Status | Error Code | Scenario |
|-------------|------------|----------|
| 401 | `INVALID_TOKEN` | Token missing, expired, or invalid |
| 404 | `USER_NOT_FOUND` | Authenticated userId has no DB record |
| 503 | `NETWORK_ERROR` | Backend unreachable (proxy catch block) |

**Error envelope shape:**
```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "INVALID_TOKEN",
    "message": "Token is invalid or expired",
    "details": []
  },
  "meta": { "timestamp": "...", "version": "1.0" }
}
```

---

## Contract 3 — Missing Cookie Handling (Proxy Route)

If `auth_session` cookie is absent or cannot be decoded, the proxy route returns immediately with a 401 — **before** calling the backend:

```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "INVALID_TOKEN",
    "message": "Authentication session not found. Please sign in."
  },
  "meta": { "timestamp": "<now>", "version": "1.0" }
}
```

This ensures the error code `INVALID_TOKEN` consistently triggers the "session expired → redirect to login" behaviour in the hook.

---

## Contract 4 — React Query Hook Interface

**Interface**: `useUserDetail()` — consumed by Dashboard and Profile pages

```typescript
// src/hooks/user/use-user-detail.ts

interface UseUserDetailResult {
  userDetail: UserDetailSuccess | undefined;
  isLoading: boolean;
  isError: boolean;
}

function useUserDetail(): UseUserDetailResult
```

**Behaviour guarantees:**
- Returns `isLoading: true` only on initial fetch (no prior cache).
- Calls `toast.success('Profile loaded successfully.')` exactly once per session mount.
- Calls `toast.error(...)` with a code-specific message on fetch failure.
- Redirects to `/login` on `INVALID_TOKEN` error.
- Does not throw — all errors are handled internally.
