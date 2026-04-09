#!/bin/bash

# Patient Portal Docker Setup Script
# This script provides quick commands for Docker operations

set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ENV_FILE="${SCRIPT_DIR}/.env"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_usage() {
    cat << EOF
${BLUE}Patient Portal Docker Management${NC}

Usage: $0 [COMMAND] [OPTIONS]

Commands:
    ${GREEN}dev-start${NC}       Start development environment
    ${GREEN}dev-stop${NC}        Stop development environment
    ${GREEN}dev-logs${NC}        View development logs
    ${GREEN}dev-shell${NC}       Access API container shell
    ${GREEN}dev-db-shell${NC}    Access database container shell
    ${GREEN}dev-clean${NC}       Clean development environment and volumes

    ${GREEN}prod-build${NC}      Build production image
    ${GREEN}prod-start${NC}      Start production environment
    ${GREEN}prod-stop${NC}       Stop production environment
    ${GREEN}prod-logs${NC}       View production logs
    ${GREEN}prod-clean${NC}      Clean production environment

    ${GREEN}migrate${NC}         Run database migrations
    ${GREEN}health${NC}          Check service health
    ${GREEN}ps${NC}              Show running containers
    ${GREEN}clean-all${NC}       Clean all Docker resources

Examples:
    $0 dev-start
    $0 dev-logs
    $0 prod-build
    $0 migrate
EOF
}

check_docker() {
    if ! command -v docker &> /dev/null; then
        echo -e "${RED}Error: Docker is not installed or not in PATH${NC}"
        exit 1
    fi
    if ! command -v docker-compose &> /dev/null; then
        echo -e "${RED}Error: Docker Compose is not installed or not in PATH${NC}"
        exit 1
    fi
}

setup_env() {
    if [ ! -f "$ENV_FILE" ]; then
        if [ -f "${SCRIPT_DIR}/.env.development" ]; then
            cp "${SCRIPT_DIR}/.env.development" "$ENV_FILE"
            echo -e "${GREEN}Created .env from .env.development${NC}"
        else
            echo -e "${RED}Error: No .env file found${NC}"
            exit 1
        fi
    fi
}

dev_start() {
    echo -e "${BLUE}Starting development environment...${NC}"
    setup_env
    docker-compose -f "${SCRIPT_DIR}/docker-compose.dev.yml" up -d
    echo -e "${GREEN}Development environment started!${NC}"
    echo -e "${YELLOW}API: http://localhost:8080${NC}"
    echo -e "${YELLOW}Swagger: http://localhost:8080/swagger/index.html${NC}"
    echo -e "${YELLOW}Database: localhost,1433${NC}"
}

dev_stop() {
    echo -e "${BLUE}Stopping development environment...${NC}"
    docker-compose -f "${SCRIPT_DIR}/docker-compose.dev.yml" stop
    echo -e "${GREEN}Development environment stopped${NC}"
}

dev_logs() {
    SERVICE="${2:-api}"
    echo -e "${BLUE}Showing ${SERVICE} logs...${NC}"
    docker-compose -f "${SCRIPT_DIR}/docker-compose.dev.yml" logs -f "$SERVICE"
}

dev_shell() {
    echo -e "${BLUE}Accessing API container shell...${NC}"
    docker-compose -f "${SCRIPT_DIR}/docker-compose.dev.yml" exec api /bin/bash
}

dev_db_shell() {
    echo -e "${BLUE}Accessing database container shell...${NC}"
    docker-compose -f "${SCRIPT_DIR}/docker-compose.dev.yml" exec mssql /bin/bash
}

dev_clean() {
    echo -e "${YELLOW}Cleaning development environment...${NC}"
    read -p "Remove volumes? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        docker-compose -f "${SCRIPT_DIR}/docker-compose.dev.yml" down -v
    else
        docker-compose -f "${SCRIPT_DIR}/docker-compose.dev.yml" down
    fi
    echo -e "${GREEN}Development environment cleaned${NC}"
}

prod_build() {
    echo -e "${BLUE}Building production image...${NC}"
    docker build -t patient-portal-api:latest -t patient-portal-api:1.0.0 "${SCRIPT_DIR}"
    echo -e "${GREEN}Production image built successfully${NC}"
    docker images | grep patient-portal-api
}

prod_start() {
    echo -e "${BLUE}Starting production environment...${NC}"
    
    if [ ! -f "${SCRIPT_DIR}/.env.production" ]; then
        echo -e "${RED}Error: .env.production not found${NC}"
        exit 1
    fi
    
    if ! docker image inspect patient-portal-api:latest > /dev/null 2>&1; then
        echo -e "${YELLOW}Image not found, building...${NC}"
        prod_build
    fi
    
    docker-compose -f "${SCRIPT_DIR}/docker-compose.prod.yml" up -d
    echo -e "${GREEN}Production environment started!${NC}"
    echo -e "${YELLOW}API: http://localhost:8080${NC}"
}

prod_stop() {
    echo -e "${BLUE}Stopping production environment...${NC}"
    docker-compose -f "${SCRIPT_DIR}/docker-compose.prod.yml" stop
    echo -e "${GREEN}Production environment stopped${NC}"
}

prod_logs() {
    SERVICE="${2:-api}"
    echo -e "${BLUE}Showing ${SERVICE} logs...${NC}"
    docker-compose -f "${SCRIPT_DIR}/docker-compose.prod.yml" logs -f "$SERVICE"
}

prod_clean() {
    echo -e "${YELLOW}Cleaning production environment...${NC}"
    docker-compose -f "${SCRIPT_DIR}/docker-compose.prod.yml" down
    echo -e "${GREEN}Production environment cleaned${NC}"
}

migrate() {
    echo -e "${BLUE}Running database migrations...${NC}"
    docker-compose -f "${SCRIPT_DIR}/docker-compose.dev.yml" exec -T api \
        dotnet ef database update \
        --project PatientPortal.Infrastructure \
        --startup-project PatientPortal.Api
    echo -e "${GREEN}Migrations completed${NC}"
}

check_health() {
    echo -e "${BLUE}Checking service health...${NC}"
    echo -e "${YELLOW}Containers:${NC}"
    docker-compose -f "${SCRIPT_DIR}/docker-compose.dev.yml" ps
    echo ""
    echo -e "${YELLOW}API Health:${NC}"
    curl -s http://localhost:8080/api/v1/health | jq . || echo "API not responding"
}

show_ps() {
    echo -e "${BLUE}Running containers:${NC}"
    docker-compose -f "${SCRIPT_DIR}/docker-compose.dev.yml" ps
}

clean_all() {
    echo -e "${RED}WARNING: This will remove all Docker containers and volumes${NC}"
    read -p "Are you sure? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        docker system prune -a --volumes -f
        echo -e "${GREEN}All Docker resources cleaned${NC}"
    fi
}

# Main script
check_docker

if [ $# -eq 0 ]; then
    print_usage
    exit 1
fi

case "$1" in
    dev-start)
        dev_start
        ;;
    dev-stop)
        dev_stop
        ;;
    dev-logs)
        dev_logs "$@"
        ;;
    dev-shell)
        dev_shell
        ;;
    dev-db-shell)
        dev_db_shell
        ;;
    dev-clean)
        dev_clean
        ;;
    prod-build)
        prod_build
        ;;
    prod-start)
        prod_start
        ;;
    prod-stop)
        prod_stop
        ;;
    prod-logs)
        prod_logs "$@"
        ;;
    prod-clean)
        prod_clean
        ;;
    migrate)
        migrate
        ;;
    health)
        check_health
        ;;
    ps)
        show_ps
        ;;
    clean-all)
        clean_all
        ;;
    *)
        echo -e "${RED}Unknown command: $1${NC}"
        print_usage
        exit 1
        ;;
esac
