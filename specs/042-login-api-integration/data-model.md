# Data Model: Login API Integration

## Entities & Types

### 1. `LoginInput` (Client-side form)

The shape React Hook Form / Zod schema works with.

| Field | Type | Validation |
|-------|------|-----------|
| `email` | `string` | Required, valid email format |
| `password` | `string` | Required, non-empty |

> Same as the existing `loginSchema` in `login-form.tsx`. Extract to `src/schemas/login.schema.ts` for consistency.

---

### 2. `LoginApiRequest` (Sent to backend, via proxy)

| Field | Type | Source |
|-------|------|--------|
| `email` | `string` | from form |
| `password` | `string` | from form |

> No field mapping needed — form fields match backend payload directly.

---

### 3. `LoginSuccess` (Unwrapped from `data` field by interceptor)

Returned by `loginUser()` service on successful authentication.

```typescript
interface LoginSuccess {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;        // seconds, e.g. 3600
  user: LoginUser;
}

interface LoginUser {
  id: string;               // UUID
  email: string;
  firstName: string;
  lastName: string;
  role: string;             // e.g. "Patient"
  isActive: boolean;
}
```

---

### 4. `LoginError` (Type alias for `RegistrationError` — same wire shape)

Returned by `loginUser()` service on failure.

```typescript
interface LoginError {
  errorCode: string;        // e.g. INVALID_CREDENTIALS, NETWORK_ERROR, SERVER_ERROR
  error: string;            // User-facing message
  field?: string;           // Optional field name for field-level errors
}
```

**Known error codes from backend**:

| Code | HTTP Status | Meaning |
|------|------------|---------|
| `INVALID_CREDENTIALS` | 400 | Wrong email or password |
| `NETWORK_ERROR` | N/A | No response from server (network/timeout) |
| `SERVER_ERROR` | 500 | Backend internal error |

---

### 5. `ApiEnvelope<T>` (Shared — already exists in `auth.types.ts`)

All backend responses share this wrapper. The interceptor in `axiosClient` unwraps it before the service sees the response.

```typescript
interface ApiEnvelope<T> {
  success: boolean;
  data: T | null;
  error: ApiEnvelopeError | null;
  meta: {
    timestamp: string;   // ISO 8601
    version: string;     // "1.0"
  };
}
```

The login endpoint wraps `LoginSuccess` in this envelope:
```
ApiEnvelope<LoginSuccess> → axiosClient unwraps → LoginSuccess
```

---

### 6. `AuthUser` (Zustand persist store — existing shape, no change)

Populated from `LoginSuccess.user` after successful login.

```typescript
interface AuthUser {
  userId: string;    // ← mapped from LoginSuccess.user.id
  name: string;      // ← mapped from `${firstName} ${lastName}`.trim()
  email: string;     // ← mapped from LoginSuccess.user.email
}
```

**Mapping**:
```typescript
setAuthenticated({
  userId: data.user.id,
  name: `${data.user.firstName} ${data.user.lastName}`.trim(),
  email: data.user.email,
});
```

---

### 7. `auth_session` Cookie Payload (httpOnly, server-set)

Set by `/api/auth/login` proxy route. Used by Next.js middleware for route guarding.

```typescript
interface AuthSessionCookiePayload {
  email: string;
  name: string;
  accessToken: string;    // JWT — not accessible from JS
  expiresIn: number;      // seconds
}
```

Serialized as base64-encoded JSON.

---

## State Transitions

```
[Form idle]
    │
    │ submit() + valid credentials
    ▼
[Submitting]  →  axiosClient.post('/api/auth/login')
    │                  │
    │          [Proxy → backend]
    │                  │
    ├── success ────── │ ──────────────────────────────►  [LoginSuccess]
    │                                                         │
    │                                                 setAuthenticated()
    │                                                 toast.success()
    │                                                 router.push('/dashboard')
    │
    ├── INVALID_CREDENTIALS ────────────────────────►  [LoginError]
    │                                                         │
    │                                                  toast.error('Incorrect...')
    │                                                  [Form remains filled]
    │
    ├── NETWORK_ERROR ──────────────────────────────►  [LoginError]
    │                                                         │
    │                                                  toast.error('Network error...')
    │
    └── SERVER_ERROR ───────────────────────────────►  [LoginError]
                                                             │
                                                      toast.error('Unable to sign in...')
```
