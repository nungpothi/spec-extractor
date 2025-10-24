# Multi-stage build for Self-Service Kiosk UI
# Stage 1: Build the React application
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files first for better caching
COPY frontend/package*.json ./

# Install dependencies
RUN npm ci --silent

# Copy source code
COPY frontend/ .

# Set build-time environment variables
ARG VITE_API_BASE_URL=http://spec-extractor-app-api.givemebug.online/api
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

# Build the application
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Install curl for health checks
RUN apk add --no-cache curl

# Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

# Copy built application from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf.default 2>/dev/null || true

# Create nginx user and set permissions
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

# Add health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

# Expose port 80
EXPOSE 80

# Add labels for better container management
LABEL maintainer="givemebug"
LABEL version="1.0"
LABEL description="Self-Service Kiosk UI - Pastel Minimal Theme"
LABEL domain="self-service-kiosk.givemebug.online"

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
