# Self-Service Kiosk Deployment
# Production-ready deployment automation for UI-only prototype

# Variables
REGISTRY = registry.gitlab.com/givemebug/self-service-kiosk
TAG = latest
CONTAINER_NAME = self-service-kiosk
SERVICE_NAME = kiosk-ui

# Default target
.PHONY: help
help:
	@echo "Self-Service Kiosk Deployment Commands:"
	@echo "  build     - Build Docker image locally"
	@echo "  push      - Push image to GitLab registry"
	@echo "  deploy    - Pull latest image and restart container"
	@echo "  logs      - View container logs"
	@echo "  stop      - Stop the container"
	@echo "  clean     - Remove container and image"
	@echo "  status    - Check container status"
	@echo ""
	@echo "Quick deployment: make build push deploy"

# Build Docker image
.PHONY: build
build:
	@echo "🏗️  Building Self-Service Kiosk image..."
	docker build -t $(REGISTRY):$(TAG) -t $(REGISTRY):dev .
	@echo "✅ Build completed: $(REGISTRY):$(TAG)"

# Push to GitLab registry
.PHONY: push
push:
	@echo "📤 Pushing to GitLab registry..."
	docker push $(REGISTRY):$(TAG)
	docker push $(REGISTRY):dev
	@echo "✅ Push completed"

# Deploy/restart container with local build
.PHONY: deploy
deploy:
	@echo "🚀 Building and deploying Self-Service Kiosk locally..."
	docker-compose up -d --build --remove-orphans
	@echo "✅ Deployment completed"
	@echo "🌐 Available at: http://localhost"

# Deploy using pre-built image from registry
.PHONY: deploy-registry
deploy-registry:
	@echo "🚀 Deploying Self-Service Kiosk from registry..."
	docker-compose pull
	docker-compose up -d --remove-orphans
	@echo "✅ Deployment completed"
	@echo "🌐 Available at: https://self-service-kiosk.givemebug.online"

# View logs
.PHONY: logs
logs:
	docker-compose logs -f $(SERVICE_NAME)

# Stop container
.PHONY: stop
stop:
	@echo "⏹️  Stopping container..."
	docker-compose stop
	@echo "✅ Container stopped"

# Clean up
.PHONY: clean
clean:
	@echo "🧹 Cleaning up..."
	docker-compose down --rmi local --volumes
	docker image prune -f
	@echo "✅ Cleanup completed"

# Check status
.PHONY: status
status:
	@echo "📊 Container Status:"
	docker-compose ps
	@echo ""
	@echo "📊 Image Info:"
	docker images | grep $(REGISTRY) || echo "No images found"

# Full deployment pipeline (local build)
.PHONY: pipeline
pipeline: build deploy
	@echo "🎉 Full deployment pipeline completed!"
	@echo "🌐 Available at: http://localhost"

# Full deployment pipeline (registry)
.PHONY: pipeline-registry
pipeline-registry: build push deploy-registry
	@echo "🎉 Full deployment pipeline completed!"
	@echo "🌐 Available at: https://self-service-kiosk.givemebug.online"

# Development helpers
.PHONY: dev-build
dev-build:
	@echo "🔧 Building for development..."
	cd frontend && npm install && npm run build
	@echo "✅ Development build completed"

.PHONY: dev-serve
dev-serve:
	@echo "🔧 Starting development server..."
	cd frontend && npm run dev