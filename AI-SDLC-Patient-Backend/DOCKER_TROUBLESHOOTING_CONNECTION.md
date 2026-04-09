# Docker Desktop Connection Troubleshooting

## Current Error
```
unable to get image 'ai-sdlc-patient-backend-api': error during connect: 
Get "http://%2F%2F.%2Fpipe%2FdockerDesktopLinuxEngine/v1.51/images/ai-sdlc-patient-backend-api/json": 
open //./pipe/dockerDesktopLinuxEngine: The system cannot find the file specified.
```

## Cause
Docker Desktop daemon is not running or not properly connected.

---

## ✅ Solution Steps

### Step 1: Verify Docker Desktop is Running
```powershell
# Check Docker status
docker ps

# If you see "Cannot connect to Docker daemon", proceed to Step 2
```

### Step 2: Restart Docker Desktop

**Option A: Via UI**
1. Find Docker Desktop in system tray
2. Click → Settings/Preferences
3. Click "Restart Docker" or "Quit Docker"
4. Close Docker completely
5. Reopen Docker Desktop
6. Wait 1-2 minutes for startup

**Option B: Via PowerShell**
```powershell
# Stop all containers
docker-compose -f docker-compose.dev.yml down

# Restart Docker Desktop service
Stop-Service com.docker.service -Force -ErrorAction SilentlyContinue
Start-Service com.docker.service

# Wait 30 seconds
Start-Sleep -Seconds 30

# Verify connection
docker ps
```

### Step 3: Rebuild and Run

```powershell
# Build the image explicitly
docker build -t patient-portal-api:dev .

# Start the development environment
docker-compose -f docker-compose.dev.yml up -d

# View logs
docker-compose -f docker-compose.dev.yml logs -f api
```

### Step 4: Check Docker Status
```powershell
# Show running containers
docker ps

# Output should show:
# CONTAINER ID   IMAGE     COMMAND   CREATED   STATUS      PORTS     NAMES
# xxx            mssql     ...       ...       Up ...      1433->1433/tcp   patient-portal-db-dev
# xxx            api       ...       ...       Up ...      8080->8080/tcp   patient-portal-api-dev
```

---

## 🔧 Additional Fixes

### Issue: WSL2 Backend Not Working
If Docker Desktop is using Linux containers but WSL2 isn't properly set up:

```powershell
# Check Docker backend
docker info | Select-String "OS"

# If it shows "linux", verify WSL2
wsl --list --verbose

# Should show Ubuntu or similar with VERSION 2
```

### Issue: Running Out of Disk Space
Docker needs at least 10GB free:

```powershell
# Check disk space
Get-Volume | Format-Table DriveLetter, SizeRemaining, Size

# If low on space, clean Docker
docker system prune -a --volumes
```

### Issue: Permission Denied
```powershell
# Run PowerShell as Administrator
# Then try again:
docker ps
```

---

## ✅ Verification

Once Docker is working:

```powershell
# 1. Build image
docker build -t patient-portal-api:dev .

# Should output:
# => exporting to image
# => naming to docker.io/library/patient-portal-api:dev
# => loads

# 2. Start environment
docker-compose -f docker-compose.dev.yml up -d

# Should output:
# Creating network patient-portal-network ...
# Creating patient-portal-db-dev ...
# Creating patient-portal-api-dev ...

# 3. Check containers
docker ps

# Should show both mssql and api containers as Up

# 4. Test API
Invoke-WebRequest http://localhost:8080/api/v1/health
```

---

## 📋 Complete Reset Procedure

If nothing works, try a complete reset:

```powershell
# 1. Stop all Docker services
docker-compose -f docker-compose.dev.yml down -v
docker-compose -f docker-compose.prod.yml down -v 2>$null

# 2. Remove all containers
docker container prune -af

# 3. Remove all images
docker image prune -af

# 4. Remove all volumes
docker volume prune -af

# 5. Restart Docker Desktop
# - Close Docker Desktop completely
# - Wait 10 seconds
# - Reopen Docker Desktop
# - Wait 2 minutes for startup

# 6. Verify connection
docker ps

# 7. Try again
./docker-manage.ps1 dev-start
```

---

## 🐛 If Still Not Working

### Check Docker Desktop Logs
```powershell
# Docker Desktop logs are usually at:
$logPath = "$env:APPDATA\Docker\log.txt"
Get-Content $logPath -Tail 50

# Or in Docker Desktop UI:
# Settings → Troubleshoot → View logs
```

### Reinstall Docker Desktop
```powershell
# Uninstall
# 1. Open Add/Remove Programs
# 2. Find "Docker Desktop"
# 3. Click "Uninstall"
# 4. Restart computer
# 5. Download and reinstall from docker.com

# Then:
./docker-manage.ps1 dev-start
```

---

## 📞 Docker Desktop Support

- [Docker Desktop for Windows Documentation](https://docs.docker.com/desktop/setup/install/windows-install/)
- [Docker Desktop Troubleshooting](https://docs.docker.com/desktop/troubleshoot/overview/)
- [WSL 2 Setup Guide](https://docs.docker.com/desktop/wsl/)

---

## ✨ Quick Commands Reference

```powershell
# Check Docker is running
docker ps

# Start development
./docker-manage.ps1 dev-start

# View logs
./docker-manage.ps1 dev-logs api

# Stop services
./docker-manage.ps1 dev-stop

# Complete reset
./docker-manage.ps1 clean-all
```

---

## Next Steps

1. ✅ Restart Docker Desktop
2. ✅ Run: `docker ps` to verify connection
3. ✅ Run: `./docker-manage.ps1 dev-start`
4. ✅ Wait 40 seconds for database startup
5. ✅ Access: http://localhost:8080/swagger
