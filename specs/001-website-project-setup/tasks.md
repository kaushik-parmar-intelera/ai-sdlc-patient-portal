# Tasks: Website Project Setup (Next.js Frontend)

**Input**: Design documents from `/specs/001-website-project-setup/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/, quickstart.md

**Constitution Check**: All tasks MUST adhere to `.specify/memory/constitution.md` principles:
- Principle I (Code Quality): Linting, duplication limits, complexity controls, and coverage >=80% for business logic
- Principle II (TDD): Tests written first and failing before implementation (Red-Green-Refactor)
- Principle III (UX): Design-system consistency and WCAG 2.1 AA accessibility
- Principle IV (Performance): Web performance targets and regression validation

**Tests**: Tests are MANDATORY for this feature per spec and constitution.

**Project Layout Constraint**: Implementation is active in `website/`; keep `mobile/` and `backend/` initialized as empty top-level directories.

## Phase 1: Setup (Project Initialization)

**Purpose**: Initialize top-level workspaces and website project scaffold.

- [ ] T001 Create top-level workspace placeholders in `website/.gitkeep`, `mobile/.gitkeep`, `backend/.gitkeep`, and `tests/.gitkeep`
- [ ] T002 Initialize Next.js TypeScript project scaffold in `website/package.json`, `website/next.config.ts`, and `website/tsconfig.json`
- [ ] T003 [P] Configure Tailwind baseline in `website/tailwind.config.ts`, `website/postcss.config.mjs`, and `website/src/app/globals.css`
- [ ] T004 [P] Add core dependency scripts and engine constraints in `website/package.json`
- [ ] T005 [P] Create website source structure in `website/src/app/`, `website/src/components/`, `website/src/controllers/`, `website/src/hooks/`, `website/src/lib/`, `website/src/routes/`, `website/src/services/`, `website/src/store/`, `website/src/mocks/screens/`, `website/src/styles/`, and `website/src/types/`
- [ ] T006 [P] Create top-level test directories in `tests/unit/.gitkeep`, `tests/integration/.gitkeep`, and `tests/e2e/.gitkeep`
- [ ] T007 [P] Define environment template variables in `website/.env.example`
- [ ] T008 Document workspace layout and bootstrap prerequisites in `website/README.md`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Deliver shared infrastructure required before user stories can proceed.

**CRITICAL**: User story work starts only after this phase completes.

- [ ] T009 Configure linting and formatting policy in `website/eslint.config.mjs`, `website/.prettierrc`, and `website/.prettierignore`
- [ ] T010 [P] Configure auto-format and pre-commit enforcement in `website/.vscode/settings.json` and `.husky/pre-commit`
- [ ] T011 [P] Configure Jest + React Testing Library baseline in `website/jest.config.ts` and `website/jest.setup.ts`
- [ ] T012 [P] Configure Playwright baseline in `website/playwright.config.ts`
- [ ] T013 [P] Configure Storybook baseline in `website/.storybook/main.ts` and `website/.storybook/preview.ts`
- [ ] T014 Implement React Query provider setup in `website/src/lib/query/query-client.ts` and `website/src/app/providers.tsx`
- [ ] T015 Implement shared API HTTP client and interceptor contract in `website/src/services/api/http-client.ts`
- [ ] T016 Implement auth/session store baseline in `website/src/store/auth-session.store.ts`
- [ ] T017 Implement route definition registry for public/private flows in `website/src/routes/route-definitions.ts`
- [ ] T018 Implement mock dataset registry and schema guard in `website/src/mocks/screens/index.ts`
- [ ] T019 Implement reusable UI state panel baseline in `website/src/components/organisms/state-panels.tsx`
- [ ] T020 Configure CI quality workflow for lint/test/build in `.github/workflows/website-quality.yml`
- [ ] T021 Configure Lighthouse baseline thresholds in `website/lighthouse.config.json` and `website/package.json`

---

## Phase 3: User Story 1 - Launch Website Workspace (Priority: P1) 🎯 MVP

**Goal**: Ensure a clean-checkout contributor can run and view the baseline website experience.

**Independent Test**: From a clean checkout, follow setup docs and run the website; verify root page renders with baseline navigation.

### Tests for User Story 1 (MANDATORY - write FIRST)

- [ ] T022 [P] [US1] Create unit test for bootstrap layout/provider wiring in `tests/unit/us1/bootstrap-layout.test.tsx`
- [ ] T023 [P] [US1] Create integration test for startup route rendering flow in `tests/integration/us1/startup-flow.test.tsx`
- [ ] T024 [P] [US1] Create E2E smoke test for website launch in `tests/e2e/us1/home-smoke.spec.ts`

### Implementation for User Story 1

- [ ] T025 [P] [US1] Implement app root layout and provider mount points in `website/src/app/layout.tsx` and `website/src/app/page.tsx`
- [ ] T026 [P] [US1] Implement route group shells for public and private spaces in `website/src/app/(public)/page.tsx` and `website/src/app/(private)/page.tsx`
- [ ] T027 [US1] Implement route guard middleware in `website/src/lib/auth/route-guard.ts` and `website/src/middleware.ts`
- [ ] T028 [US1] Implement environment profile loader from runtime variables in `website/src/lib/config/environment-profile.ts`
- [ ] T029 [US1] Implement starter app shell and navigation scaffold in `website/src/components/organisms/app-shell.tsx`
- [ ] T030 [US1] Implement startup query + mock bootstrap path in `website/src/services/query/startup-query.ts` and `website/src/mocks/screens/home.json`
- [ ] T031 [US1] Update runbook for local launch verification in `website/README.md`

---

## Phase 4: User Story 2 - Enforce Baseline Quality Gates (Priority: P2)

**Goal**: Provide one repeatable validation workflow for lint, tests, and build readiness.

**Independent Test**: Execute the validation workflow and confirm expected pass/fail output with actionable errors.

### Tests for User Story 2 (MANDATORY - write FIRST)

- [ ] T032 [P] [US2] Create unit tests for validation script command orchestration in `tests/unit/us2/quality-scripts.test.ts`
- [ ] T033 [P] [US2] Create integration test for CI quality gate fail/pass behavior in `tests/integration/us2/quality-pipeline.test.ts`

### Implementation for User Story 2

- [ ] T034 [US2] Implement consolidated validation script in `website/scripts/validate.mjs` and `website/package.json`
- [ ] T035 [P] [US2] Implement pre-commit validation runner in `website/scripts/precommit-validate.mjs` and `.husky/pre-commit`
- [ ] T036 [P] [US2] Configure coverage thresholds and reports in `website/jest.config.ts`
- [ ] T037 [US2] Configure typecheck/build guard commands in `website/package.json` and `website/tsconfig.json`
- [ ] T038 [US2] Integrate CI annotations and artifacts in `.github/workflows/website-quality.yml`
- [ ] T039 [US2] Document quality gate usage and remediation in `website/docs/quality-gates.md`

---

## Phase 5: User Story 3 - Provide Consistent UX Starter States (Priority: P3)

**Goal**: Ensure baseline loading/empty/error/success states and keyboard accessibility are consistent.

**Independent Test**: Validate consistent state rendering and keyboard traversal on starter routes.

### Tests for User Story 3 (MANDATORY - write FIRST)

- [ ] T040 [P] [US3] Create unit tests for state components and keyboard focus behavior in `tests/unit/us3/state-panels.test.tsx`
- [ ] T041 [P] [US3] Create integration test for loading-empty-error-success transitions in `tests/integration/us3/state-transitions.test.tsx`
- [ ] T042 [P] [US3] Create E2E keyboard accessibility smoke test in `tests/e2e/us3/accessibility-keyboard.spec.ts`

### Implementation for User Story 3

- [ ] T043 [P] [US3] Implement atomic state components in `website/src/components/atoms/loading-state.tsx`, `website/src/components/atoms/empty-state.tsx`, `website/src/components/atoms/error-state.tsx`, and `website/src/components/atoms/success-state.tsx`
- [ ] T044 [US3] Implement state orchestration controller in `website/src/controllers/ui-state.controller.ts` and `website/src/components/organisms/state-panels.tsx`
- [ ] T045 [US3] Implement keyboard-first skip link and focus order behavior in `website/src/components/molecules/skip-link.tsx` and `website/src/app/layout.tsx`
- [ ] T046 [US3] Implement standardized error message renderer in `website/src/components/molecules/error-banner.tsx`
- [ ] T047 [US3] Implement responsive/theme token wiring for state views in `website/src/styles/tokens.css` and `website/src/app/globals.css`
- [ ] T048 [US3] Create Storybook stories for UX state components in `website/src/components/atoms/state-components.stories.tsx`

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Validate end-to-end quality, performance, accessibility, and documentation readiness.

- [ ] T049 [P] Run full test suite and capture results in `tests/reports/full-suite.md`
- [ ] T050 [P] Run Lighthouse performance audit and record baseline in `website/docs/performance-baseline.md`
- [ ] T051 [P] Run accessibility audit and record WCAG findings in `website/docs/accessibility-audit.md`
- [ ] T052 Consolidate routing/API/mock contract summary in `website/docs/contracts-summary.md`
- [ ] T053 Review lint/duplication/complexity outcomes and document remediation in `website/docs/code-quality-notes.md`
- [ ] T054 Finalize contributor handoff notes in `website/README.md` and `specs/001-website-project-setup/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies; starts immediately.
- **Phase 2 (Foundational)**: Depends on Phase 1; blocks all story implementation.
- **Phase 3 (US1)**: Depends on Phase 2.
- **Phase 4 (US2)**: Depends on Phase 2 and baseline startup artifacts from US1.
- **Phase 5 (US3)**: Depends on Phase 2 and baseline route/layout artifacts from US1.
- **Phase 6 (Polish)**: Depends on completion of all selected user stories.

### User Story Dependencies

- **US1 (P1)**: First delivery slice and MVP.
- **US2 (P2)**: Builds on runnable website baseline from US1.
- **US3 (P3)**: Builds on layout/route/state foundation from US1; can progress in parallel with late US2 tasks once US1 stabilizes.

### Within Each User Story

- Tests MUST be written first and fail before implementation tasks.
- Shared components/entities should be completed before orchestration/integration tasks.
- Story documentation updates are part of completion criteria.

## Parallel Execution Examples

### User Story 1

```bash
# Parallel tests
T022, T023, T024

# Parallel shell scaffolding
T025, T026
```

### User Story 2

```bash
# Parallel quality-gate tests
T032, T033

# Parallel configuration tasks after script baseline
T035, T036
```

### User Story 3

```bash
# Parallel UX-state tests
T040, T041, T042

# Parallel UI component work
T043, T047
```

## Implementation Strategy

### MVP First (User Story 1)

1. Complete Phase 1 and Phase 2.
2. Deliver Phase 3 (US1) completely.
3. Validate independent startup test criteria and demo runnable website baseline.

### Incremental Delivery

1. Add Phase 4 (US2) for automated quality gates.
2. Add Phase 5 (US3) for UX consistency and accessibility baseline.
3. Complete Phase 6 for cross-cutting validation and handoff.

### Parallel Team Strategy

1. Team aligns on Setup + Foundational tasks first.
2. After US1 baseline stabilizes, run US2 and US3 tracks in parallel by separate contributors.
3. Merge on Polish phase with full suite verification.

## Notes

- Tasks marked `[P]` are safe for parallel execution when their prerequisite tasks are complete.
- Every user-story task includes `[US#]` for traceability.
- All task descriptions include concrete file paths for direct execution.
