# Tasks: User Detail API Integration (SCRUM-43)

**Input**: Design documents from `/specs/043-user-detail-api-integration/`  
**Branch**: `043-user-detail-api-integration`  
**Prerequisites**: plan.md ✅ spec.md ✅ research.md ✅ data-model.md ✅ contracts/ ✅ quickstart.md ✅

**Constitution Check**: All tasks adhere to `.specify/memory/constitution.md`:
- Principle I (Code Quality): ESLint, TypeScript strict, ≤3% duplication, cyclomatic complexity ≤5
- Principle II (TDD): Test tasks listed **first** within each story phase — MUST FAIL before implementation
- Principle III (UX): Tailwind skeleton, sonner ARIA toasts, WCAG 2.1 AA
- Principle IV (Performance): React Query staleTime 5 min; p95 ≤ 200ms for `GET /api/v1/users/me`

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no shared state dependency)
- **[US1]**: Belongs to the single user story in this feature

---

## Phase 1: Setup

**Purpose**: Branch prep and verify existing tooling is ready. No new packages required — all dependencies are already in the stack.

- [x] T001 Checkout branch `043-user-detail-api-integration` from `main` and confirm `npm install` passes in `website/`
- [x] T002 Verify backend is reachable at `http://localhost:8080/api/v1/users/me` (expected 401 without token)

**Checkpoint**: Dev environment ready — backend responds, frontend deps installed.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared infrastructure changes that ALL user story work depends on. Must complete before Phase 3.

**⚠️ CRITICAL**: Do not begin Phase 3 tasks until all Phase 2 tasks are complete.

- [x] T003 [P] Add `UserDetail`, `UserDetailSuccess`, `UserDetailError` interfaces and `isUserDetailSuccess` / `isUserDetailError` type guards to `website/src/types/auth.types.ts`
- [x] T004 [P] Add `import { Toaster } from 'sonner'` and render `<Toaster position="top-right" richColors closeButton />` (before `</div>`) in `website/src/app/(private)/layout.tsx`
- [x] T005 Import `useQueryClient` from `@tanstack/react-query` in `website/src/app/(private)/layout.tsx`; call `queryClient.removeQueries({ queryKey: ['user'] })` inside `handleSignOut` before `router.push('/login')` to purge cached user detail on sign-out

**Checkpoint**: Types exported, Toaster active on all private routes, query cache cleared on logout.

---

## Phase 3: User Story 1 — User Detail API Integration (Priority: P1) 🎯 MVP

**Goal**: Fetch the authenticated user's profile from `GET /api/v1/users/me`, expose it through a React Query hook, display real name and email on Dashboard and Profile pages, and surface success/error states via sonner toasts.

**Independent Test**: Sign in → observe green toast "Profile loaded successfully." → Dashboard welcome heading shows your real first name → Profile page shows your real email. Sign out and sign in again → data still loads. Kill the backend → red toast "Unable to load profile. Please try again."

### Tests for User Story 1 ⚠️ WRITE FIRST — must be RED before implementation

> Tests MUST be created and confirmed **failing** before any implementation task (T014–T021) begins. Follow Red-Green-Refactor.

- [x] T006 [P] [US1] Create `website/tests/services/user/user-detail.service.test.ts` — T-UD01: mock `axiosClient.get` to resolve with `UserDetailSuccess`; assert service returns the user object
- [x] T007 [P] [US1] Add T-UD02 to `website/tests/services/user/user-detail.service.test.ts` — mock axios to reject with `{ errorCode: 'INVALID_TOKEN', error: '...' }`; assert service returns `UserDetailError` with `errorCode: 'INVALID_TOKEN'`
- [x] T008 [P] [US1] Add T-UD03 to `website/tests/services/user/user-detail.service.test.ts` — mock axios to reject with `{ errorCode: 'USER_NOT_FOUND', error: '...' }`; assert service returns `UserDetailError` with `errorCode: 'USER_NOT_FOUND'`
- [x] T009 [P] [US1] Add T-UD04 to `website/tests/services/user/user-detail.service.test.ts` — mock axios to throw a network error; assert service returns `UserDetailError` with `errorCode: 'NETWORK_ERROR'`
- [x] T010 [P] [US1] Create `website/tests/hooks/user/use-user-detail.test.ts` — T-UD05: mock `getUserDetail` to resolve successfully; assert `toast.success` is called with "Profile loaded successfully."
- [x] T011 [P] [US1] Add T-UD06 to `website/tests/hooks/user/use-user-detail.test.ts` — mock `getUserDetail` to return `UserDetailError { errorCode: 'INVALID_TOKEN' }`; assert `toast.error` called with "Session expired..." and `router.push('/login')` called
- [x] T012 [P] [US1] Add T-UD07 to `website/tests/hooks/user/use-user-detail.test.ts` — mock `getUserDetail` to return `UserDetailError { errorCode: 'NETWORK_ERROR' }`; assert `toast.error` called with "Unable to load profile..."
- [x] T013 [P] [US1] Create `website/tests/app/(private)/dashboard/page.test.tsx` — T-UD08: mock `useUserDetail` returning `{ userDetail: { firstName: 'Kaushik', ... }, isLoading: false }`; assert welcome heading contains "Kaushik". T-UD09: mock `isLoading: true`; assert skeleton element is rendered instead of the name
- [x] T013b [P] [US1] Create `website/tests/app/(private)/profile/page.test.tsx` — T-UD10: mock `useUserDetail` returning `{ userDetail: { email: 'kaushik@healthcare.com', ... }, isLoading: false }`; assert email field displays the mocked email

**Confirm all tests above are RED** before proceeding to implementation.

### Implementation for User Story 1

- [x] T014 [US1] Create `website/src/app/api/user/me/route.ts` — `export async function GET(request: NextRequest)`:
  - Read `request.cookies.get('auth_session')`; return 401 `INVALID_TOKEN` envelope if absent
  - Wrap `Buffer.from(cookie.value, 'base64').toString('utf-8')` + `JSON.parse` in try/catch; return 401 on failure
  - `fetch(\`${API_BASE_URL}/api/v1/users/me\`, { headers: { Authorization: \`Bearer ${payload.accessToken}\` } })`
  - Return backend JSON + status as-is on success/error; return 503 `NETWORK_ERROR` on catch

- [x] T015 [P] [US1] Create `website/src/services/user/user-detail.service.ts` — `export async function getUserDetail(): Promise<UserDetailSuccess | UserDetailError>`:
  - `const response = await axiosClient.get<UserDetailSuccess>('/api/user/me')` inside try/catch
  - On success: `return response.data`
  - On catch: return `{ errorCode: err?.errorCode ?? 'NETWORK_ERROR', error: err?.error ?? 'Unknown error' }`

- [x] T016 [US1] Create `website/src/hooks/user/use-user-detail.ts` — `export function useUserDetail()`:
  - `const query = useQuery({ queryKey: ['user', 'detail'], queryFn: getUserDetail, staleTime: 300_000 })`
  - Declare `const toastFiredRef = useRef(false)` for one-shot success guard
  - On `query.data` that passes `isUserDetailSuccess`: if `!toastFiredRef.current` → set `true` → `toast.success('Profile loaded successfully.')`
  - On `query.data` that passes `isUserDetailError`: map `errorCode` → `toast.error(message)` + `router.push('/login')` for `INVALID_TOKEN`
  - Return `{ userDetail: UserDetailSuccess | undefined, isLoading: query.isLoading, isError: boolean }`

- [x] T017 [US1] Verify service tests T-UD01–T-UD04 are now GREEN in `website/tests/services/user/user-detail.service.test.ts`; fix implementation if any fail

- [x] T018 [US1] Verify hook tests T-UD05–T-UD07 are now GREEN in `website/tests/hooks/user/use-user-detail.test.ts`; fix implementation if any fail

- [x] T019 [US1] Update `website/src/app/(private)/dashboard/page.tsx`:
  - Add `'use client'` directive if absent
  - Import `useUserDetail` from `@/hooks/user/use-user-detail`
  - Replace hardcoded `"Welcome back, Sarah."` with `"Welcome back, ${userDetail?.firstName ?? '...'}."`
  - Replace hardcoded `"Sarah Jenkins"` in the profile card name with `\`${userDetail?.firstName ?? ''} ${userDetail?.lastName ?? ''}\`.trim()`
  - Wrap name fields in `isLoading` skeleton: `<div className="animate-pulse bg-slate-200 rounded h-5 w-32" aria-busy="true" />` while loading

- [x] T020 [P] [US1] Update `website/src/app/(private)/profile/page.tsx`:
  - Add `'use client'` directive if absent
  - Import `useUserDetail` from `@/hooks/user/use-user-detail`
  - Replace hardcoded `"Sarah Jenkins"` in the profile header name with `\`${userDetail?.firstName ?? ''} ${userDetail?.lastName ?? ''}\`.trim()`
  - Replace hardcoded `"s.jenkins@example.com"` with `userDetail?.email ?? '...'`
  - Wrap name/email with `animate-pulse` skeleton while `isLoading`

- [x] T021 [US1] Verify UI tests T-UD08–T-UD10 are now GREEN in dashboard and profile test files; fix page implementation if any fail

**Checkpoint**: All T-UD01–T-UD10 tests pass. Dashboard shows real first name + green toast on load. Profile shows real email. Red toast fires on backend error. Session expired redirects to `/login`.

---

## Phase 4: Polish & Quality Assurance

**Purpose**: Cross-cutting quality gates across the full feature.

- [x] T022 [P] Run full test suite: `cd website && npm test` — assert all tests pass with no regressions on login or registration flows
- [x] T023 [P] Run linter: `cd website && npm run lint` — fix any ESLint violations; confirm TypeScript strict mode (`no implicit any`, `const`/`let` only)
- [x] T024 Review `user-detail.service.ts` and `use-user-detail.ts` for cyclomatic complexity ≤ 5 per function; refactor if exceeded
- [x] T025 [P] Verify code coverage ≥ 80% for `user-detail.service.ts` and `use-user-detail.ts` business logic; add tests if coverage is below threshold
- [ ] T026 Manual smoke test per `quickstart.md` steps 1–7: sign in → toast → dashboard name → profile email → expired token → backend offline
- [x] T027 [P] Accessibility check: verify skeleton uses `aria-busy="true"`; verify sonner toasts are announced by screen reader (sonner uses ARIA live regions by default)
- [x] T028 Verify no hardcoded `"Sarah"` / `"Sarah Jenkins"` / `"s.jenkins@example.com"` remain in Dashboard or Profile pages (use grep to confirm)

**Checkpoint**: Feature complete and ready for PR per Constitution Phase 3 (Pre-Merge Review).

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1 (Setup)
  └─► Phase 2 (Foundational — types, Toaster, sign-out cache clear)
        └─► Phase 3 (US1 — all implementation + tests)
              └─► Phase 4 (Polish & QA)
```

### Within Phase 3

```
T006–T013b (Write tests — all [P], run in parallel)
  └─► Confirm RED
        └─► T014 (Proxy route) ──┐
            T015 (Service)  ──[P]┤ implement in parallel (different files)
            T016 (Hook)     ──[P]┘
                  └─► T017 (Verify service tests GREEN)
                  └─► T018 (Verify hook tests GREEN)
                  └─► T019 (Dashboard update)
                  └─► T020 (Profile update) [P with T019]
                        └─► T021 (Verify UI tests GREEN)
```

### Parallel Opportunities

- T003, T004, T005 — different files in Phase 2, run in parallel
- T006–T013b — all test files, different paths, run in parallel
- T014, T015, T016 — different files (route, service, hook), run in parallel
- T019, T020 — different page files, run in parallel
- T022–T028 — most Polish tasks are independent checks, run in parallel

---

## Parallel Example: Phase 3 Test Writing

```bash
# All test tasks in parallel (different files, no conflicts):
Task T006/T007/T008/T009: "website/tests/services/user/user-detail.service.test.ts"
Task T010/T011/T012:      "website/tests/hooks/user/use-user-detail.test.ts"
Task T013:                "website/tests/app/(private)/dashboard/page.test.tsx"
Task T013b:               "website/tests/app/(private)/profile/page.test.tsx"
```

## Parallel Example: Phase 3 Implementation

```bash
# After tests are RED, implement all three new files in parallel:
Task T014: "website/src/app/api/user/me/route.ts"         (proxy route)
Task T015: "website/src/services/user/user-detail.service.ts" (service)
Task T016: "website/src/hooks/user/use-user-detail.ts"    (hook)

# Then page updates in parallel:
Task T019: "website/src/app/(private)/dashboard/page.tsx"
Task T020: "website/src/app/(private)/profile/page.tsx"
```

---

## Implementation Strategy

### MVP (This Feature = One Story)

1. Complete Phase 1: Setup (T001–T002)
2. Complete Phase 2: Foundational (T003–T005)
3. Write all tests (T006–T013b) — confirm RED
4. Implement proxy route + service + hook (T014–T016) — in parallel
5. Verify service + hook tests GREEN (T017–T018)
6. Update Dashboard + Profile pages (T019–T020) — in parallel
7. Verify UI tests GREEN (T021)
8. Run Phase 4 quality gates (T022–T028)
9. **Open PR** against `main`

### Key Constraints

- **Do NOT skip TDD**: Tests must be written and confirmed failing before implementation begins (Constitution Principle II — NON-NEGOTIABLE).
- **Scope boundary**: Only replace `name` and `email` fields in the Dashboard and Profile. Vitals, appointments, health records, medications, billing remain hardcoded — separate Jira task.
- **No new packages**: All dependencies are already installed.

---

## Task Count Summary

| Phase | Tasks | Parallel [P] | Story |
|-------|-------|--------------|-------|
| Phase 1: Setup | 2 | 0 | — |
| Phase 2: Foundational | 3 | 2 | — |
| Phase 3: Tests (TDD) | 9 | 9 | US1 |
| Phase 3: Implementation | 8 | 5 | US1 |
| Phase 4: Polish | 7 | 5 | — |
| **Total** | **29** | **21** | — |

**Parallel efficiency**: 21 of 29 tasks (72%) can execute in parallel within their phase.
