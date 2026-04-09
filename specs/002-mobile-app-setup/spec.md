# Feature Specification: Mobile App Setup for Login and Dashboard MVP

**Feature Branch**: `002-mobile-app-setup`  
**Created**: 2026-04-09  
**Status**: Draft  
**Input**: Initial MVP based on Google Stitch project `Remix of Mobile - Patient Auth & Profile` (`12210324048331832562`)

## Clarifications

### Session 2026-04-09

- Q: What should happen to the hardcoded-auth session when the app is reopened? → A: Reset to `Login` every time the app is reopened
- Q: How many hardcoded demo accounts should the MVP support? → A: One shared demo account
- Q: How should invalid login feedback be shown in the MVP? → A: Show an inline error message on the `Login` screen
- Q: How should hardcoded dashboard content behave across logins? → A: One fixed dashboard dataset for all logins
- Q: How interactive should the MVP dashboard be? → A: Dashboard has buttons that show placeholder alerts
- Q: What identifier should the MVP login use? → A: `username + password`

## User Scenarios & Testing

### User Story 1 - Patient Logs In With Hardcoded Credentials (Priority: P1)

A patient opens the mobile app and needs a sign-in screen that matches the approved design direction and allows access with a predefined set of hardcoded credentials.

**Why this priority**: Login is the smallest useful entry point for the MVP. It lets the team validate the visual design, form behavior, navigation, and protected-state setup without waiting for backend APIs.

**Independent Test**: Launch the app, open the login screen, submit the known valid credentials, and verify that only those credentials reach the dashboard.

**Acceptance Scenarios**:

1. **Given** the patient opens the app in the MVP build, **When** the initial screen appears, **Then** the app shows the `Login` experience aligned to the Stitch design direction
2. **Given** the patient enters the predefined valid username and password, **When** they submit the login form, **Then** the app authenticates locally and routes them to `Home`
3. **Given** the patient enters a username or password that does not match the predefined values, **When** they submit the login form, **Then** the app stays on `Login` and shows a clear inline invalid-credentials message on the same screen
4. **Given** the patient leaves a required login field empty, **When** they attempt submission, **Then** the app blocks authentication and shows validation feedback on the same screen

---

### User Story 2 - Authenticated Patient Sees a Hardcoded Dashboard (Priority: P1)

An authenticated patient needs a dashboard screen that visually matches the approved design direction and is populated with representative hardcoded values.

**Why this priority**: The dashboard is the first protected experience after login and completes the MVP loop. Hardcoded values are sufficient for validating layout fidelity and navigation.

**Independent Test**: Log in with the valid credentials and verify the patient reaches `Home` with static dashboard content rendered consistently on each run.

**Acceptance Scenarios**:

1. **Given** the patient has successfully logged in with the valid hardcoded credentials, **When** navigation completes, **Then** the app routes them to `Home`
2. **Given** the patient is on `Home`, **When** the screen loads, **Then** the dashboard content is populated from one fixed predefined hardcoded dataset used for every successful login
3. **Given** the patient selects a dashboard action in the MVP, **When** the action is triggered, **Then** the app shows a placeholder alert instead of navigating to a real feature
4. **Given** the patient has not authenticated successfully, **When** they attempt to reach `Home`, **Then** the app prevents access and keeps them on `Login`

---

### Edge Cases

- What happens when the patient submits the login form with empty fields?
- What happens when the patient uses the correct username with an incorrect password, or vice versa?
- On every full app relaunch, the MVP resets the authenticated state and returns the patient to `Login`
- How does the dashboard behave if one or more hardcoded values are intentionally missing for design testing?
- What happens when a patient taps a dashboard action that has no backend or destination yet?

## Requirements

### Functional Requirements

- **FR-001**: The MVP mobile setup MUST implement `Login` and `Home` as the only in-scope patient-facing screens
- **FR-002**: The system MUST present `Login` as the initial screen in the MVP build
- **FR-003**: The `Login` screen MUST visually align with the approved Stitch design direction for the login experience
- **FR-004**: The system MUST authenticate users locally using one shared predefined hardcoded demo account with `username + password` credentials stored in the app codebase for MVP use only
- **FR-005**: The system MUST grant access to `Home` only when the submitted credentials exactly match the predefined hardcoded values
- **FR-006**: The system MUST reject any non-matching credentials and keep the patient on `Login`
- **FR-007**: The system MUST validate required `username` and `password` fields before attempting hardcoded authentication
- **FR-008**: The system MUST display a clear inline invalid-credentials message on `Login` when hardcoded authentication fails
- **FR-009**: The system MUST route successfully authenticated patients from `Login` to `Home`
- **FR-010**: The `Home` screen MUST visually align with the approved Stitch design direction for the dashboard experience
- **FR-011**: The `Home` screen MUST render one fixed predefined hardcoded dashboard dataset for MVP review
- **FR-012**: The system MUST keep `Home` inaccessible until hardcoded authentication succeeds
- **FR-013**: The MVP MUST be structured so the hardcoded authentication and dashboard data can later be replaced by real services without redesigning the screens
- **FR-014**: The `Login` and `Home` screens MUST support mobile accessibility basics, including readable labels, validation feedback, and touch targets suitable for phone use
- **FR-015**: The hardcoded MVP session MUST reset on every full app relaunch so the user returns to `Login`
- **FR-016**: The `Home` screen MAY include dashboard action controls in the MVP, but each control MUST show a placeholder alert instead of invoking a live workflow

### Key Entities

- **Hardcoded Credential Set**: The single predefined `username + password` combination accepted by the MVP login flow
- **Hardcoded Demo Account**: The one shared `username + password` combination accepted by the MVP login flow
- **Auth Session State**: The in-app authenticated/unauthenticated flag that controls whether `Home` is accessible
- **Dashboard Data**: The single fixed predefined static dataset rendered on `Home` for design and navigation validation

## Success Criteria

### Measurable Outcomes

- **SC-001**: A reviewer can open the app, enter the valid hardcoded `username + password`, and reach `Home` in under 30 seconds
- **SC-002**: 100% of invalid credential attempts remain on `Login` and display an authentication error message
- **SC-002**: 100% of invalid credential attempts remain on `Login` and display an inline authentication error message
- **SC-003**: `Home` renders the same dashboard content on every clean run of the MVP build
- **SC-004**: Design review confirms `Login` and `Home` both match the intended Stitch design direction closely enough for first-pass UI approval
- **SC-005**: Unauthenticated users are unable to access `Home` during MVP review
- **SC-006**: 100% of in-scope dashboard actions display placeholder alerts rather than broken navigation or silent failure

## Assumptions

- This initial increment is intentionally limited to `Login` and `Home`; onboarding, registration, country code selection, profile, edit mode, and session expiry are deferred
- Hardcoded credentials are acceptable for this MVP because the goal is design validation and basic route protection, not production-ready security
- The MVP supports one shared demo account rather than multiple user profiles
- The shared demo account uses a `username + password` login shape rather than email or phone
- Hardcoded dashboard values are acceptable for this MVP because the goal is to validate layout and protected-screen flow before backend integration
- The dashboard uses one fixed hardcoded dataset for every successful login in the MVP
- The dashboard may include placeholder action buttons solely to support design validation before real destinations exist
- The approved Stitch project remains the visual reference, but only the `Login` and `Home` parts of that design are in scope right now
- The hardcoded authentication and dashboard data will be replaced by real APIs in a later increment
- The hardcoded MVP does not persist authenticated state across full app restarts
