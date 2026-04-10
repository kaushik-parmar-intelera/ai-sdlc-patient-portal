# Spec: Registration Screen API Integration

**Jira**: [SCRUM-41](https://intelera-team-gbifcm47.atlassian.net/browse/SCRUM-41)  
**Branch**: `041-registration-api-integration`  
**Sprint**: SCRUM Sprint 0 (2026-04-08 → 2026-04-22)  
**Priority**: Medium | **Status**: To Do

---

## User Story

As a new user, I want my registration form to submit my details to the real backend API, receive clear success or error feedback via toast notifications, and have my data correctly validated end-to-end, so that I can create an account and proceed to the portal.

## Acceptance Criteria

1. Registration form submits to `POST http://localhost:8080/api/v1/auth/register`
2. Request body maps form fields to `{ fullName, email, password, confirmPassword }`
3. A `confirmPassword` field is added to the registration form and validated client-side
4. On success (HTTP 201), a green toast notification shows "Account created successfully!"
5. On validation error (HTTP 400 / `INVALID_INPUT`), a red toast shows the field-level reason
6. On email conflict (HTTP 409 / `EMAIL_EXISTS`), a red toast shows "Email already registered"
7. On network/server error, a red toast shows a user-friendly fallback message
8. All HTTP requests go through an Axios instance with request and response interceptors
9. Request interceptor: attaches `X-Request-ID` header and `Content-Type: application/json`
10. Response interceptor: normalizes the `{ success, data, error, meta }` envelope
11. The existing retry logic (3 attempts, exponential backoff) is preserved
12. TypeScript types align with the actual backend response shape
13. No regressions on the existing login flow

## API Contract (from Jira)

### Endpoint
```
POST http://localhost:8080/api/v1/auth/register
```

### Request Body
```json
{
  "fullName": "string",
  "email": "string",
  "password": "string",
  "confirmPassword": "string"
}
```

### Success Response (HTTP 201)
```json
{
  "success": true,
  "data": {
    "userId": "15021486-50ff-449f-8c11-94d47adf46ef",
    "email": "kaushik@healthcare.com",
    "firstName": "Kaushik",
    "lastName": "",
    "message": "Account created successfully"
  },
  "error": null,
  "meta": {
    "timestamp": "2026-04-10T09:35:12.2149953Z",
    "version": "1.0"
  }
}
```

### Error Response (HTTP 400)
```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "INVALID_INPUT",
    "message": "Request validation failed",
    "details": [
      {
        "field": "ConfirmPassword",
        "reason": "confirmPassword must match password"
      }
    ]
  },
  "meta": {
    "timestamp": "2026-04-10T09:39:00.7104266Z",
    "version": "1.0"
  }
}
```

## Out of Scope

- Backend API implementation
- JWT token storage or post-registration auto-login
- Email verification flow
- `medicalId` field integration with the backend (UI-only field retained)
