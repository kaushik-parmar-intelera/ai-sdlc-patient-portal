<!--
  SYNC IMPACT REPORT (v1.0.0 Backend Constitution)
  ├─ Version: 1.0.0 (initial backend constitution)
  ├─ Created: 2026-04-09 (derivative of main constitution)
  ├─ Scope: Backend services across Python FastAPI, Node.js Express, microservices
  ├─ Principles Added:
  │  ├─ I. Code Quality Excellence (Backend-specific)
  │  ├─ II. Testing Standards (Backend-focused)
  │  ├─ III. Clean Architecture & Layering
  │  ├─ IV. API User Experience & Contracts
  │  └─ V. Performance & Scalability
  ├─ Key Sections:
  │  ├─ Core Principles (5 backend-focused principles)
  │  ├─ Backend Architecture Standards
  │  ├─ API Design & Contract Standards
  │  └─ Governance & Compliance
  └─ Follow-up: None (all placeholders resolved)
-->

# Backend Services Constitution

## Core Principles

### I. Code Quality Excellence

Every backend service MUST maintain industry-standard code quality and consistency:

- **Enforced Standards**:
  - Linting & Formatting: Pylint/flake8 (Python), ESLint (Node), Prettier (all) MUST run pre-commit
  - Type Safety: Type hints mandatory on all public functions (Python); strict TypeScript mode enforced (Node.js)
  - Code Coverage: Min 85% for business logic, 75% for utilities
  - Complexity: Cyclomatic complexity ≤ 5 per function; refactor if exceeded
  - Duplication: Max 3% code duplication across all backend repositories

- **Language-Specific Rules**:
  - **Python**: PEP 8 compliance; docstrings for all public modules, functions, classes; no bare except clauses
  - **Node.js**: Strict mode enforced; const/let only (no var); ES6+ syntax required
  - **All**: No hardcoded secrets, API keys, or credentials; use environment variables/secret management only

- **Documentation Requirements**:
  - README.md per service (purpose, setup, run instructions)
  - API documentation auto-generated from OpenAPI/Swagger specs
  - Database schema documentation with migration notes

- **Rationale**: Consistent code quality reduces bugs, enables rapid onboarding, ensures maintainability, and prevents technical debt accumulation.

### II. Testing Standards (NON-NEGOTIABLE)

All backend services MUST follow Test-First (Red-Green-Refactor) development:

- **Mandatory Test Strategy**:
  1. Requirements analyzed and test cases designed
  2. Test suite written before implementation (RED phase)
  3. Tests MUST initially fail
  4. Implementation proceeds until tests pass (GREEN)
  5. Code refactored for quality (REFACTOR)

- **Test Coverage Requirements**:
  - **Unit Tests**: Min 85% of business logic; isolated dependency injection; MUST test error paths
  - **Integration Tests**: All API endpoints; database operations; service boundaries; external service mocks
  - **Contract Tests**: API request/response validation; schema compliance; error response formats
  - **Performance Tests**: Endpoint response time benchmarks; database query performance; memory leaks detection
  - **Security Tests**: SQL injection prevention; authentication/authorization enforcement; input validation

- **Test Execution Standards**:
  - Unit tests MUST run in <5s total
  - Integration tests MUST run in <30s per service
  - All tests MUST pass before merge (no exceptions)
  - Test failure blocks CI/CD pipeline immediately

- **Mutation Testing**:
  - Run mutation tests quarterly; min 80% mutation score on critical paths
  - Rationale: Validates that tests actually detect defects (not just coverage measurement)

- **Rationale**: TDD ensures correctness at implementation time, reduces post-release defects by 40-60%, and provides regression detection.

### III. Clean Architecture & Layering

Every backend service MUST follow layered clean architecture for maintainability and testability:

- **Mandatory Layers** (ordered by dependency):
  1. **Presentation Layer** (Controllers/Handlers): HTTP routing, request validation, response formatting only
  2. **Application Layer** (Use Cases/Services): Business logic orchestration; dependency injection; transaction management
  3. **Domain Layer** (Entities/Value Objects): Pure business rules; zero external dependencies; no side effects
  4. **Infrastructure Layer** (Repositories, external clients): Database access, API clients, file I/O

- **Architectural Rules**:
  - **Dependency Direction**: Always inward (UI → App → Domain; never Domain → App/UI)
  - **No Circular Dependencies**: Enforced via architecture tests or linting
  - **Interfaces/Contracts**: Abstract external dependencies; enable swapping implementations
  - **Error Handling**: Domain layer throws custom exceptions; outer layers handle translation to HTTP/protocol-specific errors
  - **Data Mapping**: Separate data models per layer (DTOs, domain models, persistence models)

- **Folder Structure Example**:
  ```
  src/
    controllers/        # HTTP routing, validation
    services/          # Business logic, use cases
    domain/            # Entities, value objects, rules
    repositories/      # Data access abstractions
    mappers/           # DTO ← → Domain conversions
    dto/               # Data transfer objects
    exceptions/        # Domain & app exceptions
  ```

- **Testing Implications**:
  - Domain logic testable without mocks (pure functions + entities)
  - Services testable with dependency injection
  - Controllers tested via integration tests (HTTP layer)

- **Rationale**: Clean architecture enables rapid feature changes, isolates business logic from frameworks, and makes code testable and reusable.

### IV. API User Experience & Contracts

All REST/GraphQL APIs MUST provide a consistent, predictable, and well-documented experience:

- **API Contract Standards**:
  - **OpenAPI 3.0+ Specification** required for all REST endpoints
  - **Versioning**: API versioning MUST be explicit (v1, v2 in URL or header); breaking changes only with major version
  - **Response Format**: All responses MUST follow standard envelope:
    ```json
    {
      "success": true,
      "data": { ... },
      "meta": { "timestamp": "ISO-8601", "version": "1.0" }
    }
    ```
  - **Error Responses**: Consistent format for all errors:
    ```json
    {
      "success": false,
      "error": {
        "code": "INVALID_REQUEST",
        "message": "User-friendly description",
        "details": [ { "field": "email", "reason": "invalid format" } ]
      }
    }
    ```

- **Field Requirements**:
  - All datetime fields: ISO 8601 format (YYYY-MM-DDTHH:mm:ssZ)
  - Pagination: Consistent limit/offset or cursor-based; default page size documented
  - Filtering: Operators MUST be explicit (eq, gt, lt, in); documented on each endpoint
  - Sorting: Field names match response field names; prefix with - for descending

- **Request Validation**:
  - Input schema validation on every endpoint (JSON Schema or equivalent)
  - Type checking: Reject non-matching types immediately with descriptive error
  - Rate limiting: Implement backoff guidance; communicate via headers (Retry-After)

- **Documentation**:
  - Auto-generated OpenAPI docs (Swagger UI) required
  - Example requests and responses for every endpoint
  - Success codes and possible error codes documented
  - Authentication/authorization requirements explicit

- **Backwards Compatibility**:
  - New fields MUST be optional in old API versions
  - Field removal only in major version
  - Deprecation notices in headers 3 versions before removal

- **Rationale**: Predictable APIs reduce client integration effort, decrease support burden, and prevent breaking changes downstream.

### V. Performance & Scalability

All backend services MUST meet performance targets and scale horizontally:

- **Response Time Targets** (non-negotiable):
  - **p50 ≤ 100ms** for simple queries (no joins, cached)
  - **p95 ≤ 200ms** for typical queries (1-2 joins)
  - **p99 ≤ 500ms** for complex queries; anything exceeding requires caching/indexing strategy
  - Measured from request arrival to first byte sent

- **Throughput & Concurrency**:
  - ≥500 concurrent connections supported per service instance
  - ≥100 requests/second minimum baseline per endpoint
  - Connection pooling configured; idle connections recycled

- **Database Performance**:
  - All queries ≤100ms execution time; index strategy required for new queries
  - Query plans reviewed before merge; full table scans prohibited in production queries
  - Connection pool size: min 10, max 50 (configurable per load)
  - N+1 query detection: automated via integration tests

- **Memory & Resource Management**:
  - Memory baseline: ≤200MB per service instance (measured at startup)
  - Memory leak detection: continuous monitoring in production; alert if > 10% growth over 1 hour
  - CPU utilization target: ≤60% under normal load; ≤85% under peak
  - Implement graceful degradation if approaching limits (circuit breaker pattern)

- **Caching Strategy**:
  - Cache layers defined: Redis (session/fast access), CDN (static), database query cache
  - Cache invalidation strategy explicit and documented
  - Cache hits measured and reported; target ≥70% for frequently accessed data

- **Observability & Monitoring**:
  - Structured logging: all requests logged with request ID, duration, status
  - Metrics collection: Request count, latency percentiles, error rates (by endpoint)
  - Distributed tracing: Request path across service boundaries visible
  - SLA monitoring: Automated alerts if p95 > 200ms or p99 > 500ms

- **Load Testing**:
  - Services tested with 2x expected peak load before release
  - Failure modes documented (graceful degradation vs. hard failure)
  - Capacity planning: review quarterly with 30% headroom minimum

- **Rationale**: Performance targets ensure user satisfaction, enable cost-effective scaling, and prevent cascading failures in distributed systems.

## Backend Architecture Standards

### Service Boundaries & Decomposition

- **Single Responsibility**: Each service owns one business domain; clear API boundaries
- **API-First Design**: Services assume only HTTP/REST contracts between each other (no shared databases)
- **Data Ownership**: Each service owns its data; cross-service queries via API only
- **Deployment Independence**: Each service deployable without coordinating other services

### Configuration Management

- **Environment Variables**: All configuration externalized; no hardcoding of URLs, credentials, or feature flags
- **Configuration Hierarchy**: Environment > Config file > Defaults
- **Feature Flags**: Runtime toggles for gradual rollouts, A/B testing, killed feature deactivation
- **Secrets Management**: Use dedicated secret manager (e.g., HashiCorp Vault, AWS Secrets Manager); never commit secrets

### Resilience & Fault Tolerance

- **Timeouts**: All external calls have timeouts; default 30s, adjustable per client library
- **Retries**: Exponential backoff with jitter; max 3 attempts for transient failures
- **Circuit Breakers**: External service failures fail-fast; circuit opens after 5 consecutive failures
- **Bulkheads**: Thread pools isolated per external dependency; prevent cascading thread exhaustion
- **Graceful Degradation**: Services continue operating in degraded mode if non-critical dependencies fail (cache stale data if DB unavailable)

## API Design & Contract Standards

### RESTful Conventions

- **HTTP Methods**: GET (idempotent read), POST (create), PUT (full update), PATCH (partial), DELETE (remove)
- **Status Codes**:
  - 200 OK: Successful GET/PUT/PATCH
  - 201 Created: Successful POST
  - 204 No Content: Successful DELETE
  - 400 Bad Request: Invalid input
  - 401 Unauthorized: Authentication required
  - 403 Forbidden: Authorization failed
  - 404 Not Found: Resource missing
  - 409 Conflict: State conflict (e.g., duplicate resource)
  - 500 Internal Server Error: Server error (never 500 for known client issues)
  - 503 Service Unavailable: Temporary outage; include Retry-After header

- **URL Design**:
  - Resource-oriented: `/api/v1/patients`, `/api/v1/patients/{id}`, `/api/v1/patients/{id}/appointments`
  - Actions as sub-resources: `POST /api/v1/appointments/{id}/confirm` (not a separate verb)
  - Consistent pagination: `?limit=20&offset=0` or `?cursor=<token>&limit=20`

### Data Contracts

- **Request Validation Schema**: Every endpoint MUST have OpenAPI schema; validated on arrival
- **Response Schema**: Consistent structure; documented field types and constraints
- **Enum-like Fields**: Use string enums with documented values; never numeric enums (fragile across versions)
- **Timestamps**: ISO 8601 format; timezone always UTC; field naming: `createdAt`, `updatedAt`

## Governance & Compliance

### Code Review Requirements

- **Minimum Reviewers**: ≥2 engineers (≥1 from outside feature team) for all code
- **Review Checklist**: Architecture adherence, test coverage, performance benchmarks, security fixes
- **Approval Process**: Both reviewers must explicitly approve; changes after approval reset timer
- **SLA**: Code review within 24 hours; merge within 48 hours of approval

### Deployment & Release

- **Pre-Deployment**: All tests passing; performance benchmarks met; security scan clean
- **Staged Rollout**: Canary (5% traffic) → Gradual (25% → 50% → 100%) over 30 minutes minimum
- **Rollback Plan**: Documented and tested; backwards-compatible API required for zero-downtime deploy
- **Post-Deployment**: Monitor error rate, p95 latency, resource usage for 1 hour; escalate immediately if regression detected

### Compliance & Audit

- **Dependency Management**: Security scanning automated; known vulnerabilities blocked; quarterly updates required
- **Data Access Auditing**: Sensitive data queries logged; access patterns reviewed monthly
- **Breaking Changes**: Deprecated 2 versions before removal; communication sent 30 days in advance
- **Constitution Amendments**: Requires documented rationale + team consensus; versioned with semantic versioning

### Performance Governance

- **Quarterly Review**: Performance metrics reviewed; capacity planning updated; SLAs adjusted if needed
- **Critical Alerts**: p95 latency > 200ms or p99 > 500ms triggers immediate incident investigation
- **Load Testing**: Every major release tested at 2x expected peak load before production

---

**Version**: 1.0.0 | **Created**: 2026-04-09 | **Last Amended**: 2026-04-09

**Applicability**: All backend services, APIs, and microservices under the AI SDLC Patient Portal initiative.
