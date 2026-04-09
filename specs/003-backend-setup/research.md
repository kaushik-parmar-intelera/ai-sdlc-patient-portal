# Research: Backend Setup - .NET 8 Clean Architecture

**Feature**: Backend Setup (003-backend-setup)  
**Created**: 2026-04-09  
**Purpose**: Resolve technical unknowns and document best practices for .NET 8 backend implementation

---

## 1. JWT Best Practices in .NET 8

**Decision**: Use `System.IdentityModel.Tokens.Jwt` with RSA key pairs for production, HMAC for development.

**Rationale**: 
- `System.IdentityModel.Tokens.Jwt` is the official .NET JWT library from Microsoft
- RSA (asymmetric) allows secure token validation without private key exposure
- HMAC (symmetric) is acceptable for development but requires key rotation in production
- Integrates seamlessly with ASP.NET Core authorization middleware

**Implementation Approach**:
1. Create `JwtTokenProvider.cs` class that:
   - Generates tokens with user claims (sub, email, role)
   - Sets expiration (1 hour for access token)
   - Signs with configurable key (RSA public/private or HMAC)
   - Validates token signature and expiration on each request

2. Register JWT middleware in `Program.cs`:
   ```csharp
   services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
       .AddJwtBearer(options => {
           options.Authority = "https://your-issuer.com";
           options.Audience = "PatientPortalApi";
           options.TokenValidationParameters = tokenParams;
       });
   ```

3. Implement refresh token strategy:
   - Store refresh tokens in database (nullable column on User entity)
   - Rotate on each use (revoke old, issue new)
   - Shorter refresh token expiration (7-30 days)

**Alternatives Considered**:
- OAuth2/OIDC: Too complex for monolithic backend; consider for future multi-service auth
- API Keys: Less secure; no claim-based authorization; not recommended for healthcare data

---

## 2. Entity Framework Core Code-First with Migrations

**Decision**: Use EF Core Code-First with automatic migration execution on application startup

**Rationale**:
- Code-First maintains entity definitions as source of truth (easier versioning, code review)
- Migrations track schema changes explicitly (audit trail for compliance)
- Automatic execution on startup simplifies deployment (no manual migration step)
- Supports both SQL Server and containerized dev environments

**Implementation Approach**:

1. Create `AuditableEntity` base class in Domain layer:
```csharp
public abstract class AuditableEntity {
    public Guid Id { get; set; }
    public DateTime CreatedOn { get; set; }
    public string CreatedBy { get; set; }
    public DateTime? ModifiedOn { get; set; }
    public string ModifiedBy { get; set; }
}
```

2. All Domain entities inherit from `AuditableEntity`

3. Configure EF interceptor to auto-populate audit fields:
```csharp
services.AddScoped<AuditableEntityInterceptor>();
```

4. In Infrastructure layer, create migration in `Program.cs`:
```csharp
using var scope = app.Services.CreateScope();
var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
dbContext.Database.Migrate(); // Auto-execute pending migrations
await dbContext.SeedDataAsync();
```

5. Seed dummy data in `SeedData.cs` for development/testing

**Alternatives Considered**:
- Database-First: Separates schema from code; loses schema versioning benefits
- Manual migrations: Error-prone; requires DevOps coordination
- Snapshot testing: Validates migrations; adds complexity without benefit for this scale

---

## 3. ASP.NET Core Dependency Injection Configuration

**Decision**: Use built-in ASP.NET Core DI container with scoped services for repositories and application services

**Rationale**:
- Built-in container is sufficient for this architecture (no need for external DI libraries)
- Scoped lifetime ideal for DbContext (one per request)
- Transient for stateless utilities (mappers, validators)
- Singleton for configuration and logging

**Implementation Approach**:

```csharp
// Program.cs
builder.Services
    .AddScoped<IUnitOfWork, UnitOfWork>()                           // DB per request
    .AddScoped<IUserRepository, UserRepository>()                   // DB per request
    .AddScoped<IAppointmentRepository, AppointmentRepository>()     // DB per request
    .AddScoped<IAuthService, AuthService>()                         // Business logic
    .AddScoped<IUserService, UserService>()
    .AddScoped<AuditableEntityInterceptor>()                        // DB interceptor
    .AddScoped<FluentValidation.IValidator<CreateUserRequest>, CreateUserValidator>()
    .AddTransient<IMapper>(sp => new Mapper(mapperConfig))          // Stateless
    .AddSingleton<ILogger>(LoggerFactory.Create(...));              // App lifetime
```

**Alternatives Considered**:
- Autofac: Additional dependency; .NET DI adequate for this scale
- Service locator pattern: Anti-pattern; constructor injection preferred

---

## 4. Global Exception Handling in ASP.NET Core

**Decision**: Middleware-based exception handling with custom exception mapping to HTTP status codes

**Rationale**:
- Middleware handles all exceptions (including those outside controllers)
- Centralized error response format ensures consistency
- Allows audit logging of all exceptions
- Separates technical exceptions from user-facing messages

**Implementation Approach**:

Create `ErrorHandlingMiddleware.cs`:
```csharp
public class ErrorHandlingMiddleware {
    public async Task InvokeAsync(HttpContext context) {
        try {
            await _next(context);
        } catch (Exception ex) {
            await HandleExceptionAsync(context, ex);
        }
    }
    
    private static Task HandleExceptionAsync(HttpContext context, Exception exception) {
        var response = exception switch {
            ValidationException => CreateErrorResponse(400, "VALIDATION_ERROR", ex),
            AuthenticationException => CreateErrorResponse(401, "UNAUTHORIZED", ex),
            AuthorizationException => CreateErrorResponse(403, "FORBIDDEN", ex),
            NotFoundException => CreateErrorResponse(404, "NOT_FOUND", ex),
            _ => CreateErrorResponse(500, "INTERNAL_ERROR", ex)
        };
        
        context.Response.StatusCode = response.StatusCode;
        return context.Response.WriteAsJsonAsync(response);
    }
}
```

Register in `Program.cs`:
```csharp
app.UseMiddleware<ErrorHandlingMiddleware>();
```

**Alternatives Considered**:
- Try-catch in each controller: Verbose; error response format inconsistent
- ExceptionFilter: Only catches controller exceptions; misses middleware exceptions

---

## 5. Performance Optimization for .NET APIs

**Decision**: 
- Connection pooling: Min 10, Max 50 connections (configurable)
- Query optimization: Use `AsNoTracking()` for read-only queries; eager load with `Include()`
- Response caching: Cache at HTTP layer (IHttpClientFactory with cache policies)
- Async/await throughout to prevent thread pool exhaustion

**Rationale**:
- Connection pooling prevents database connection exhaustion under load
- Entity Framework tracking overhead removed for read-only queries
- HTTP caching reduces database hits for frequently accessed data
- Async patterns ensure thread pool availability for 500+ concurrent users

**Implementation Approach**:

1. Configure connection pooling in `appsettings.json`:
```json
{
  "ConnectionStrings": {
    "SqlServer": "Server=sqlserver;Database=PatientPortal;Min Pool Size=10;Max Pool Size=50;..."
  }
}
```

2. Use `AsNoTracking()` in repositories:
```csharp
public async Task<List<User>> GetAllAsync() {
    return await _context.Users.AsNoTracking().ToListAsync();
}
```

3. Configure response caching:
```csharp
builder.Services.AddResponseCaching();
app.UseResponseCaching();
```

4. Use async patterns throughout:
```csharp
public async Task<UserDto> GetUserAsync(Guid id) {
    var user = await _context.Users.FindAsync(id);  // Async
    return _mapper.Map<UserDto>(user);
}
```

**Alternatives Considered**:
- Distributed caching (Redis): Overkill for initial scale; implement if horizontal scaling required
- Synchronous code: Cannot achieve 500+ concurrent connections; thread pool limited to CPU cores

---

## 6. Docker Containerization for .NET

**Decision**: Multi-stage Dockerfile for optimized image size; Docker Compose for local development

**Rationale**:
- Multi-stage build reduces final image size (removes build tools)
- Docker Compose provides local dev environment matching production
- Health checks ensure container restart on failure
- Environment variables allow dev/prod configuration

**Implementation Approach**:

Create `Dockerfile`:
```dockerfile
# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["PatientPortal.Api/PatientPortal.Api.csproj", "PatientPortal.Api/"]
RUN dotnet restore "PatientPortal.Api/PatientPortal.Api.csproj"
COPY . .
RUN dotnet publish "PatientPortal.Api/PatientPortal.Api.csproj" -c Release -o /app/publish

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/publish .
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:5000/health || exit 1
ENTRYPOINT ["dotnet", "PatientPortal.Api.dll"]
```

Create `docker-compose.yml`:
```yaml
version: '3.8'
services:
  api:
    build: .
    ports:
      - "5000:80"
    environment:
      - ASPNETCORE_ENVIRONMENT=Development
      - ConnectionStrings__SqlServer=Server=sqlserver;Database=PatientPortal;User Id=SA;Password=Password@2468;TrustServerCertificate=true;
    depends_on:
      - sqlserver
    
  sqlserver:
    image: mcr.microsoft.com/mssql/server:2022-latest
    environment:
      - SA_PASSWORD=Password@2468
      - ACCEPT_EULA=Y
    ports:
      - "1433:1433"
    volumes:
      - sqlserver_data:/var/opt/mssql

volumes:
  sqlserver_data:
```

**Alternatives Considered**:
- Single-stage Dockerfile: Final image includes build tools; unnecessarily large
- Manual SQL Server setup: Complex; Docker ensures reproducibility

---

## 7. Testing Strategy: xUnit + MoQ + FluentAssertions

**Decision**: 
- Unit tests: Mock all dependencies; test in isolation
- Integration tests: Real DbContext (in-memory); real HTTP requests
- 85% coverage for business logic

**Rationale**:
- xUnit is modern, concurrent-safe, and preferred in .NET ecosystem
- MoQ provides clean, fluent mocking API
- FluentAssertions improve readability and error messages
- Two-tier testing (unit + integration) catches both logic errors and integration issues

**Implementation Approach**:

Unit test example:
```csharp
[Fact]
public async Task CreateUser_WithValidData_ReturnsCreatedUser() {
    // Arrange
    var userService = new UserService(_mockUserRepository.Object);
    var request = new CreateUserRequest { Email = "test@example.com", Password = "Secure123!" };
    
    // Act
    var result = await userService.CreateAsync(request);
    
    // Assert
    result.Should().NotBeNull();
    result.Id.Should().NotBeEmpty();
    result.Email.Should().Be("test@example.com");
}
```

Integration test example:
```csharp
[Fact]
public async Task PostUser_WithValidData_Returns201Created() {
    // Arrange
    var client = _factory.CreateClient();
    var request = new CreateUserRequest { Email = "test@example.com", Password = "Secure123!" };
    
    // Act
    var response = await client.PostAsJsonAsync("/api/v1/users", request);
    
    // Assert
    response.StatusCode.Should().Be(HttpStatusCode.Created);
    var result = await response.Content.ReadAsAsync<ApiResponse<UserDto>>();
    result.Success.Should().BeTrue();
    result.Data.Email.Should().Be("test@example.com");
}
```

**Alternatives Considered**:
- NUnit: Similar capability; xUnit more modern
- Moq vs Substitute: MoQ preferred for .NET ecosystem
- Manual mocking: Verbose; libraries provide cleaner API

---

## 8. API Documentation: Swagger/OpenAPI

**Decision**: Swagger UI with Swashbuckle; XML documentation comments for auto-generated docs

**Rationale**:
- Swashbuckle auto-generates OpenAPI spec from code and endpoints
- Swagger UI provides interactive documentation
- XML comments keep documentation close to code
- OpenAPI spec enables client code generation if needed

**Implementation Approach**:

Install NuGet: `Swashbuckle.AspNetCore`

In `Program.cs`:
```csharp
builder.Services.AddSwaggerGen(c => {
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Patient Portal API", Version = "v1" });
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme {
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT"
    });
});

app.UseSwagger();
app.UseSwaggerUI(c => {
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Patient Portal API v1");
});
```

In controller:
```csharp
/// <summary>Creates a new user</summary>
/// <param name="request">User creation data</param>
/// <returns>Created user with ID</returns>
/// <response code="201">User created successfully</response>
/// <response code="400">Invalid request data</response>
[HttpPost]
public async Task<ActionResult<ApiResponse<UserDto>>> CreateUser(CreateUserRequest request) {
    ...
}
```

Swagger UI available at `http://localhost:5000/swagger`

**Alternatives Considered**:
- Manual API documentation: Cannot stay synchronized with code changes
- GraphQL: Overkill for current requirements; consider for future feature set

---

## Key Decisions Summary

| Area | Decision | Why |
|------|----------|-----|
| JWT | System.IdentityModel.Tokens.Jwt with RSA/HMAC | Official, integrates with ASP.NET Core auth |
| Migrations | EF Code-First with auto-execution | Maintains schema in code, auto-deployment |
| DI | Built-in ASP.NET Core container | Sufficient; no external dependency needed |
| Errors | Middleware with custom exception mapping | Centralized, consistent error format |
| Performance | Connection pooling + async + caching | Achieves 500+ concurrent users |
| Containerization | Multi-stage Dockerfile + Docker Compose | Optimized images, matching local & prod |
| Testing | xUnit + MoQ + FluentAssertions | Modern, consistent, readable assertions |
| Docs | Swagger/OpenAPI with Swashbuckle | Auto-generated, interactive documentation |

---

**Status**: ✅ All research questions resolved. Ready for implementation.

**Next**: Create data-model.md with detailed entity definitions, contracts/, and quickstart.md
