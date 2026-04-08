---

description: "Task list template for feature implementation"
---

# Tasks: [FEATURE NAME]

**Input**: Design documents from `/specs/[###-feature-name]/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Constitution Check**: All tasks MUST adhere to `.specify/memory/constitution.md` principles:
- Principle I (Code Quality): Linting, coverage ≥80% business logic
- Principle II (TDD): Tests written first, Red-Green-Refactor enforced
- Principle III (UX): Design system compliance, accessibility standards
- Principle IV (Performance): SLA targets met, performance tests included

**Tests**: The examples below include test tasks. Tests are MANDATORY and MUST be created FIRST as per Principle II.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root
- **Web app**: `backend/src/`, `frontend/src/`
- **Mobile**: `api/src/`, `ios/src/` or `android/src/`
- Paths shown below assume single project - adjust based on plan.md structure

<!-- 
  ============================================================================
  IMPORTANT: The tasks below are SAMPLE TASKS for illustration purposes only.
  
  The /speckit.tasks command MUST replace these with actual tasks based on:
  - User stories from spec.md (with their priorities P1, P2, P3...)
  - Feature requirements from plan.md
  - Entities from data-model.md
  - Endpoints from contracts/
  
  Tasks MUST be organized by user story so each story can be:
  - Implemented independently
  - Tested independently
  - Delivered as an MVP increment
  
  DO NOT keep these sample tasks in the generated tasks.md file.
  ============================================================================
-->

## Phase 0: Quality Foundation (Pre-Implementation)

**Purpose**: Establish testing infrastructure and quality tooling per Constitution

- [ ] T001 [P] Initialize [language] test framework: [e.g., pytest, Jest, XCTest]
- [ ] T002 [P] Configure code coverage tracking; set baseline to [80% business, 70% UI]
- [ ] T003 [P] Setup linting: [tool] with [style guide]; configure pre-commit hooks
- [ ] T004 [P] Create test directory structure: tests/{unit, integration, e2e, contracts}
- [ ] T005 Add performance testing setup: [k6, JMeter, Lighthouse CI] configuration
- [ ] T006 [If web/mobile] Integrate accessibility testing: [Lighthouse, axe, VoiceOver/TalkBack]
- [ ] T007 Configure CI/CD gates: tests MUST pass + coverage ≥threshold before merge

**Checkpoint**: Quality infrastructure ready - proceed to Phase 1

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure (runtime dependencies only)

- [ ] T008 Create project structure per implementation plan
- [ ] T009 Initialize [language] project with [framework] dependencies
- [ ] T010 [P] Configure environment variables and configuration management
- [ ] T011 Setup documentation structure: README.md, contributing guidelines

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

Examples of foundational tasks (adjust based on your project):

- [ ] T012 Setup database schema and migrations framework
- [ ] T013 [P] Implement authentication/authorization framework
- [ ] T014 [P] Setup API routing and middleware structure
- [ ] T015 Create base models/entities that all stories depend on
- [ ] T016 Configure error handling and logging infrastructure

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - [Title] (Priority: P1) 🎯 MVP

**Goal**: [Brief description of what this story delivers]

**Independent Test**: [How to verify this story works on its own]

### Tests for User Story 1 (MANDATORY - write FIRST per Principle II) ⚠️

> **IMPORTANT**: Write test cases FIRST using Red-Green-Refactor pattern. Tests MUST fail before implementation.

- [ ] T017 [P] [US1] Contract test for [endpoint] in tests/contract/test_[name].py
- [ ] T018 [P] [US1] Integration test for [user journey] in tests/integration/test_[name].py

### Implementation for User Story 1

- [ ] T019 [P] [US1] Create [Entity1] model in src/models/[entity1].py
- [ ] T020 [P] [US1] Create [Entity2] model in src/models/[entity2].py
- [ ] T021 [US1] Implement [Service] in src/services/[service].py (depends on T019, T020)
- [ ] T022 [US1] Implement [endpoint/feature] in src/[location]/[file].py
- [ ] T023 [US1] Add validation and error handling (per Constitution error format)
- [ ] T024 [US1] Add logging for user story 1 operations
- [ ] T025 [US1] Verify code coverage ≥80% for US1 business logic; add tests if needed
- [ ] T026 [US1] Verify UX consistency + accessibility (if web/mobile feature)
- [ ] T027 [US1] Run performance tests; verify SLA targets met

**Checkpoint**: At this point, User Story 1 should be fully functional, tested independently, and deployable

---

## Phase 4: User Story 2 - [Title] (Priority: P2)

**Goal**: [Brief description of what this story delivers]

**Independent Test**: [How to verify this story works on its own]

### Tests for User Story 2 (MANDATORY - write FIRST per Principle II) ⚠️

- [ ] T028 [P] [US2] Contract test for [endpoint] in tests/contract/test_[name].py
- [ ] T029 [P] [US2] Integration test for [user journey] in tests/integration/test_[name].py

### Implementation for User Story 2

- [ ] T030 [P] [US2] Create [Entity] model in src/models/[entity].py
- [ ] T031 [US2] Implement [Service] in src/services/[service].py
- [ ] T032 [US2] Implement [endpoint/feature] in src/[location]/[file].py
- [ ] T033 [US2] Integrate with User Story 1 components (if needed)
- [ ] T034 [US2] Verify code coverage ≥80% for US2 business logic
- [ ] T035 [US2] Run performance tests; verify SLA targets met

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently and in combination

---

## Phase 5: User Story 3 - [Title] (Priority: P3)

**Goal**: [Brief description of what this story delivers]

**Independent Test**: [How to verify this story works on its own]

### Tests for User Story 3 (MANDATORY - write FIRST per Principle II) ⚠️

- [ ] T036 [P] [US3] Contract test for [endpoint] in tests/contract/test_[name].py
- [ ] T037 [P] [US3] Integration test for [user journey] in tests/integration/test_[name].py

### Implementation for User Story 3

- [ ] T038 [P] [US3] Create [Entity] model in src/models/[entity].py
- [ ] T039 [US3] Implement [Service] in src/services/[service].py
- [ ] T040 [US3] Implement [endpoint/feature] in src/[location]/[file].py
- [ ] T041 [US3] Verify code coverage ≥80% for US3 business logic
- [ ] T042 [US3] Run performance tests; verify SLA targets met

**Checkpoint**: All user stories should now be independently functional

---

[Add more user story phases as needed, following the same pattern]

---

## Phase N: Polish & Quality Assurance

**Purpose**: Cross-cutting concerns and quality gates (post user story implementation)

- [ ] T043 [P] Final code coverage review; achieve target ≥80% business logic, ≥70% UI
- [ ] T044 [P] Run full test suite (unit + integration + E2E) with all user stories
- [ ] T045 Full UX consistency audit (if web/mobile); verify design system compliance
- [ ] T046 Performance regression test; verify all SLA targets still met
- [ ] T047 Accessibility audit complete (Lighthouse for web, VoiceOver/TalkBack for mobile)
- [ ] T048 [P] Documentation updates: README.md, API docs, quickstart.md, contributing guide
- [ ] T049 Security scanning passed (no critical/high severity issues)
- [ ] T050 Code cleanup and refactoring based on review feedback
- [ ] T051 Verify linting passes; ≤3% code duplication; complexity ≤5 per function

**Checkpoint**: Feature complete and ready for merge per Constitution Phase 3 (Pre-Merge Review)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - May integrate with US1 but should be independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - May integrate with US1/US2 but should be independently testable

### Within Each User Story

- Tests (if included) MUST be written and FAIL before implementation
- Models before services
- Services before endpoints
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- All tests for a user story marked [P] can run in parallel
- Models within a story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together (if tests requested):
Task: "Contract test for [endpoint] in tests/contract/test_[name].py"
Task: "Integration test for [user journey] in tests/integration/test_[name].py"

# Launch all models for User Story 1 together:
Task: "Create [Entity1] model in src/models/[entity1].py"
Task: "Create [Entity2] model in src/models/[entity2].py"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
   - Developer C: User Story 3
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
