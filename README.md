# Template Management System - Enhanced Edition

A complete CRUD system for managing generic items, built with React frontend and Node.js backend using Clean Architecture principles. **Now featuring beautiful pastel theme, dark mode, and responsive design!**

## ✨ **New Enhanced Features**

- 🎨 **Beautiful Pastel Theme** - Soft, pleasing color palette
- 🌙 **Dark Mode Support** - System preference detection with manual toggle
- 📱 **Fully Responsive** - Mobile-first design that works on all devices
- ⚡ **Smooth Animations** - Fade-in effects and smooth transitions
- ♿ **Accessibility Improved** - Better contrast, ARIA labels, keyboard navigation
- 🎭 **Modern UI/UX** - Card layouts, backdrop blur, enhanced shadows

## Features

- ✅ Full CRUD operations (Create, Read, Update, Delete)
- ✅ Real-time UI updates with Zustand state management
- ✅ Type-safe API with TypeScript
- ✅ Clean Architecture backend with proper separation of concerns
- ✅ PostgreSQL database with audit logging
- ✅ **NEW:** Responsive UI with pastel theme and dark mode
- ✅ Form validation with React Hook Form
- ✅ **NEW:** Enhanced animations and visual feedback

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Zustand** for state management
- **React Router DOM v6** for routing
- **React Hook Form** for form handling
- **Axios** for API calls
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Vite** for build tooling

### Backend
- **Node.js** with TypeScript
- **Express.js** web framework
- **TypeORM** for database ORM
- **PostgreSQL** database
- **Clean Architecture** with proper layer separation
- **Dependency Injection** pattern
- **Transaction support** for data consistency

### Database
- **PostgreSQL** with UUID primary keys
- **Audit trail** with template_logs table
- **Proper indexing** for performance
- **Auto-updating timestamps**

## Project Structure

```
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Route pages
│   │   ├── stores/         # Zustand stores
│   │   ├── services/       # API service layer
│   │   ├── types/          # TypeScript type definitions
│   │   ├── hooks/          # Custom React hooks
│   │   └── utils/          # Utility functions
│   └── package.json
├── backend/                 # Node.js backend
│   ├── src/
│   │   ├── domain/         # Domain entities and business rules
│   │   ├── usecases/       # Application business logic
│   │   ├── infrastructure/ # Database and external services
│   │   └── interface/      # HTTP controllers and routes
│   └── package.json
├── database/               # Database schema and migrations
└── package.json           # Root package for running both
```

## Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL 12+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd template-management-system
   ```

2. **Install all dependencies**
   ```bash
   npm run install:all
   ```

3. **Setup PostgreSQL Database**
   ```bash
   # Create database
   createdb template_management
   
   # Run schema
   psql -d template_management -f database/schema.sql
   ```

4. **Configure Environment Variables**
   ```bash
   # Backend
   cp backend/.env.example backend/.env
   # Edit backend/.env with your database credentials
   
   # Frontend  
   cp frontend/.env.example frontend/.env
   # Edit frontend/.env if needed
   ```

5. **Start Development Servers**
   ```bash
   npm run dev
   ```

   This will start:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - API Health Check: http://localhost:3001/health

## API Documentation

### Endpoints

| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/template/list` | Get all templates |
| GET | `/api/template/:id` | Get template by ID |
| POST | `/api/template/create` | Create new template |
| PUT | `/api/template/update/:id` | Update template |
| DELETE | `/api/template/delete/:id` | Delete template |

### Response Format

All API responses follow this format:
```json
{
  "default": {
    "status": true,
    "message": "success",
    "results": { /* data */ },
    "errors": []
  }
}
```

### Example API Usage

**Create Template:**
```bash
curl -X POST http://localhost:3001/api/template/create \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Sample Template",
    "description": "A sample template",
    "category": "General",
    "status": "active",
    "notes": "This is a test template"
  }'
```

## Development

### Running Tests
```bash
# Backend tests
cd backend && npm test

# Frontend tests  
cd frontend && npm test
```

### Building for Production
```bash
npm run build
```

### Database Migrations
```bash
cd backend
npm run migration:generate -- -n AddNewField
npm run migration:run
```

## Architecture Details

### Backend Clean Architecture

The backend follows Clean Architecture principles with clear separation of concerns:

1. **Domain Layer** (`src/domain/`)
   - Contains business entities and domain logic
   - Pure business rules with no external dependencies
   - Example: Template entity with business validation methods

2. **Use Cases Layer** (`src/usecases/`)
   - Application business logic
   - Orchestrates domain entities
   - Contains business rules specific to the application

3. **Infrastructure Layer** (`src/infrastructure/`)
   - Database repositories
   - External service implementations
   - Framework-specific code

4. **Interface Layer** (`src/interface/`)
   - HTTP controllers
   - Route definitions
   - Request/response handling

### Frontend Architecture

The frontend uses modern React patterns:

1. **Component-Based Architecture**
   - Reusable UI components
   - Props-based communication
   - Proper separation of concerns

2. **State Management with Zustand**
   - Centralized state management
   - Type-safe state updates
   - Automatic re-rendering

3. **Service Layer**
   - API communication abstraction
   - Error handling
   - Type-safe API calls

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
