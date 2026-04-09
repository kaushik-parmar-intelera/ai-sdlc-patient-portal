# 🚀 Docker Connection Fix - Action Guide

## The Problem
```
error during connect: Get "http://%2F%2F.%2Fpipe%2FdockerDesktopLinuxEngine": 
The system cannot find the file specified.
```

**Translation**: Docker Desktop is not running or not accessible.

---

## ✅ Quick Fix (3 Steps)

### Step 1: Check If Docker Desktop is Running
```powershell
# Look at system tray (bottom right of screen)
# You should see a Docker whale icon

# Or run this command:
docker ps
```

If you see an error, continue to Step 2.

### Step 2: Restart Docker Desktop
```powershell
# Option 1: Via UI
# - Click the whale icon in system tray
# - Click "Quit Docker Desktop"
# - Wait for it to close
# - Click Docker Desktop again to restart
# - Wait 2 minutes for startup

# Option 2: Via PowerShell
Stop-Service com.docker.service -Force 2>$null
Start-Sleep -Seconds 3
Start-Service com.docker.service 2>$null
Start-Sleep -Seconds 60
```

### Step 3: Verify and Run
```powershell
# Verify Docker is working
docker ps

# Should show output with CONTAINER ID, IMAGE, STATUS, etc.

# Then start the environment
./docker-manage.ps1 dev-start

# Wait 30-40 seconds
# Then access: http://localhost:8080/swagger
```

---

## 🔍 If That Doesn't Work

### Run the Diagnostic Script
```powershell
./docker-diagnose.ps1

# Shows:
# ✅ Docker CLI
# ✅ Docker Compose  
# ✅ Docker Daemon
# ✅ Disk Space
# etc.
```

### Check Docker Status
```powershell
# Check if daemon is running
Get-Service -Name "Docker Desktop" 2>$null

# Check system events for Docker errors
Get-EventLog -LogName System -Source Docker -Newest 10 2>$null
```

### Completely Reset Docker
```powershell
# 1. Stop everything
docker-compose -f docker-compose.dev.yml down -v 2>$null

# 2. Clean up
docker system prune -af

# 3. Restart Docker Desktop
# - Find Docker Desktop in Start menu
# - Right-click → More → Run as Administrator
# - Click Quit Docker Desktop
# - Wait 10 seconds
# - Open Docker Desktop again
# - Wait 2 minutes

# 4. Verify connection
docker ps

# 5. Try again
./docker-manage.ps1 dev-start
```

---

## 🆘 If Still Not Working

### Option 1: Reinstall Docker Desktop

**Download**: https://www.docker.com/products/docker-desktop

```powershell
# 1. Uninstall
Settings → Apps → Apps & features → Search "Docker" → Uninstall

# 2. Restart computer

# 3. Install the latest Docker Desktop

# 4. Follow setup wizard

# 5. Restart computer again

# 6. Try again
./docker-manage.ps1 dev-start
```

### Option 2: Check WSL2 (if using Windows)

Docker on Windows uses WSL2. If it's not set up:

```powershell
# Check WSL
wsl --list --verbose

# Should show Ubuntu or similar with VERSION 2

# If not installed, install WSL2:
wsl --install

# Restart and try again
```

### Option 3: Check Event Viewer for Errors

```powershell
# Open Event Viewer
eventvwr

# Look in:
# Windows Logs → System → Source: Docker

# Copy any errors and search online for solutions
```

---

## 📋 Verification Checklist

- [ ] Docker Desktop installed
- [ ] Docker Desktop running (whale icon visible in tray)
- [ ] `docker ps` returns container list (not error)
- [ ] `docker-compose --version` shows version
- [ ] `docker build --help` works
- [ ] At least 10GB free disk space
- [ ] All compose files exist (docker-compose.dev.yml, etc.)

---

## 📞 Quick Reference

| Problem | Command | Solution |
|---------|---------|----------|
| Docker not running | `docker ps` | Restart Docker Desktop |
| Can't find images | `docker images` | Build: `docker build -t patient-portal-api:dev .` |
| Port 8080 in use | `netstat -ano \| findstr :8080` | Change port or kill process |
| Network issues | `docker network ls` | Recreate: `docker network create patient-portal-network` |
| No disk space | `Get-Volume` | Clean: `docker system prune -af` |

---

## 🎯 Once Docker is Working

```powershell
# 1. Start environment
./docker-manage.ps1 dev-start

# 2. Wait 30-40 seconds

# 3. Access Swagger
# Browser: http://localhost:8080/swagger/index.html

# 4. Login with test account
# Email: admin@patient-portal.com
# Password: Admin@123

# 5. Get JWT token from login endpoint

# 6. Click "Authorize" in Swagger
# Enter: Bearer <YOUR_TOKEN>

# 7. Test protected endpoints
```

---

## 💡 Tips

- **First startup takes 1-2 minutes** (database initialization)
- **Subsequent startups take 30-45 seconds**
- **Hot reload works** - edit code and changes appear in <5 seconds
- **Database persists** - data remains between restarts

---

## ✨ You're Ready When...

✅ `docker ps` shows no errors  
✅ `docker-compose --version` shows 2.0.0+  
✅ Docker Desktop icon shows in system tray  
✅ Computer has 10GB+ free disk space  

Then: **`./docker-manage.ps1 dev-start`**

---

**Still stuck? See: `DOCKER_TROUBLESHOOTING_CONNECTION.md`**
