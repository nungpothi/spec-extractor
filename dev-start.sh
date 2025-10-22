#!/bin/bash

# Quick development start script

set -e

echo "🚀 Starting JSON Preview & Storage Tool Development Environment..."

# Check if .env exists
if [ ! -f backend/.env ]; then
    echo "📄 Creating backend .env file..."
    cp backend/.env.example backend/.env
    echo "⚠️  Please update backend/.env with your database credentials before continuing"
    echo "   Example PostgreSQL setup:"
    echo "   DB_HOST=localhost"
    echo "   DB_PORT=5432"
    echo "   DB_USERNAME=postgres"
    echo "   DB_PASSWORD=postgres"
    echo "   DB_DATABASE=json_preview_db"
    echo ""
    echo "   Press Enter to continue after updating .env..."
    read
fi

echo "🔍 Checking database connection..."
# Basic check if PostgreSQL is accessible
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL client (psql) not found. Please install PostgreSQL."
    exit 1
fi

echo "📦 Installing dependencies..."
npm install

echo "🏗️  Building applications..."
npm run build

echo "🌐 Starting development servers..."
echo "Frontend will be available at: http://localhost:3000"
echo "Backend will be available at: http://localhost:8000"
echo ""
echo "Press Ctrl+C to stop both servers"

npm run dev