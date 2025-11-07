#!/bin/bash

echo "🎯 Marketing Strategy Bot - Starting Services"
echo "=============================================="
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Error: Docker is not running. Please start Docker first."
    exit 1
fi

# Check if .env files exist
if [ ! -f "./backend/.env" ]; then
    echo "⚠️  Warning: backend/.env not found. Using defaults."
fi

if [ ! -f "./frontend/.env" ]; then
    echo "⚠️  Warning: frontend/.env not found. Creating one..."
    echo "VITE_API_URL=http://localhost:3001/api" > ./frontend/.env
fi

echo "📦 Starting Docker containers..."
echo ""

# Start services
docker-compose up -d

echo ""
echo "⏳ Waiting for services to be ready..."
sleep 5

# Check if services are running
if docker-compose ps | grep -q "Up"; then
    echo ""
    echo "✅ Services started successfully!"
    echo ""
    echo "🔗 Access the application:"
    echo "   Frontend:  http://localhost:5173"
    echo "   Backend:   http://localhost:3001"
    echo "   Database:  postgresql://user:password@localhost:5432/marketing_strategy_bot"
    echo ""
    echo "📋 Useful commands:"
    echo "   View logs:        docker-compose logs -f"
    echo "   Stop services:    docker-compose down"
    echo "   Restart:          docker-compose restart"
    echo ""
else
    echo ""
    echo "❌ Failed to start services. Check logs with:"
    echo "   docker-compose logs"
fi
