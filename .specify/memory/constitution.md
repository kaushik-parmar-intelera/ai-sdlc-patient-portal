<!--
SYNC IMPACT REPORT
==================
Version Change: 1.0.0 -> 1.1.0
Modified Principles:
  - III. User Experience Consistency -> III. Stitch-Driven Experience Consistency
  - Quality Gates updated to require Stitch screen coverage and recovery-state review
Added Sections:
  - Design Source of Truth
Removed Sections:
  - None
Templates Updated:
  - ✅ .specify/templates/plan-template.md (already compatible; plan must reference Stitch inventory)
  - ✅ .specify/templates/spec-template.md (already compatible; spec must enumerate design-backed stories)
  - ✅ .specify/templates/tasks-template.md (already compatible; tasks must trace to design-backed flows)
Deferred TODOs:
  - None
-->

# AI SDLC Patient Portal - Constitution

## Core Principles

### I. Code Quality Excellence

Every deliverable MUST adhere to industry-standard code quality metrics and best practices across all platforms:

- **Enforced Standards**:
  - Linting: ESLint, Pylint, SwiftLint (or equivalent) MUST run on every commit
  - Min Code Coverage: 80% for core business logic, 70% for UI/presentation layers
  - Complexity: Cyclomatic complexity <= 5 per function (refactor if exceeded)
  - Duplication: Max 3% code duplication across repositories

- **Language-Specific Rules**:
  - Web (JS/TS): Strict mode enforced; no implicit types; use const/let only
  - Mobile (React Native/iOS/Android): Typed navigation, immutable UI state where practical, reusable screen primitives required
  - Backend (Python/Node): Type hints mandatory; docstrings for all public APIs

- **Rationale**: Consistent quality prevents technical debt, reduces debugging time, and keeps cross-platform delivery maintainable.

### II. Test-Driven Development (NON-NEGOTIABLE)

All new features MUST follow a test-first Red-Green-Refactor cycle:

- **Mandatory Process**:
  1. User stories written and approved
  2. Acceptance tests derived from the spec and reviewed
  3. Tests MUST fail initially
  4. Implementation proceeds until tests pass
  5. Refactoring preserves passing coverage and acceptance behavior

- **Test Scope Requirements**:
  - **Unit Tests**: Minimum 80% of business logic coverage
  - **Integration Tests**: API contracts, navigation guards, form validation, and state persistence boundaries
  - **E2E Tests**: Critical P1 mobile journeys including onboarding/authentication and protected-route recovery
  - **Performance Tests**: Mobile flows MUST meet startup and interaction targets from the active plan

- **Enforcement**: No merge without passing test suite and reviewer confirmation that acceptance scenarios are automated.

- **Rationale**: TDD reduces regressions in patient-facing flows and gives the team confidence while the app skeleton is still being established.

### III. Stitch-Driven Experience Consistency

All patient-facing mobile experiences MUST be driven by the approved Google Stitch design project before implementation begins.

- **Source of Truth**:
  - The active design reference for mobile auth/profile work is Google Stitch project `Remix of Mobile - Patient Auth & Profile` (`12210324048331832562`)
  - The following screens are the minimum required experience inventory for this feature set:
    - `Splash / Onboarding`
    - `Registration`
    - `Login`
    - `Country Code Picker`
    - `Home`
    - `Profile`
    - `Profile (Edit Mode)`
    - `Session Expired`
  - Specs, plans, and tasks MUST explicitly trace requirements back to this screen inventory

- **Consistency Requirements**:
  - No screen, state, or CTA may be implemented if it is missing from the approved Stitch flow unless the design source is updated first
  - Mobile navigation, labels, recovery states, and edit/view transitions MUST match the Stitch-authored user journey
  - Shared UI states such as loading, validation, error, and expired-session handling MUST be consistent across all auth and profile screens
  - Accessibility support is mandatory: VoiceOver/TalkBack semantics, readable labels, and touch targets suitable for mobile form entry

- **Rationale**: Stitch is the team's visual and flow contract. Using it as the source of truth prevents drift between planning, engineering, and design review.

### IV. Performance Requirements

All applications MUST meet or exceed target SLAs for responsiveness and efficiency:

- **Backend Requirements**:
  - API Response Times: p95 <= 200ms, p99 <= 500ms for typical queries
  - Throughput: >=1000 concurrent connections; >=100 RPS per endpoint baseline
  - Database queries: <=100ms end-to-end; index strategy required for new queries

- **Web Frontend Requirements**:
  - Core Web Vitals: LCP <=2.5s, FID <=100ms, CLS <=0.1
  - Bundle size: <=150KB gzipped for core experience; lazy-load non-critical features

- **Mobile Requirements**:
  - Frame rate: >=55 fps for onboarding, auth, home, and profile interactions
  - App startup: <=2s from cold start on target test devices
  - Memory: <=150MB peak during typical auth/profile use
  - Session expiry and navigation recovery MUST complete without app restart

- **Monitoring & Enforcement**:
  - Automated performance checks in CI/CD where practical
  - Manual benchmark validation required before first release of the mobile shell
  - Alert on regressions greater than 10% versus baseline

- **Rationale**: Performance is part of the patient experience, especially in frequent flows like login and profile access.

## Design Source of Truth

For all mobile app setup work, design review MUST use the Stitch project and its named screen inventory as the authoritative UI contract.

- Spec documents MUST describe the user flow implied by the Stitch screens
- Plan documents MUST map implementation structure to those screens
- Task documents MUST break work down by the Stitch-backed user stories or screen groups
- Design changes after planning require the affected spec/plan/tasks artifacts to be updated before implementation continues

## Platform Scope

This constitution applies to all projects under the AI SDLC Patient Portal initiative:

- **Web Applications**: React/Vue/Next.js frontends, REST/GraphQL APIs
- **Mobile Applications**: React Native, iOS, and Android patient experiences
- **Backend Services**: Python FastAPI, Node.js Express, or equivalent microservices
- **Testing Infrastructure**: Unit, integration, E2E, load, and security test suites

All principles apply equally across platforms unless a documented exception is approved.

## Quality Gates & Review Standards

Every feature delivery requires passage through these gates:

### Phase 1: Design Review (Pre-Implementation)

- [ ] User stories approved by product owner
- [ ] `spec.md` complete with acceptance criteria
- [ ] Stitch screen inventory mapped to the feature scope
- [ ] Recovery states documented, including `Session Expired`
- [ ] Performance requirements estimated
- [ ] Accessibility checklist completed

### Phase 2: Code Implementation

- [ ] All code follows project linting and typing standards
- [ ] Test-first cycle followed: tests written before implementation
- [ ] Coverage thresholds met: 80% business logic, 70% UI
- [ ] Mobile navigation and screen states match approved Stitch flow
- [ ] Performance benchmarks run; SLA targets met or exceptions documented

### Phase 3: Pre-Merge Review

- [ ] Code review by >=2 engineers
- [ ] All automated tests passing (unit + integration + E2E)
- [ ] UX consistency verified against Stitch design source
- [ ] Performance tests passing with no significant regression
- [ ] Documentation updated: spec, plan, tasks, and developer notes where needed
- [ ] Security scanning passed (no critical/high vulnerabilities)
- [ ] Accessibility audit completed for changed mobile screens

### Phase 4: Merge & Deployment

- [ ] Requires >=1 approval from maintainer team
- [ ] Monitoring alerts configured where applicable
- [ ] Rollback plan documented

## Development Workflow

1. **Branch Naming**: `{issue-number}-{short-description}` (example: `002-mobile-app-setup`)
2. **Specs First**: No mobile feature work begins without spec coverage for all affected Stitch screens
3. **Plans Next**: Every plan MUST document the chosen mobile structure, navigation model, and screen-to-module mapping
4. **Tasks After Planning**: Tasks MUST group work into independently testable user stories or screen clusters
5. **Releases**: Semantic versioning (MAJOR.MINOR.PATCH); changelog required for user-visible changes

## Governance

This constitution supersedes all other development guidelines and practices for this project.

**Amendment Process**:
- Proposed changes MUST include rationale, impact analysis, and any migration notes
- Approval required from the Technical Lead, Product Owner, and at least two core team members
- Amendments MUST log old/new version, effective date, changed principles, and justification

**Compliance Review**: Quarterly review of recent specs, plans, and PRs for adherence to quality and design-source rules.

**Non-Negotiable Elements**: Principle II (TDD) and Principle III (Stitch-Driven Experience Consistency) cannot be weakened without formal approval.

---

**Version**: 1.1.0 | **Ratified**: 2026-04-08 | **Last Amended**: 2026-04-09
