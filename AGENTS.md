# ai-sdlc-patient-portal Development Guidelines

Auto-generated from all feature plans. Last updated: 2026-04-09

## Active Technologies

- TypeScript 5.x with Next.js 14+ compatibility + Next.js 14+, React 18+, Zustand, React Query, Tailwind CSS, ESLint, Prettier, Storybook (001-website-project-setup)
- C# .NET 8.0 + Entity Framework Core 8.0, ASP.NET Core 8, JWT Authentication, xUnit, MoQ, FluentAssertions, Docker, SQL Server (003-backend-setup)

## Project Structure

```text
backend/
  src/
    PatientPortal.Api/
    PatientPortal.Application/
    PatientPortal.Domain/
    PatientPortal.Infrastructure/
  tests/
    PatientPortal.Api.Tests/
    PatientPortal.Application.Tests/
    PatientPortal.Infrastructure.Tests/
    PatientPortal.Integration.Tests/
  docker-compose.yml
  Dockerfile
frontend/
tests/
```

## Commands

**Frontend**: `npm test && npm run lint`

**Backend**: `dotnet test && dotnet build`

**All**: See individual project quickstart guides

## Code Style

- **Frontend** (TypeScript 5.x): Follow Next.js conventions; strict type checking; ESLint + Prettier
- **Backend** (.NET 8): Clean architecture (4-layer separation); async/await throughout; StyleCop analyzers; 85% business logic code coverage minimum

## Recent Changes

- 001-website-project-setup: Added TypeScript 5.x frontend stack + Next.js 14+, React 18+, Zustand, React Query, Tailwind CSS, ESLint, Prettier, Storybook
- 003-backend-setup: Added .NET 8.0 backend with C# clean architecture, Entity Framework Core code-first, JWT authentication, SQL Server, Docker containerization, xUnit testing, comprehensive API contracts

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
