# Docker Configuration for Patient Portal API

## Overview
This project includes Docker configuration for both local development and production deployment. The setup uses Docker Compose to orchestrate the ASP.NET Core API and SQL Server database.

## Architecture

```
┌─────────────────────────────────────────────────┐
│         Docker Network: patient-portal          │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌──────────────────┐    ┌──────────────────┐  │
│  │   API Service    │    │  SQL Server      │  │
│  │  (ASP.NET Core)  │───▶│   Database       │  │
│  │  Port: 8080      │    │  Port: 1433      │  │
│  │  Port: 8443      │    │                  │  │
│  └──────────────────┘    └──────────────────┘  │
│                                                 │
└─────────────────────────────────────────────────┘
```

## Prerequisites

- Docker Desktop (latest version)
- Docker Compose (included with Docker Desktop)
- Git
- PowerShell or Bash terminal

## Quick Start - Local Development

### 1. Setup Environment Variables

Copy the development environment file:
```bash
cp .env.development .env
```

Or create `.env` with your custom values:
```env
MSSQL_SA_PASSWORD=YourSecurePassword@123
JWT_SIGNING_KEY=YourSecureSigningKeyMinimum32Bytes
```

### 2. Start Development Environment

```bash
# Start services with hot reload
docker-compose -f docker-compose.dev.yml up -d

# View logs
docker-compose -f docker-compose.dev.yml logs -f api

# Stop services
docker-compose -f docker-compose.dev.yml down
```

### 3. Access the Application

- **API**: http://localhost:8080
- **Swagger UI**: http://localhost:8080/swagger/index.html
- **Health Check**: http://localhost:8080/api/v1/health
- **Database (SSMS)**: `localhost,1433`
  - Username: `sa`
  - Password: `PatientPortal@2024Dev`

### 4. Database Migrations

The database is automatically initialized on first run. To apply migrations:

```bash
# Inside the container
docker-compose -f docker-compose.dev.yml exec api dotnet ef database update --project PatientPortal.Infrastructure --startup-project PatientPortal.Api

# Or from host
docker exec patient-portal-api-dev dotnet ef database update --project PatientPortal.Infrastructure --startup-project PatientPortal.Api
```

## Production Deployment

### 1. Setup Environment Variables

Copy the production environment file:
```bash
cp .env.production .env
```

**⚠️ IMPORTANT**: Change these values in `.env.production`:
- `MSSQL_SA_PASSWORD` - Use a strong password
- `JWT_SIGNING_KEY` - Generate a secure 32+ byte key

### 2. Build Docker Image

```bash
# Build the image
docker build -t patient-portal-api:latest -t patient-portal-api:1.0.0 .

# Tag for registry (if using Docker Hub or private registry)
docker tag patient-portal-api:latest yourregistry/patient-portal-api:latest
```

### 3. Start Production Environment

```bash
# Start services
docker-compose -f docker-compose.prod.yml up -d

# View logs
docker-compose -f docker-compose.prod.yml logs -f api

# Stop services
docker-compose -f docker-compose.prod.yml down
```

### 4. Verify Deployment

```bash
# Check container status
docker-compose -f docker-compose.prod.yml ps

# Test health endpoint
curl http://localhost:8080/api/v1/health

# View logs
docker-compose -f docker-compose.prod.yml logs api
```

## Environment Configuration

### Development Environment (.env.development)

| Variable | Default | Description |
|----------|---------|-------------|
| `ASPNETCORE_ENVIRONMENT` | Development | Execution environment |
| `MSSQL_SA_PASSWORD` | PatientPortal@2024Dev | SQL Server SA password |
| `JWT_SIGNING_KEY` | SuperSecretSigningKeyChangeMe123 | JWT signing key (32+ bytes) |
| `LOG_LEVEL` | Information | Application log level |

### Production Environment (.env.production)

| Variable | Default | Description |
|----------|---------|-------------|
| `ASPNETCORE_ENVIRONMENT` | Production | Execution environment |
| `MSSQL_SA_PASSWORD` | ⚠️ CHANGE THIS | SQL Server SA password |
| `JWT_SIGNING_KEY` | ⚠️ CHANGE THIS | JWT signing key (32+ bytes) |
| `LOG_LEVEL` | Warning | Application log level |

## Common Docker Commands

### View Logs
```bash
# All services
docker-compose -f docker-compose.dev.yml logs -f

# Specific service
docker-compose -f docker-compose.dev.yml logs -f api
docker-compose -f docker-compose.dev.yml logs -f mssql

# Last 100 lines
docker-compose -f docker-compose.dev.yml logs --tail=100 api
```

### Access Container Shell
```bash
# API container
docker-compose -f docker-compose.dev.yml exec api /bin/bash

# Database container
docker-compose -f docker-compose.dev.yml exec mssql /bin/bash
```

### Stop/Remove Services
```bash
# Stop services (containers remain)
docker-compose -f docker-compose.dev.yml stop

# Remove services (containers deleted)
docker-compose -f docker-compose.dev.yml down

# Remove volumes as well (data deleted!)
docker-compose -f docker-compose.dev.yml down -v
```

### Clean Up
```bash
# Remove stopped containers
docker container prune

# Remove unused images
docker image prune

# Remove unused volumes
docker volume prune

# Remove everything
docker system prune -a
```

## Health Checks

The containers include health checks:

### API Health Endpoints
- `GET /api/v1/health` - General health status
- `GET /api/v1/health/live` - Liveness probe (is app running?)
- `GET /api/v1/health/ready` - Readiness probe (is app ready for traffic?)

### Check Container Health
```bash
docker-compose -f docker-compose.dev.yml ps

# Shows health status in STATUS column
# healthy, unhealthy, or starting
```

## Troubleshooting

### Port Already in Use
```bash
# Find process using port 8080
netstat -ano | findstr :8080

# Or change ports in docker-compose file
```

### Database Connection Issues
```bash
# Check if SQL Server is healthy
docker-compose -f docker-compose.dev.yml ps mssql

# Wait for database to be ready (usually 30-40 seconds)
# Check logs: docker-compose logs mssql
```

### Migrations Failing
```bash
# Check if database exists
docker-compose -f docker-compose.dev.yml exec mssql /opt/mssql-tools18/bin/sqlcmd \
  -S localhost \
  -U sa \
  -P PatientPortal@2024Dev \
  -Q "SELECT name FROM sys.databases"

# Manual migration
docker exec -it patient-portal-api-dev \
  dotnet ef database update \
  --project PatientPortal.Infrastructure \
  --startup-project PatientPortal.Api
```

### API Won't Start
```bash
# Check logs
docker-compose -f docker-compose.dev.yml logs api

# Rebuild image
docker-compose -f docker-compose.dev.yml build --no-cache api

# Restart
docker-compose -f docker-compose.dev.yml restart api
```

## Security Best Practices

### Development
- ✅ Use weak passwords (for local development only)
- ✅ Allow database access locally

### Production
- ⚠️ **Change** `MSSQL_SA_PASSWORD` to a strong password
- ⚠️ **Generate** a new `JWT_SIGNING_KEY`
- ✅ Use environment files (`.env.production`) with restricted permissions
- ✅ Don't commit `.env.production` to version control
- ✅ Add `.env.production` to `.gitignore`
- ✅ Use secrets management (Kubernetes secrets, Docker secrets, etc.)
- ✅ Run with read-only file system when possible
- ✅ Use non-root user in production image

## Volume Management

### Development Volumes
- Source code mounted for hot reload
- `mssql_data_dev` - SQL Server data persistence

### Production Volumes
- `mssql_data_prod` - SQL Server data persistence

### Backup Database Volume
```bash
# Create backup
docker run --rm -v mssql_data_dev:/data -v $(pwd):/backup alpine tar czf /backup/mssql_backup.tar.gz /data

# Restore backup
docker run --rm -v mssql_data_dev:/data -v $(pwd):/backup alpine tar xzf /backup/mssql_backup.tar.gz -C /
```

## Scaling & Production Considerations

### Load Balancing
For production, consider:
- Nginx reverse proxy for load balancing
- Multiple API containers behind load balancer
- Database replication for high availability

### Monitoring
Integrate with:
- Prometheus for metrics
- ELK stack for logging
- Application Insights

### Backup Strategy
- Automated SQL Server backups
- Volume snapshots
- Docker registry backup for images

## Docker Compose Files Reference

### docker-compose.dev.yml
- **Purpose**: Local development with hot reload
- **Services**: API + SQL Server
- **Volumes**: Source code mounted
- **Ports**: 8080 (HTTP), 8443 (HTTPS), 1433 (Database)
- **Command**: `dotnet watch run` for hot reload

### docker-compose.prod.yml
- **Purpose**: Production deployment
- **Services**: API + SQL Server
- **Volumes**: Data persistence only
- **Health Checks**: Enabled
- **Restart Policy**: `unless-stopped`
- **Logging**: Minimal

## Next Steps

1. **Setup Git LFS** (for large files)
   ```bash
   git lfs install
   ```

2. **Configure CI/CD** (GitHub Actions, Azure DevOps)
   - Build on push
   - Push to registry
   - Deploy to production

3. **Setup Monitoring**
   - Application Insights
   - Custom health dashboards

4. **Database Backups**
   - Automated backup scripts
   - Backup verification

## Support & Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Reference](https://docs.docker.com/compose/compose-file/)
- [Microsoft .NET Container Guide](https://github.com/dotnet/dotnet-docker)
- [SQL Server on Docker](https://hub.docker.com/_/microsoft-mssql-server)
