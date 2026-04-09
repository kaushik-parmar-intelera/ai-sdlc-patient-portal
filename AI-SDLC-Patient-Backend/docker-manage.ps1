#!/usr/bin/env pwsh

<#
.SYNOPSIS
    Patient Portal Docker Management Script for Windows PowerShell

.DESCRIPTION
    Provides convenient commands for managing Docker development and production environments.

.EXAMPLE
    ./docker-manage.ps1 dev-start
    ./docker-manage.ps1 dev-logs api
    ./docker-manage.ps1 prod-build
#>

param(
    [Parameter(Position = 0)]
    [ValidateSet(
        'dev-start', 'dev-stop', 'dev-logs', 'dev-shell', 'dev-db-shell', 'dev-clean',
        'prod-build', 'prod-start', 'prod-stop', 'prod-logs', 'prod-clean',
        'migrate', 'health', 'ps', 'clean-all', 'help'
    )]
    [string]$Command,

    [Parameter(Position = 1)]
    [string]$Service = 'api'
)

$SCRIPT_DIR = Split-Path -Parent $MyInvocation.MyCommand.Path
$ENV_FILE = Join-Path $SCRIPT_DIR ".env"
$DEV_COMPOSE = Join-Path $SCRIPT_DIR "docker-compose.dev.yml"
$PROD_COMPOSE = Join-Path $SCRIPT_DIR "docker-compose.prod.yml"

function Print-Header {
    param([string]$Message)
    Write-Host "`n" -ForegroundColor Cyan
    Write-Host $Message -ForegroundColor Cyan -BackgroundColor Black
    Write-Host ("-" * $Message.Length) -ForegroundColor Cyan
}

function Print-Success {
    param([string]$Message)
    Write-Host $Message -ForegroundColor Green
}

function Print-Error {
    param([string]$Message)
    Write-Host $Message -ForegroundColor Red
}

function Print-Warning {
    param([string]$Message)
    Write-Host $Message -ForegroundColor Yellow
}

function Print-Info {
    param([string]$Message)
    Write-Host $Message -ForegroundColor Cyan
}

function Print-Usage {
    $usage = @"
Patient Portal Docker Management

Usage: $($MyInvocation.ScriptName) [COMMAND] [SERVICE]

Commands:
    $(Write-Host "dev-start" -ForegroundColor Green)       Start development environment
    $(Write-Host "dev-stop" -ForegroundColor Green)        Stop development environment
    $(Write-Host "dev-logs" -ForegroundColor Green)        View development logs (optional: [api|mssql])
    $(Write-Host "dev-shell" -ForegroundColor Green)       Access API container shell
    $(Write-Host "dev-db-shell" -ForegroundColor Green)    Access database container shell
    $(Write-Host "dev-clean" -ForegroundColor Green)       Clean development environment

    $(Write-Host "prod-build" -ForegroundColor Green)      Build production image
    $(Write-Host "prod-start" -ForegroundColor Green)      Start production environment
    $(Write-Host "prod-stop" -ForegroundColor Green)       Stop production environment
    $(Write-Host "prod-logs" -ForegroundColor Green)       View production logs
    $(Write-Host "prod-clean" -ForegroundColor Green)      Clean production environment

    $(Write-Host "migrate" -ForegroundColor Green)         Run database migrations
    $(Write-Host "health" -ForegroundColor Green)          Check service health
    $(Write-Host "ps" -ForegroundColor Green)              Show running containers
    $(Write-Host "clean-all" -ForegroundColor Green)       Clean all Docker resources
    $(Write-Host "help" -ForegroundColor Green)            Show this help message

Examples:
    ./$($MyInvocation.ScriptName) dev-start
    ./$($MyInvocation.ScriptName) dev-logs api
    ./$($MyInvocation.ScriptName) prod-build
    ./$($MyInvocation.ScriptName) migrate
"@
    Write-Host $usage
}

function Check-Docker {
    try {
        $null = docker --version 2>$null
        $null = docker-compose --version 2>$null
    }
    catch {
        Print-Error "Error: Docker is not installed or not in PATH"
        exit 1
    }
}

function Setup-Env {
    if (-not (Test-Path $ENV_FILE)) {
        if (Test-Path "$SCRIPT_DIR\.env.development") {
            Copy-Item "$SCRIPT_DIR\.env.development" $ENV_FILE
            Print-Success "Created .env from .env.development"
        }
        else {
            Print-Error "Error: No .env file found"
            exit 1
        }
    }
}

function Dev-Start {
    Print-Header "Starting Development Environment"
    Setup-Env
    & docker-compose -f $DEV_COMPOSE up -d
    Print-Success "Development environment started!"
    Print-Info "API: http://localhost:8080"
    Print-Info "Swagger: http://localhost:8080/swagger/index.html"
    Print-Info "Database: localhost,1433"
}

function Dev-Stop {
    Print-Header "Stopping Development Environment"
    & docker-compose -f $DEV_COMPOSE stop
    Print-Success "Development environment stopped"
}

function Dev-Logs {
    Print-Header "Showing $Service Logs"
    & docker-compose -f $DEV_COMPOSE logs -f $Service
}

function Dev-Shell {
    Print-Header "Accessing API Container Shell"
    & docker-compose -f $DEV_COMPOSE exec api powershell
}

function Dev-DbShell {
    Print-Header "Accessing Database Container Shell"
    & docker-compose -f $DEV_COMPOSE exec mssql powershell
}

function Dev-Clean {
    Print-Header "Cleaning Development Environment"
    $response = Read-Host "Remove volumes? (y/n)"
    if ($response -eq 'y' -or $response -eq 'Y') {
        & docker-compose -f $DEV_COMPOSE down -v
    }
    else {
        & docker-compose -f $DEV_COMPOSE down
    }
    Print-Success "Development environment cleaned"
}

function Prod-Build {
    Print-Header "Building Production Image"
    & docker build -t patient-portal-api:latest -t patient-portal-api:1.0.0 $SCRIPT_DIR
    Print-Success "Production image built successfully"
    & docker images | Select-String patient-portal-api
}

function Prod-Start {
    Print-Header "Starting Production Environment"
    
    if (-not (Test-Path "$SCRIPT_DIR\.env.production")) {
        Print-Error "Error: .env.production not found"
        exit 1
    }
    
    $imageExists = & docker image inspect patient-portal-api:latest 2>$null
    if (-not $imageExists) {
        Print-Warning "Image not found, building..."
        Prod-Build
    }
    
    & docker-compose -f $PROD_COMPOSE up -d
    Print-Success "Production environment started!"
    Print-Info "API: http://localhost:8080"
}

function Prod-Stop {
    Print-Header "Stopping Production Environment"
    & docker-compose -f $PROD_COMPOSE stop
    Print-Success "Production environment stopped"
}

function Prod-Logs {
    Print-Header "Showing $Service Logs"
    & docker-compose -f $PROD_COMPOSE logs -f $Service
}

function Prod-Clean {
    Print-Header "Cleaning Production Environment"
    & docker-compose -f $PROD_COMPOSE down
    Print-Success "Production environment cleaned"
}

function Run-Migrate {
    Print-Header "Running Database Migrations"
    & docker-compose -f $DEV_COMPOSE exec -T api `
        dotnet ef database update `
        --project PatientPortal.Infrastructure `
        --startup-project PatientPortal.Api
    Print-Success "Migrations completed"
}

function Check-Health {
    Print-Header "Checking Service Health"
    
    Print-Info "`nContainers:"
    & docker-compose -f $DEV_COMPOSE ps
    
    Print-Info "`nAPI Health:"
    try {
        $health = Invoke-RestMethod -Uri "http://localhost:8080/api/v1/health" -ErrorAction SilentlyContinue
        $health | ConvertTo-Json | Write-Host
    }
    catch {
        Print-Warning "API not responding"
    }
}

function Show-Ps {
    Print-Header "Running Containers"
    & docker-compose -f $DEV_COMPOSE ps
}

function Clean-All {
    Print-Header "Cleaning All Docker Resources"
    Print-Warning "WARNING: This will remove all Docker containers and volumes"
    $response = Read-Host "Are you sure? (y/n)"
    if ($response -eq 'y' -or $response -eq 'Y') {
        & docker system prune -a --volumes -f
        Print-Success "All Docker resources cleaned"
    }
}

# Main execution
Check-Docker

if ([string]::IsNullOrEmpty($Command)) {
    Print-Usage
    exit 0
}

switch ($Command) {
    'dev-start' { Dev-Start }
    'dev-stop' { Dev-Stop }
    'dev-logs' { Dev-Logs }
    'dev-shell' { Dev-Shell }
    'dev-db-shell' { Dev-DbShell }
    'dev-clean' { Dev-Clean }
    'prod-build' { Prod-Build }
    'prod-start' { Prod-Start }
    'prod-stop' { Prod-Stop }
    'prod-logs' { Prod-Logs }
    'prod-clean' { Prod-Clean }
    'migrate' { Run-Migrate }
    'health' { Check-Health }
    'ps' { Show-Ps }
    'clean-all' { Clean-All }
    'help' { Print-Usage }
    default { 
        Print-Error "Unknown command: $Command"
        Print-Usage
        exit 1
    }
}
