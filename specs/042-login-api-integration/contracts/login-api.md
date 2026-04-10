# Contract: Login API

## 1. Backend Endpoint Contract

### `POST http://localhost:8080/api/v1/auth/login`

**Headers (from proxy)**:
```
Content-Type: application/json
X-Request-ID: <UUID v4>   ← injected by axiosClient request interceptor
```

**Request Body**:
```json
{
  "email": "string",
  "password": "string"
}
```

**Success Response — HTTP 200**:
```json
{
  "success": true,
  "data": {
    "accessToken": "string (JWT)",
    "refreshToken": "string (opaque token)",
    "expiresIn": 3600,
    "user": {
      "id": "string (UUID)",
      "email": "string",
      "firstName": "string",
      "lastName": "string",
      "role": "string (e.g. Patient)",
      "isActive": true
    }
  },
  "error": null,
  "meta": {
    "timestamp": "string (ISO 8601)",
    "version": "1.0"
  }
}
```

**Error Response — HTTP 400 (Invalid Credentials)**:
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
    "timestamp": "string (ISO 8601)",
    "version": "1.0"
  }
}
```

---

## 2. Next.js Proxy Route Contract

### `POST /api/auth/login`

**Source**: `website/src/app/api/auth/login/route.ts`  
**Consumer**: `axiosClient.post('/api/auth/login')` in `login.service.ts`

**Request**: Forwards raw body `{ email, password }` to backend

**On backend 200 success**:
- Forwards backend response JSON as-is (preserving envelope shape)
- **Additionally sets** `auth_session` httpOnly cookie:
  ```typescript
  payload = base64({ email, name: `${firstName} ${lastName}`.trim(), accessToken, expiresIn })
  cookie: auth_session, httpOnly, sameSite: lax, maxAge: expiresIn (3600s), path: /
  ```
- Returns HTTP 200

**On backend error (4xx/5xx)**:
- Forwards backend response JSON as-is
- Returns same HTTP status code from backend

**On network failure to backend**:
- Returns HTTP 503 with envelope:
  ```json
  { "success": false, "data": null, "error": { "code": "NETWORK_ERROR", "message": "Unable to reach authentication service. Please try again." }, "meta": { "timestamp": "...", "version": "1.0" } }
  ```

---

## 3. `loginUser` Service Contract

**Source**: `website/src/services/auth/login.service.ts`  
**Signature**:
```typescript
function loginUser(input: LoginInput): Promise<LoginSuccess | LoginError>
```

**Behavior**:
- Posts to `/api/auth/login` via `axiosClient`
- On resolved: returns `LoginSuccess` (envelope already unwrapped by interceptor)
- On rejected with `LoginError`: returns `LoginError`
- On unexpected error: returns `{ errorCode: 'NETWORK_ERROR', error: 'An unexpected error occurred...' }`
- **No retry** (login failures are deterministic)

**Never throws** — always resolves with either success or error.

---

## 4. `axiosClient` Interceptor Contract (shared, unchanged)

**Request interceptor** adds:
```
X-Request-ID: <uuid-v4>
Content-Type: application/json
```

**Response interceptor** (success path):
- If `response.data.success === true`: returns `response.data.data` (unwrapped payload)
- If `response.data.success === false`: rejects with `LoginError { errorCode, error, field? }`

**Error interceptor**:
- No `error.response` (network/timeout): rejects with `{ errorCode: 'NETWORK_ERROR', error: '...' }`
- Has `error.response.data.error`: rejects with `{ errorCode: code, error: message, field }`
- Fallback: rejects with `{ errorCode: 'SERVER_ERROR', error: '...' }`

---

## 5. UI Toast Contract

| Condition | Toast Type | Message |
|-----------|-----------|---------|
| `isLoginSuccess(response)` | `toast.success` | `response.message \|\| 'Signed in successfully!'` |
| `errorCode === 'INVALID_CREDENTIALS'` | `toast.error` | `'Incorrect email or password. Please try again.'` |
| `errorCode === 'NETWORK_ERROR'` | `toast.error` | `'Network error: Please check your internet connection and try again.'` |
| `errorCode === 'SERVER_ERROR'` | `toast.error` | `'Unable to sign in. Please try again later.'` |
| any other error | `toast.error` | `response.error \|\| 'Sign in failed. Please try again.'` |
