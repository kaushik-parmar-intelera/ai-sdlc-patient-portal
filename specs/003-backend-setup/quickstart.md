# Quick Start Guide: Backend Setup

**Feature**: Backend Setup (003-backend-setup)  
**Created**: 2026-04-09  
**Purpose**: Developer setup and project initialization guide

---

## Prerequisites

### Required Software

1. **`.NET 8 SDK`** (v8.0.0 or later)
   - Download: https://dotnet.microsoft.com/en-us/download/dotnet/8.0
   - Verify: `dotnet --version`

2. **`Visual Studio 2022`** (Community, Professional, or Enterprise)
   - Download: https://visualstudio.microsoft.com/downloads/
   - Workload: ASP.NET and web development
   - Workload: .NET desktop development

   OR **`Visual Studio Code`** with C# extension
   - Extension: C# Dev Kit
   - Extension: NuGet Package Manager

3. **`Docker Desktop`** (for local SQL Server)
   - Download: https://www.docker.com/products/docker-desktop
   - Verify: `docker --version` and `docker-compose --version`

4. **`Git`** (for version control)
   - Download: https://git-scm.com/
   - Verify: `git --version`

### System Requirements

- **Windows**: Windows 10/11 with 8GB+ RAM, 10GB free disk space
- **macOS**: macOS 11+ with 8GB+ RAM, 10GB free disk space
- **Linux**: Ubuntu 20.04+ with 4GB+ RAM, 10GB free disk space

---

## Project Setup

### 1. Clone Repository

```bash
git clone https://github.com/yourepo/ai-sdlc-patient-portal.git
cd ai-sdlc-patient-portal
```

### 2. Create Backend Solution

```bash
cd backend

# Create solution
dotnet new sln -n PatientPortal

# Create projects
dotnet new classlib -n PatientPortal.Domain -f net8.0
dotnet new classlib -n PatientPortal.Application -f net8.0
dotnet new classlib -n PatientPortal.Infrastructure -f net8.0
dotnet new webapi -n PatientPortal.Api -f net8.0

# Add projects to solution
dotnet sln add PatientPortal.Domain/PatientPortal.Domain.csproj
dotnet sln add PatientPortal.Application/PatientPortal.Application.csproj
dotnet sln add PatientPortal.Infrastructure/PatientPortal.Infrastructure.csproj
dotnet sln add PatientPortal.Api/PatientPortal.Api.csproj

# Create test projects
dotnet new xunit -n PatientPortal.Api.Tests -f net8.0
dotnet new xunit -n PatientPortal.Application.Tests -f net8.0
dotnet new xunit -n PatientPortal.Infrastructure.Tests -f net8.0
dotnet new xunit -n PatientPortal.Integration.Tests -f net8.0

dotnet sln add PatientPortal.Api.Tests/PatientPortal.Api.Tests.csproj
dotnet sln add PatientPortal.Application.Tests/PatientPortal.Application.Tests.csproj
dotnet sln add PatientPortal.Infrastructure.Tests/PatientPortal.Infrastructure.Tests.csproj
dotnet sln add PatientPortal.Integration.Tests/PatientPortal.Integration.Tests.csproj
```

### 3. Add NuGet Dependencies

**For all projects**:
```bash
cd PatientPortal.Api
dotnet add package Microsoft.EntityFrameworkCore.SqlServer
dotnet add package Microsoft.EntityFrameworkCore.Tools
dotnet add package System.IdentityModel.Tokens.Jwt
dotnet add package Microsoft.IdentityModel.Tokens
dotnet add package AutoMapper.Extensions.Microsoft.DependencyInjection
dotnet add package FluentValidation.DependencyInjectionExtensions
dotnet add package Swashbuckle.AspNetCore
```

**For Infrastructure project**:
```bash
cd ../PatientPortal.Infrastructure
dotnet add package Microsoft.EntityFrameworkCore.SqlServer
dotnet add package Microsoft.EntityFrameworkCore.Tools
```

**For Test projects**:
```bash
cd ../PatientPortal.Api.Tests
dotnet add package xunit
dotnet add package Moq
dotnet add package FluentAssertions
dotnet add package Microsoft.AspNetCore.Mvc.Testing
```

### 4. Configure Database Connection

**Create `appsettings.Development.json` in `PatientPortal.Api`**:

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.EntityFrameworkCore": "Debug"
    }
  },
  "ConnectionStrings": {
    "SqlServer": "Server=localhost,1433;Database=PatientPortalDev;User Id=SA;Password=Password@2468;TrustServerCertificate=true;"
  },
  "JwtSettings": {
    "Secret": "your-secret-key-here-minimum-32-characters-for-production",
    "Issuer": "PatientPortalApi",
    "Audience": "PatientPortalApi",
    "ExpirationMinutes": 60,
    "RefreshTokenExpirationDays": 7
  },
  "AllowedHosts": "*"
}
```

**Create `appsettings.Production.json`**:

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Warning"
    }
  },
  "ConnectionStrings": {
    "SqlServer": "Server={PROD_SERVER};Database={PROD_DB};User Id={PROD_USER};Password={PROD_PASS};TrustServerCertificate=false;"
  },
  "JwtSettings": {
    "Secret": "${JWT_SECRET}",
    "Issuer": "PatientPortalApi",
    "Audience": "PatientPortalApi",
    "ExpirationMinutes": 60,
    "RefreshTokenExpirationDays": 7
  }
}
```

### 5. Start Docker Containers

**Create `docker-compose.yml` in `backend` directory**:

```yaml
version: '3.8'

services:
  sqlserver:
    image: mcr.microsoft.com/mssql/server:2022-latest
    container_name: patient-portal-db
    environment:
      ACCEPT_EULA: Y
      SA_PASSWORD: Password@2468
    ports:
      - "1433:1433"
    volumes:
      - sqlserver-data:/var/opt/mssql
    networks:
      - patient-portal-network

  api:
    build: .
    container_name: patient-portal-api
    environment:
      ASPNETCORE_ENVIRONMENT: Development
      ConnectionStrings__SqlServer: "Server=sqlserver;Database=PatientPortalDev;User Id=SA;Password=Password@2468;TrustServerCertificate=true;"
    ports:
      - "5000:80"
    depends_on:
      - sqlserver
    networks:
      - patient-portal-network

volumes:
  sqlserver-data:

networks:
  patient-portal-network:
    driver: bridge
```

### 6. Run Database Migrations

```bash
cd PatientPortal.Api

# Create initial migration
dotnet ef migrations add InitialCreate -p ../PatientPortal.Infrastructure -s .

# Apply migrations
dotnet ef database update
```

### 7. Run Application

**Option 1: CLI**
```bash
cd PatientPortal.Api
dotnet run
```

**Option 2: Docker Compose**
```bash
cd ..
docker-compose up -d
```

**Option 3: Visual Studio**
- Open `PatientPortal.sln`
- Right-click on `PatientPortal.Api`
- Select "Set as Startup Project"
- Press F5 or click "Start Debugging"

---

## Development Workflow

### 1. Create New Feature

**Example: Add User CRUD Endpoints**

**Step 1: Create Entity** (`Domain/Entities/User.cs`)
```csharp
public class User : AuditableEntity {
    public string Email { get; set; }
    public string PasswordHash { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public UserRole Role { get; set; }
    public bool IsActive { get; set; } = true;
}
```

**Step 2: Create DTOs** (`Application/DTOs/UserDto.cs`)
```csharp
public class UserDto {
    public Guid Id { get; set; }
    public string Email { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
}

public class CreateUserRequest {
    public string Email { get; set; }
    public string Password { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
}
```

**Step 3: Create Validator** (`Application/Validators/CreateUserValidator.cs`)
```csharp
public class CreateUserValidator : AbstractValidator<CreateUserRequest> {
    public CreateUserValidator() {
        RuleFor(x => x.Email).NotEmpty().EmailAddress();
        RuleFor(x => x.FirstName).NotEmpty().MaximumLength(100);
        RuleFor(x => x.LastName).NotEmpty().MaximumLength(100);
        RuleFor(x => x.Password).NotEmpty().MinimumLength(8);
    }
}
```

**Step 4: Create Service** (`Application/Services/UserService.cs`)
```csharp
public class UserService : IUserService {
    private readonly IUserRepository _repository;
    private readonly IMapper _mapper;

    public async Task<UserDto> CreateAsync(CreateUserRequest request) {
        var user = _mapper.Map<User>(request);
        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);
        
        await _repository.AddAsync(user);
        await _repository.SaveChangesAsync();
        
        return _mapper.Map<UserDto>(user);
    }
}
```

**Step 5: Create Controllers** (`Controllers/UsersController.cs`)
```csharp
[ApiController]
[Route("api/v1/[controller]")]
public class UsersController : ControllerBase {
    private readonly IUserService _userService;

    [HttpPost]
    [AllowAnonymous]
    public async Task<IActionResult> Create([FromBody] CreateUserRequest request) {
        var result = await _userService.CreateAsync(request);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }

    [HttpGet("{id}")]
    [Authorize]
    public async Task<IActionResult> GetById(Guid id) {
        var result = await _userService.GetByIdAsync(id);
        return Ok(result);
    }
}
```

**Step 6: Write Tests** (`Tests/UserServiceTests.cs`)
```csharp
public class UserServiceTests {
    [Fact]
    public async Task CreateUser_WithValidData_ReturnsUserDto() {
        // Arrange
        var mockRepository = new Mock<IUserRepository>();
        var mockMapper = new Mock<IMapper>();
        var service = new UserService(mockRepository.Object, mockMapper.Object);
        var request = new CreateUserRequest { Email = "test@example.com", ... };

        // Act
        var result = await service.CreateAsync(request);

        // Assert
        result.Should().NotBeNull();
        result.Email.Should().Be(request.Email);
        mockRepository.Verify(x => x.SaveChangesAsync(), Times.Once);
    }
}
```

### 2. Run Tests

```bash
# Run all tests
dotnet test

# Run specific test project
dotnet test PatientPortal.Api.Tests

# Run with coverage
dotnet test /p:CollectCoverage=true /p:CoverageFormat=opencover
```

### 3. Check Code Quality

```bash
# Analyze with StyleCop
dotnet build /p:TreatWarningsAsErrors=true

# Format code (install first: dotnet tool install -g dotnet-format)
dotnet format
```

### 4. View API Documentation

**Start application** and navigate to: `http://localhost:5000/swagger`

### 5. Database Migrations

```bash
# Create new migration (after model changes)
dotnet ef migrations add MigrationName -p ../PatientPortal.Infrastructure -s PatientPortal.Api

# Apply migrations
dotnet ef database update

# Revert last migration
dotnet ef database update PreviousMigrationName
```

---

## Common Tasks

### Run Specific Test

```bash
dotnet test --filter "FullyQualifiedName=PatientPortal.Api.Tests.UserControllerTests.CreateUser_WithValidData_ReturnsCreated"
```

### View Database

Use SQL Server Management Studio:
```
Server: localhost,1433
Login: SA
Password: Password@2468
Database: PatientPortalDev
```

Or use Azure Data Studio for cross-platform database client.

### Debug Application

1. **Set breakpoint** in Visual Studio (F9)
2. **Start debugging** (F5)
3. **Hit endpoint** via Swagger UI or cURL
4. **Inspect variables** in debug window

### Check Entity Framework Logs

Add to `appsettings.Development.json`:
```json
"Logging": {
  "LogLevel": {
    "Microsoft.EntityFrameworkCore.Database.Command": "Debug"
  }
}
```

### Generate New API Key for JWT

```csharp
var key = new byte[32];
using (var rng = System.Security.Cryptography.RandomNumberGenerator.Create()) {
    rng.GetBytes(key);
}
var keyString = Convert.ToBase64String(key);
// Use generated keyString in appsettings.json
```

---

## Environment Variables

For production deployment, set these environment variables:

```bash
ASPNETCORE_ENVIRONMENT=Production
ConnectionStrings__SqlServer=Server=prod-server;Database=PatientPortal;...
JwtSettings__Secret=your-production-secret-key
JwtSettings__Issuer=PatientPortalApi
```

---

## Docker Commands

```bash
# Build Docker image
docker build -t patient-portal-api:latest .

# Run container
docker run -p 5000:80 -e ASPNETCORE_ENVIRONMENT=Development patient-portal-api:latest

# View logs
docker logs patient-portal-api

# Stop container
docker stop patient-portal-api

# Remove container
docker rm patient-portal-api

# Docker Compose commands
docker-compose up -d       # Start services
docker-compose down        # Stop services
docker-compose ps          # List running services
docker-compose logs -f api # View logs
```

---

## Troubleshooting

### SQL Server Connection Fails

**Problem**: `Failed to establish a new connection`

**Solution**:
1. Verify Docker is running: `docker ps`
2. Verify SQL Server container: `docker logs patient-portal-db`
3. Check connection string in `appsettings.Development.json`
4. Verify port 1433 is not in use: `netstat -an | findstr 1433` (Windows) or `lsof -i :1433` (Mac/Linux)

### Migration Fails

**Problem**: `Unable to create a 'DbContext' of type 'ApplicationDbContext'`

**Solution**:
1. Ensure connection string is set in `appsettings.json`
2. Verify SQL Server is running
3. Check for syntax errors in DbContext configuration
4. Run: `dotnet ef migrations add PreFix -p ../PatientPortal.Infrastructure -s PatientPortal.Api`

### Port 5000 Already in Use

**Problem**: `Port 5000 is in use`

**Solution**:
1. Change port in `appsettings.json`: `"Urls": "http://localhost:5001"`
2. Or kill process on port 5000: `netstat -ano | findstr :5000` (Windows) or `lsof -ti:5000` (Mac/Linux)

### Tests Fail with Timeout

**Problem**: Tests timeout during database operations

**Solution**:
1. Increase test timeout: `dotnet test --logger trx --blame`
2. Ensure in-memory test database is being used (not Docker container)
3. Check for database locks

---

## Next Steps

1. **Review API Documentation**: Navigate to `http://localhost:5000/swagger`
2. **Study Code Structure**: Explore clean architecture layers
3. **Run Test Suite**: Ensure all tests pass
4. **Create First Task**: Pick a user story and start implementation
5. **Reference Contracts**: Consult `contracts/api-contracts.md` for endpoint specs

---

## Resources

- **Microsoft Docs**: https://docs.microsoft.com/en-us/dotnet/
- **Entity Framework**: https://docs.microsoft.com/en-us/ef/
- **ASP.NET Core**: https://docs.microsoft.com/en-us/aspnet/core/
- **Docker**: https://docs.docker.com/
- **JWT**: https://jwt.io/
- **How to REST**: https://restfulapi.net/

---

**Status**: ✅ Quick start guide complete.

**Ready for**: Development team onboarding and implementation start.
