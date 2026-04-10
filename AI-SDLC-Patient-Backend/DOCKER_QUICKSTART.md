# Docker Quick Start Guide

## 🚀 Quick Start (5 minutes)

### For Windows (PowerShell):
```powershell
# Make script executable
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Start development environment
./docker-manage.ps1 dev-start

# View logs
./docker-manage.ps1 dev-logs api

# Run migrations
./docker-manage.ps1 migrate

# Stop everything
./docker-manage.ps1 dev-stop
```

### For macOS/Linux (Bash):
```bash
# Make script executable
chmod +x docker-manage.sh

# Start development environment
./docker-manage.sh dev-start

# View logs
./docker-manage.sh dev-logs api

# Run migrations
./docker-manage.sh migrate

# Stop everything
./docker-manage.sh dev-stop
```

### Manual Docker Compose:
```bash
# Development
docker-compose -f docker-compose.dev.yml up -d
docker-compose -f docker-compose.dev.yml logs -f api

# Production
docker-compose -f docker-compose.prod.yml up -d
docker-compose -f docker-compose.prod.yml logs -f api
```

## 📋 What Gets Deployed

### Development Environment
```
┌─ Web API (ASP.NET Core)
│  ├─ HTTP: http://localhost:8080
│  ├─ Swagger: http://localhost:8080/swagger
│  └─ Hot Reload: Enabled (code changes auto-restart)
│
└─ SQL Server Database
   ├─ Host: localhost,1433
   ├─ SA Username: sa
   └─ SA Password: PatientPortal@2024Dev
```

### Production Environment
```
┌─ Web API (ASP.NET Core)
│  ├─ HTTP: http://localhost:8080
│  ├─ HTTPS: https://localhost:8443
│  └─ Hot Reload: Disabled
│
└─ SQL Server Database
   ├─ Host: localhost,1433
   ├─ SA Username: sa
   └─ SA Password: (from .env.production)
```

## 🔧 Configuration Files

### Environment Variables
- `.env.development` - Development defaults (committed to repo)
- `.env.production` - Production template (committed, customize values)
- `.env` - Actual runtime config (not committed, auto-generated from template)

### Docker Compose Files
- `docker-compose.dev.yml` - Development with hot reload
- `docker-compose.prod.yml` - Production optimized

### Dockerfile
- Multi-stage build
- Optimized for both development and production
- Includes health checks

## 📊 Architecture

```
Docker Network (patient-portal-network)
│
├─ API Service (patient-portal-api-dev or -prod)
│  ├─ Port 8080 (HTTP)
│  ├─ Port 8443 (HTTPS)
│  ├─ Environment: Development/Production
│  └─ Health: /api/v1/health
│
└─ SQL Server (mssql)
   ├─ Port 1433
   ├─ Image: mcr.microsoft.com/mssql/server:2022-latest
   └─ Data Volume: mssql_data_dev or mssql_data_prod
```

## 🎯 Common Tasks

### View Running Services
```powershell
./docker-manage.ps1 ps
```

### Access Database
```bash
# Using sqlcmd inside container
docker-compose -f docker-compose.dev.yml exec mssql /opt/mssql-tools18/bin/sqlcmd \
  -S localhost \
  -U sa \
  -P PatientPortal@2024Dev

# Using SSMS/Azure Data Studio
Server: localhost,1433
Username: sa
Password: PatientPortal@2024Dev
```

### Run Database Migrations
```powershell
./docker-manage.ps1 migrate
```

### View Application Logs
```powershell
# All services
./docker-manage.ps1 dev-logs

# Specific service
./docker-manage.ps1 dev-logs api
./docker-manage.ps1 dev-logs mssql
```

### Access Container Terminal
```powershell
./docker-manage.ps1 dev-shell      # API container
./docker-manage.ps1 dev-db-shell   # Database container
```

### Test Health Endpoints
```bash
# General health
curl http://localhost:8080/api/v1/health

# Liveness probe
curl http://localhost:8080/api/v1/health/live

# Readiness probe
curl http://localhost:8080/api/v1/health/ready
```

### Stop & Clean Up
```powershell
# Stop only
./docker-manage.ps1 dev-stop

# Remove containers
./docker-manage.ps1 dev-clean

# Remove everything (including volumes)
./docker-manage.ps1 clean-all
```

## 🔐 Security Considerations

### Development
✅ Use provided weak passwords  
✅ Access only from localhost  
✅ Enable hot reload  

### Production
⚠️ **CHANGE** all default passwords  
⚠️ **GENERATE** new JWT signing key  
⚠️ Use strong passwords (32+ chars)  
✅ Disable debug logging  
✅ Enable HTTPS  
✅ Use secrets management  
✅ Implement network policies  

### Before Going to Production
1. [ ] Change `MSSQL_SA_PASSWORD` in `.env.production`
2. [ ] Generate new `JWT_SIGNING_KEY` (32+ bytes)
3. [ ] Enable SSL/TLS certificates
4. [ ] Configure backup strategy
5. [ ] Setup monitoring/alerting
6. [ ] Configure CI/CD pipeline
7. [ ] Test disaster recovery
8. [ ] Remove unnecessary environment variables
9. [ ] Enable container resource limits
10. [ ] Setup log aggregation

## 🐛 Troubleshooting

### Port Already in Use
```powershell
# Find process using port 8080
Get-NetTCPConnection -LocalPort 8080

# Kill process
Stop-Process -Id <PID> -Force

# Or use different port in docker-compose file
```

### Database Won't Start
```powershell
# Check logs
./docker-manage.ps1 dev-logs mssql

# Wait 30-40 seconds for database startup
# Check health
./docker-manage.ps1 health
```

### API Won't Connect to Database
```bash
# Verify network
docker network inspect patient-portal-network

# Check database is healthy
docker-compose -f docker-compose.dev.yml ps

# Check logs
docker-compose -f docker-compose.dev.yml logs api
```

### Clean Slate
```powershell
# Remove everything and start fresh
./docker-manage.ps1 clean-all
./docker-manage.ps1 dev-start
```

## 📚 Related Documentation

- [DOCKER_SETUP.md](./DOCKER_SETUP.md) - Comprehensive Docker guide
- [SWAGGER_JWT_AUTHORIZATION.md](./SWAGGER_JWT_AUTHORIZATION.md) - API authentication
- [Docker Docs](https://docs.docker.com/)
- [Docker Compose Docs](https://docs.docker.com/compose/)

## ✨ Features

✅ Multi-stage Docker build  
✅ Hot reload in development  
✅ Database migrations automated  
✅ Health checks included  
✅ Environment-based configuration  
✅ Production-ready setup  
✅ Convenient management scripts  
✅ Clear documentation  

## 🆘 Getting Help

Check logs:
```powershell
./docker-manage.ps1 dev-logs api
./docker-manage.ps1 dev-logs mssql
```

Verify services:
```powershell
./docker-manage.ps1 ps
./docker-manage.ps1 health
```

Test connectivity:
```bash
# Test API
curl http://localhost:8080/api/v1/health

# Test database
docker-compose -f docker-compose.dev.yml exec mssql sqlcmd -S localhost -U sa -P PatientPortal@2024Dev -Q "SELECT @@VERSION"
```

## 📝 Notes

- First startup takes 30-40 seconds for SQL Server to initialize
- Database is automatically created on first run
- Migrations run on first API startup
- Seed data is populated automatically
- Hot reload works in development mode
- Production image is optimized for size and security
