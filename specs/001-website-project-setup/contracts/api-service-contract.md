# Contract: Frontend API Service Layer

## Purpose

Define baseline contract rules for the API service layer required by Jira subtask `SCRUM-9`.

## Scope

- Applies to all modules under `website/src/services/api/`.
- Covers request construction, auth handling, error handling, and typed response normalization.

## Contract Rules

1. Every API function MUST expose a typed request and typed response contract.
2. Every API function MUST be created through a shared HTTP client wrapper that includes:
   - timeout policy
   - auth token injection for protected endpoints
   - normalized error object mapping
3. Protected endpoints MUST enforce auth interceptor flow before request dispatch.
4. API services MUST be consumed via React Query hooks in `website/src/services/query/`.
5. API services MUST support mock substitution when `enableMockMode=true`.

## Error Contract

All service errors MUST normalize to:

```json
{
  "code": "string",
  "message": "string",
  "recoverable": true,
  "context": {
    "operation": "string",
    "requestId": "string"
  }
}
```

## Non-Functional Requirements

- Service calls MUST be compatible with retry/backoff policy defined in shared client config.
- Service calls MUST emit telemetry events when telemetry is enabled.
- Sensitive tokens MUST never be logged.
