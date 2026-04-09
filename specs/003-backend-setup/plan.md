# Implementation Plan: Backend Setup

**Branch**: `003-backend-setup` | **Date**: 2026-04-09 | **Spec**: [003-backend-setup/spec.md](spec.md)
**Input**: Feature specification from `/specs/003-backend-setup/spec.md`

## Summary

Establish a production-grade .NET 8 backend using clean architecture (4-layer separation: Controllers, Services, Repository, Entities). The backend must support JWT-based authentication, Entity Framework Core code-first database setup with audit fields, CRUD API endpoints, and comprehensive testing coverage (85% business logic, 75% utilities). Docker containerization ensures consistent deployment across development, staging, and production environments. This foundation enables all future healthcare platform features while maintaining strict adherence to code quality, TDD, and performance SLAs (p95 ≤200ms, p99 ≤500ms).

## Technical Context

**Language/Version**: C# .NET 8.0  
**Primary Dependencies**: 
  - Entity Framework Core 8.0
  - FastEndpoints (or MediatR for API orchestration)
  - System.IdentityModel.Tokens.Jwt (JWT authentication)
  - AutoMapper (DTO mapping)
  - xUnit (unit testing framework)
  - MoQ (dependency mocking)
  - FluentAssertions (test assertions)
  - FluentValidation (request validation)

**Storage**: SQL Server (Docker container for dev, managed instance for production)  
**Testing**: 
  - Unit: xUnit + MoQ + FluentAssertions
  - Integration: Microsoft.AspNetCore.Mvc.Testing
  - Performance: Apache JMeter or k6 for load testing

**Target Platform**: Linux server (Docker) + Windows development  
**Project Type**: ASP.NET Core 8 REST API microservice  
**Performance Goals**: 
  - p95 ≤ 200ms response time
  - p99 ≤ 500ms response time
  - ≥500 concurrent connections
  - ≥100 requests/second baseline per endpoint

**Constraints**: 
  - Memory baseline ≤200MB per service instance at startup
  - Query execution time ≤100ms
  - Deployment must support zero-downtime with backwards-compatible versioning
  - Healthcare data handling must follow HIPAA security guidelines

**Scale/Scope**: 
  - Initial: 50-100 concurrent users
  - Growth: 1000+ concurrent users
  - Core entities: User, Appointment, Provider, MedicalRecord, Payment
  - ~120 functional requirements across architecture, auth, database, APIs, infrastructure, testing

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Based on `.specify/memory/constitution.md` (Backend Constitution also available), verify:

- [x] **Code Quality (Principle I)**: .NET 8 project identified for backend excellence
  - Linting tool: StyleCop Analyzers (built into Visual Studio) + SonarAnalyzer
  - Code coverage target: 85% business logic, 75% utilities (aligned with Backend Constitution)
  - Complexity: Cyclomatic complexity ≤5 enforced
  - Duplication: ≤3% code duplication across solution
  
- [x] **Test-Driven (Principle II)**: .NET testing stack pre-selected
  - Testing tools: xUnit + MoQ + FluentAssertions (established and verified)
  - Unit test strategy: Red-Green-Refactor mandatory for all public APIs and business logic
  - Integration test scope: All REST endpoints, database operations, authentication flows
  - Performance tests: Load testing for endpoint SLA validation
  - Backend Constitution requirement: 85% unit coverage + integration + contract testing

- [x] **UX Consistency (Principle III)**: N/A for backend API service
  - API response format: Standardized JSON envelope (success + data + meta)
  - Error response format: Standardized error envelope (error code + message + details)
  - HTTP status codes: Consistent across all endpoints (200, 201, 400, 401, 403, 404, 500)
  - Backend Constitution: Explicit API User Experience & Contracts principle

- [x] **Performance (Principle IV)**: SLA targets documented and measurable
  - Response time targets: p95 ≤200ms, p99 ≤500ms (from Backend Constitution)
  - Throughput: ≥500 concurrent connections; ≥100 RPS baseline
  - Database: ≤100ms query execution time (Backend Constitution)
  - Memory: ≤200MB baseline; ≤60% CPU at max load (Backend Constitution)
  - Performance testing tool: Apache JMeter or k6; continuous load testing in CI/CD

**Gate Status**: ☑ PASS (all gates validated and aligned with Backend Constitution)

## Project Structure

### Documentation (this feature)

```text
specs/003-backend-setup/
├── spec.md                      # User scenarios + acceptance criteria
├── plan.md                      # This file (Phase 0-1 design output)
├── research.md                  # Phase 0: Research findings (resolve unknowns)
├── data-model.md                # Phase 1: Entity definitions + relationships
├── quickstart.md                # Phase 1: Development setup guide
├── contracts/
│   ├── api-contracts.md         # OpenAPI 3.0 spec + endpoint documentation
│   └── auth-contract.md         # JWT token format + auth flow
└── checklists/
    └── requirements.md          # Spec quality validation
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── PatientPortal.Api/                  # ASP.NET Core Web API project
│   │   ├── Program.cs                      # Startup configuration, DI setup
│   │   ├── appsettings.json                # Development config
│   │   ├── appsettings.Development.json    # Dev environment
│   │   ├── appsettings.Production.json     # Prod environment
│   │   ├── Controllers/
│   │   │   ├── AuthController.cs           # JWT token generation
│   │   │   ├── UsersController.cs          # User CRUD endpoints
│   │   │   ├── AppointmentsController.cs   # Appointment CRUD endpoints
│   │   │   └── ProvidersController.cs      # Provider CRUD endpoints
│   │   ├── Middleware/
│   │   │   ├── ErrorHandlingMiddleware.cs  # Global exception handling
│   │   │   └── ValidationMiddleware.cs     # Request validation
│   │   ├── Filters/
│   │   │   └── AuthorizeFilter.cs          # JWT authorization filter
│   │   └── Dockerfile                      # Container configuration
│   │
│   ├── PatientPortal.Application/          # Business logic (use cases, services)
│   │   ├── Services/
│   │   │   ├── AuthService.cs              # JWT token logic
│   │   │   ├── UserService.cs              # User business logic
│   │   │   ├── AppointmentService.cs       # Appointment logic
│   │   │   └── ProviderService.cs          # Provider logic
│   │   ├── DTOs/
│   │   │   ├── UserDto.cs
│   │   │   ├── AppointmentDto.cs
│   │   │   ├── AuthRequestDto.cs
│   │   │   └── AuthResponseDto.cs
│   │   ├── Mappers/
│   │   │   └── MappingProfile.cs           # AutoMapper profiles
│   │   └── Validations/
│   │       ├── UserValidator.cs            # FluentValidation rules
│   │       └── AppointmentValidator.cs
│   │
│   ├── PatientPortal.Domain/               # Business entities & rules (no dependencies)
│   │   ├── Entities/
│   │   │   ├── Base/
│   │   │   │   └── AuditableEntity.cs      # CreatedOn, CreatedBy, ModifiedOn, ModifiedBy
│   │   │   ├── User.cs
│   │   │   ├── Appointment.cs
│   │   │   ├── Provider.cs
│   │   │   └── MedicalRecord.cs
│   │   ├── ValueObjects/
│   │   │   └── PersonName.cs
│   │   └── Enums/
│   │       ├── AppointmentStatus.cs
│   │       └── UserRole.cs
│   │
│   ├── PatientPortal.Infrastructure/       # Data access, external services
│   │   ├── Persistence/
│   │   │   ├── ApplicationDbContext.cs     # EF Core DbContext
│   │   │   ├── Migrations/
│   │   │   │   ├── 001_InitialCreate.cs    # Auto-generated migrations
│   │   │   │   └── 002_AddAuditFields.cs
│   │   │   ├── SeedData.cs                 # Dummy data seeding
│   │   │   └── UnitOfWork.cs               # Transaction management
│   │   ├── Repositories/
│   │   │   ├── IRepository.cs              # Generic repository interface
│   │   │   ├── Repository.cs               # Generic repository implementation
│   │   │   ├── IUserRepository.cs
│   │   │   ├── UserRepository.cs
│   │   │   └── [Entity]Repository.cs patterns
│   │   └── Authentication/
│   │       ├── JwtTokenProvider.cs         # Token generation/validation
│   │       └── JwtSettings.cs              # JWT configuration
│   │
│   └── PatientPortal.sln                   # Solution file
│
├── tests/
│   ├── PatientPortal.Api.Tests/            # API controller tests (integration)
│   │   ├── Controllers/
│   │   │   ├── AuthControllerTests.cs
│   │   │   ├── UsersControllerTests.cs
│   │   │   └── [Controller]Tests.cs
│   │   ├── Fixtures/
│   │   │   └── WebApplicationFactory.cs    # Test server setup
│   │   └── appsettings.Testing.json
│   │
│   ├── PatientPortal.Application.Tests/    # Service layer unit tests
│   │   ├── Services/
│   │   │   ├── AuthServiceTests.cs
│   │   │   ├── UserServiceTests.cs
│   │   │   └── [Service]Tests.cs
│   │   └── Fixtures/
│   │       └── MockRepositories.cs
│   │
│   ├── PatientPortal.Infrastructure.Tests/ # Repository unit tests
│   │   ├── Repositories/
│   │   │   ├── UserRepositoryTests.cs
│   │   │   └── [Repository]Tests.cs
│   │   └── Fixtures/
│   │       └── TestDbContext.cs            # In-memory test database
│   │
│   └── PatientPortal.Integration.Tests/    # End-to-end API + DB tests
│       ├── AuthenticationFlowTests.cs      # Full login flow
│       ├── UserCrudTests.cs                # CRUD operations with DB
│       └── DatabaseMigrationTests.cs       # Migration validation

docker-compose.yml                          # Local dev: API + SQL Server
docker-compose.prod.yml                     # Prod deployment
```

**Structure Decision**: 
Implemented standard ASP.NET Core clean architecture with 4 distinct layers:
- **API Layer** (Controllers): HTTP routing, request/response handling, authorization filter
- **Application Layer** (Services): Business logic orchestration, DTO mapping, validation
- **Domain Layer** (Entities): Pure business rules, no external dependencies
- **Infrastructure Layer** (Repositories, EF Context, Auth providers): Data access, external integrations

This structure ensures:
- Clear dependency direction (UI → App → Domain; never Domain → App/UI)
- Easy testability (domain logic testable without mocks; services with DI; controllers via integration tests)
- Technology agnostic domain logic (Entity Framework is isolated in Infrastructure)
- Separation of concerns (each layer has a single responsibility)

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|-----------|-------------------------------------|
| 4 distinct projects + shared abstractions | Clear boundary enforcement across layers | Single monolithic project couples layers, making testing and refactoring difficult and violating Backend Constitution clean architecture requirement |
| Repository pattern abstraction | Enables swapping database implementations, testing with in-memory repos, deferred data source decisions | Direct DbContext usage couples business logic to Entity Framework, violates dependency inversion, complicates testing |
| Async/await throughout | Healthcare APIs must handle 500+ concurrent users; blocking calls create thread pool starvation | Synchronous code cannot scale to required throughput; async is mandatory per Backend Constitution |
| 3 test projects (unit, integration, E2E) | Backend Constitution requires: unit (85%), integration (APIs + DB), contract (response formats) | Two test projects insufficient to validate all three test tiers; integration tests require separate database context |

## Phase 0: Research & Clarification

**Objective**: Resolve all technical unknowns and document best practices for .NET 8 clean architecture backend.

### Research Tasks

1. **JWT Best Practices in .NET 8**
   - How to generate and validate JWT tokens securely
   - Token expiration and refresh token strategy
   - Integration with ASP.NET Core authorization middleware
   
2. **Entity Framework Core Code-First Migrations**
   - Automated migration execution on application startup
   - Audit field patterns (CreatedOn, CreatedBy, ModifiedBy, ModifiedOn)
   - Seeding strategy for dev/test data
   
3. **ASP.NET Core Dependency Injection**
   - Service registration patterns (Transient, Scoped, Singleton)
   - Middleware ordering and configuration
   - Factory patterns for repository creation
   
4. **Global Exception Handling in ASP.NET Core**
   - Middleware-based error handling
   - Custom exception types and HTTP status code mapping
   - Structured error response format (error code, message, details)
   
5. **Performance Optimization for .NET APIs**
   - Connection pooling configuration for SQL Server
   - Query optimization with Entity Framework
   - Caching strategies (response caching, distributed caching)
   - Async patterns to prevent thread pool exhaustion
   
6. **Docker Containerization for .NET**
   - Multi-stage Dockerfile for optimized images
   - Environment variable configuration in Docker Compose
   - SQL Server container setup with persistent storage
   - Health checks and graceful shutdown
   
7. **Testing in .NET (xUnit + MoQ + FluentAssertions)**
   - Unit test structure and naming conventions
   - Mocking repository and service dependencies
   - Integration test setup with WebApplicationFactory
   - In-memory database for integration tests
   
8. **API Documentation**
   - Swagger/OpenAPI integration with Swashbuckle
   - XML documentation comments for API endpoints
   - Contract examples and error scenarios

### Research Deliverable

Output: `research.md` with:
- Decision: [chosen approach]
- Rationale: [why chosen]
- Alternatives considered: [what else evaluated]
- Implementation notes: [practical guidelines]

---

## Phase 1: Design & Contracts

### 1.1 Entity & Data Model Design

**Deliverable**: `data-model.md`

Define core entities with relationships, validation rules, and audit patterns:

1. **User Entity**
   - id (GUID, PK)
   - email (string, unique, indexed)
   - passwordHash (string)
   - firstName, lastName (strings)
   - role (enum: Admin, Patient, Provider)
   - isActive (bool)
   - createdOn, createdBy, modifiedOn, modifiedBy (audit fields)
   
   Validations:
   - Email must be valid format
   - Password must be >= 12 characters (hashed)
   - FirstName/LastName required, max 100 chars
   - Role must be one of enum values

2. **Appointment Entity**
   - id (GUID, PK)
   - userId (GUID, FK → User)
   - providerId (GUID, FK → Provider)
   - appointmentDate (DateTime)
   - duration (int, minutes)
   - status (enum: Scheduled, Completed, Cancelled, NoShow)
   - notes (string, optional)
   - createdOn, createdBy, modifiedOn, modifiedBy (audit fields)
   
   Validations:
   - appointmentDate must be future datetime
   - duration must be > 0
   - userId and providerId must exist
   - Cannot update past appointments

3. **Provider Entity**
   - id (GUID, PK)
   - name (string)
   - specialization (string)
   - licenseNumber (string)
   - availableHours (JSON array or separate table)
   - rating (decimal, 0-5)
   - createdOn, createdBy, modifiedOn, modifiedBy (audit fields)
   
   Validations:
   - Name required, max 200 chars
   - Specialization required
   - licenseNumber must be unique

4. **MedicalRecord Entity**
   - id (GUID, PK)
   - userId (GUID, FK → User)
   - recordDate (DateTime)
   - diagnosis (string)
   - treatment (string)
   - notes (string, optional)
   - attachmentUrl (string, optional)
   - createdOn, createdBy, modifiedOn, modifiedBy (audit fields)
   
   Validations:
   - userId must exist
   - diagnosis and treatment required

5. **Payment Entity**
   - id (GUID, PK)
   - appointmentId (GUID, FK → Appointment)
   - amount (decimal)
   - status (enum: Pending, Completed, Failed, Refunded)
   - transactionId (string, external reference)
   - paymentDate (DateTime, nullable)
   - createdOn, createdBy, modifiedOn, modifiedBy (audit fields)
   
   Validations:
   - appointmentId must exist
   - amount must be >= 0.01
   - transactionId must be unique when status = Completed

### 1.2 API Contracts

**Deliverable**: `contracts/api-contracts.md` + `contracts/auth-contract.md`

#### 1.2.1 Authentication Contract

**Endpoint**: `POST /api/v1/auth/login`

**Request**:
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGc...",
    "refreshToken": "refresh...",
    "expiresIn": 3600,
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "Patient"
    }
  },
  "meta": {
    "timestamp": "2026-04-09T12:00:00Z",
    "version": "1.0"
  }
}
```

**Error Response (400/401)**:
```json
{
  "success": false,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Email or password is incorrect",
    "details": []
  },
  "meta": {
    "timestamp": "2026-04-09T12:00:00Z",
    "version": "1.0"
  }
}
```

**JWT Token Format**:
- Header: `{ "alg": "HS256", "typ": "JWT" }`
- Payload: `{ "sub": "uuid", "email": "user@example.com", "role": "Patient", "iat": 1234567890, "exp": 1234571490 }`
- Audience/Issuer: Configurable per environment
- Expiration: 1 hour (3600 seconds)

#### 1.2.2 User CRUD Endpoints

**Endpoint**: `GET /api/v1/users`
- Query params: `limit=20&offset=0` (pagination)
- Headers: `Authorization: Bearer {token}`
- Response: Array of User objects

**Endpoint**: `POST /api/v1/users`
- Request body: User creation data (email, password, firstName, lastName, role)
- Response (201 Created): Created user object with id

**Endpoint**: `GET /api/v1/users/{id}`
- Response: Single user object

**Endpoint**: `PUT /api/v1/users/{id}`
- Request body: Updated user fields
- Response (200 OK): Updated user object

**Endpoint**: `DELETE /api/v1/users/{id}`
- Response (204 No Content)

#### 1.2.3 Standard Response Format

All endpoints return this envelope:
```json
{
  "success": true|false,
  "data": { ... },
  "error": { ... },
  "meta": {
    "timestamp": "ISO-8601",
    "version": "1.0"
  }
}
```

**HTTP Status Codes**:
- 200 OK: Successful GET/PUT/PATCH
- 201 Created: Successful POST
- 204 No Content: Successful DELETE
- 400 Bad Request: Invalid input (validation errors in details)
- 401 Unauthorized: Missing/invalid JWT token
- 403 Forbidden: Insufficient permissions
- 404 Not Found: Resource not found
- 500 Internal Server Error: Server error

### 1.3 Quick Start Guide

**Deliverable**: `quickstart.md`

Covers:
1. Prerequisites (.NET 8 SDK, SQL Server, Docker)
2. Project setup (clone, restore packages, database setup)
3. Running the application (dotnet run, Docker Compose)
4. Running tests (dotnet test)
5. API documentation (Swagger UI at /swagger)
6. Development workflow

### 1.4 Agent Context Update

Run `.specify/scripts/bash/update-agent-context.sh copilot` to update:
- [Agent context files](https://github.com/path) with new technology stack
- Preserve manual additions between markers
- Add only new technologies from this plan: .NET 8, Entity Framework Core, JWT, xUnit, Docker

---

## Implementation Phases

### Phase 1-1: Foundation Setup
- Create Visual Studio solution with 4 projects
- Set up dependency injection container
- Configure middleware pipeline (auth, error handling, validation)
- Configure Entity Framework DbContext and connection strings

### Phase 1-2: Authentication
- Implement JWT token generation and validation
- Create AuthController with login endpoint
- Add authorization filter to protect endpoints
- Configure token refresh mechanism

### Phase 1-3: Database & Entities
- Complete Entity Framework setup with Code-First migrations
- Create all core entities with audit fields
- Implement automatic migration execution
- Set up database seeding with dummy data

### Phase 1-4: API Endpoints
- Implement CRUD endpoints for all entities (User, Appointment, Provider, MedicalRecord, Payment)
- Implement repository pattern and generic repository
- Add AutoMapper for DTO conversions
- Implement FluentValidation for request validation

### Phase 1-5: Infrastructure & Docker
- Create Dockerfile for .NET application
- Set up Docker Compose for local development (API + SQL Server)
- Configure environment-specific settings (appsettings.json)
- Set up containerized CI/CD pipeline

### Phase 1-6: Testing
- Implement unit tests for services and repositories (85% coverage)
- Implement integration tests for API endpoints
- Implement authentication flow tests
- Set up continuous performance testing (load testing)

---

## Gate: Pre-Implementation Review

**Constitution Re-Check (Post-Design)**:

- [x] **Code Quality**: .NET linting tools configured; 85% coverage target set; complexity limits enforced
- [x] **TDD**: Testing framework stack finalized; test structure designed; first tests will be written before implementation
- [x] **API Contracts**: All endpoints documented with request/response formats; error handling standardized
- [x] **Performance**: p95/p99 targets documented; connection pooling strategy included; load testing approach defined

**Status**: ✅ **GATE PASS** - All design artifacts complete; ready for implementation

---

**Version**: 1.0.0 | **Created**: 2026-04-09 | **Last Updated**: 2026-04-09
