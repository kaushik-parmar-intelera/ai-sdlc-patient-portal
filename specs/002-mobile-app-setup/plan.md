# Implementation Plan: Mobile App Login and Dashboard MVP

**Branch**: `002-mobile-app-setup` | **Date**: 2026-04-09 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `/specs/002-mobile-app-setup/spec.md`

## Summary

Set up the first usable mobile app shell inside `mobile/` with only two in-scope screens: `Login` and `Home`. Authentication will be performed entirely against hardcoded credentials, and the dashboard will render hardcoded values, while both screens should visually match the approved Stitch design direction as closely as possible.

## Technical Context

**Language/Version**: TypeScript 5.x  
**Primary Dependencies**: Expo, React Native, Expo Router, React Hook Form, Zod  
**Storage**: In-memory local session state for the MVP; hardcoded dashboard data in source files  
**Testing**: Jest, React Native Testing Library  
**Target Platform**: iOS and Android phones  
**Project Type**: Mobile app  
**Performance Goals**: Cold start <= 2s, login feedback <= 100ms, smooth dashboard rendering on standard simulators  
**Constraints**: Scope is limited to `Login` and `Home`; authentication must use hardcoded credentials only; dashboard content must use hardcoded values only; screens should match the Stitch design direction  
**Scale/Scope**: 2 screens, 2 user stories, no backend integration in this increment

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Based on `.specify/memory/constitution.md`, verify:

- [x] **Code Quality (Principle I)**: Project type and language/version identified
  - Linting tool identified: ESLint + TypeScript strict mode
  - Code coverage target: 80% business logic, 70% UI

- [x] **Test-Driven (Principle II)**: Testing framework pre-selected
  - Testing tools identified: Jest and React Native Testing Library
  - Unit test strategy defined: login validation, hardcoded auth matching, protected route behavior
  - Integration test scope identified: login submission and navigation to dashboard

- [x] **Stitch-Driven UX (Principle III)**:
  - Design system applied: YES, with focus on the `Login` and `Home` design direction from Stitch project `12210324048331832562`
  - Platform consistency documented: MVP will implement only the login and dashboard parts of the approved design
  - Accessibility requirements clear: readable labels, clear validation messaging, touch-friendly controls

- [x] **Performance (Principle IV)**: SLA targets documented
  - Response targets: immediate hardcoded login feedback and stable dashboard rendering
  - Resource targets: lightweight MVP shell suitable for simulator review
  - Performance testing approach: manual simulator validation during MVP review

**Gate Status**: PASS

## Design Inventory

Reference screens from Stitch MCP project `Remix of Mobile - Patient Auth & Profile` (`12210324048331832562`):

1. `Login` - `e531b38ca3734f8ca088fbf428c5cb47`
2. `Home` - `c924e3f5dea6428b896de82cd6281bb0`

Deferred for later increments:

- `Splash / Onboarding`
- `Registration`
- `Country Code Picker`
- `Profile`
- `Profile (Edit Mode)`
- `Session Expired`

## Project Structure

### Documentation (this feature)

```text
specs/002-mobile-app-setup/
├── plan.md
├── spec.md
├── checklists/
│   └── requirements.md
└── tasks.md
```

### Source Code (repository root)

```text
mobile/
├── app/
│   ├── _layout.tsx
│   ├── index.tsx
│   ├── login.tsx
│   └── home.tsx
├── src/
│   ├── features/
│   │   ├── auth/
│   │   └── home/
│   ├── components/
│   │   ├── forms/
│   │   └── layouts/
│   ├── store/
│   ├── theme/
│   ├── constants/
│   │   ├── auth.ts
│   │   └── dashboard.ts
│   └── types/
└── package.json

tests/
├── unit/mobile/
└── integration/mobile/
```

**Structure Decision**: Build the smallest possible Expo-based mobile structure that supports one public screen (`Login`) and one protected screen (`Home`), with hardcoded constants isolated so they can be swapped out later.

## Phase 0: Research Goals

Research only the implementation decisions needed for this MVP:

1. Best lightweight route protection approach for `Login` and `Home`
2. Best way to encode Stitch design direction into reusable screen primitives
3. Best simple strategy for hardcoded auth/session state that is easy to replace later

## Phase 1: Design Artifacts To Produce

- **tasks.md**: MVP tasks split across mobile shell setup, login flow, and dashboard implementation

## Delivery Strategy

1. Stand up the mobile shell and base navigation
2. Implement `Login` to match the Stitch design direction
3. Add hardcoded credential validation and protected navigation
4. Implement `Home` with hardcoded dashboard values matching the Stitch design direction
5. Finish with validation states, accessibility basics, and tests

## Complexity Tracking

No constitution exceptions are currently required.
