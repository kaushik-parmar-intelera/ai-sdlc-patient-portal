# Quickstart - Website Project Setup (Next.js Frontend)

## 1. Prerequisites

- Node.js 20 LTS (or newer LTS compatible with Next.js 14+)
- npm 10+ (or project-approved package manager)
- Git and shell access

## 2. Initialize Top-Level Workspaces

```bash
mkdir -p website mobile backend tests
touch mobile/.gitkeep backend/.gitkeep
cd website
npx create-next-app@latest . --ts --eslint --src-dir --app --import-alias "@/*"
```

## 3. Install Required Stack

```bash
npm install zustand @tanstack/react-query tailwindcss postcss autoprefixer
npm install -D prettier eslint-config-prettier eslint-plugin-import jest @testing-library/react @testing-library/jest-dom @testing-library/user-event playwright storybook
```

## 4. Create Required Structure

Create baseline directories:

```text
website/src/components/{atoms,molecules,organisms}
website/src/controllers
website/src/hooks
website/src/routes
website/src/services/{api,query}
website/src/store
website/src/mocks/screens
website/src/types
tests/{unit,integration,e2e}
```

## 5. Configure Routing and Access Groups

- Add route groups in `src/app/` for public and private sections.
- Add a route access guard for private pages.
- Add global error boundary and route-level `error` handling pages.

## 6. Configure State and API Layers

- Create a shared Zustand store module for session/UI state.
- Configure React Query client provider in root layout.
- Create HTTP client wrapper for API service modules with normalized error contract.

## 7. Configure Quality Automation

- Enable ESLint and Prettier integration.
- Enforce format-on-save in editor config.
- Add pre-commit hook to run formatter and lint checks.

## 8. Seed Mock Data

- Create per-screen JSON files in `src/mocks/screens/`.
- Keep mock payload keys aligned to intended backend contracts.

## 9. Validate Baseline

Run and verify:

```bash
npm run lint
npm run test
npm run build
npm run dev
```

## 10. Acceptance Checklist Mapping (SCRUM-9)

- [x] Scalable website architecture defined
- [x] Folder structure planned (`components`, `pages/app`, `services`, `hooks`)
- [x] Public/private routing approach defined
- [x] Zustand state management included
- [x] Environment configuration path documented
- [x] ESLint + Prettier included
- [x] Auto-format strategy documented
- [x] API service layer contract defined
- [x] Mock data folder strategy defined
