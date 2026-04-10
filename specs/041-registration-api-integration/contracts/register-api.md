# API Contract: User Registration

**Endpoint**: `POST /api/v1/auth/register`  
**Backend Base**: `http://localhost:8080` (configured via `NEXT_PUBLIC_API_BASE_URL`)  
**Frontend Proxy**: `POST /api/auth/register` (Next.js Route Handler → proxies to backend)

---

## Request

### Headers
| Header | Value | Required |
|--------|-------|----------|
| `Content-Type` | `application/json` | Yes |
| `X-Request-ID` | UUID v4 (injected by axios request interceptor) | Yes |

### Body
```json
{
  "fullName": "string",       // Required. Combined from firstName + lastName
  "email": "string",          // Required. Valid email address
  "password": "string",       // Required. Min 12 chars
  "confirmPassword": "string" // Required. Must match password
}
```

---

## Responses

### 201 Created — Success
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
**Frontend action**: Toast success "Account created successfully!" → redirect to `/login?registered=true&email={email}`

---

### 400 Bad Request — Validation Error
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
**Frontend action**: Toast error with `details[0].reason` if available, otherwise `error.message`

---

### 409 Conflict — Email Already Registered
```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "EMAIL_EXISTS",
    "message": "An account with this email already exists"
  },
  "meta": { ... }
}
```
**Frontend action**: Toast error "This email is already registered. Please sign in."

---

### 500 Internal Server Error
```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "SERVER_ERROR",
    "message": "An unexpected error occurred"
  },
  "meta": { ... }
}
```
**Frontend action**: Toast error "Unable to create your account. Please try again later."  
**Retry**: Up to 3 attempts with exponential backoff (0ms, 2s, 5s)

---

## Frontend Proxy Route Contract

The Next.js proxy at `/api/auth/register`:
1. Receives the same `{ fullName, email, password, confirmPassword }` body from the client
2. Forwards verbatim to `${NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/register`
3. Returns the backend response body and status code unchanged to the client

---

## Axios Interceptor Contracts

### Request Interceptor
- Attaches `Content-Type: application/json`
- Attaches `X-Request-ID: <uuid>`
- Does **not** attach auth tokens (registration is a public endpoint)

### Response Interceptor
- On `response.data.success === false`: throws a normalized `RegistrationError`
- On HTTP 4xx/5xx: catches `AxiosError`, extracts `response.data.error.code` and `message`
- On network timeout / no response: returns `errorCode: NETWORK_ERROR`
- On `success === true`: resolves with `response.data.data` (unwrapped payload)
