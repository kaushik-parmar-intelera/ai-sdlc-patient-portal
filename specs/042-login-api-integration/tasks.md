# Tasks: Login Screen API Integration (SCRUM-42)

**Branch**: `042-login-api-integration`  
**Input**: `/specs/042-login-api-integration/` — plan.md, spec.md, data-model.md, contracts/login-api.md, research.md  
**Approach**: TDD — tests written before implementation (Constitution Principle II)

---

## Phase 1: Setup

**Purpose**: Confirm no new dependencies needed; environment already configured from SCRUM-41

- [X] T001 Confirm `axios` and `sonner` are installed in `website/package.json` (no `pnpm add` needed — carried over from SCRUM-41)
- [X] T002 Confirm `NEXT_PUBLIC_API_BASE_URL=http://localhost:8080` exists in `website/.env.local` (no change needed)
- [X] T003 Confirm `src/services/api/axios-client.ts` exists and exports `axiosClient` — it will be reused as-is

**Checkpoint**: All prerequisites confirmed; proceed to foundational types ✓

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Type definitions, schema extraction, and test fixtures that ALL subsequent tasks depend on. MUST complete in order before Phase 3.

- [X] T004 Add `LoginUser`, `LoginSuccess`, `LoginError`, `isLoginSuccess`, `isLoginError` to `website/src/types/auth.types.ts` — per data-model.md section 3–4
- [X] T005 [P] Create `website/src/schemas/login.schema.ts` — extract `loginSchema` (email required, password required) and `LoginInput` type from `login-form.tsx`; update `login-form.tsx` to import from the new schema file
- [X] T006 [P] Create `website/src/mocks/auth/login.mock.ts` — define `validLoginInput`, `mockLoginResponses.success`, `mockLoginResponses.invalidCredentials`, `mockLoginResponses.serverError`, `mockLoginResponses.networkError` per data-model.md and contracts/login-api.md

**Checkpoint**: Types, schema, and fixtures ready; TDD test writing can begin ✓

---

## Phase 3: Login API Integration (User Story 1 — P1)

**User Story**: As an existing patient, I want my login form to submit credentials to the real backend, receive toast notifications for success/failure, and have my session stored, so I can access the portal securely.

**Independent Test Criteria**: `loginUser()` service returns `LoginSuccess` on 200, returns `LoginError` on 400, does not throw; `LoginForm` renders correctly; shows `toast.success` on success, `toast.error` on `INVALID_CREDENTIALS`; Zustand store populated with correct user data after login.

### TDD: Write Tests First (Red Phase)

- [X] T007 [US1] Write unit tests for `website/tests/unit/services/auth/login.service.test.ts` covering:
  - T-L01: success path — `loginUser()` returns `LoginSuccess` with accessToken and user data
  - T-L02: `INVALID_CREDENTIALS` error — returns `LoginError { errorCode: 'INVALID_CREDENTIALS' }`
  - T-L03: network failure — returns `LoginError { errorCode: 'NETWORK_ERROR' }`
  - Uses `axios-mock-adapter` (already installed) to mock `axiosClient`; mocks envelope wrapping
- [X] T008 [P] [US1] Write component tests for `website/tests/unit/components/molecules/login-form.test.tsx` covering:
  - T-L04: renders email input (`label: /institutional email/i`), password input (`label: /security key/i`), submit button
  - T-L05: `toast.success` called with "Signed in successfully!" when `loginUser` returns `LoginSuccess`
  - T-L06: `toast.error` called with credentials message when `loginUser` returns `INVALID_CREDENTIALS`
  - T-L07: `toast.error` called with network message when `loginUser` returns `NETWORK_ERROR`
  - T-L08: `loginUser` NOT called when email field is empty and form is submitted
  - T-L09: `useAuthSessionStore.getState().isAuthenticated` is `true` after successful login mock
  - Mocks `@/services/auth/login.service` and `sonner`

### Implementation (Green Phase)

- [X] T009 [US1] Implement `website/src/services/auth/login.service.ts`:
  - Import `axiosClient` from `@/services/api/axios-client`
  - Import `LoginInput`, `LoginSuccess`, `LoginError` from `@/types/auth.types`
  - `loginUser(input: LoginInput): Promise<LoginSuccess | LoginError>` — single try/catch, no retry
  - Post to `/api/auth/login` with `{ email: input.email, password: input.password }`
  - On resolved: cast and return as `LoginSuccess` (interceptor already unwrapped envelope)
  - On caught `LoginError` (has `errorCode`): return it
  - On unexpected error: return `{ errorCode: 'NETWORK_ERROR', error: 'An unexpected error occurred. Please try again.' }`
- [X] T010 [US1] Update `website/src/app/api/auth/login/route.ts` — replace mock `TEST_USERS` implementation with real backend proxy:
  - Read `process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8080'`
  - Forward `{ email, password }` to `POST ${apiBaseUrl}/api/v1/auth/login`
  - On backend 200: parse `data.user`, set `auth_session` httpOnly cookie (base64-encode `{ email, name: firstName+lastName, accessToken, expiresIn }`), return full response JSON with 200
  - On backend 4xx/5xx: forward response JSON with same status
  - On fetch network failure: return 503 with NETWORK_ERROR envelope
- [X] T011 [US1] Update `website/src/components/molecules/login-form.tsx` — migrate from `fetch` to `loginUser` service:
  - Add imports: `loginUser` from `@/services/auth/login.service`, `toast` from `sonner`, `isLoginSuccess` / `isLoginError` from `@/types/auth.types`
  - Replace schema inline definition with import from `@/schemas/login.schema`
  - Remove `formError` state, `setFormError`, and the error banner JSX
  - Replace `fetch('/api/auth/login', ...)` call with `loginUser(data)`
  - On `isLoginSuccess`: `toast.success('Signed in successfully!')`, populate store with `userId: data.user.id`, `name: \`\${data.user.firstName} \${data.user.lastName}\`.trim()`, `email: data.user.email`; call `onSuccess?.()`
  - On `isLoginError`: switch on `errorCode` — `INVALID_CREDENTIALS` → toast, `NETWORK_ERROR` → toast, `SERVER_ERROR` → toast, default → `toast.error(response.error || 'Sign in failed.')`

---

## Phase 4: Polish & Quality Assurance

**Purpose**: Cross-cutting quality gates and regression check

- [X] T012 [P] Run `pnpm tsc --noEmit` in `website/` — confirm zero TypeScript errors across all new and modified files (`auth.types.ts`, `login.schema.ts`, `login.service.ts`, `login-form.tsx`, `login/route.ts`, `login.mock.ts`)
- [X] T013 [P] Run `pnpm lint` in `website/` — confirm zero ESLint errors; fix any import-order or unused-import warnings in new files (pre-existing jest.environment.cjs errors unrelated to SCRUM-42)
- [X] T014 Run full test suite `pnpm test` — confirm all new tests pass (T-L01 through T-L09) and no regressions in registration or auth tests
- [ ] T015 Manual smoke test: start dev server (`pnpm dev`) + backend; submit valid credentials → success toast + redirect to `/dashboard`; submit wrong password → `INVALID_CREDENTIALS` toast; stop backend → `NETWORK_ERROR` toast
- [ ] T016 [P] Verify `auth_session` httpOnly cookie is set correctly after login: DevTools → Application → Cookies → `auth_session` (httpOnly ✓, SameSite: Lax ✓, expires ~1 hour)
- [ ] T017 [P] Verify Zustand store is populated: after login, check `localStorage['cc_auth_session']` contains `{ isAuthenticated: true, user: { userId, name, email } }` — confirm `userId` is the UUID (not email address — bug fix from old implementation)

**Checkpoint**: Feature complete, tested, lint-clean, and ready for PR per Constitution Phase 3

---

## Dependencies & Execution Order

```
Phase 1 (T001–T003)       ← confirm prerequisites
       │
       ▼
Phase 2 (T004)            ← types (blocks ALL)
       │
       ├── T005 ─────────── schema extraction (blocks T008, T011)
       └── T006 ─────────── mock fixtures (blocks T007, T008)
                │
                ▼
Phase 3 — TDD:
  T007 (service tests)     ← writes tests, expects RED
  T008 (form tests)        ← writes tests, expects RED
       │
       ▼
  T009 (service impl)      ← makes T007 GREEN
  T010 (proxy route)       ← makes integration GREEN
  T011 (form update)       ← makes T008 GREEN
       │
       ▼
Phase 4 (T012–T017)        ← quality gates, all parallel except T014
```

**Sequential groups**:
- T004 → T005, T006 (schema + mocks need types)
- T007, T008 → T009, T010, T011 (tests written before implementation)
- T009, T010, T011 → T012, T013, T014 (quality gates run after implementation)

**Parallel opportunities**:
- T005, T006 can run in parallel (different files, both depend on T004)
- T007, T008 can run in parallel (different test files)
- T012, T013, T016, T017 can run in parallel (independent checks)

---

## Implementation Strategy

**MVP** (Minimum Viable Delivery — recommended order):
1. T004 → T005 → T009 → T010 → T011 (service + proxy + form, no tests)
2. Validate manually (T015)
3. T006 → T007 → T008 (add tests after manual validation)
4. T012–T017 (quality gates)

**TDD Order** (preferred per Constitution Principle II):
1. T001–T003 (setup confirmation)
2. T004–T006 (foundational types + fixtures)
3. T007, T008 (write tests — RED)
4. T009–T011 (implement — GREEN)
5. T012–T017 (polish + gates)
