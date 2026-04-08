# Feature Specification: [FEATURE NAME]

**Feature Branch**: `[###-feature-name]`  
**Created**: [DATE]  
**Status**: Draft  
**Input**: User description: "$ARGUMENTS"

## User Scenarios & Testing *(mandatory)*

<!--
  IMPORTANT: User stories should be PRIORITIZED as user journeys ordered by importance.
  Each user story/journey must be INDEPENDENTLY TESTABLE - meaning if you implement just ONE of them,
  you should still have a viable MVP (Minimum Viable Product) that delivers value.
  
  Assign priorities (P1, P2, P3, etc.) to each story, where P1 is the most critical.
  Think of each story as a standalone slice of functionality that can be:
  - Developed independently
  - Tested independently
  - Deployed independently
  - Demonstrated to users independently
-->

### User Story 1 - [Brief Title] (Priority: P1)

[Describe this user journey in plain language]

**Why this priority**: [Explain the value and why it has this priority level]

**Independent Test**: [Describe how this can be tested independently - e.g., "Can be fully tested by [specific action] and delivers [specific value]"]

**Acceptance Scenarios**:

1. **Given** [initial state], **When** [action], **Then** [expected outcome]
2. **Given** [initial state], **When** [action], **Then** [expected outcome]

---

### User Story 2 - [Brief Title] (Priority: P2)

[Describe this user journey in plain language]

**Why this priority**: [Explain the value and why it has this priority level]

**Independent Test**: [Describe how this can be tested independently]

**Acceptance Scenarios**:

1. **Given** [initial state], **When** [action], **Then** [expected outcome]

---

### User Story 3 - [Brief Title] (Priority: P3)

[Describe this user journey in plain language]

**Why this priority**: [Explain the value and why it has this priority level]

**Independent Test**: [Describe how this can be tested independently]

**Acceptance Scenarios**:

1. **Given** [initial state], **When** [action], **Then** [expected outcome]

---

[Add more user stories as needed, each with an assigned priority]

## Quality Acceptance Criteria *(aligned with constitution)*

<!--
  ACTION REQUIRED: Define quality gates per Constitution Principles.
  These are NON-NEGOTIABLE and apply to every deliverable.
-->

### Code Quality (Principle I: Code Quality Excellence)

- **QA-001**: MUST achieve min 80% code coverage for business logic, 70% for UI/presentation
- **QA-002**: MUST pass [linting tool] with zero errors and ≤5 warnings
- **QA-003**: MUST have ≤3% code duplication; refactor shared logic if exceeded
- **QA-004**: MUST have cyclomatic complexity ≤5 per function; refactor if violated

### Test-Driven Development (Principle II: TDD)

- **QA-005**: MUST follow Red-Green-Refactor: tests written first, fail, then implement
- **QA-006**: MUST include unit tests for all user stories (blocking merge)
- **QA-007**: MUST include integration tests for [APIs/inter-service calls] (if applicable)
- **QA-008**: MUST include E2E tests for P1 user stories (if web/mobile app)
- **QA-009**: All acceptance scenarios MUST have corresponding automated tests

### User Experience Consistency (Principle III: UX Consistency)

*[If web/mobile feature]*

- **QA-010**: MUST use approved design system components; no custom styling without review
- **QA-011**: MUST follow consistent error message format: [Error Code] - [User message] - [Recovery action]
- **QA-012**: MUST support keyboard navigation (web) and gesture consistency (mobile)
- **QA-013**: MUST meet WCAG 2.1 AA accessibility standards (web) or VoiceOver/TalkBack support (mobile)
- **QA-014**: MUST have consistent navigation patterns across web and mobile (or justified alternative)

### Performance Requirements (Principle IV: Performance)

- **QA-015**: Backend: API response p95 ≤200ms, p99 ≤500ms (or feature-specific SLA documented)
- **QA-016**: Web: Core Web Vitals met - LCP ≤2.5s, FID ≤100ms, CLS ≤0.1
- **QA-017**: Mobile: ≥55 fps for scroll; app startup ≤2s; memory ≤150MB peak
- **QA-018**: MUST pass load test: ≥[100 RPS / 1000 concurrent connections / feature-specific target]
- **QA-019**: MUST include performance testing and monitoring setup in CI/CD

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right edge cases.
-->

- What happens when [boundary condition]?
- How does system handle [error scenario]?

## Requirements *(mandatory)*

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right functional requirements.
-->

### Functional Requirements

- **FR-001**: System MUST [specific capability, e.g., "allow users to create accounts"]
- **FR-002**: System MUST [specific capability, e.g., "validate email addresses"]  
- **FR-003**: Users MUST be able to [key interaction, e.g., "reset their password"]
- **FR-004**: System MUST [data requirement, e.g., "persist user preferences"]
- **FR-005**: System MUST [behavior, e.g., "log all security events"]

*Example of marking unclear requirements:*

- **FR-006**: System MUST authenticate users via [NEEDS CLARIFICATION: auth method not specified - email/password, SSO, OAuth?]
- **FR-007**: System MUST retain user data for [NEEDS CLARIFICATION: retention period not specified]

### Key Entities *(include if feature involves data)*

- **[Entity 1]**: [What it represents, key attributes without implementation]
- **[Entity 2]**: [What it represents, relationships to other entities]

## Success Criteria *(mandatory)*

<!--
  ACTION REQUIRED: Define measurable success criteria.
  These must be technology-agnostic and measurable.
-->

### Measurable Outcomes

- **SC-001**: [Measurable metric, e.g., "Users can complete account creation in under 2 minutes"]
- **SC-002**: [Measurable metric, e.g., "System handles 1000 concurrent users without degradation"]
- **SC-003**: [User satisfaction metric, e.g., "90% of users successfully complete primary task on first attempt"]
- **SC-004**: [Business metric, e.g., "Reduce support tickets related to [X] by 50%"]

## Assumptions

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right assumptions based on reasonable defaults
  chosen when the feature description did not specify certain details.
-->

- [Assumption about target users, e.g., "Users have stable internet connectivity"]
- [Assumption about scope boundaries, e.g., "Mobile support is out of scope for v1"]
- [Assumption about data/environment, e.g., "Existing authentication system will be reused"]
- [Dependency on existing system/service, e.g., "Requires access to the existing user profile API"]
