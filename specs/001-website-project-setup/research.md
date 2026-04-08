# Phase 0 Research - Website Project Setup (SCRUM-9)

## Decision 1: Use Next.js App Router with top-level workspace boundaries

- Decision: Implement the website in a top-level `website/` workspace using Next.js App Router and route groups for public/private navigation, while creating `mobile/` and `backend/` placeholders.
- Rationale: `SCRUM-9` requires enterprise-grade scalable structure, public/private routing, and responsive web delivery with SEO support; top-level directories preserve a stable multi-platform layout from day one.
- Alternatives considered:
  - Pages Router: rejected because App Router better supports layout boundaries and route grouping for private/public flows.
  - Flat `src/` without workspace boundary: rejected because clear website/mobile/backend separation is required for forward scalability.

## Decision 2: Separate client state and server state responsibilities

- Decision: Use Zustand for client/UI/session state and React Query for API-backed server state caching.
- Rationale: This aligns directly with the mandated stack and cleanly separates local interaction state from remote data synchronization.
- Alternatives considered:
  - Redux Toolkit for all state: rejected to avoid heavier boilerplate for setup scope and because Zustand is explicitly requested.
  - React Context-only: rejected due to weaker scaling patterns for larger screen count and cache orchestration.

## Decision 3: Adopt Tailwind CSS + atomic component architecture with controller separation

- Decision: Define reusable atomic UI components and keep orchestration/business decisions in `controllers/` and `services/`.
- Rationale: `SCRUM-9` specifies Figma-first design translation, reusable atomic components, and separation of UI from business logic.
- Alternatives considered:
  - Utility-only pages with minimal component abstraction: rejected due to maintainability risk at ~50 screens.
  - CSS Modules-only styling stack: rejected because Tailwind is explicit in the subtask and supports rapid responsive theming.

## Decision 4: Enforce quality and formatting automation from day one

- Decision: Configure ESLint + Prettier and enforce auto-format on save plus pre-commit formatting checks.
- Rationale: This is explicit in the acceptance criteria and supports Constitution Principle I quality gates.
- Alternatives considered:
  - Manual formatting guidance only: rejected due to inconsistency risk.
  - Lint-only without formatting automation: rejected because subtask requires formatter automation before commit.

## Decision 5: Establish API service and mock data contract concurrently

- Decision: Create `services/api/` for endpoint wrappers and `mocks/screens/` for per-screen JSON fixtures sharing domain naming conventions.
- Rationale: Subtask requires both API service layer and mock data folders to seed backend model/API evolution.
- Alternatives considered:
  - Keep temporary mock data inline in components: rejected because it blocks reuse and future backend contract generation.
  - Delay service layer until backend readiness: rejected because setup acceptance requires service layer creation now.

## Decision 6: Testing strategy baseline

- Decision: Define test pyramid with Jest + React Testing Library (unit/integration), Playwright (E2E), and Storybook for component-level validation.
- Rationale: Matches SCRUM-9 technical context and Constitution Principles II/III/IV.
- Alternatives considered:
  - Cypress for E2E: rejected to stay aligned with mandated Playwright.
  - No Storybook in setup phase: rejected because component documentation and consistency checks are part of enterprise-grade setup expectations.

## Decision 7: Performance and accessibility guardrails

- Decision: Track initial budgets and quality bars: <2s load, Lighthouse mobile >=90, WCAG 2.1 AA, core bundle and CSS size budgets, and resilient error handling.
- Rationale: Required by SCRUM-9 constraints/performance goals and project constitution.
- Alternatives considered:
  - Define performance/accessibility later: rejected because constitution treats these as non-negotiable early gates.
