# Tasks: Mobile App Login and Dashboard MVP

**Input**: Design documents from `/specs/002-mobile-app-setup/`  
**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [checklists/requirements.md](./checklists/requirements.md)

**Constitution Compliance**: This task breakdown complies with the project constitution:
- Test-first coverage is included for hardcoded auth and protected navigation
- Work is grouped by user story so each increment can be built and validated independently
- `Login` and `Home` must stay aligned to the Stitch design direction while using temporary hardcoded data

**Organization**: Tasks are grouped by setup, foundations, and the two MVP user stories.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create the initial mobile app shell and baseline tooling for the MVP

- [X] T001 Initialize the Expo/React Native app package in `mobile/package.json`
- [X] T002 Create the Expo app entry and router shell in `mobile/app/_layout.tsx` and `mobile/app/index.tsx`
- [X] T003 [P] Configure TypeScript and Expo app settings in `mobile/tsconfig.json`, `mobile/app.json`, and `mobile/babel.config.js`
- [X] T004 [P] Configure ESLint for the mobile app in `mobile/eslint.config.js`
- [X] T005 [P] Configure Jest and React Native Testing Library in `mobile/jest.config.js` and `mobile/jest.setup.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Put in place shared primitives needed by both `Login` and `Home`

**⚠️ CRITICAL**: No user story work should start until this phase is complete

- [X] T006 Create design tokens and shared theme scaffolding in `mobile/src/theme/tokens.ts` and `mobile/src/theme/index.ts`
- [X] T007 [P] Create reusable layout and form primitives in `mobile/src/components/layouts/screen-container.tsx`, `mobile/src/components/forms/text-field.tsx`, and `mobile/src/components/forms/primary-button.tsx`
- [X] T008 Create the hardcoded credential and dashboard constants in `mobile/src/constants/auth.ts` and `mobile/src/constants/dashboard.ts`
- [X] T009 Create shared mobile types in `mobile/src/types/auth.ts` and `mobile/src/types/dashboard.ts`
- [X] T010 Implement MVP auth session store and route guard helpers in `mobile/src/store/auth-store.ts` and `mobile/src/features/auth/route-guard.ts`
- [ ] T011 [P] Write foundational tests for hardcoded auth matching and protected route logic in `tests/unit/mobile/auth-store.test.ts` and `tests/integration/mobile/route-guard.test.ts`

**Checkpoint**: The app shell, shared UI primitives, hardcoded constants, and auth gate are ready for story work

---

## Phase 3: User Story 1 - Patient Logs In With Hardcoded Credentials (Priority: P1) 🎯 MVP

**Goal**: Deliver a login screen that matches the Stitch design direction and authenticates only with the predefined hardcoded credentials

**Independent Test**: Launch the app, submit the valid hardcoded credentials, and confirm the user is routed to `Home`; invalid or empty input must keep the user on `Login`

### Tests for User Story 1

- [ ] T012 [P] [US1] Write login validation and invalid-credentials tests in `tests/unit/mobile/login-form.test.tsx`
- [ ] T013 [P] [US1] Write login submission and navigation integration tests in `tests/integration/mobile/login-navigation.test.tsx`

### Implementation for User Story 1

- [X] T014 [P] [US1] Implement the hardcoded auth utility in `mobile/src/features/auth/auth-service.ts`
- [X] T015 [P] [US1] Implement the login form model and validation schema in `mobile/src/features/auth/login-form.ts`
- [X] T016 [US1] Build the Stitch-aligned login screen in `mobile/app/login.tsx`
- [X] T017 [US1] Wire the app entry route to `Login` in `mobile/app/index.tsx`
- [X] T018 [US1] Connect login submission, validation feedback, and auth store updates in `mobile/app/login.tsx` and `mobile/src/store/auth-store.ts`
- [X] T019 [US1] Verify login accessibility labels, error messaging, and touch targets in `mobile/app/login.tsx`

**Checkpoint**: The app opens to `Login`, validates input, rejects invalid credentials, and accepts the hardcoded valid credentials

---

## Phase 4: User Story 2 - Authenticated Patient Sees a Hardcoded Dashboard (Priority: P1)

**Goal**: Deliver a protected dashboard screen that matches the Stitch design direction and renders static hardcoded values

**Independent Test**: After successful login, verify `Home` loads with the expected hardcoded dashboard values and cannot be reached without authentication

### Tests for User Story 2

- [ ] T020 [P] [US2] Write dashboard rendering tests for hardcoded values in `tests/unit/mobile/home-screen.test.tsx`
- [ ] T021 [P] [US2] Write protected-dashboard access tests in `tests/integration/mobile/home-guard.test.tsx`

### Implementation for User Story 2

- [X] T022 [P] [US2] Implement dashboard data mapping helpers in `mobile/src/features/home/home-model.ts`
- [X] T023 [P] [US2] Build reusable dashboard sections in `mobile/src/components/layouts/dashboard-header.tsx` and `mobile/src/components/layouts/dashboard-card.tsx`
- [X] T024 [US2] Build the Stitch-aligned protected dashboard screen in `mobile/app/home.tsx`
- [X] T025 [US2] Connect `Home` to hardcoded dashboard constants and protected session checks in `mobile/app/home.tsx` and `mobile/src/features/auth/route-guard.ts`
- [X] T026 [US2] Enforce redirect-to-login behavior for unauthenticated access in `mobile/app/home.tsx` and `mobile/app/index.tsx`
- [X] T027 [US2] Verify dashboard accessibility labels and stable rendering for hardcoded content in `mobile/app/home.tsx`

**Checkpoint**: Successful login leads to a protected `Home` dashboard with repeatable hardcoded content

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Finalize the MVP for review and handoff

- [X] T028 [P] Add feature notes and hardcoded-credentials usage guidance to `mobile/README.md`
- [X] T029 Run and document the MVP smoke-test flow in `specs/002-mobile-app-setup/quickstart.md`
- [X] T030 Perform code cleanup and ensure deferred screens are not accidentally linked from `mobile/app/login.tsx` and `mobile/app/home.tsx`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Can start immediately
- **Foundational (Phase 2)**: Depends on Setup and blocks all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational and delivers the first useful MVP slice
- **User Story 2 (Phase 4)**: Depends on Foundational and on the authenticated path created in User Story 1
- **Polish (Phase 5)**: Depends on the desired MVP stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: No dependency on other user stories
- **User Story 2 (P1)**: Depends on User Story 1 for successful hardcoded login and session state

### Within Each User Story

- Write tests before implementation
- Build underlying logic before screen integration where possible
- Complete screen behavior before polish and accessibility sign-off

### Parallel Opportunities

- `T003`, `T004`, and `T005` can run in parallel after package initialization
- `T006`, `T007`, `T008`, `T009`, and `T011` have parallel slices once the app shell exists
- `T012` and `T013` can run in parallel for the login story
- `T014` and `T015` can run in parallel before login screen assembly
- `T020` and `T021` can run in parallel for the dashboard story
- `T022` and `T023` can run in parallel before final `Home` integration

---

## Parallel Example: User Story 1

```bash
Task: "Write login validation and invalid-credentials tests in tests/unit/mobile/login-form.test.tsx"
Task: "Write login submission and navigation integration tests in tests/integration/mobile/login-navigation.test.tsx"

Task: "Implement the hardcoded auth utility in mobile/src/features/auth/auth-service.ts"
Task: "Implement the login form model and validation schema in mobile/src/features/auth/login-form.ts"
```

---

## Parallel Example: User Story 2

```bash
Task: "Write dashboard rendering tests for hardcoded values in tests/unit/mobile/home-screen.test.tsx"
Task: "Write protected-dashboard access tests in tests/integration/mobile/home-guard.test.tsx"

Task: "Implement dashboard data mapping helpers in mobile/src/features/home/home-model.ts"
Task: "Build reusable dashboard sections in mobile/src/components/layouts/dashboard-header.tsx and mobile/src/components/layouts/dashboard-card.tsx"
```

---

## Implementation Strategy

### MVP First

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1 (`Login`)
4. Validate the login flow with hardcoded credentials
5. Complete Phase 4: User Story 2 (`Home`)
6. Finish polish items needed for review

### Incremental Delivery

1. Ship the app shell plus login experience first
2. Add the protected hardcoded dashboard second
3. Replace hardcoded auth and dashboard data with real APIs in a later increment without redesigning the screens
