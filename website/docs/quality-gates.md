# Quality Gates

## Required Checks

1. ESLint passes with no errors.
2. Typecheck passes with no TypeScript errors.
3. Unit and integration tests pass.
4. Build succeeds.
5. Coverage threshold remains at >=80% business logic and >=70% UI-oriented flows.

## Execution

- Local: `npm run validate`
- CI: `.github/workflows/website-quality.yml`

## Failure Remediation

- Fix lint violations first.
- Resolve type errors next.
- Address failing tests and update assertions.
- Re-run `npm run validate` before pushing.
