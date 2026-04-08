# Contract: Routing, Access Control, and Mock Data

## Purpose

Define routing and mock-data baseline contracts to satisfy `SCRUM-9` acceptance criteria.

## Routing Contract

1. Routes MUST be partitioned into `public` and `private` groups.
2. Private routes MUST enforce authenticated session checks before rendering protected content.
3. Unauthorized access to private routes MUST redirect to the configured auth entry route.
4. Route modules MUST declare metadata:
   - route id
   - access group (`public`/`private`)
   - layout binding
   - preload policy (`eager`/`lazy`)

## UI State Contract

Every route screen MUST define and render four baseline states:

- `loading`
- `empty`
- `error`
- `success`

Error state MUST include user-safe messaging and a recovery action.

## Mock Data Contract

1. Mock payloads MUST live under `website/src/mocks/screens/`.
2. Each screen mock file MUST include:
   - `screenId`
   - `version`
   - `payload`
3. `screenId` MUST match a declared route id.
4. Mock payloads MUST be valid JSON and satisfy the screen contract shape.
5. Mock payload changes MUST be traceable by version bump.
