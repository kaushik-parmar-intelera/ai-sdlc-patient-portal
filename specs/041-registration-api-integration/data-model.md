# Data Model: Registration API Integration

## Entities & Types

### 1. `RegistrationFormInput` (Client-side form)

The shape the React Hook Form / Zod schema works with. **Unchanged UX** — two name fields preserved.

| Field | Type | Validation |
|-------|------|-----------|
| `firstName` | `string` | 1–128 chars, letters/spaces/hyphens/apostrophes |
| `lastName` | `string` | 1–128 chars, letters/spaces/hyphens/apostrophes |
| `email` | `string` | Valid RFC email, max 254 chars |
| `medicalId` | `string` | Required, no format restriction |
| `password` | `string` | 12–128 chars, uppercase + lowercase + digit + special char |
| `confirmPassword` | `string` | **NEW** — must equal `password` (Zod `.refine()`) |
| `terms` | `boolean` | Must be `true` |

> `confirmPassword` is new. Added to the form (Section 03) below the password field.

---

### 2. `RegistrationApiRequest` (Sent to backend)

Mapped from `RegistrationFormInput` in the service layer.

| Field | Type | Source |
|-------|------|--------|
| `fullName` | `string` | `${firstName} ${lastName}`.trim() |
| `email` | `string` | from form |
| `password` | `string` | from form |
| `confirmPassword` | `string` | from form |

> `medicalId` and `terms` are **not** sent to the backend.

---

### 3. `ApiEnvelope<T>` (Generic backend response wrapper)

All backend responses share this envelope shape.

```typescript
interface ApiEnvelope<T> {
  success: boolean;
  data: T | null;
  error: ApiEnvelopeError | null;
  meta: {
    timestamp: string;   // ISO 8601
    version: string;     // e.g. "1.0"
  };
}

interface ApiEnvelopeError {
  code: string;          // e.g. INVALID_INPUT, EMAIL_EXISTS
  message: string;
  details?: ApiErrorDetail[];
}

interface ApiErrorDetail {
  field: string;         // e.g. "ConfirmPassword"
  reason: string;        // e.g. "confirmPassword must match password"
}
```

---

### 4. `RegistrationSuccess` (Success payload inside envelope)

Returned in `data` on HTTP 201.

| Field | Type | Notes |
|-------|------|-------|
| `userId` | `string` | UUID v4 |
| `email` | `string` | Normalized email |
| `firstName` | `string` | Extracted from fullName by backend |
| `lastName` | `string` | May be empty string |
| `message` | `string` | e.g. "Account created successfully" |

---

### 5. `RegistrationError` (Normalized error — post-interceptor)

Produced by the response interceptor after unwrapping `ApiEnvelope`.

| Field | Type | Notes |
|-------|------|-------|
| `errorCode` | `string` | From `error.code`: `INVALID_INPUT`, `EMAIL_EXISTS`, `SERVER_ERROR`, `NETWORK_ERROR` |
| `error` | `string` | Human-readable message |
| `field` | `string?` | From `error.details[0].field` if present |

---

## State Transitions: Registration Flow

```
[idle]
  → user fills form
[validating] (client-side Zod)
  → invalid: show inline field errors → back to [idle]
  → valid: call registerUser()
[submitting]
  → HTTP 201 success: toast("Account created!") → onSuccess() → redirect /login
  → HTTP 400 INVALID_INPUT: toast.error(field reason)
  → HTTP 409 EMAIL_EXISTS: toast.error("Email already registered")
  → HTTP 5xx / network: toast.error("Unable to create account. Try again.")
  → any error: back to [idle]
```

---

## Schema Changes Summary

| File | Change |
|------|--------|
| `src/schemas/registration.schema.ts` | Add `confirmPassword` field + `.refine()` cross-field check |
| `src/types/auth.types.ts` | Add `ApiEnvelope<T>`, `ApiEnvelopeError`, `ApiErrorDetail`; update `RegistrationInput` to include `confirmPassword`; update `RegistrationSuccess` to include `firstName`, `lastName` |
