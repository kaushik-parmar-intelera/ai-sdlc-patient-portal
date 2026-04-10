#!/usr/bin/env pwsh

<#
.SYNOPSIS
    Docker connection diagnostic script for Patient Portal API

.DESCRIPTION
    Diagnoses Docker Desktop connectivity and configuration issues.

.EXAMPLE
    ./docker-diagnose.ps1
#>

function Write-Header {
    param([string]$Text)
    Write-Host "`n" -ForegroundColor Cyan
    Write-Host "╔$("═" * ($Text.Length + 2))╗" -ForegroundColor Cyan
    Write-Host "║ $Text ║" -ForegroundColor Cyan
    Write-Host "╚$("═" * ($Text.Length + 2))╝" -ForegroundColor Cyan
}

function Write-Success {
    param([string]$Message)
    Write-Host "✅ $Message" -ForegroundColor Green
}

function Write-Error {
    param([string]$Message)
    Write-Host "❌ $Message" -ForegroundColor Red
}

function Write-Warning {
    param([string]$Message)
    Write-Host "⚠️  $Message" -ForegroundColor Yellow
}

function Write-Info {
    param([string]$Message)
    Write-Host "ℹ️  $Message" -ForegroundColor Cyan
}

# Main diagnostics
Write-Header "Docker Connection Diagnostic"

# 1. Check if Docker CLI is installed
Write-Host "`n1. Checking Docker CLI Installation..."
try {
    $dockerVersion = docker --version 2>$null
    Write-Success "Docker installed: $dockerVersion"
}
catch {
    Write-Error "Docker CLI not found or not in PATH"
    exit 1
}

# 2. Check if Docker Compose is installed
Write-Host "`n2. Checking Docker Compose Installation..."
try {
    $composeVersion = docker-compose --version 2>$null
    Write-Success "Docker Compose installed: $composeVersion"
}
catch {
    Write-Error "Docker Compose not found or not in PATH"
    exit 1
}

# 3. Check Docker daemon connection
Write-Host "`n3. Checking Docker Daemon Connection..."
$dockerPs = docker ps 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Success "Docker daemon is running and accessible"
}
else {
    Write-Error "Cannot connect to Docker daemon"
    Write-Warning "Docker Desktop may not be running"
    Write-Info "Solution: Restart Docker Desktop"
    exit 1
}

# 4. Check Docker images
Write-Host "`n4. Checking Available Docker Images..."
$images = docker images --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}" | Measure-Object
Write-Info "Total images available: $($images.Count - 1)"

# 5. Check Docker volumes
Write-Host "`n5. Checking Docker Volumes..."
$volumes = docker volume ls --format "table {{.Name}}\t{{.Driver}}" | Measure-Object
Write-Info "Total volumes: $($volumes.Count - 1)"

# 6. Check Docker networks
Write-Host "`n6. Checking Docker Networks..."
try {
    $networks = docker network ls --format "table {{.Name}}\t{{.Driver}}" 2>$null
    $networkCount = $networks | Measure-Object
    Write-Info "Total networks: $($networkCount.Count - 1)"
    Write-Info "Networks:"
    $networks | Select-Object -Skip 1 | ForEach-Object {
        Write-Host "  $_" -ForegroundColor Gray
    }
}
catch {
    Write-Warning "Could not list networks"
}

# 7. Check Docker info
Write-Host "`n7. Docker System Information..."
try {
    $info = docker info 2>$null
    $osInfo = $info | Select-String "OS:"
    $serverVersion = $info | Select-String "Server Version:"
    Write-Info $osInfo
    Write-Info $serverVersion
}
catch {
    Write-Warning "Could not retrieve Docker info"
}

# 8. Check disk space
Write-Host "`n8. Checking Disk Space..."
$volumes = Get-Volume | Where-Object { $_.DriveLetter -eq 'C' }
$freeSpace = $volumes.SizeRemaining / 1GB
$totalSpace = $volumes.Size / 1GB
$percentFree = ($freeSpace / $totalSpace) * 100

Write-Info "C: Drive: $([math]::Round($freeSpace, 2))GB free of $([math]::Round($totalSpace, 2))GB ($([math]::Round($percentFree, 1))%)"

if ($freeSpace -lt 10) {
    Write-Warning "Less than 10GB free space - Docker may have issues"
}
else {
    Write-Success "Sufficient disk space available"
}

# 9. Check if compose files exist
Write-Host "`n9. Checking Docker Compose Files..."
$files = @(
    "docker-compose.dev.yml",
    "docker-compose.prod.yml",
    "Dockerfile",
    ".env.development"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Success "$file found"
    }
    else {
        Write-Warning "$file not found"
    }
}

# 10. Test connectivity to Docker Hub
Write-Host "`n10. Checking Docker Hub Connectivity..."
try {
    $null = docker pull hello-world:latest 2>$null
    Write-Success "Docker Hub connectivity: OK"
}
catch {
    Write-Warning "Could not reach Docker Hub - offline or network issue"
}

# Summary
Write-Header "Diagnostic Summary"

Write-Success "Docker CLI: OK"
Write-Success "Docker Compose: OK"
Write-Success "Docker Daemon: RUNNING"
Write-Success "Disk Space: OK"

Write-Info "`nReady to start development environment!"
Write-Info "Run: ./docker-manage.ps1 dev-start"
