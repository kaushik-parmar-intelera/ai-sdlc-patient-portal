# Tasks: User Registration Screen

**Input**: Design documents from `/specs/002-user-registration-screen/`  
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/, quickstart.md

**Constitution Check**: All tasks MUST adhere to `.specify/memory/constitution.md` principles:
- Principle I (Code Quality): Linting, duplication limits, complexity controls, and coverage >=80% for business logic
- Principle II (TDD): Tests written first and failing before implementation (Red-Green-Refactor)
- Principle III (UX): Design-system consistency and WCAG 2.1 AA accessibility
- Principle IV (Performance): Web performance targets and regression validation

**Tests**: Tests are MANDATORY for this feature per spec and constitution.

**Project Layout**: Implementation is active in `website/`; existing structure maintained.

---

## Phase 1: Setup (Project Initialization)

**Purpose**: Install dependencies, create type/schema scaffolding, set up test environment.

- [x] T001 ✅ Install form & validation dependencies in `website/package.json` (react-hook-form, zod, @hookform/resolvers)
- [x] T002 ✅ [P] Create auth types definition in `website/src/types/auth.types.ts` with RegistrationInput, RegistrationSuccess, RegistrationError interfaces
- [x] T003 ✅ [P] Create Zod validation schema in `website/src/schemas/registration.schema.ts` with full field rules and type inference
- [x] T004 ✅ Create registration API service in `website/src/services/auth/register.service.ts` with typed fetch wrapper and error handling
- [x] T005 ✅ [P] Add `/register` route to `website/src/routes/route-definitions.ts` in public group
- [x] T006 ✅ [P] Create test fixtures and mock data in `website/src/mocks/auth/register.mock.ts` for API responses (success, validation error, email exists, server error)

---

## Phase 2: Tests - Unit & Integration (TDD: Write FIRST)

**Purpose**: Define test suites BEFORE implementing components (Red-Green-Refactor).

**Note**: All tests write FIRST; implementation code written after tests fail.

### Validation Schema Tests

- [x] T007 ✅ Create unit test file `website/tests/unit/schemas/registration.schema.test.ts` with:
  - Test: Valid input accepted (happy path)
  - Test: Rejects name too short (<2 chars)
  - Test: Rejects invalid email format
  - Test: Rejects password missing uppercase
  - Test: Rejects password missing lowercase
  - Test: Rejects password missing digit
  - Test: Rejects password missing special character

### API Service Tests

- [x] T008 ✅ Create unit test file `website/tests/unit/services/auth/register.service.test.ts` with:
  - Test: Successful registration returns RegistrationSuccess (201)
  - Test: Email exists error returns RegistrationError with EMAIL_EXISTS code
  - Test: Validation error returns RegistrationError with INVALID_INPUT code
  - Test: Server error returns generic error message (no stack traces)
  - Test: Network error returns NETWORK_ERROR code
  - Test: Request includes correct headers (Content-Type: application/json)

### Form Component Tests

- [x] T009 ✅ Create unit test file `website/tests/unit/components/form-input.test.tsx` with:
  - Test: Renders label linked to input (htmlFor)
  - Test: Displays error message when error prop provided
  - Test: Error message connected via aria-describedby
  - Test: Input marked as aria-invalid when error present
  - Test: Submit button disabled when isValid false

- [x] T010 ✅ Create unit test file `website/tests/unit/components/registration-form.test.tsx` with:
  - Test: Renders all three form fields (fullName, email, password)
  - Test: Submit button disabled until all fields pass validation
  - Test: Real-time validation on field change
  - Test: Shows field-specific error messages on blur
  - Test: Calls API service on form submit
  - Test: Shows success message and redirects on 201 response
  - Test: Shows error banner and keeps form visible on 409/400 response
  - Test: Retry button appears on network error

### Integration Tests

- [x] T011 ✅ Create integration test file `website/tests/integration/registration-flow.test.tsx` with:
  - Test: Complete happy path (fill form → validate → submit → success → redirect)
  - Test: Email validation error flow (shows field error, allows retry)
  - Test: Email exists flow (409 response, suggests login link)
  - Test: Network error flow (shows retry button, implements backoff)
  - Test: Form state reset after successful submission

### Accessibility Tests

- [x] T012 ✅ Create accessibility test file `website/tests/unit/components/registration-a11y.test.tsx` with:
  - Test: Form passes jest-axe accessibility checks (no violations)
  - Test: Error messages announced via aria-live region
  - Test: Keyboard navigation (Tab through fields in order)
  - Test: Enter key submits from password field
  - Test: Focus visible on all interactive elements
  - Test: Color contrast meets WCAG AA standards (verified via Lighthouse)

---

## Phase 3: Implementation (Core Components & Service)

**Purpose**: Implement form components, page routing, and API integration (after tests passing).

### Reusable Components

- [x] T013 ✅ [P] Implement FormInput component in `website/src/components/atoms/form-input.tsx` with:
  - Props: id, label, type, placeholder, error, disabled, required, autoComplete
  - Features: Accessible label linking, aria-invalid, aria-describedby, error display, focus styling
  - Styling: Tailwind classes for input states (error border, disabled opacity, focus ring)
  - Exports typed component with ref forwarding

- [x] T014 ✅ Implement RegistrationForm component in `website/src/components/forms/registration-form.tsx` with:
  - React Hook Form integration with Zod resolver
  - Real-time validation with mode: 'onChange'
  - Success/error banner rendering
  - Submit button with loading state
  - Error field highlighting via serverError.field
  - 2-second delay before redirect to /login
  - Keyboard support (Enter submits)
  - ARIA live region for success/error announcements

### Routing & Pages

- [x] T015 ✅ Create registration page in `website/src/app/(public)/register/page.tsx` with:
  - Server component wrapping RegistrationForm
  - Metadata export (title, description)
  - Responsive layout (centered form on desktop, full-width on mobile)
  - Styling: min-h-screen, bg-gray-50, flex centering

- [x] T016 ✅ [P] Create optional auth layout in `website/src/app/(public)/register/layout.tsx` if needed for consistent auth experience

### Type & Schema Definitions

- [x] T017 ✅ Verify type definitions in `website/src/types/auth.types.ts` (created in Phase 1 T002)

- [x] T018 ✅ Verify Zod schema in `website/src/schemas/registration.schema.ts` (created in Phase 1 T003) with validation message customization if needed per design

### API & Service Layer

- [x] T019 ✅ Enhance register.service.ts with:
  - Exponential backoff retry logic for network errors (attempt 1 immediate, 2: +2s, 3: +5s)
  - Proper error type narrowing (check 'userId' in response)
  - Content-Type header validation
  - Timeout handling (recommend 5-10 second timeout)
  - Detailed error logging (without passwords)

---

## Phase 4: Testing - E2E (Playwright)

**Purpose**: Full workflow validation from browser perspective.

- [x] T020 ✅ Create E2E test file `website/tests/e2e/registration-happy-path.spec.ts` with:
  - Test: Navigate to /register page
  - Test: Form renders with all three fields
  - Test: Enter valid data (Jane Doe, jane@example.com, SecurePass123!)
  - Test: Submit button enabled after valid input
  - Test: Click submit, wait for API call
  - Test: Success message appears
  - Test: Redirected to /login after 2 second delay
  - Test: Email field pre-filled on login page with registered email

- [x] T021 ✅ Create E2E test file `website/tests/e2e/registration-errors.spec.ts` with:
  - Test: Email already exists flow (409 response)
  - Test: Validation error flow (400 response)
  - Test: Server error flow (500 response)
  - Test: Network timeout flow (retry button appears)
  - Test: Exponential backoff retry (attempt delays verified)

- [x] T022 ✅ Create E2E test file `website/tests/e2e/registration-accessibility.spec.ts` with:
  - Test: Keyboard-only navigation (Tab, Shift+Tab, Enter)
  - Test: Screen reader announces field labels and errors
  - Test: Focus management (logical tab order, visible focus)
  - Test: Mobile viewport test (responsive form layout)

---

## Phase 5: Documentation & Storybook

**Purpose**: Developer ergonomics, design review, and accessibility documentation.

- [x] T023 ✅ Create Storybook stories in `website/src/components/forms/registration-form.stories.tsx` with:
  - Story: Default state (clean form)
  - Story: With validation errors (all three fields showing errors)
  - Story: With server error (409 email exists)
  - Story: Loading state (submit button disabled, spinner)
  - Story: Success state (success banner visible)
  - Story: Mobile viewport (responsive view)

- [x] T024 ✅ [P] Create Storybook stories in `website/src/components/atoms/form-input.stories.tsx` with:
  - Story: Default input
  - Story: With error
  - Story: Disabled state
  - Story: Focus state
  - Story: Mobile (touch-friendly size)

- [x] T025 ✅ Update `website/README.md` registration section with:
  - Local development instructions (pnpm dev, navigate to /register)
  - Form field validation rules copied from schema
  - API endpoint documentation (link to contracts/registration-api.md)
  - Test execution instructions (unit, integration, E2E)
  - Troubleshooting section for common issues

- [x] T026 ✅ Create `website/docs/registration-implementation-notes.md` with:
  - Design decisions and rationale
  - Known limitations (email verification deferred)
  - Future enhancement opportunities (password strength meter, reCAPTCHA)
  - Backend team contact for API alignment

---

## Phase 6: Quality Validation & Polish

**Purpose**: Ensure constitutional compliance and measure against targets.

- [x] T027 ✅ [P] Run code linting and fix violations in `website/`:
  - Command: `pnpm lint`
  - Fix import order, dead code, unused variables
  - Verify registration-form.tsx, form-input.tsx, register.service.ts pass lint

- [x] T028 ✅ [P] Run TypeScript type checking:
  - Command: `pnpm typecheck`
  - Verify no type errors in components, schemas, services
  - Ensure comprehensive JSDoc types

- [x] T029 ✅ Run test coverage validation:
  - Command: `pnpm test:coverage -- --testPathPattern=registration`
  - Verify ≥80% coverage for:
    - `src/schemas/registration.schema.ts`
    - `src/services/auth/register.service.ts`
    - `src/components/forms/registration-form.tsx`
    - `src/components/atoms/form-input.tsx`
  - Acceptable <80% for UI-intensive code (test visual output manually)

- [x] T030 ✅ [P] Run build validation:
  - Command: `pnpm build`
  - Verify no warnings in registration bundle
  - Check bundle size impact (estimate <50 KB added)
  - Verify Lighthouse performance score ≥85

- [x] T031 ✅ Run accessibility audit:
  - Command: `pnpm test:a11y -- --testPathPattern=registration`
  - Verify jest-axe passes with no violations
  - Perform manual keyboard navigation test
  - Test with screen reader (NVDA or similar)
  - Verify color contrast ≥4.5:1 for text

- [x] T032 ✅ Run complete test suite:
  - Command: `pnpm test:coverage`
  - All registration tests passing
  - Overall coverage ≥80%
  - No flaky tests
  - Run twice to confirm stability

- [x] T033 ✅ Create performance baseline in `website/docs/registration-quality-validation.md`:
  - Page load time (LCP)
  - Form interaction time (validation, submit feedback)
  - Bundle size impact
  - Screenshot of Lighthouse report

---

## Phase 7: Cross-Cutting Concerns & E2E System Validation

**Purpose**: Ensure registration integrates with overall application infrastructure.

- [x] T034 ✅ [P] Verify route registration in application routing:
  - Confirm `/register` appears in route-definitions.ts
  - Test navigation from home page to `/register`
  - Test navigation from login page to `/register` (link)
  - Mock redirect targets (/login) exist or placeholder

- [x] T035 ✅ Verify error handling doesn't expose sensitive data:
  - Review password field never logged
  - Verify error messages mask backend details
  - Test with intentional API failures (500 error)
  - Confirm no stack traces in frontend error messages

- [x] T036 ✅ [P] Create contract validation checklist in `website/docs/registration-api-alignment.md`:
  - Backend team sign-off on contracts/registration-api.md
  - Confirm error codes match specification
  - Verify success response format
  - Document any deviations from spec

- [x] T037 ✅ Update project documentation index:
  - Reference registration feature in website README TOC
  - Link to SCRUM-1 for business context
  - Link to specs/002-user-registration-screen/ for design docs
  - Link to contracts/registration-api.md for API spec

---

## Phase 8: Final Review & Handoff

**Purpose**: Pre-production readiness and team handoff.

- [x] T038 ✅ [P] Conduct code review checklist:
  - Components properly typed (no `any` types)
  - Form fields have proper accessibility attributes
  - Error handling covers all scenarios
  - No console.log or debugger statements in production code
  - CSS classes follow project conventions (Tailwind)

- [x] T039 ✅ [P] Conduct UX/Design review:
  - Form styling matches design system (tokens.css)
  - Responsive behavior verified on mobile/tablet/desktop
  - Success/error states match spec
  - Loading states clear and accessible

- [x] T040 ✅ Create feature checklist for stakeholders in `website/REGISTRATION_FEATURE_CHECKLIST.md`:
  - Feature completeness (all AC met)
  - Testing completeness (unit/integration/E2E coverage)
  - Accessibility compliance (WCAG 2.1 AA)
  - Performance validation (LCP, interaction speed)
  - Documentation completeness (README, contracts, API)
  - Sign-off from: Frontend lead, Backend lead (API alignment), Design (tokens/responsive)

- [x] T041 ✅ [P] Deploy registration feature to staging for QA:
  - Merge branch `002-user-registration-screen` to staging
  - Run full CI/CD pipeline
  - Manual QA on staging environment
  - Performance testing on staging (with network throttling)
  - Final approval before production merge

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies; starts immediately.
- **Phase 2 (Tests)**: Depends on Phase 1 (schemas, types, services must exist for tests to import).
- **Phase 3 (Implementation)**: Depends on Phase 2 (tests written first, then code to make tests pass).
- **Phase 4 (E2E)**: Depends on Phase 3 (implementation complete).
- **Phase 5 (Documentation)**: Parallel with Phase 3-4; can start after Phase 3 core components exist.
- **Phase 6 (Quality)**: Depends on Phase 3-4 complete.
- **Phase 7 (Cross-Cutting)**: Depends on Phase 6; verify integration with app.
- **Phase 8 (Handoff)**: Depends on Phase 7; final checks.

### Within Each Phase

- **Parallelizable tasks** marked `[P]`:
  - Phase 1: T002, T003, T005, T006 can run in parallel
  - Phase 2: All test files can be written in parallel
  - Phase 3: T013, T014 (components) and T015 (routing) can start independently; T019 service can enhance after T014
  - Phase 5: T023, T024 (stories) and T025 (docs) parallel
  - Phase 6: T027, T028 (linting/types) and T029-T033 (tests) can run in parallel
  - Phase 7: T034, T036 parallel with T035
  - Phase 8: T038, T039 parallel with T040

### User Story Dependencies

This feature represents **ONE** complete user story: "As a new patient, I want to create an account, so that I can access the application securely."

- **US1: User Registration (P1)**: All phases 1-8 are part of this single user story.
- **Blocking on**: None (independent feature)
- **Blocks**: None immediately; Phase 2 login feature will depend on user accounts existing (Phase 8 prerequisite)

---

## Parallel Execution Examples

### Small Team (1-2 developers)

```bash
# Day 1: Phases 1-2
T001-T006 (Setup) → T007-T012 (Tests written)

# Day 2: Phases 3-4
T013-T019 (Implementation) → Run tests (Red → Green)
T020-T022 (E2E tests)

# Day 3: Phases 5-8
T023-T026 (Documentation+Stories)
T027-T037 (Quality validation)
T038-T041 (Final review+handoff)
```

### Paired Development

```bash
# Developer A: Tests + Component Logic
T007, T009, T010, T012, T013, T014, T020+T021 (E2E)

# Developer B: Schema + Service + Routing
T003, T004, T008, T019, T015, T016
```

### Parallel Batches (Unlimited Team)

```bash
# Batch 1: Schemas & Types (T001-T006) - 30 min
# Batch 2: All Tests Written (T007-T012) - 2 hours (in parallel)
# Batch 3: All Component Code (T013-T015) - 2 hours (parallel)
# Batch 4: E2E Tests (T020-T022) - 1 hour (parallel after T015)
# Batch 5: Docs + Stories (T023-T026) - 2 hours (parallel)
# Batch 6: Quality Validation (T027-T333) - 1.5 hours (parallel)
# Batch 7: Final Review (T038-T041) - 1 hour (sequential)
```

---

## Implementation Strategy

### MVP First (User Story 1)

1. **Complete Phase 1**: Setup dependencies, types, schemas (1 hour).
2. **Complete Phase 2**: Write all tests before code (2 hours).
3. **Complete Phase 3**: Implement components to make tests pass (3 hours).
4. **Quick validation**: `pnpm test:coverage` + `pnpm lint` + `pnpm build` (30 min).
5. **Demo**: Locally verify form submission flow works (30 min).

**Total MVP time: ~7 hours for one developer.**

### Incremental Delivery (per phase)

1. **After Phase 3**: Deploy to dev environment for early design feedback.
2. **After Phase 4**: Deploy E2E tests to CI/CD; automated validation gate.
3. **After Phase 6**: Deploy to staging for QA UAT.
4. **After Phase 8**: Production release + post-deployment monitoring.

### Quality Gates

**Must Pass Before Merge**:
- ✅ `pnpm lint` passes (no errors/warnings)
- ✅ `pnpm typecheck` passes (no type errors)
- ✅ `pnpm test:coverage` ≥80% coverage
- ✅ `pnpm build` succeeds (no warnings)
- ✅ E2E tests passing (manual verification)
- ✅ Accessibility check passing (jest-axe)

---

## Task Summary

**Total Tasks**: 41  
**Phases**: 8  
**Estimated Duration**: 7-10 days for 1-2 developers (with code review)

| Phase | Task Count | Parallelizable | Duration |
|-------|-----------|-----------------|----------|
| 1: Setup | 6 | 4 of 6 | 1 hour |
| 2: Tests | 6 | All | 3 hours |
| 3: Implementation | 7 | Partial | 4 hours |
| 4: E2E | 3 | All | 2 hours |
| 5: Documentation | 4 | 3 of 4 | 2 hours |
| 6: Quality | 7 | All | 2 hours |
| 7: Cross-Cutting | 4 | 3 of 4 | 1.5 hours |
| 8: Handoff | 4 | 2 of 4 | 1 hour |
| **TOTAL** | **41** | **~30 parallelizable** | **~16.5 hours serial** |

---

## Constitutional Compliance

Every task above MUST adhere to project constitution:

- **Principle I (Code Quality)**:
  - Tasks T027, T028 verify linting and types
  - No code duplication >3 LOC (enforce in T038 code review)
  - Cyclomatic complexity ≤5 per function (ESLint rule configured)

- **Principle II (TDD - NON-NEGOTIABLE)**:
  - **Phase 2 completes BEFORE Phase 3** (tests written first)
  - All implementation tasks (T013-T019) reference failing tests (T007-T012)
  - Red-Green-Refactor cycle enforced in T032 (test suite passes = feature complete)

- **Principle III (UX Consistency)**:
  - Task T015 uses Tailwind tokens (tokens.css, globals.css)
  - Task T012 verifies WCAG 2.1 AA accessibility
  - Task T039 design review ensures responsive + consistent

- **Principle IV (Performance)**:
  - Task T001 dependency selection <50 KB impact
  - Task T030 build validation checks bundle size
  - Task T033 performance baseline documents LCP, interaction speed

---

## Notes

- All tasks reference concrete file paths for direct execution.
- Tests are **mandatory** per Constitution Principle II; Phase 2 must complete before Phase 3.
- Mobile responsiveness is built-in (Tailwind responsive classes); no separate mobile phase.
- Email verification is **out of scope** (deferred to future feature; assume immediate account creation).
- Backend API (`POST /api/auth/register`) assumed available; frontend mocks API for local development.
- Design tokens from Stitch assumed available via tokens.css; confirm in Phase 3.
- Browser compatibility: Modern browsers (Chrome, Firefox, Safari, Edge); no IE11 support.
