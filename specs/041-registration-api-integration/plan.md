# Implementation Plan: Registration Screen API Integration

**Branch**: `041-registration-api-integration` | **Date**: 2026-04-10 | **Spec**: [spec.md](./spec.md)  
**Jira**: [SCRUM-41](https://intelera-team-gbifcm47.atlassian.net/browse/SCRUM-41)  
**Input**: Feature specification from `/specs/041-registration-api-integration/spec.md`

## Summary

Connect the existing registration form to the real backend API (`POST http://localhost:8080/api/v1/auth/register`) using an Axios HTTP client with request/response interceptors. Replace inline success/error UI banners with `sonner` toast notifications. Add a `confirmPassword` field to the form (required by the API). Route requests through a Next.js proxy to avoid CORS. Preserve existing retry logic and type-guard patterns.

## Technical Context

**Language/Version**: TypeScript 5 / Node.js 20  
**Primary Dependencies**: Next.js 14.2, React 18, axios (new), sonner (new), Zustand 5, react-hook-form 7, Zod 3.22, @tanstack/react-query 5  
**Storage**: N/A (stateless HTTP; auth state in Zustand + localStorage)  
**Testing**: Jest + React Testing Library (existing)  
**Target Platform**: Web — Next.js App Router, localhost dev  
**Project Type**: Web application (frontend + BFF proxy)  
**Performance Goals**: LCP ≤ 2.5s (existing), registration round-trip ≤ 500ms p95  
**Constraints**: No CORS from browser → backend; backend URL must not be in client bundle  
**Scale/Scope**: Single registration flow; 1 new API endpoint integrated

## Constitution Check

- [x] **Code Quality (Principle I)**: TypeScript strict mode, ESLint enforced
  - Linting tool: ESLint (existing)
  - Code coverage target: 80% business logic (service + interceptors), 70% UI
  
- [x] **Test-Driven (Principle II)**: Tests written before implementation
  - Testing tool: Jest + React Testing Library
  - Unit tests: axios interceptors, registerUser service, form submit handler
  - Integration tests: proxy route → backend contract

- [x] **UX Consistency (Principle III)**:
  - Design system applied: YES — Tailwind Clinical Curator tokens throughout
  - Toast library (sonner) styled to match existing error states
  - `confirmPassword` field uses existing `FormInput` atom
  - WCAG 2.1 AA: form labels, aria-invalid, aria-live regions preserved

- [x] **Performance (Principle IV)**:
  - Axios adds ~13KB gzipped; within bundle budget
  - Sonner adds ~4KB gzipped
  - Retry logic preserved with exponential backoff
  - No synchronous blocking on interceptor chain

**Gate Status**: ✅ PASS

## Project Structure

### Documentation (this feature)

```text
specs/041-registration-api-integration/
├── plan.md              ← This file
├── spec.md              ← Feature specification (from SCRUM-41)
├── research.md          ← Phase 0: library decisions + architecture choices
├── data-model.md        ← Phase 1: type shapes + state transitions
├── quickstart.md        ← Phase 1: dev setup guide
├── contracts/
│   └── register-api.md  ← Phase 1: API + interceptor contracts
└── tasks.md             ← Phase 2 output (/speckit.tasks — NOT created here)
```

### Source Code Changes

```text
website/
├── .env.local                                      NEW  NEXT_PUBLIC_API_BASE_URL
├── src/
│   ├── types/
│   │   └── auth.types.ts                          MOD  ApiEnvelope<T>, updated types
│   ├── schemas/
│   │   └── registration.schema.ts                 MOD  add confirmPassword + refine
│   ├── services/
│   │   ├── api/
│   │   │   └── axios-client.ts                    NEW  axios instance + interceptors
│   │   └── auth/
│   │       └── register.service.ts                MOD  use axios, map fullName
│   ├── app/
│   │   ├── api/
│   │   │   └── auth/
│   │   │       └── register/
│   │   │           └── route.ts                   NEW  Next.js proxy → backend
│   │   └── (public)/
│   │       └── layout.tsx                         MOD  add <Toaster /> (sonner)
│   └── components/
│       └── molecules/
│           └── registration-form.tsx              MOD  confirmPassword field + toasts
└── package.json                                   MOD  +axios, +sonner
```

**Structure Decision**: Single Next.js web app with BFF proxy pattern. Client → `/api/auth/register` → backend at `localhost:8080`. Axios instance is shared across all future API calls.

## Complexity Tracking

No constitution violations. All changes are within existing patterns.

---

## Implementation Steps (for `/speckit.tasks`)

### Step 1 — Dependencies
- Install `axios` and `sonner` via pnpm
- Add `NEXT_PUBLIC_API_BASE_URL=http://localhost:8080` to `.env.local`

### Step 2 — Types (`src/types/auth.types.ts`)
- Add `ApiEnvelope<T>`, `ApiEnvelopeError`, `ApiErrorDetail` interfaces
- Add `confirmPassword` to `RegistrationInput`
- Update `RegistrationSuccess` with `firstName`, `lastName` fields

### Step 3 — Schema (`src/schemas/registration.schema.ts`)
- Add `confirmPassword: z.string().min(1, 'Please confirm your password')`
- Add `.superRefine()` cross-field check: `confirmPassword === password`

### Step 4 — Axios Client (`src/services/api/axios-client.ts`)
- Create axios instance with `baseURL: '/'` (calls Next.js proxy, not backend directly)
- Request interceptor: inject `X-Request-ID` (UUID), `Content-Type: application/json`
- Response interceptor: on `data.success === false` → throw normalized `RegistrationError`; on `data.success === true` → return `data.data`
- Network error interceptor: catch `AxiosError` with no response → return `NETWORK_ERROR`

### Step 5 — Proxy Route (`src/app/api/auth/register/route.ts`)
- POST handler: forward body to `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/register`
- Pass through status code and response body verbatim
- On fetch failure: return `{ success: false, error: { code: 'NETWORK_ERROR', message: '...' } }`

### Step 6 — Registration Service (`src/services/auth/register.service.ts`)
- Replace `fetch` with `axiosClient.post('/api/auth/register', payload)`
- Map: `payload = { fullName: \`${firstName} ${lastName}\`.trim(), email, password, confirmPassword }`
- Keep retry loop; catch `AxiosError` and map to `RegistrationError`

### Step 7 — Registration Form (`src/components/molecules/registration-form.tsx`)
- Add `confirmPassword` field to Section 03 (below password, above terms)
- Add `confirmPassword: ''` to `defaultValues`
- Replace `setFormError` / `setSuccessMessage` state with `toast.success()` / `toast.error()` calls
- Keep `setIsSubmitting` for button disabled state

### Step 8 — Toast Provider
- Add `import { Toaster } from 'sonner'` to `src/app/(public)/layout.tsx`
- Render `<Toaster position="top-right" richColors />` inside the layout

### Step 9 — Tests
- `axios-client.test.ts`: interceptor unit tests (mock axios adapter)
- `register.service.test.ts`: success, INVALID_INPUT, EMAIL_EXISTS, NETWORK_ERROR
- `registration-form.test.tsx`: confirmPassword validation, toast calls on submit
