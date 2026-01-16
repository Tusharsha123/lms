#!/bin/bash

# LMS Coding Platform - Setup Script
# This script automates the initial setup of the platform

echo "🚀 LMS Coding Platform - Setup Script"
echo "======================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install it first."
    exit 1
fi

echo "✅ Node.js is installed"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed"
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local from .env.example"
    cp .env.example .env.local
    
    echo "⚠️  Please update .env.local with your settings:"
    echo "   - DATABASE_URL"
    echo "   - NEXTAUTH_SECRET"
    echo "   - OAuth credentials (if using)"
    echo ""
    
    echo "Press Enter once you've updated .env.local..."
    read
fi

# Generate Prisma Client
echo "🔧 Generating Prisma Client..."
npm run prisma:generate

if [ $? -ne 0 ]; then
    echo "❌ Failed to generate Prisma Client"
    exit 1
fi

echo "✅ Prisma Client generated"
echo ""

# Run migrations
echo "🗄️  Running database migrations..."
npm run prisma:migrate

if [ $? -ne 0 ]; then
    echo "❌ Failed to run migrations"
    exit 1
fi

echo "✅ Database migrations completed"
echo ""

echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Run 'npm run dev' to start the development server"
echo "2. Visit http://localhost:3000"
echo "3. Create your first account and start teaching!"
echo ""
