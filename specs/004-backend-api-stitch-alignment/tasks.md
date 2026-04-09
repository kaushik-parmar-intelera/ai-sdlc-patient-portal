# Tasks: Backend API Stitch Alignment

**Prerequisites**: spec.md (required), data-model.md, contracts/api-contracts.md

## Phase 1: Setup

- [ ] T001 Create backend solution structure in `AI-SDLC-Patient-Backend/PatientPortal.sln`, `AI-SDLC-Patient-Backend/PatientPortal.Api/`, `AI-SDLC-Patient-Backend/PatientPortal.Application/`, `AI-SDLC-Patient-Backend/PatientPortal.Domain/`, and `AI-SDLC-Patient-Backend/PatientPortal.Infrastructure/`
- [ ] T002 Initialize .NET 8 project files in `AI-SDLC-Patient-Backend/PatientPortal.Api/PatientPortal.Api.csproj`, `AI-SDLC-Patient-Backend/PatientPortal.Application/PatientPortal.Application.csproj`, `AI-SDLC-Patient-Backend/PatientPortal.Domain/PatientPortal.Domain.csproj`, and `AI-SDLC-Patient-Backend/PatientPortal.Infrastructure/PatientPortal.Infrastructure.csproj`
- [ ] T003 Configure backend test projects in `AI-SDLC-Patient-Backend/PatientPortal.Api.Tests/PatientPortal.Api.Tests.csproj`, `AI-SDLC-Patient-Backend/PatientPortal.Application.Tests/PatientPortal.Application.Tests.csproj`, and `AI-SDLC-Patient-Backend/PatientPortal.Infrastructure.Tests/PatientPortal.Infrastructure.Tests.csproj`
- [ ] T004 Add shared environment configuration templates in `AI-SDLC-Patient-Backend/PatientPortal.Api/appsettings.Development.json`, `AI-SDLC-Patient-Backend/PatientPortal.Api/appsettings.Production.json`, and `AI-SDLC-Patient-Backend/PatientPortal.Api/.env.example`
- [ ] T005 [P] Create backend documentation placeholders in `specs/004-backend-api-stitch-alignment/spec.md`, `specs/004-backend-api-stitch-alignment/contracts/api-contracts.md`, and `specs/004-backend-api-stitch-alignment/data-model.md`

---

## Phase 2: Foundational

- [ ] T006 Setup Entity Framework Core SQL Server provider and migrations in `AI-SDLC-Patient-Backend/PatientPortal.Infrastructure/`
- [ ] T007 Implement base `AuditableEntity` in `AI-SDLC-Patient-Backend/PatientPortal.Domain/Entities/AuditableEntity.cs`
- [ ] T008 Implement `User` entity with audit fields in `AI-SDLC-Patient-Backend/PatientPortal.Domain/Entities/User.cs`
- [ ] T009 Configure `PatientPortalDbContext` and repository registration in `AI-SDLC-Patient-Backend/PatientPortal.Infrastructure/PatientPortalDbContext.cs`
- [ ] T010 Add global exception handling middleware and standard error envelope support in `AI-SDLC-Patient-Backend/PatientPortal.Api/Middleware/ExceptionHandlingMiddleware.cs`
- [ ] T011 Add JWT authentication and `AuthSettings` configuration in `AI-SDLC-Patient-Backend/PatientPortal.Api/Configuration/AuthSettings.cs`
- [ ] T012 [P] Create backend contract test directory in `AI-SDLC-Patient-Backend/tests/contracts/`

---

## Phase 3: User Story 1 - Patient Onboarding Registration API (Priority: P1)

**Goal**: Implement the Stitch registration endpoint and mapping for the UI payload.

**Independent Test**: Verify `POST /api/v1/auth/register` accepts `fullName`, returns `201 Created`, and creates a persisted `User` with first/last name mapping.

### Tests for User Story 1

- [ ] T013 [P] [US1] Add contract test for `POST /api/v1/auth/register` in `AI-SDLC-Patient-Backend/tests/contracts/RegisterContractTests.cs`
- [ ] T014 [P] [US1] Add integration test for registration happy path in `AI-SDLC-Patient-Backend/tests/integration/RegisterIntegrationTests.cs`

### Implementation for User Story 1

- [ ] T015 [US1] Implement `RegistrationRequest` and `RegisterSuccessResponse` DTOs in `AI-SDLC-Patient-Backend/PatientPortal.Api/Models/Auth/`
- [ ] T016 [US1] Implement `AuthController` registration action in `AI-SDLC-Patient-Backend/PatientPortal.Api/Controllers/AuthController.cs`
- [ ] T017 [US1] Implement `IAuthService` and registration flow in `AI-SDLC-Patient-Backend/PatientPortal.Application/Services/AuthService.cs`
- [ ] T018 [US1] Implement `IUserRepository` and `UserRepository` in `AI-SDLC-Patient-Backend/PatientPortal.Infrastructure/Repositories/UserRepository.cs`
- [ ] T019 [US1] Implement `fullName` parsing and mapping logic in `AI-SDLC-Patient-Backend/PatientPortal.Application/Mappers/FullNameMapper.cs`
- [ ] T020 [US1] Add duplicate email detection and field-level error response handling in `AI-SDLC-Patient-Backend/PatientPortal.Api/Controllers/AuthController.cs`
- [ ] T021 [US1] Ensure registration response matches Stitch UI contract in `specs/004-backend-api-stitch-alignment/contracts/api-contracts.md`

---

## Phase 4: User Story 2 - Auth Flow Integration (Priority: P1)

**Goal**: Implement login and refresh token endpoints required by the Stitch auth flow.

**Independent Test**: Verify valid login returns access/refresh tokens and valid refresh returns new tokens.

### Tests for User Story 2

- [ ] T022 [P] [US2] Add contract test for `POST /api/v1/auth/login` and `POST /api/v1/auth/refresh` in `AI-SDLC-Patient-Backend/tests/contracts/AuthContractTests.cs`
- [ ] T023 [P] [US2] Add integration tests for login, token validation, and refresh flow in `AI-SDLC-Patient-Backend/tests/integration/AuthIntegrationTests.cs`

### Implementation for User Story 2

- [ ] T024 [US2] Implement `LoginRequest`, `AuthResponse`, and `UserDto` models in `AI-SDLC-Patient-Backend/PatientPortal.Api/Models/Auth/`
- [ ] T025 [US2] Implement JWT token generation and refresh logic in `AI-SDLC-Patient-Backend/PatientPortal.Application/Services/AuthService.cs`
- [ ] T026 [US2] Implement login and refresh endpoints in `AI-SDLC-Patient-Backend/PatientPortal.Api/Controllers/AuthController.cs`
- [ ] T027 [US2] Implement protected profile endpoint in `AI-SDLC-Patient-Backend/PatientPortal.Api/Controllers/UserController.cs`
- [ ] T028 [US2] Add integration test for protected endpoint access with valid and invalid tokens in `AI-SDLC-Patient-Backend/tests/integration/AuthIntegrationTests.cs`

---

## Phase 5: User Story 3 - Field-Level Error Feedback (Priority: P2)

**Goal**: Return consistent Stitch-friendly field validation errors for registration.

**Independent Test**: Verify invalid registration inputs return `INVALID_INPUT` or `EMAIL_EXISTS` with `field` details.

### Tests for User Story 3

- [ ] T029 [P] [US3] Add contract test for field-level validation errors in `AI-SDLC-Patient-Backend/tests/contracts/ValidationContractTests.cs`
- [ ] T030 [P] [US3] Add integration tests for duplicate email, invalid email, weak password, and missing fullName in `AI-SDLC-Patient-Backend/tests/integration/ValidationIntegrationTests.cs`

### Implementation for User Story 3

- [ ] T031 [US3] Implement standard validation error response model in `AI-SDLC-Patient-Backend/PatientPortal.Api/Models/Error/ValidationErrorResponse.cs`
- [ ] T032 [US3] Implement request validation for registration in `AI-SDLC-Patient-Backend/PatientPortal.Api/Validators/AuthRequestValidator.cs`
- [ ] T033 [US3] Map validation failures to the standard error envelope in `AI-SDLC-Patient-Backend/PatientPortal.Api/Middleware/ValidationMiddleware.cs`
- [ ] T034 [US3] Ensure `EMAIL_EXISTS` and `INVALID_INPUT` codes conform to `specs/004-backend-api-stitch-alignment/contracts/api-contracts.md`

---

## Phase 6: Polish & Quality Assurance

- [ ] T035 [P] Run full backend test suite and verify all tests pass in `AI-SDLC-Patient-Backend/tests/`
- [ ] T036 [P] Verify code coverage for backend business logic and add tests until thresholds are met
- [ ] T037 [P] Validate API contract implementation against `specs/004-backend-api-stitch-alignment/contracts/api-contracts.md`
- [ ] T038 [P] Update `specs/004-backend-api-stitch-alignment/checklists/requirements.md` with final completion notes
- [ ] T039 [P] Review and polish error messages and response shapes for UX consistency
- [ ] T040 [P] Document feature implementation notes and integration guidance in `specs/004-backend-api-stitch-alignment/spec.md`
