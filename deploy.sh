#!/bin/bash
# Deployment script for Self-Service Kiosk
# Usage: ./deploy.sh [environment]

set -e

ENVIRONMENT=${1:-production}
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "🚀 Deploying Self-Service Kiosk to $ENVIRONMENT environment..."

# Load environment variables
if [ -f "$SCRIPT_DIR/.env" ]; then
    source "$SCRIPT_DIR/.env"
fi

if [ -f "$SCRIPT_DIR/.env.$ENVIRONMENT" ]; then
    source "$SCRIPT_DIR/.env.$ENVIRONMENT"
fi

# Set defaults
REGISTRY=${REGISTRY:-registry.gitlab.com/givemebug/self-service-kiosk}
CONTAINER_NAME=${CONTAINER_NAME:-self-service-kiosk}
DOMAIN=${DOMAIN:-self-service-kiosk.givemebug.online}

echo "📋 Configuration:"
echo "  Environment: $ENVIRONMENT"
echo "  Registry: $REGISTRY"
echo "  Domain: $DOMAIN"
echo "  Container: $CONTAINER_NAME"
echo ""

# Build and push if in CI/CD or if requested
if [ "$CI" = "true" ] || [ "$2" = "--build" ]; then
    echo "🏗️  Building Docker image..."
    docker build -t "$REGISTRY:latest" -t "$REGISTRY:$ENVIRONMENT" .
    
    echo "📤 Pushing to registry..."
    docker push "$REGISTRY:latest"
    docker push "$REGISTRY:$ENVIRONMENT"
fi

# Deploy using docker-compose
echo "🚀 Deploying container..."
docker-compose pull
docker-compose up -d --remove-orphans

# Wait for health check
echo "⏳ Waiting for health check..."
sleep 10

# Verify deployment
if docker-compose ps | grep -q "Up.*healthy"; then
    echo "✅ Deployment successful!"
    echo "🌐 Application available at: https://$DOMAIN"
else
    echo "❌ Deployment failed - checking logs..."
    docker-compose logs --tail=50
    exit 1
fi

# Cleanup old images
echo "🧹 Cleaning up old images..."
docker image prune -f

echo "🎉 Deployment completed successfully!"