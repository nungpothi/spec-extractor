# Development Guide

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm 9+

### Setup
1. Run the setup script:
   ```bash
   ./setup.sh
   ```

2. Configure database:
   ```bash
   # Create database
   createdb json_preview_db
   
   # Update backend/.env with your database credentials
   cp backend/.env.example backend/.env
   ```

3. Run migrations:
   ```bash
   cd backend && npm run migration:run
   ```

4. Start development servers:
   ```bash
   npm run dev
   ```

## Architecture

### Frontend (React + TypeScript + Zustand)
```
frontend/src/
├── components/     # Reusable UI components
├── pages/         # Page components
├── stores/        # Zustand stores
├── hooks/         # Custom React hooks
├── services/      # API service layer
├── types/         # TypeScript type definitions
├── router.tsx     # React Router configuration
└── main.tsx       # Application entry point
```

### Backend (Node.js + TypeScript + Clean Architecture)
```
backend/src/
├── domain/        # Domain entities and business rules
│   ├── entities/
│   ├── repositories/
│   └── valueObjects/
├── usecases/      # Business logic
│   ├── dto/
│   ├── specs/
│   └── preview/
├── infrastructure/    # External dependencies
│   ├── database/
│   └── repositories/
└── interface/     # HTTP controllers and routes
    ├── controllers/
    ├── middleware/
    └── routes/
```

## Development Workflow

### Frontend Development
```bash
cd frontend
npm run dev        # Start development server
npm run build      # Build for production
npm run lint       # Run ESLint
```

### Backend Development
```bash
cd backend
npm run dev        # Start development server with hot reload
npm run build      # Build TypeScript
npm start          # Start production server
```

### Database Management
```bash
cd backend
npm run migration:generate -- -n MigrationName  # Generate migration
npm run migration:run                           # Run migrations
npm run migration:revert                        # Revert last migration
npm run schema:sync                             # Sync schema (dev only)
```

## API Documentation

### Endpoints

#### GET /api/specs
Get all specifications
- Response: `{ status: boolean, message: string, results: SpecSummary[], errors: string[] }`

#### GET /api/specs/:id
Get specific specification
- Response: `{ status: boolean, message: string, results: SpecDetail[], errors: string[] }`

#### POST /api/specs
Create new specification
- Body: `{ json_data: object }`
- Response: `{ status: boolean, message: string, results: { id: string }[], errors: string[] }`

#### DELETE /api/specs/:id
Delete specification
- Response: `{ status: boolean, message: string, results: [], errors: string[] }`

#### POST /api/preview
Preview JSON without saving
- Body: `{ json_data: object }`
- Response: `{ status: boolean, message: string, results: { html: string }[], errors: string[] }`

## Deployment

### Docker Deployment
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Manual Deployment
1. Build frontend:
   ```bash
   cd frontend && npm run build
   ```

2. Build backend:
   ```bash
   cd backend && npm run build
   ```

3. Set environment variables
4. Run migrations
5. Start services

## Testing

### Frontend Testing
```bash
cd frontend
npm test           # Run unit tests
npm run test:e2e   # Run e2e tests (if configured)
```

### Backend Testing
```bash
cd backend
npm test           # Run unit tests
npm run test:integration  # Run integration tests (if configured)
```

## Code Style

### Frontend
- Use TypeScript strict mode
- Follow React functional component patterns
- Use Zustand for state management
- Implement proper error boundaries
- Use custom hooks for business logic

### Backend
- Follow Clean Architecture principles
- Use dependency injection
- Implement proper error handling
- Use transactions for database operations
- Write descriptive commit messages

## Environment Variables

### Backend (.env)
```env
NODE_ENV=development
PORT=8000
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=json_preview_db
JWT_SECRET=your-secret-key
CORS_ORIGIN=http://localhost:3000
```

## Troubleshooting

### Common Issues

1. **Database connection failed**
   - Check PostgreSQL is running
   - Verify database credentials in .env
   - Ensure database exists

2. **CORS errors**
   - Update CORS_ORIGIN in backend .env
   - Check frontend proxy configuration

3. **Migration errors**
   - Check database permissions
   - Verify connection string
   - Run migrations manually

4. **Build errors**
   - Clear node_modules and reinstall
   - Check TypeScript configuration
   - Verify dependency versions

### Performance Tips

1. **Frontend**
   - Use React.memo for expensive components
   - Implement proper pagination
   - Optimize bundle size with tree shaking

2. **Backend**
   - Use database indexes
   - Implement proper caching
   - Monitor query performance

3. **Database**
   - Regular VACUUM and ANALYZE
   - Monitor connection pool
   - Use appropriate data types