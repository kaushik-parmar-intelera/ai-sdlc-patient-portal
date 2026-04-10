# Quickstart: Registration API Integration

## Prerequisites

- Node.js 20+, pnpm 9+
- Backend running at `http://localhost:8080`
- `website/.env.local` configured (see below)

---

## 1. Install New Dependencies

```bash
cd website
pnpm add axios sonner
```

---

## 2. Environment Setup

Create or update `website/.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

---

## 3. Files to Create

| File | Purpose |
|------|---------|
| `src/services/api/axios-client.ts` | Axios instance with request/response interceptors |
| `src/app/api/auth/register/route.ts` | Next.js proxy route → backend |

## 4. Files to Modify

| File | Change |
|------|--------|
| `src/types/auth.types.ts` | Add `ApiEnvelope<T>`, `ApiEnvelopeError`, `ApiErrorDetail`; update `RegistrationInput` (add `confirmPassword`); update `RegistrationSuccess` (add `firstName`, `lastName`) |
| `src/schemas/registration.schema.ts` | Add `confirmPassword` field + `.superRefine()` cross-field password match |
| `src/services/auth/register.service.ts` | Replace `fetch` with axios client; map `firstName+lastName → fullName`; preserve retry logic |
| `src/components/molecules/registration-form.tsx` | Add `confirmPassword` field to Section 03; replace inline success/error banners with `toast()` calls |
| `src/app/(public)/layout.tsx` (or root layout) | Add `<Toaster />` from `sonner` |

---

## 5. Architecture

```
Browser
  └─ RegistrationForm (RHF + Zod)
       └─ registerUser() service
            └─ axiosClient.post('/api/auth/register')   ← interceptors run here
                 └─ Request interceptor: X-Request-ID
                      ↓
            Next.js Route Handler /api/auth/register
                 └─ fetch → http://localhost:8080/api/v1/auth/register
                      ↓
            Response interceptor: unwrap envelope → RegistrationSuccess | RegistrationError
                 ↓
       Toast notification (sonner)
       onSuccess() → router.push('/login?registered=true&email=...')
```

---

## 6. Toast Behavior

| Scenario | Toast |
|----------|-------|
| Success (201) | `toast.success("Account created successfully!")` |
| INVALID_INPUT (400) | `toast.error(details[0].reason \|\| error.message)` |
| EMAIL_EXISTS (409) | `toast.error("This email is already registered. Please sign in.")` |
| SERVER_ERROR (500) | `toast.error("Unable to create your account. Please try again later.")` |
| NETWORK_ERROR | `toast.error("Network error. Please check your connection.")` |

---

## 7. Running Tests

```bash
cd website
pnpm test                  # unit tests
pnpm test:integration      # integration (requires backend running)
```

Test files to create:
- `src/services/api/axios-client.test.ts` — interceptor unit tests
- `src/services/auth/register.service.test.ts` — updated service tests
- `src/components/molecules/registration-form.test.tsx` — toast + submit tests
