# Spec: User Detail API Integration

**Jira**: [SCRUM-43](https://intelera-team-gbifcm47.atlassian.net/browse/SCRUM-43)  
**Branch**: `043-user-detail-api-integration`  
**Sprint**: SCRUM Sprint 0 (2026-04-08 → 2026-04-22)  
**Priority**: Medium | **Status**: To Do

---

## User Story

As an authenticated patient, I want the dashboard and profile pages to display my real account information fetched from the backend API, with clear success and error feedback via toast notifications, so that I see accurate and personalized data rather than placeholder content.

## Acceptance Criteria

1. `GET /api/user/me` Next.js proxy route proxies to backend `GET /api/v1/users/me` with `Authorization: Bearer <accessToken>` extracted from the `auth_session` httpOnly cookie
2. All HTTP requests go through the existing Axios instance with request and response interceptors (`X-Request-ID` injection + envelope unwrap)
3. Dashboard page displays real user name from API (replaces hardcoded "Sarah Jenkins")
4. Profile page displays real user name and email from API (replaces hardcoded "Sarah Jenkins" / "s.jenkins@example.com")
5. On successful data fetch, a green toast shows "Profile loaded successfully."
6. On 401 `INVALID_TOKEN` error, a red toast shows "Session expired. Please sign in again." and user is redirected to `/login`
7. On 404 `USER_NOT_FOUND` error, a red toast shows "User account not found. Please contact support."
8. On network/server error, a red toast shows "Unable to load profile. Please try again."
9. A loading skeleton is shown in the dashboard welcome and profile header while the request is in flight
10. `<Toaster>` component is added to the private layout so all private routes can display toasts
11. React Query caches user detail with `staleTime: 300_000` (5 minutes)
12. No regressions on login, registration, or existing auth middleware flows

## API Contract (Backend)

### Endpoint
```
GET http://localhost:8080/api/v1/users/me
```

### Request Headers
```
Authorization: Bearer <accessToken>
Content-Type: application/json
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

### Error Response (HTTP 401 — Invalid Token)
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

### Error Response (HTTP 404 — User Not Found)
```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "USER_NOT_FOUND",
    "message": "User not found",
    "details": []
  },
  "meta": { "timestamp": "...", "version": "1.0" }
}
```

## Scope

### In Scope
- Create `src/app/api/user/me/route.ts` — Next.js proxy route (reads `auth_session` cookie, forwards Bearer token)
- Create `src/services/user/user-detail.service.ts` — service function using `axiosClient`
- Create `src/hooks/user/use-user-detail.ts` — React Query `useQuery` hook with toast integration
- Add `UserDetail`, `UserDetailSuccess`, `UserDetailError` types to `src/types/auth.types.ts`
- Add `<Toaster>` to `src/app/(private)/layout.tsx`
- Update Dashboard page to display real user name (welcome heading + profile card name)
- Update Profile page to display real user name and email
- Unit tests for `user-detail.service.ts` and `use-user-detail.ts`

### Out of Scope
- Replacing vitals, appointments, health records, medications, clinical history, or billing with real API data
- User profile editing (PATCH endpoint)
- Avatar / photo upload
- Token refresh flow on 401
- Role-based access control beyond current auth guard

## Test Requirements

| Test ID | Type | Description |
|---------|------|-------------|
| T-UD01 | Unit | `getUserDetail` service: success path — returns `UserDetailSuccess` |
| T-UD02 | Unit | `getUserDetail` service: `INVALID_TOKEN` — returns `UserDetailError` with code |
| T-UD03 | Unit | `getUserDetail` service: `USER_NOT_FOUND` — returns `UserDetailError` with code |
| T-UD04 | Unit | `getUserDetail` service: network failure — returns `UserDetailError` with `NETWORK_ERROR` |
| T-UD05 | Unit | `useUserDetail` hook: calls `toast.success` on first successful fetch |
| T-UD06 | Unit | `useUserDetail` hook: calls `toast.error` with session message on `INVALID_TOKEN` |
| T-UD07 | Unit | `useUserDetail` hook: calls `toast.error` with generic message on `NETWORK_ERROR` |
| T-UD08 | Unit | Dashboard: renders real user first name from hook data in welcome heading |
| T-UD09 | Unit | Dashboard: renders loading skeleton while data is pending |
| T-UD10 | Unit | Profile: renders real user email from hook data |
