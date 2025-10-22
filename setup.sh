#!/bin/bash

# Setup script for JSON Preview & Storage Tool

set -e

echo "🚀 Setting up JSON Preview & Storage Tool..."

# Check Node.js version
NODE_VERSION=$(node --version)
echo "Node.js version: $NODE_VERSION"

# Check if PostgreSQL is running
if command -v psql &> /dev/null; then
    echo "✅ PostgreSQL is available"
else
    echo "❌ PostgreSQL is not installed or not in PATH"
    echo "Please install PostgreSQL before continuing"
    exit 1
fi

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend && npm install && cd ..

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend && npm install && cd ..

# Create .env file if it doesn't exist
if [ ! -f backend/.env ]; then
    echo "📄 Creating backend .env file..."
    cp backend/.env.example backend/.env
    echo "Please update backend/.env with your database credentials"
fi

# Create database if it doesn't exist (optional)
echo "🗄️  Database setup:"
echo "1. Make sure PostgreSQL is running"
echo "2. Create a database named 'json_preview_db'"
echo "3. Update backend/.env with your database credentials"
echo "4. Run: cd backend && npm run migration:run"

echo ""
echo "✅ Setup complete!"
echo ""
echo "To start development:"
echo "1. Update backend/.env with your database settings"
echo "2. Run database migrations: cd backend && npm run migration:run"
echo "3. Start development servers: npm run dev"
echo ""
echo "The frontend will be available at: http://localhost:3000"
echo "The backend will be available at: http://localhost:8000"