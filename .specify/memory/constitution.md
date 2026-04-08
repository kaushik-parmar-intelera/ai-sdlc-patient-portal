<!-- 
  SYNC IMPACT REPORT (v1.0.0)
  ├─ Version Change: Template → 1.0.0 (initial adoption)
  ├─ Principles Added:
  │  ├─ I. Code Quality Excellence
  │  ├─ II. Test-Driven Development
  │  ├─ III. User Experience Consistency
  │  └─ IV. Performance Requirements
  ├─ Sections Added:
  │  ├─ Platform Scope (Web, Mobile, Backend)
  │  └─ Quality Gates & Review Standards
  ├─ Templates Updated:
  │  ├─ ✅ plan-template.md (Constitution Check alignment)
  │  ├─ ✅ spec-template.md (User story requirements)
  │  ├─ ✅ tasks-template.md (Quality task categorization)
  │  └─ ⚠ Runtime guidance (docs/Developer-Handbook.md - suggested)
  └─ Follow-up: None (all placeholders resolved)
-->

# AI SDLC Patient Portal - Constitution

## Core Principles

### I. Code Quality Excellence

Every deliverable MUST adhere to industry-standard code quality metrics and best practices across all platforms:

- **Enforced Standards**:
  - Linting: ESLint, Pylint, SwiftLint (or equivalent) MUST run on every commit
  - Min Code Coverage: 80% for core business logic, 70% for UI/presentation layers
  - Complexity: Cyclomatic complexity ≤ 5 per function (refactor if exceeded)
  - Duplication: Max 3% code duplication across repositories
  
- **Language-Specific Rules**:
  - Web (JS/TS): Strict mode enforced; no implicit types; use const/let only
  - Mobile (iOS/Android): Follow SOLID principles; immutable data structures preferred
  - Backend (Python/Node): Type hints mandatory; docstrings for all public APIs
  
- **Rationale**: Consistent quality prevents technical debt, reduces debugging time, and ensures maintainability across web, mobile, and backend teams.

### II. Test-Driven Development (NON-NEGOTIABLE)

All new features MUST follow Test-First (Red-Green-Refactor) cycle:

- **Mandatory Process**:
  1. User stories written and approved
  2. Test cases derived and submitted for stakeholder review
  3. Tests MUST fail initially (red)
  4. Implementation proceeds (green)
  5. Refactoring for quality (refactor)
  
- **Test Scope Requirements**:
  - **Unit Tests**: Min 80% of business logic; async/concurrency tests required for backend
  - **Integration Tests**: All API contracts, inter-service communication, database operations
  - **E2E Tests**: Critical user journeys (P1 stories); min 60% feature coverage for web/mobile
  - **Performance Tests**: Backend endpoints must meet SLA; mobile must run at ≥55 fps on target devices
  
- **Enforcement**: No PR merges without passing test suite + >75% reviewer approval

- **Rationale**: TDD ensures correctness before coding, reduces post-release defects, and enables confident refactoring.

### III. User Experience Consistency

All user-facing applications (web, mobile) MUST maintain visual, behavioral, and interaction consistency:

- **Design System Compliance**:
  - Single design system source of truth (colors, typography, spacing, components)
  - All screens MUST use approved design system components
  - Deviations require design review + architectural justification
  
- **Behavioral Consistency**:
  - Navigation patterns identical across web and mobile (or justified alternative)
  - Error messages follow consistent format: [Error Code] - [User-friendly message] - [Recovery action]
  - Loading states, empty states, and success states standardized
  - Accessibility: WCAG 2.1 AA compliance mandatory (web); VoiceOver/TalkBack support (mobile)
  
- **Interaction Standards**:
  - Web: Keyboard navigation required; mouse + touch support
  - Mobile: Gesture consistency (swipe, tap, long-press) across platforms
  - Response time: ≤100ms for interactive feedback
  
- **Rationale**: Consistency reduces user learning curve, increases adoption, decreases support burden, and enables code reuse across platforms.

### IV. Performance Requirements

All applications MUST meet or exceed target SLAs for responsiveness and efficiency:

- **Backend Requirements**:
  - API Response Times: p95 ≤ 200ms, p99 ≤ 500ms for typical queries
  - Throughput: ≥1000 concurrent connections; ≥100 RPS per endpoint baseline
  - Database queries: ≤100ms e2e; index strategy required for new queries
  - Memory usage: ≤500MB for standalone services; no memory leaks detected (continuous monitoring)
  - CPU: ≤60% utilization at max load
  
- **Web Frontend Requirements**:
  - Core Web Vitals: LCP ≤2.5s, FID ≤100ms, CLS ≤0.1
  - Bundle size: ≤150KB gzipped (core); lazy-load additional features
  - Time to Interactive: ≤3s on 4G connection
  - Rendering: 60 fps for scroll/animations; use RequestAnimationFrame or CSS transforms
  
- **Mobile Requirements**:
  - Frame rate: ≥55 fps for smooth scrolling (iOS/Android)
  - App startup: ≤2s from cold start
  - Memory: ≤150MB peak during typical use
  - Network: Handle reconnection gracefully; offline support if applicable
  - Battery: No significant drain detected; background tasks ≤5% CPU when idle
  
- **Monitoring & Enforcement**:
  - Automated performance testing in CI/CD pipeline
  - Real User Monitoring (RUM) dashboard for web/mobile
  - Alert on SLA breach (immediate investigation required)
  - Capacity planning: Review SLAs quarterly with 20% headroom minimum
  
- **Rationale**: Performance directly impacts user satisfaction, engagement, and conversion. Explicit targets enable predictable scaling and prevent surprise outages.

## Platform Scope

This constitution applies to all projects under the AI SDLC Patient Portal initiative:

- **Web Applications**: React/Vue/Next.js frontends, REST/GraphQL APIs
- **Mobile Applications**: iOS (Swift) and Android (Kotlin) native apps
- **Backend Services**: Python FastAPI, Node.js Express, or equivalent microservices
- **Testing Infrastructure**: Unit, integration, E2E, load, and security test suites

All principles apply equally across platforms unless platform-specific rationale is documented and approved.

## Quality Gates & Review Standards

Every feature delivery requires passage through these gates:

### Phase 1: Design Review (Pre-Implementation)
- [ ] User stories approved by product owner
- [ ] Spec.md complete with acceptance criteria
- [ ] Data model documented (if applicable)
- [ ] API contracts defined (if applicable)
- [ ] Performance requirements estimated
- [ ] Accessibility checklist completed

### Phase 2: Code Implementation
- [ ] All code follows language-specific linting standards
- [ ] Test-first cycle followed: tests written before implementation
- [ ] Min coverage thresholds met: 80% business logic, 70% UI
- [ ] No compiler warnings (web/mobile) or PEP8 violations (Python)
- [ ] Performance benchmarks run; SLA targets met or exceptions documented

### Phase 3: Pre-Merge Review
- [ ] Code review by ≥2 engineers (≥1 outside feature team)
- [ ] All automated tests passing (unit + integration + E2E)
- [ ] UX consistency verified against design system
- [ ] Performance tests passing; no regression detected
- [ ] Documentation updated: code comments, API docs, user guides
- [ ] Security scanning passed (no critical/high vulnerabilities)
- [ ] Accessibility audit completed (web: Lighthouse audit; mobile: VoiceOver/TalkBack test)

### Phase 4: Merge & Deployment
- [ ] Requires ≥1 approval from maintainer team
- [ ] Feature flag enabled (if applicable)
- [ ] Monitoring alerts configured
- [ ] Rollback plan documented

## Development Workflow

1. **Branch Naming**: `{issue-number}-{short-description}` (e.g., `001-user-login-screen`)
2. **Commits**: Atomic, descriptive messages; include test status in commit
3. **PRs**: Link to feature spec; include performance impact analysis
4. **Releases**: Semantic versioning (MAJOR.MINOR.PATCH); changelog required
5. **Escalation**: Ward lead (if SLA at risk); architecture team (if design conflict)

## Governance

This constitution supersedes all other development guidelines and practices for this project.

**Amendment Process**:
- Proposed changes MUST include:
  1. Rationale for change
  2. Impact analysis on existing features / in-progress work
  3. Migration plan (if breaking change)
  4. Implementation effort estimate
  
- Approval required from:
  - Technical Lead
  - Product Owner
  - Minimum 2 core team members
  
- Amendments logged with:
  - Old version / new version
  - Effective date
  - Principles added/modified/removed
  - Justification

**Compliance Review**: Quarterly check-in to assess adherence to principles; adjustments for 25%+ misalignment.

**Non-Negotiable Elements**: Principles II (TDD), III (UX Consistency), and IV (Performance) cannot be downgraded without Executive sponsor approval.

**Runtime Guidance**: Development team refers to `.provide/docs/Developer-Handbook.md` for detailed implementation how-tos and troubleshooting. Constitution defines the "what" and "why"; handbook defines the "how".

---

**Version**: 1.0.0 | **Ratified**: 2026-04-08 | **Last Amended**: 2026-04-08
