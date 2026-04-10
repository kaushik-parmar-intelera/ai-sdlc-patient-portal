# Spec: Login Screen API Integration

**Jira**: [SCRUM-42](https://intelera-team-gbifcm47.atlassian.net/browse/SCRUM-42)  
**Branch**: `042-login-api-integration`  
**Sprint**: SCRUM Sprint 0 (2026-04-08 → 2026-04-22)  
**Priority**: Medium | **Status**: To Do

---

## User Story

As an existing patient, I want my login form to submit my credentials to the real backend API, receive clear success or error feedback via toast notifications, and have my session properly persisted, so that I can authenticate and access the patient portal securely.

## Acceptance Criteria

1. Login form submits to `POST http://localhost:8080/api/v1/auth/login` via a Next.js proxy route
2. Request body matches `{ email, password }`
3. On success (HTTP 200), a green toast notification shows "Signed in successfully!" and user is redirected to `/dashboard`
4. On invalid credentials (HTTP 400 / `INVALID_CREDENTIALS`), a red toast shows "Incorrect email or password. Please try again."
5. On network/server error, a red toast shows a user-friendly fallback message
6. All HTTP requests go through the existing Axios instance with request and response interceptors
7. Request interceptor: attaches `X-Request-ID` header and `Content-Type: application/json`
8. Response interceptor: normalizes the `{ success, data, error, meta }` envelope — same as registration
9. On success, user info (`id`, `firstName`, `lastName`, `email`) is stored in Zustand persist store (localStorage)
10. On success, `auth_session` httpOnly cookie is set by the proxy route for server-side middleware auth
11. The inline error banner (`formError` state) in `login-form.tsx` is replaced with `toast.error()`
12. No regressions on the registration flow or existing auth middleware

## API Contract (from Jira)

### Endpoint
```
POST http://localhost:8080/api/v1/auth/login
```

### Request Body
```json
{
  "email": "kaushik@healthcare.com",
  "password": "Test@123"
}
```

### Success Response (HTTP 200)
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "KqWLCGrT7LzM1sj8Tdm2L9d65H92R0NK...",
    "expiresIn": 3600,
    "user": {
      "id": "15021486-50ff-449f-8c11-94d47adf46ef",
      "email": "kaushik@healthcare.com",
      "firstName": "Kaushik",
      "lastName": "",
      "role": "Patient",
      "isActive": true
    }
  },
  "error": null,
  "meta": {
    "timestamp": "2026-04-10T11:04:55.6265095Z",
    "version": "1.0"
  }
}
```

### Error Response (HTTP 400 — Invalid Credentials)
```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Email or password is incorrect",
    "details": []
  },
  "meta": {
    "timestamp": "2026-04-10T11:07:56.1989342Z",
    "version": "1.0"
  }
}
```

## Scope

### In Scope
- Replace `global.fetch` in `login-form.tsx` with `loginUser` service (uses `axiosClient`)
- Replace `formError` inline banner with `sonner` toast notifications
- Create `src/services/auth/login.service.ts`
- Update `/api/auth/login/route.ts` proxy to call real backend (remove mock users)
- Add `LoginSuccess` / `LoginError` types to `auth.types.ts`
- Update Zustand store population to use `user.id` and `user.firstName + lastName`
- Ensure `auth_session` cookie is still set by proxy for server-side middleware
- Unit tests for `login.service.ts` and updated `login-form.tsx`

### Out of Scope
- Refresh token rotation
- Token persistence in memory / secure storage beyond current cookie approach
- SSO / BioID buttons (already present as placeholders, not functional)
- "Recovery options" link
- Remember me / persistent session beyond existing 8-hour cookie

## Test Requirements

| Test ID | Type | Description |
|---------|------|-------------|
| T-L01 | Unit | `loginUser` service: success path — returns `LoginSuccess` |
| T-L02 | Unit | `loginUser` service: `INVALID_CREDENTIALS` — returns `LoginError` |
| T-L03 | Unit | `loginUser` service: network failure — returns `NETWORK_ERROR` LoginError |
| T-L04 | Unit | `LoginForm`: renders email + password fields |
| T-L05 | Unit | `LoginForm`: shows `toast.success` on 200 response |
| T-L06 | Unit | `LoginForm`: shows `toast.error` with credentials message on `INVALID_CREDENTIALS` |
| T-L07 | Unit | `LoginForm`: shows `toast.error` on `NETWORK_ERROR` |
| T-L08 | Unit | `LoginForm`: does not call `loginUser` when form has empty email |
| T-L09 | Unit | `LoginForm`: sets `isAuthenticated` in Zustand store on success |
