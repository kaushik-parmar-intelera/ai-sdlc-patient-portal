# Implementation Plan: Website Project Setup (Next.js Frontend)

**Branch**: `001-website-project-setup` | **Date**: 2026-04-08 | **Spec**: `/specs/001-website-project-setup/spec.md`
**Input**: Feature specification from `/specs/001-website-project-setup/spec.md` and Jira subtask `SCRUM-9` (Web Project Setup (Next.js) - Frontend Only)

## Summary

Set up a website-focused Patient Portal foundation using the stack mandated in `SCRUM-9`: Next.js 14+ with React 18+ and TypeScript 5.x, Zustand for client state, React Query for server-state caching, Tailwind CSS for responsive theming, and a scalable architecture with public/private routing, API service layer, lint/format automation, and screen-level mock data organization. Use a top-level workspace layout with `website/`, `mobile/`, `backend/`, and `tests/` directories, where website implementation starts now and other product areas are initialized as empty placeholders.

## Technical Context

**Language/Version**: TypeScript 5.x with Next.js 14+ compatibility  
**Primary Dependencies**: Next.js 14+, React 18+, Zustand, React Query, Tailwind CSS, ESLint, Prettier, Storybook  
**Storage**: Backend API as source of truth (website app caches via React Query); screen-level mock JSON data for development parity  
**Testing**: Jest + React Testing Library (unit/integration), Playwright (E2E), Storybook-based component verification  
**Target Platform**: Web browsers (desktop, tablet, mobile) with responsive PWA support  
**Project Type**: Top-level multi-directory project (`website` active, `mobile`/`backend` placeholders) with Next.js website app and controller-pattern UI/business separation  
**Performance Goals**: <2s page load, Lighthouse mobile >=90, support 1000 concurrent users, <=100ms interactive feedback on primary controls  
**Constraints**: Core JS bundle <200KB gzipped, feature CSS <100KB, WCAG 2.1 AA, zero-trust security posture, error boundaries + network interceptors, auto-format on save and pre-commit  
**Scale/Scope**: Setup baseline for ~50 screens, 7 user stories, and 10,000+ service catalog entries

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Based on `.specify/memory/constitution.md`, verify:

- [x] **Code Quality (Principle I)**: Project type and language/version identified -> YES
  - Linting tool identified: ESLint (+ Prettier formatting policy)
  - Code coverage target: 80% business logic, 70% UI

- [x] **Test-Driven (Principle II)**: Testing framework pre-selected -> YES
  - Testing tool identified: Jest + React Testing Library + Playwright
  - Unit test strategy defined: test-first for stores, hooks, controllers, and component behavior
  - Integration test scope identified: route guards, API service layer, React Query integration, mock-to-service flow

- [x] **UX Consistency (Principle III)**: Web feature requirements defined
  - Design system applied: YES (Figma-first, reusable atomic components)
  - Platform consistency documented: responsive behavior aligned across desktop/tablet/mobile
  - Accessibility requirements clear: WCAG 2.1 AA baseline for all starter pages

- [x] **Performance (Principle IV)**: SLA targets documented
  - Response time targets: page load <2s, interactive feedback <=100ms, Lighthouse mobile >=90
  - Throughput/resources: support 1000 concurrent users; bundle and CSS budget constraints documented
  - Performance testing tool: Lighthouse + Playwright flows with CI threshold checks

**Gate Status**: [x] PASS (all gates checked) | [ ] NEEDS CLARIFICATION (see flags above) | [ ] DEFER (with justification)

## Project Structure

### Documentation (this feature)

```text
specs/001-website-project-setup/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── api-service-contract.md
│   └── routing-and-mock-contract.md
└── tasks.md
```

### Source Code (repository root)

```text
website/
├── src/
│   ├── app/
│   │   ├── (public)/
│   │   ├── (private)/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── error.tsx
│   ├── components/
│   │   ├── atoms/
│   │   ├── molecules/
│   │   └── organisms/
│   ├── controllers/
│   ├── hooks/
│   ├── lib/
│   ├── routes/
│   ├── services/
│   │   ├── api/
│   │   └── query/
│   ├── store/
│   ├── mocks/
│   │   └── screens/
│   ├── styles/
│   └── types/
├── public/
├── .storybook/
└── package.json

mobile/
└── .gitkeep

backend/
└── .gitkeep

tests/
├── unit/
├── integration/
└── e2e/
```

**Structure Decision**: Adopt a top-level workspace split with `website/`, `mobile/`, `backend/`, and `tests/`. Implement `SCRUM-9` inside `website/` now; keep `mobile/` and `backend/` as empty placeholders to align future implementation tracks without changing project layout later.

## Complexity Tracking

No constitution violations require justification at planning time.

## Post-Design Constitution Re-check

- [x] Principle I maintained: linting/formatting, coverage, and architecture constraints captured in research + quickstart.
- [x] Principle II maintained: test-first strategy and framework mapping documented.
- [x] Principle III maintained: accessibility + responsive + design-system alignment reflected in contracts and data model.
- [x] Principle IV maintained: explicit performance budgets and verification path included.

**Post-Design Gate Status**: PASS
