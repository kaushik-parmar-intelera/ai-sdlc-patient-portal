# Data Model: User Registration

**Phase**: Phase 1 (Design & Contracts)  
**Date**: 2026-04-08  
**Input**: spec.md § 2-4, plan.md § Phase 1.1, research.md (decisions)

---

## 1. Core Entities & Types

### RegistrationInput (Client-side Form)

User-submitted data from the registration form.

```typescript
// website/src/types/auth.types.ts
export interface RegistrationInput {
  fullName: string;  // 2-256 chars, letters + spaces + hyphens + apostrophes
  email: string;     // RFC 5322 simplified; unique constraint
  password: string;  // 8+ chars, uppercase + lowercase + digit + special char
}
```

**Validation Rules** (enforced by Zod schema):

| Field | Min | Max | Pattern | Error Message |
|-------|-----|-----|---------|---------------|
| fullName | 2 | 256 | `^[a-zA-Z\s'-]+$` | "Name can only contain letters, spaces, hyphens, and apostrophes" |
| email | 1 | 254 | RFC 5322 | "Invalid email address" |
| password | 8 | 128 | Uppercase + lowercase + digit + special | "Password must contain uppercase, lowercase, number, and special character" |

---

### RegistrationSuccess

Server response on successful account creation (HTTP 201 Created).

```typescript
// website/src/types/auth.types.ts
export interface RegistrationSuccess {
  userId: string;       // Unique user identifier (e.g., "usr_abc123")
  email: string;        // Confirmed email (matches input)
  message: string;      // "Account created successfully"
}
```

**Sample Response**:
```json
{
  "userId": "usr_e7f4c2d9b1a5",
  "email": "jane.doe@example.com",
  "message": "Account created successfully"
}
```

---

### RegistrationError

Server response on validation or processing error (HTTP 400, 409, 500).

```typescript
// website/src/types/auth.types.ts
export interface RegistrationError {
  error: string;      // User-friendly error message (no stack traces)
  errorCode: string;  // Machine-readable code (EMAIL_EXISTS | INVALID_INPUT | SERVER_ERROR)
  field?: string;     // Optional: field name that failed (email, password, etc.)
}
```

**Error Scenarios**:

| Scenario | HTTP | errorCode | error | field |
|----------|------|-----------|-------|-------|
| Email already exists | 409 | EMAIL_EXISTS | "Email already registered. Try login or use another email." | email |
| Invalid format | 400 | INVALID_INPUT | "Invalid email address" | email |
| Password too weak | 400 | INVALID_INPUT | "Password must contain uppercase letter" | password |
| Server fault | 500 | SERVER_ERROR | "Unable to create account. Please try again later." | N/A |
| Network timeout | (client) | NETWORK_ERROR | "Connection lost. Please check your internet and retry." | N/A |

---

## 2. Zod Validation Schema

Complete schema definition for client-side validation.

```typescript
// website/src/schemas/registration.schema.ts
import { z } from 'zod';

export const registrationSchema = z.object({
  fullName: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(256, "Name must not exceed 256 characters")
    .regex(
      /^[a-zA-Z\s'-]+$/,
      "Name can only contain letters, spaces, hyphens, and apostrophes"
    ),

  email: z
    .string()
    .email("Invalid email address")
    .max(254, "Email must not exceed 254 characters"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password must not exceed 128 characters")
    .regex(/[A-Z]/, "Password must contain an uppercase letter")
    .regex(/[a-z]/, "Password must contain a lowercase letter")
    .regex(/[0-9]/, "Password must contain a number")
    .regex(/[^a-zA-Z0-9]/, "Password must contain a special character"),
});

// Inferred TypeScript type (full type safety without duplication)
export type RegistrationInput = z.infer<typeof registrationSchema>;

// Export validator function for backend use (if needed)
export const validateRegistration = (data: unknown) => {
  const result = registrationSchema.safeParse(data);
  return result;
};
```

**Usage in Components**:
```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registrationSchema, type RegistrationInput } from '@/schemas/registration.schema';

function RegistrationForm() {
  const form = useForm<RegistrationInput>({
    resolver: zodResolver(registrationSchema),
    mode: 'onChange',
  });
  
  // form.formState.errors now has type-safe error messages
}
```

---

## 3. Form State Machine

Registration submission flow with state transitions.

```typescript
// website/src/types/auth.types.ts
export type FormState = 'idle' | 'validating' | 'valid' | 'invalid' | 'submitting' | 'success' | 'error';

export interface FormContext {
  state: FormState;
  values: Partial<RegistrationInput>;
  errors: Partial<Record<keyof RegistrationInput, string>>;
  serverError?: RegistrationError;
  isSubmitting: boolean;
  isValid: boolean;
}
```

**State Diagram**:

```
                        ┌─────────────────────────────────────────────┐
                        │                                             │
                        ▼                                             │
    ┌──────────┐      ┌─────────┐      ┌──────────┐                  │
    │  idle    │─────▶│ invalid │      │  valid   │                  │
    └──────────┘      └─────────┘      └──────────┘                  │
         ▲                ▲                   │                       │
         │                │                   ▼                       │
         │                └───────────────────┤                       │
         │             (validation feedback)  │                       │
         │                                    ▼                       │
         │                               ┌──────────┐                │
         │                               │submitting│                │
         │                               └──────────┘                │
         │                                  │      │                 │
         │                                  │      │                 │
         │                   (201 Created) ▼      ▼ (4xx/5xx)       │
         │                               ┌────────┐                  │
         │                               │success │                  │
         │                               └────────┘                  │
         │                                  │                        │
         │                                  │ (redirect after 2s)    │
         │                                  ▼                        │
         │                             (navigate to /login)          │
         │                                  │                        │
         └──────────────────────────────────┤                        │
                                            │                        │
    (reset on new attempt)          ┌──────────┐                     │
         └───────────────────────────│  error   │────────────────────┘
                                      └──────────┘ (retry button)
```

---

## 4. API Request/Response Contract

Formal specification for client-server communication.

### Request

```typescript
// Endpoint: POST /api/auth/register
// Content-Type: application/json

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
}
```

**Example**:
```http
POST /api/auth/register HTTP/1.1
Host: localhost:3000
Content-Type: application/json
Content-Length: 78

{
  "fullName": "Jane Doe",
  "email": "jane.doe@example.com",
  "password": "SecurePass123!"
}
```

---

### Response - Success (201 Created)

```typescript
export interface RegisterSuccessResponse {
  userId: string;
  email: string;
  message: string;
}
```

**Example**:
```http
HTTP/1.1 201 Created
Content-Type: application/json

{
  "userId": "usr_e7f4c2d9b1a5",
  "email": "jane.doe@example.com",
  "message": "Account created successfully"
}
```

---

### Response - Error (400 Bad Request)

**Validation Error**:
```http
HTTP/1.1 400 Bad Request
Content-Type: application/json

{
  "error": "Invalid email address",
  "errorCode": "INVALID_INPUT",
  "field": "email"
}
```

---

### Response - Error (409 Conflict)

**Email Already Exists**:
```http
HTTP/1.1 409 Conflict
Content-Type: application/json

{
  "error": "Email already registered. Try login or use another email.",
  "errorCode": "EMAIL_EXISTS",
  "field": "email"
}
```

---

### Response - Error (500 Internal Server Error)

**Server Error**:
```http
HTTP/1.1 500 Internal Server Error
Content-Type: application/json

{
  "error": "Unable to create account. Please try again later.",
  "errorCode": "SERVER_ERROR"
}
```

---

## 5. Storage & Persistence

### Client-Side Storage

**No persistent storage**. Form state lives in React Hook Form's internal state and React component state.

- ✅ Form field values: React Hook Form `watch()`
- ✅ Validation errors: React Hook Form `formState.errors`
- ✅ Submission state: React Hook Form `formState.isSubmitting` + custom Zustand store (optional)
- ❌ Password storage: NEVER stored anywhere except in-flight to server
- ❌ Session storage: Registration does NOT create session; user must login separately

### Server-Side Storage

Out of scope for frontend; handled by backend:

- User account creation in database (usually PostgreSQL/MySQL)
- Password hashing (BCRYPT or Argon2)
- Email validation & uniqueness constraint in database
- Audit logging of registration attempt

---

## 6. Relations & Constraints

### Data Constraints

| Property | Constraint | Validation | Impact |
|----------|-----------|-----------|--------|
| email | UNIQUE | Database constraint + API 409 response | User cannot register with existing email |
| email | NOT NULL | Schema requirement | Backend rejects null email |
| password | NOT LOGGED | Application & ops policy | No plane-text passwords in logs |
| userId | GENERATED | Backend auto-increment or UUID | Frontend receives after successful registration |
| fullName | INDEX? | Optional (for search/reporting) | Backend decides |

### Relationships

**Current**:
- Registration → (creates) → User Account → (has) → Session (deferred to login)

**Future Phases**:
- User Account → (receives) → Welcome Email (Phase 2)
- User Account → (starts) → Onboarding Flow (Phase 2+)
- User Account ← (authenticated by) → Auth Session (Phase 2+)

---

## 7. State Transitions & Behaviors

### Happy Path: Successful Registration

```
User enters:
  fullName: "Jane Doe"
  email: "jane@example.com"
  password: "SecurePass123!"
        ↓
Client validates (Zod schema) → VALID
        ↓
Submit button enabled, user clicks
        ↓
State: submitting = true
        ↓
POST /api/auth/register
        ↓
Backend response: 201 + { userId, email, message }
        ↓
State: success = true
Show success banner: "Account created successfully"
        ↓
After 2s delay:
        ↓
Navigate to /login?registered=true
Show banner: "Registration successful! Enter your credentials."
```

---

### Error Path: Email Already Exists

```
User enters:
  fullName: "John Smith"
  email: "existing@example.com"  ← Already registered
  password: "StrongPass456!"
        ↓
Client validates (Zod) → VALID
        ↓
Submit button enabled, user clicks
        ↓
State: submitting = true
        ↓
POST /api/auth/register
        ↓
Backend response: 409 + { error, errorCode: "EMAIL_EXISTS", field: "email" }
        ↓
State: error = true, serverError = RegistrationError
        ↓
Show error banner: "Email already registered. Try login or use another email."
Highlight email field with red border
Focus returns to email input
        ↓
User can retry or navigate to login
```

---

### Error Path: Validation Error

```
User enters:
  fullName: "J"  ← Too short
  email: "invalid-email"  ← Invalid format
  password: "short"  ← Too weak
        ↓
Client validates (Zod) → INVALID
        ↓
Errors displayed in real-time:
  - fullName error: "Name must be at least 2 characters"
  - email error: "Invalid email address"
  - password error: "Password must contain an uppercase letter"
        ↓
Submit button DISABLED
        ↓
User corrects fields
        ↓
Errors clear as fields become valid
        ↓
Submit button ENABLED (when all fields valid)
        ↓
User submits (happy path or error path)
```

---

## 8. Accessibility Data Attributes

Form fields and error messages must support WCAG 2.1 AA compliance.

```typescript
// FormInput Component structure
<div>
  <label htmlFor="fullName">
    Full Name
    <span aria-label="required">*</span>
  </label>
  <input
    id="fullName"
    name="fullName"
    type="text"
    aria-invalid={!!errors.fullName}
    aria-describedby={errors.fullName ? 'fullName-error' : undefined}
    required
  />
  {errors.fullName && (
    <div
      id="fullName-error"
      role="alert"
      aria-live="polite"
    >
      {errors.fullName.message}
    </div>
  )}
</div>
```

**Key Attributes**:
- `htmlFor`: Links label to input
- `aria-invalid`: Indicates invalid state
- `aria-describedby`: Links input to error message
- `role="alert"`: Announces errors to screen readers
- `aria-live="polite"`: Dynamic error updates announced
- `required`: HTML5 required attribute

---

## 9. Bundle & Performance Impact

### Dependency Sizes (Gzipped)

| Package | Size | Source |
|---------|------|--------|
| react-hook-form | ~8.6 KB | npm (tree-shaken) |
| zod | ~8 KB | npm (tree-shaken) |
| @hookform/resolvers | ~2 KB | npm (tree-shaken) |
| **Total New** | **~18.6 KB** | Estimate |
| **Feature Code** | ~15 KB | Forms + schemas + services (uncompressed) |
| **Component Bundle Impact** | ~4 KB | Registration page + form component (gzipped estimate) |

**Total Impact**: ~25 KB (under 50 KB constraint per spec)

### Performance Targets

- Form render: <100ms (React Hook Form is lightweight)
- Field validation: <50ms per keystroke (Zod schema fast)
- Submit feedback: ≤200ms p95 (server RTT + client processing)
- FCP/LCP: ≤2.5s (registration page doesn't change existing metrics; baseline from home page)

---

## Summary

This data model defines:
- ✅ Input/output types (RegistrationInput, RegistrationSuccess, RegistrationError)
- ✅ Validation schema (Zod with comprehensive rules)
- ✅ Form state machine (transitions from idle → success/error)
- ✅ API contract (request/response formats)
- ✅ No new storage requirements (stateless form)
- ✅ Accessibility attributes (WCAG 2.1 AA)
- ✅ Performance aligned (under budget)

**Ready for Phase 1.2**: Proceed to contracts/ generation and quickstart.md development.
