# Feature Specification: Backend API Stitch Alignment

**Feature Branch**: `004-backend-api-stitch-alignment`
**Created**: 2026-04-10
**Status**: Draft
**Input**: Align backend API shape and data model to Google Stitch website registration UI design at https://stitch.withgoogle.com/projects/2100673560530097365

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Patient Onboarding Registration API (Priority: P1)
As a prospective patient, I want the website sign-up flow to submit the Stitch-based registration form so that I can create an account and continue to login.

**Why this priority**: The registration form is the first conversion point for new patients, and it must align directly with the website UI contract.

**Independent Test**: Send a registration request with `fullName`, `email`, `password`, and `confirmPassword` that matches the UI payload. Verify a 201 response, success banner data, and user record creation.

**Acceptance Scenarios**:

1. **Given** the Stitch registration form is completed with valid values, **When** the frontend submits the payload, **Then** the backend returns `201 Created` with a success envelope and new user details.
2. **Given** a registration request uses an existing email, **When** it is submitted, **Then** the backend returns `409 Conflict` with `EMAIL_EXISTS` and `field: "email"`.
3. **Given** a registration request contains invalid `fullName`, `email`, or `password`, **When** it is submitted, **Then** the backend returns `400 Bad Request` with a field-level error response that the UI can display next to the relevant input.

---

### User Story 2 - Auth Flow Integration (Priority: P1)
As a returning patient, I want login and refresh endpoints that support the Stitch-based login flow so that I can authenticate and maintain my session.

**Why this priority**: Authentication is required immediately after registration and is essential for protected app flows.

**Independent Test**: Use login and refresh endpoints with valid credentials, verify tokens are returned, and verify protected resource access by reusing the token.

**Acceptance Scenarios**:

1. **Given** valid credentials, **When** I call `POST /api/v1/auth/login`, **Then** I receive access and refresh tokens with user metadata.
2. **Given** a valid refresh token, **When** I call `POST /api/v1/auth/refresh`, **Then** I receive a new access token and refresh token.
3. **Given** an invalid or expired access token, **When** I access a protected endpoint, **Then** I receive `401 Unauthorized`.

---

### User Story 3 - Field-Level Error Feedback (Priority: P2)
As a patient using the form, I want the backend to return consistent field-specific validation errors so that the Stitch UI can highlight the correct input and present accessible messaging.

**Why this priority**: Good user experience on the registration form depends on precise error mapping and friendly messaging.

**Independent Test**: Submit malformed requests and verify responses include `errorCode`, `error`, and `field` values for the failing input.

**Acceptance Scenarios**:

1. **Given** a request with invalid email format, **When** it is submitted, **Then** the backend returns `INVALID_INPUT` with `field: "email"`.
2. **Given** a password that does not meet strength requirements, **When** it is submitted, **Then** the backend returns `INVALID_INPUT` with `field: "password"`.
3. **Given** a missing full name, **When** it is submitted, **Then** the backend returns `INVALID_INPUT` with `field: "fullName"`.

---

## Quality Acceptance Criteria *(aligned with constitution)*

### Code Quality (Principle I: Code Quality Excellence)

- **QA-001**: Must keep business logic coverage ≥ 85% for backend registration/auth flows.
- **QA-002**: Must pass backend linting/static analysis with zero blocking issues.
- **QA-003**: Must avoid duplicated validation logic by centralizing request validation.
- **QA-004**: Must keep controller/service complexity ≤ 5 per method.

### Test-Driven Development (Principle II: TDD)

- **QA-005**: Must include automated tests for registration, login, refresh, and protected route access.
- **QA-006**: Must include negative tests for duplicate email, invalid full name, invalid email, weak password, and expired token.
- **QA-007**: Must include contract tests for the UI payload shape expected by the Stitch design.

### User Experience Consistency (Principle III: UX Consistency)

- **QA-008**: Must return field-specific errors in the same standard response shape across all endpoints.
- **QA-009**: Must preserve the public registration form contract defined by the Stitch UI.
- **QA-010**: Must return accessible, human-readable messages suitable for UI banner and inline field display.

### Performance Requirements (Principle IV: Performance)

- **QA-011**: Must keep registration and login response p95 ≤ 250ms in integration tests.
- **QA-012**: Must keep auth endpoint latency p99 ≤ 500ms under load.
- **QA-013**: Must use efficient validation and token generation to avoid unnecessary database roundtrips.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The backend MUST expose `POST /api/v1/auth/register` that accepts `fullName`, `email`, `password`, and `confirmPassword`.
- **FR-002**: The backend MUST default the registered user role to `Patient` for UI registration requests.
- **FR-003**: The backend MUST split `fullName` into `firstName` and `lastName` for storage, with a graceful fallback for single-word names.
- **FR-004**: The backend MUST return `201 Created` on successful registration with a standard JSON envelope.
- **FR-005**: The backend MUST return consistent error responses with `errorCode`, `error`, and optional `field`.
- **FR-006**: The backend MUST validate password strength and confirm password match server-side.
- **FR-007**: The backend MUST support `POST /api/v1/auth/login` and `POST /api/v1/auth/refresh` for the Stitch auth flow.
- **FR-008**: The backend MUST protect user profile and appointment endpoints with JWT authentication.
- **FR-009**: The backend MUST include audit fields (`CreatedOn`, `CreatedBy`, `ModifiedOn`, `ModifiedBy`) on persisted entities.
- **FR-010**: The backend MUST maintain a registration UI contract that supports the website's Stitch-designed onboarding experience.

### Key Entities *(include if feature involves data)*

- **RegistrationRequest**: Represents the registration payload from the Stitch UI, including `fullName`, `email`, `password`, and `confirmPassword`.
- **RegisterResponse**: Represents the success payload returned by the backend after user creation.
- **User**: Represents the persisted patient account, including `firstName`, `lastName`, `email`, `role`, `isActive`, and audit metadata.
- **AuthToken**: Represents access and refresh tokens used by the frontend to maintain session state.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The backend registration endpoint accepts the UI payload and returns success for valid Stitch-based user submissions.
- **SC-002**: The backend returns field-level validation responses for invalid `fullName`, `email`, or `password` inputs.
- **SC-003**: The login endpoint issues valid access tokens that enable protected endpoint access with `Authorization: Bearer` headers.
- **SC-004**: The refresh endpoint issues new tokens and preserves session continuity for valid refresh tokens.
- **SC-005**: The registration UI contract is documented and supported with automated contract tests.

### Technology-Agnostic Metrics

- **SC-006**: 100% of valid registration submissions from the Stitch UI payload succeed.
- **SC-007**: <1% of registration requests produce 500-level errors in controlled test scenarios.
- **SC-008**: 100% of invalid form submissions return actionable UI-level error information.
- **SC-009**: 90% of auth-related tests pass on first execution without manual fixes.

## Assumptions

- The Stitch website design is for public patient registration and login, not provider onboarding.
- The UI expects a single `fullName` field rather than separate `firstName` and `lastName` inputs.
- The backend will map UI registration input to the existing `User` entity fields.
- The existing .NET 8 backend architecture and JWT authentication patterns are reused.
- The backend registration flow is delivered in the same release as the Stitch UI onboarding page.
