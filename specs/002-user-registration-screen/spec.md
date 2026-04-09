# Feature Specification: User Registration Screen (Patient Portal)

**Context**: SCRUM-1 - User Registration Screen  
**Status**: Specification Phase  
**Last Updated**: 2026-04-08

## 1. Feature Overview

### Summary
Enable new patients to create secure accounts by providing a simple, user-friendly registration interface with name, email, and password inputs. The system validates inputs, securely stores credentials, and provides clear error messaging without exposing sensitive information.

### Success Criteria
- ✅ Registration form renders with proper input fields and validation UI
- ✅ Valid submission creates user account and stores credentials securely
- ✅ Input validation provides clear, actionable error messages
- ✅ Error handling does not expose sensitive system information
- ✅ Mobile and desktop designs match Google Stitch reference
- ✅ WCAG 2.1 AA accessibility compliance (Principle III: UX Consistency)
- ✅ Form interactions maintain ≥55fps performance (Principle IV: Performance)
- ✅ Code coverage ≥80% for business logic (Principle I: Code Quality)
- ✅ TDD approach with tests written first (Principle II: TDD)

## 2. User Story

**As a** new patient  
**I want to** create an account by entering name, email, and password  
**So that** I can access the application securely

### Acceptance Criteria
1. **Welcome/Entry**: New visitors land on registration page; page title and headings are clear
2. **Form Fields**: Three input fields present: Full Name, Email, Password
3. **Client-Side Validation**:
   - Full Name: Required, minimum 2 characters, alphabetic + spaces only
   - Email: Required, valid email format (RFC 5322 subset)
   - Password: Required, minimum 8 characters, at least one uppercase, one lowercase, one digit, one special character
4. **Real-Time Feedback**: Validation errors appear as user interacts (on blur/change)
5. **Submit Button**: Disabled until all fields pass validation; shows loading state during submission
6. **Success Flow**: On valid submission → clear form → show success message → redirect to login/onboarding (behavioral detail TBD)
7. **Error Handling**:
   - Email already exists: "Email already registered. Try login or use another email."
   - Server error: "Unable to create account. Please try again later." (no stack traces)
   - Network error: Retry prompt with exponential backoff up to 3 attempts
8. **Keyboard Navigation**: Tab through fields in logical order; Enter submits from password field
9. **Mobile Responsiveness**: Form stacks vertically; touch-friendly input sizes (48px minimum line-height)
10. **Accessibility**: Form labels, error announcements via ARIA live regions, focus management

## 3. Design Reference

### Stitch Projects
- **Website Design**: https://stitch.withgoogle.com/projects/2100673560530097365
- **Mobile Design**: https://stitch.withgoogle.com/projects/9555780054807567103

### Key Visual Requirements (from Stitch)
- Color palette: Tailwind CSS tokens (to be extracted from Stitch in planning phase)
- Typography: Consistent with existing design system (tokens.css)
- Layout: Centered single-column form on desktop; full-width on mobile
- Button states: Default, hover, active, loading, disabled
- Error state styling: Red accent with icon + message text

## 4. Technical Context

### Stack
- **Frontend Framework**: Next.js 14.2+ (TypeScript 5.x)
- **UI Framework**: React 18+
- **Styling**: Tailwind CSS + design tokens (globals.css, tokens.css)
- **Form Handling**: React Hook Form or similar (existing integrations TBD in planning)
- **Validation**: Zod or similar schema validation library
- **Testing**: Jest + React Testing Library (unit), Playwright (E2E)
- **State Management**: Zustand (auth session store)
- **HTTP Client**: Existing API service layer (services/api/http-client.ts)

### API Integration
- **Endpoint**: POST /api/auth/register (backend routing TBD)
- **Request Payload**:
  ```json
  {
    "fullName": "string",
    "email": "string (unique)",
    "password": "string (hashed on server)"
  }
  ```
- **Success Response** (201):
  ```json
  {
    "userId": "string",
    "email": "string",
    "message": "Account created successfully"
  }
  ```
- **Error Response** (400/409/500):
  ```json
  {
    "error": "string (user-friendly message)",
    "errorCode": "string (e.g., EMAIL_EXISTS, INVALID_INPUT)"
  }
  ```

### Route Structure
- **URL Path**: `/register` or `/auth/register` (to be confirmed in planning)
- **Route Group**: Public (unauthenticated users only)
- **Layout Inheritance**: Inherits from app root layout; may use auth-specific layout sub-group

### Dependencies
- **Required**: None (blocking prerequisites completed in Phase 2 of 001-website-project-setup)
- **Optional**: Existing form components from Phase 3 (e.g., shared input atoms if available)

## 5. Non-Functional Requirements

### Performance (Constitution Principle IV)
- **Web Vitals Target**:
  - Page load: ≤2.5s LCP
  - Form interaction response: ≤100ms
  - Submit button feedback: ≤200ms p95 (backend latency + client rendering)
- **Baseline**: Measure against Lighthouse baseline

### Code Quality (Constitution Principle I)
- **Linting**: ESLint 9.39.4 rules enforced; no warnings in registration module
- **Complexity**: Max cyclomatic complexity 5 per function
- **Duplication**: No code duplication >3 LOC instances
- **Coverage**: ≥80% function/line/statement coverage; ≥70% branch coverage

### Testing (Constitution Principle II - TDD)
- **Test-First Approach**: Write tests before implementation; validate failing tests before coding
- **Unit Tests**: Form component logic, validation rules, error handling
- **Integration Tests**: Form submission flow, API client integration
- **E2E Tests**: Happy path (successful registration) and error paths (invalid input, server error)
- **Test Data**: Mock API responses; test fixtures in `tests/mocks/auth/`

### Accessibility (Constitution Principle III)
- **Target Level**: WCAG 2.1 AA
- **Requirements**:
  - Semantic HTML form structure (`<form>`, `<label>`, `<input>`)
  - Error messages linked to inputs via aria-describedby
  - Live region announcements for dynamic errors (aria-live="polite")
  - Focus management: visible focus indicator; logical tab order
  - Color: Do not rely on color alone; use icons + text for error states
  - Mobile: Touch targets ≥48px

## 6. Constraints & Assumptions

### Constraints
- Cannot expose backend error details (e.g., database connection failures)
- Password must never be logged or stored in plain text
- Registration state machine must handle edge cases (duplicate submission, network retry)
- Mobile and web implementations must share validation logic (or contract)

### Assumptions
- **Backend ready**: API endpoint `/api/auth/register` exists and handles validation ✅ (assumed)
- **Design finalized**: Google Stitch projects contain all visual specifications ✅ (external reference)
- **Email service out of scope**: Email verification happens in User Story 2+ (not part of MVP)
- **Password reset out of scope**: Handled separately (not part of registration flow)

## 7. Phase Mapping

### Relates to Phase 3 (User Story 1 - MVP)
This feature extends the baseline website launch by adding the **registration entry point**. It is parallel-compatible with T022-T025 (bootstrap + routing scaffolding) but depends on:
- Base layout + route groups (T025, T026) ✅
- Providers and React Query setup (T014) ✅
- HTTP client service (T015) ✅
- Auth session store (T016) ✅

### Associated Tasks (to be generated)
- Tests: Unit, integration, E2E test suites
- Implementation: Form component, validation schema, API integration
- Documentation: README, storybook stories, accessibility audit

## 8. Known Unknowns & Clarifications Needed

- [ ] **Form library choice**: Should we use React Hook Form, Formik, or simple useState? (planning phase)
- [ ] **Validation library**: Zod, Yup, or native JS? (planning phase)
- [ ] **Route naming**: `/register`, `/auth/register`, or `/signup`? (confirm with design/backend)
- [ ] **Success redirect**: After registration, where should user be taken? (login, onboarding, dashboard?) (confirm with UX/backend)
- [ ] **Email verification**: Immediate or after confirmation email? (assume no for MVP, defer to Phase 2)
- [ ] **Backend API contract**: Exact error codes and response format (assume schema above, confirm in planning)
- [ ] **Design token mapping**: Specific colors, spacing, fonts from Stitch (extract in planning phase)
- [ ] **Password requirements**: Exact entropy/rules (assume above; confirm with security team in planning)

## 9. References

### Jira Ticket
- **ID**: SCRUM-1
- **Type**: User Story
- **Status**: In Progress
- **Link**: https://intelera-team-gbifcm47.atlassian.net/browse/SCRUM-1

### Related Documents
- [Constitution](../../.specify/memory/constitution.md) - Governs all 4 principles
- [Website Project Setup Spec](../001-website-project-setup/spec.md) - Parent feature
- [Tasks](../001-website-project-setup/tasks.md) - Phase 3 context (US1)
