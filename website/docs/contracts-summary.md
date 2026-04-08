# Contracts Summary

## API Service Contract

- All calls use shared client in `website/src/services/api/http-client.ts`.
- Errors normalize to `{ code, message, recoverable, context }`.
- Protected routes use auth guard and token-aware request options.

## Routing and Mock Contract

- Public/private route definitions are declared in `website/src/routes/route-definitions.ts`.
- Private route protection is enforced in `website/src/middleware.ts`.
- Screen-level mock data is sourced from `website/src/mocks/screens/`.
