# syntax=docker/dockerfile:1

FROM node:18-alpine AS builder
WORKDIR /app

# copy both package.json and package-lock.json for deterministic installs
COPY backend/package.json ./
COPY backend/tsconfig.json ./tsconfig.json
COPY backend/src ./src

# use npm ci to get deterministic install (includes devDependencies for build)
RUN npm i
RUN npm run build

FROM node:18-alpine AS production
WORKDIR /app
ENV NODE_ENV=production

# copy lockfile and package.json from builder to ensure exact production install
COPY --from=builder /app/package.json ./

# install production deps only
RUN npm i --omit=dev && npm cache clean --force
COPY --from=builder /app/dist ./dist

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -G nodejs -u 1001

USER nodejs
EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost:8000/health || exit 1

CMD ["node", "dist/app.js"]
