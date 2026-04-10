# Tasks: Registration Screen API Integration

**Input**: Design documents from `/specs/041-registration-api-integration/`  
**Branch**: `041-registration-api-integration` | **Jira**: SCRUM-41  
**Prerequisites**: plan.md ✓ spec.md ✓ research.md ✓ data-model.md ✓ contracts/ ✓ quickstart.md ✓

**Constitution Check**: All tasks adhere to `.specify/memory/constitution.md`:
- Principle I (Code Quality): TypeScript strict, ESLint, ≥80% business logic coverage
- Principle II (TDD): Tests written first (Red-Green-Refactor)
- Principle III (UX): Clinical Curator design system, WCAG 2.1 AA preserved
- Principle IV (Performance): Bundle impact validated; round-trip ≤500ms p95

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this belongs to (US1, US2, US3)

---

## Phase 1: Setup

**Purpose**: Install new dependencies and configure environment

- [ ] T001 Install `axios` and `sonner` packages in `website/` via `pnpm add axios sonner`
- [ ] T002 [P] Add `NEXT_PUBLIC_API_BASE_URL=http://localhost:8080` to `website/.env.local`
- [ ] T003 [P] Add `NEXT_PUBLIC_API_BASE_URL=http://localhost:8080` to `website/.env.example` (documentation)

**Checkpoint**: Dependencies installed, env variable available to server routes

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared types and schema changes that all user stories depend on

⚠️ **CRITICAL**: Phases 3, 4, 5 cannot begin until this phase is complete

- [ ] T004 Update `website/src/types/auth.types.ts` — add `ApiEnvelope<T>`, `ApiEnvelopeError`, `ApiErrorDetail` interfaces matching the backend envelope shape `{ success, data, error, meta }`
- [ ] T005 Update `website/src/types/auth.types.ts` — add `confirmPassword: string` to `RegistrationInput`; update `RegistrationSuccess` to include `firstName: string` and `lastName: string` fields
- [ ] T006 Update `website/src/schemas/registration.schema.ts` — add `confirmPassword: z.string().min(1, 'Please confirm your password')` field and `.superRefine()` cross-field validation ensuring `confirmPassword === password`

**Checkpoint**: Shared types and validation schema are complete; downstream tasks can reference them

---

## Phase 3: User Story 1 — Axios HTTP Client & Interceptors (P1)

**Goal**: Central axios instance with request/response interceptors that handles `X-Request-ID` injection and backend envelope unwrapping — used by all future API calls

**Independent Test**: `axiosClient.post('/api/auth/register', validPayload)` returns unwrapped `RegistrationSuccess` data; `axiosClient.post()` with a `success: false` response throws a normalized `RegistrationError`; network failure resolves to `errorCode: NETWORK_ERROR`

### Tests for User Story 1 (write FIRST — must FAIL before implementation) ⚠️

- [ ] T007 [P] [US1] Write unit test: request interceptor attaches `X-Request-ID` (UUID format) and `Content-Type: application/json` headers in `website/src/services/api/__tests__/axios-client.test.ts`
- [ ] T008 [P] [US1] Write unit test: response interceptor unwraps `{ success: true, data: {...} }` envelope and resolves with the `data` payload in `website/src/services/api/__tests__/axios-client.test.ts`
- [ ] T009 [P] [US1] Write unit test: response interceptor throws normalized `RegistrationError` when `success: false` with `errorCode` from `error.code` in `website/src/services/api/__tests__/axios-client.test.ts`
- [ ] T010 [P] [US1] Write unit test: network error (no response) maps to `{ errorCode: 'NETWORK_ERROR', error: '...' }` in `website/src/services/api/__tests__/axios-client.test.ts`

### Implementation for User Story 1

- [ ] T011 [US1] Create `website/src/services/api/axios-client.ts` — export named `axiosClient` instance with `baseURL: '/'`; add request interceptor injecting `X-Request-ID` (crypto.randomUUID()) and `Content-Type: application/json`
- [ ] T012 [US1] Add response interceptor to `axiosClient` in `website/src/services/api/axios-client.ts` — on `response.data.success === true` return `response.data.data`; on `success === false` throw `RegistrationError` with `errorCode: error.code`, `error: error.message`, `field: error.details?.[0]?.field`
- [ ] T013 [US1] Add error interceptor to `axiosClient` in `website/src/services/api/axios-client.ts` — catch `AxiosError` with no response (`error.request` exists, no `error.response`) and throw `{ errorCode: 'NETWORK_ERROR', error: 'Network error...' }`; catch `AxiosError` with response and re-throw normalized `RegistrationError` from `error.response.data.error`
- [ ] T014 [US1] Verify T007–T010 tests now pass (green); confirm coverage ≥80% on `axios-client.ts`

**Checkpoint**: Axios client fully functional and tested; US2 and US3 can start

---

## Phase 4: User Story 2 — Next.js Proxy Route & Service Migration (P1)

**Goal**: Next.js route handler proxies registration requests to the backend (bypassing CORS), and the registration service switches from `fetch` to `axiosClient`

**Independent Test**: `POST /api/auth/register` with valid payload returns `201` and backend success body; with invalid `confirmPassword` returns `400`; with duplicate email returns `409`

### Tests for User Story 2 (write FIRST — must FAIL before implementation) ⚠️

- [ ] T015 [P] [US2] Write integration test: `POST /api/auth/register` proxy forwards request body to `${NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/register` and returns status + body verbatim in `website/src/app/api/auth/register/__tests__/route.test.ts` (use `msw` or `nock` to mock backend)
- [ ] T016 [P] [US2] Write unit test: `registerUser()` service maps `{ firstName, lastName, email, password, confirmPassword }` to `{ fullName: 'First Last', email, password, confirmPassword }` before sending in `website/src/services/auth/__tests__/register.service.test.ts`
- [ ] T017 [P] [US2] Write unit test: `registerUser()` returns `RegistrationSuccess` on HTTP 201; returns `RegistrationError` with correct `errorCode` on 400, 409, 500; returns `NETWORK_ERROR` after 3 failed attempts in `website/src/services/auth/__tests__/register.service.test.ts`

### Implementation for User Story 2

- [ ] T018 [US2] Create `website/src/app/api/auth/register/route.ts` — POST handler that reads body, calls `fetch(${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/register, { method: 'POST', body: JSON.stringify(body) })`, returns backend response status + JSON body unchanged; on fetch failure return `{ success: false, error: { code: 'NETWORK_ERROR', message: 'Unable to reach registration service' } }` with status 503
- [ ] T019 [US2] Update `website/src/services/auth/register.service.ts` — replace `fetch('/api/auth/register', ...)` with `axiosClient.post('/api/auth/register', payload)` where `payload = { fullName: \`${firstName} ${lastName}\`.trim(), email, password, confirmPassword }`; remove manual JSON parse; preserve the 3-attempt retry loop; map `AxiosError` catches to `RegistrationError`
- [ ] T020 [US2] Verify T015–T017 tests now pass (green); confirm `register.service.ts` coverage ≥80%

**Checkpoint**: Registration API call reaches backend; service is fully migrated

---

## Phase 5: User Story 3 — Form UI + Toast Notifications (P1)

**Goal**: `confirmPassword` field added to the registration form; all inline success/error banners replaced with `sonner` toast calls

**Independent Test**: Submit form with mismatched passwords → client-side Zod error on `confirmPassword` field, no API call; submit with valid data → success toast appears and redirect to `/login?registered=true&email=...`; API 409 → error toast "This email is already registered"

### Tests for User Story 3 (write FIRST — must FAIL before implementation) ⚠️

- [ ] T021 [P] [US3] Write component test: `confirmPassword` field renders in Section 03; entering mismatched value shows inline Zod error "Passwords do not match" in `website/src/components/molecules/__tests__/registration-form.test.tsx`
- [ ] T022 [P] [US3] Write component test: successful submit calls `toast.success("Account created successfully!")` and calls `onSuccess(userId, email)` in `website/src/components/molecules/__tests__/registration-form.test.tsx`
- [ ] T023 [P] [US3] Write component test: 409 `EMAIL_EXISTS` response calls `toast.error("This email is already registered. Please sign in.")` in `website/src/components/molecules/__tests__/registration-form.test.tsx`
- [ ] T024 [P] [US3] Write component test: `NETWORK_ERROR` response calls `toast.error("Network error. Please check your connection.")` in `website/src/components/molecules/__tests__/registration-form.test.tsx`

### Implementation for User Story 3

- [ ] T025 [US3] Add `import { toast } from 'sonner'` and `import { Toaster } from 'sonner'` to `website/src/app/(public)/layout.tsx`; render `<Toaster position="top-right" richColors closeButton />` inside the layout body
- [ ] T026 [US3] Update `website/src/components/molecules/registration-form.tsx` — add `confirmPassword` to `defaultValues: { confirmPassword: '' }`; add `confirmPassword` field in Section 03 between password and the terms checkbox, using the existing `FormInput` atom with `type="password"`, `label="Confirm Password"`, `autoComplete="new-password"`
- [ ] T027 [US3] Update `onSubmit` in `website/src/components/molecules/registration-form.tsx` — replace `setSuccessMessage()` with `toast.success(response.message || "Account created successfully!")`; replace all `setFormError()` cases with the appropriate `toast.error()` call per the toast behavior table in `quickstart.md`; remove `formError`, `successMessage`, and `fieldError` state variables and their JSX render blocks
- [ ] T028 [US3] Verify T021–T024 tests now pass (green); confirm `registration-form.tsx` UI coverage ≥70%

**Checkpoint**: Full end-to-end registration flow works — form → service → proxy → backend → toast

---

## Phase 6: Polish & Quality Assurance

**Purpose**: Cross-cutting quality gates, regression check, and cleanup

- [X] T029 [P] Run `pnpm tsc --noEmit` in `website/` — confirm zero TypeScript errors across all modified files
- [X] T030 [P] Run `pnpm lint` in `website/` — confirm zero ESLint errors; fix any introduced by new files
- [X] T031 Run full test suite `pnpm test` — confirm all existing tests still pass (regression check for login flow)
- [ ] T032 Manual smoke test: start dev server (`pnpm dev`) + backend (`localhost:8080`); submit registration form with valid data → 201 toast; duplicate email → 409 toast; wrong passwords → Zod inline error; no backend → NETWORK_ERROR toast
- [ ] T033 Accessibility check: inspect `confirmPassword` field has `id`, `aria-invalid`, `aria-describedby` wired correctly; toast container has `aria-live="polite"` (sonner default — verify)
- [ ] T034 Bundle impact check: run `pnpm build` and confirm gzipped bundle increase is within acceptable range (axios ~13KB + sonner ~4KB expected)
- [ ] T035 [P] Verify code duplication ≤3% and cyclomatic complexity ≤5 per function across new/modified files
- [X] T036 Remove `formError`, `successMessage`, `fieldError` state and their type references from `registration-form.tsx` if not already cleaned up in T027

**Checkpoint**: Feature complete, tested, lint-clean, and ready for PR per Constitution Phase 3

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1 (Setup)
  └─ Phase 2 (Foundational)  ← BLOCKS all user stories
       ├─ Phase 3 (US1 - Axios Client)  ← BLOCKS Phase 4
       │    └─ Phase 4 (US2 - Proxy + Service)  ← BLOCKS Phase 5
       │         └─ Phase 5 (US3 - Form + Toast)
       └─ (US3 schema changes can start after Phase 2)
Phase 6 (Polish) ← after Phase 5 complete
```

### User Story Dependencies

- **US1** (Phase 3): Depends on Phase 2 (types). No dependency on US2 or US3.
- **US2** (Phase 4): Depends on US1 (`axiosClient` import). Independently testable via proxy route.
- **US3** (Phase 5): Depends on Phase 2 (schema). Form tests can be written in parallel with US1/US2.

### Parallel Opportunities Within Stories

**Phase 1**: T002 and T003 can run in parallel  
**Phase 2**: T004, T005, T006 are independent files — run in parallel  
**Phase 3**: T007, T008, T009, T010 (tests) run in parallel; T011 → T012 → T013 are sequential (same file)  
**Phase 4**: T015, T016, T017 (tests) run in parallel; T018 and T019 are independent files — run in parallel  
**Phase 5**: T021, T022, T023, T024 (tests) run in parallel; T025 (layout) independent of T026–T027 (form)  
**Phase 6**: T029, T030, T032, T033, T034, T035 all independent — run in parallel

---

## Parallel Example: Phase 4 (US2)

```bash
# Write tests and create proxy route simultaneously:
Task A: "Write integration test for proxy route in website/src/app/api/auth/register/__tests__/route.test.ts"
Task B: "Write unit tests for registerUser() service in website/src/services/auth/__tests__/register.service.test.ts"
Task C: "Create Next.js proxy route.ts in website/src/app/api/auth/register/route.ts"
# T018 (proxy) and T019 (service) are different files — run in parallel
```

---

## Implementation Strategy

### MVP: US1 + US2 + US3 (all P1 — single story, full feature)

Since SCRUM-41 is one user story with a single acceptance condition (registration calls the real API with toasts), all phases are MVP:

1. Complete Phase 1: Setup (T001–T003)
2. Complete Phase 2: Foundational types + schema (T004–T006)
3. Complete Phase 3: Axios client (T007–T014)
4. Complete Phase 4: Proxy route + service (T015–T020)
5. Complete Phase 5: Form UI + toasts (T021–T028)
6. **VALIDATE**: Manual smoke test end-to-end
7. Complete Phase 6: Polish (T029–T036)
8. Open PR against `develop`

### Task Count Summary

| Phase | Tasks | Parallelizable |
|-------|-------|---------------|
| Phase 1 — Setup | 3 | 2 |
| Phase 2 — Foundational | 3 | 3 |
| Phase 3 — US1 Axios Client | 8 | 4 (tests) |
| Phase 4 — US2 Proxy + Service | 6 | 5 |
| Phase 5 — US3 Form + Toast | 8 | 5 |
| Phase 6 — Polish | 8 | 6 |
| **Total** | **36** | **25** |

---

## Notes

- [P] tasks touch different files — safe to run in parallel with no merge conflicts
- Test tasks (T007–T010, T015–T017, T021–T024) MUST be committed and failing before their implementation siblings start
- `axios-client.ts` is the single most critical file — all downstream depends on it being correct
- Do NOT delete the existing `http-client.ts` (used elsewhere); `axios-client.ts` is additive
- `sonner`'s `<Toaster>` must be in `(public)/layout.tsx` (not root layout) so it only renders on public auth pages; the private layout already has its own potential notification surface
- Commit after each checkpoint; use the branch `041-registration-api-integration` throughout
