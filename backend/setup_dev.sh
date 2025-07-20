#!/bin/bash

# Development Setup Script for PrepNexus
# This follows production best practices for local development

set -e

echo "🚀 Setting up PrepNexus Development Environment"
echo "================================================"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    echo "   Visit: https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    echo "   Visit: https://docs.docker.com/compose/install/"
    exit 1
fi

echo "✅ Docker and Docker Compose are available"

# Create .env file for local development
if [ ! -f .env ]; then
    echo "📝 Creating .env file for local development..."
    cat > .env << EOF
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=prepnexus
DB_USER=postgres
DB_PASSWORD=postgres

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379

# Application Configuration
ENVIRONMENT=development
DEBUG=true
LOG_LEVEL=INFO

# Security (change in production)
SECRET_KEY=dev-secret-key-change-in-production
EOF
    echo "✅ .env file created"
else
    echo "✅ .env file already exists"
fi

# Start PostgreSQL and Redis with Docker Compose
echo "🐳 Starting PostgreSQL and Redis containers..."
docker-compose up -d postgres redis

# Wait for services to be healthy
echo "⏳ Waiting for services to be ready..."
timeout=60
counter=0

while [ $counter -lt $timeout ]; do
    if docker-compose ps | grep -q "healthy"; then
        echo "✅ Services are healthy"
        break
    fi
    echo "   Waiting... ($counter/$timeout)"
    sleep 2
    counter=$((counter + 2))
done

if [ $counter -eq $timeout ]; then
    echo "❌ Services failed to start within $timeout seconds"
    docker-compose logs
    exit 1
fi

# Install Python dependencies
echo "📦 Installing Python dependencies..."
if [ ! -d "venv" ]; then
    echo "   Creating virtual environment..."
    python3 -m venv venv
fi

source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt

# Test database connection
echo "🔍 Testing database connection..."
python3 -c "
import asyncio
import os
from core.production_database import db

async def test_connection():
    try:
        await db.initialize()
        result = await db.fetchval('SELECT 1')
        print('✅ Database connection successful')
        await db.close()
    except Exception as e:
        print(f'❌ Database connection failed: {e}')
        exit(1)

asyncio.run(test_connection())
"

echo ""
echo "🎉 Development environment setup complete!"
echo ""
echo "📋 Next steps:"
echo "   1. Start the application:"
echo "      source venv/bin/activate"
echo "      uvicorn main:app --reload --host 0.0.0.0 --port 8000"
echo ""
echo "   2. Access the application:"
echo "      http://localhost:8000"
echo ""
echo "   3. View API documentation:"
echo "      http://localhost:8000/docs"
echo ""
echo "   4. Stop services when done:"
echo "      docker-compose down"
echo ""
echo "🔧 Development tools:"
echo "   - PostgreSQL: localhost:5432 (user: postgres, password: postgres)"
echo "   - Redis: localhost:6379"
echo "   - Database: prepnexus"
echo ""
echo "📊 Monitoring:"
echo "   - Health check: http://localhost:8000/health"
echo "   - Database health: http://localhost:8000/api/monitoring/database/health" 