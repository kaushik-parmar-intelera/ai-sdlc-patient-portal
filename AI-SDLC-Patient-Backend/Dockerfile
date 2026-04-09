# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy project files
COPY ["PatientPortal.Api/PatientPortal.Api.csproj", "PatientPortal.Api/"]
COPY ["PatientPortal.Application/PatientPortal.Application.csproj", "PatientPortal.Application/"]
COPY ["PatientPortal.Infrastructure/PatientPortal.Infrastructure.csproj", "PatientPortal.Infrastructure/"]
COPY ["PatientPortal.Domain/PatientPortal.Domain.csproj", "PatientPortal.Domain/"]

# Restore dependencies
RUN dotnet restore "PatientPortal.Api/PatientPortal.Api.csproj"

# Copy source code
COPY . .

# Build application
RUN dotnet build "PatientPortal.Api/PatientPortal.Api.csproj" -c Release -o /app/build

# Publish stage
FROM build AS publish
RUN dotnet publish "PatientPortal.Api/PatientPortal.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

# Install curl for health checks
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

COPY --from=publish /app/publish .

EXPOSE 8080
EXPOSE 8443

ENV ASPNETCORE_HTTP_PORT=8080
ENV ASPNETCORE_HTTPS_PORT=8443
ENV ASPNETCORE_ENVIRONMENT=Production

ENTRYPOINT ["dotnet", "PatientPortal.Api.dll"]
