# ai-sdlc-patient-portal Development Guidelines

Auto-generated from all feature plans. Last updated: 2026-04-09

## Active Technologies

- TypeScript 5.x with Next.js 14+ compatibility + Next.js 14+, React 18+, Zustand, React Query, Tailwind CSS, ESLint, Prettier, Storybook (001-website-project-setup)
- C# .NET 8.0 + Entity Framework Core, ASP.NET Core 8, JWT, xUnit, Docker, SQL Server (003-backend-setup)

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
frontend/
tests/
```

## Commands

**Frontend**: npm test && npm run lint

**Backend**: dotnet test && dotnet build

**All projects**: See specs/[feature]/quickstart.md

## Code Style

- Frontend: Standard TypeScript conventions with ESLint + Prettier
- Backend: C# clean architecture (4-layer separation); async/await patterns; StyleCop analyzers

## Recent Changes

- 001-website-project-setup: Added TypeScript + Next.js 14
- 003-backend-setup: Added .NET 8 with clean architecture, EF Core, JWT auth, SQL Server, Docker

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
