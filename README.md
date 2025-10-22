# JSON Preview & Storage Tool

A full-stack web application that allows users to paste JSON specifications and dynamically preview their rendered output.

## Features

- Paste JSON and preview rendered HTML/Markdown
- Store specifications in PostgreSQL database
- Manage entries (view, copy, delete)
- Clean Architecture backend with TypeORM
- React frontend with TypeScript and Zustand

## Tech Stack

### Frontend
- React 18 + TypeScript
- Zustand for state management
- React Router DOM v6
- Tailwind CSS
- Axios for API calls

### Backend
- Node.js + TypeScript
- Express.js
- TypeORM
- PostgreSQL
- Clean Architecture pattern

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm 9+

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up PostgreSQL database:
   ```bash
   # Create database
   createdb json_preview_db
   
   # Import schema
   psql json_preview_db < database_schema.sql
   ```

4. Configure environment variables:
   ```bash
   cp backend/.env.example backend/.env
   # Update backend/.env with your database credentials
   ```

5. Build the applications:
   ```bash
   npm run build
   ```

6. Start development servers:
   ```bash
   npm run dev
   # OR use the automated script
   ./dev-start.sh
   ```

The frontend will be available at `http://localhost:3000` and the backend at `http://localhost:8000`.

## Project Structure

```
├── frontend/          # React TypeScript frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── stores/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── types/
│   │   ├── router.tsx
│   │   └── main.tsx
│   └── package.json
├── backend/           # Node.js TypeScript backend
│   ├── src/
│   │   ├── domain/
│   │   ├── usecases/
│   │   ├── infrastructure/
│   │   ├── interface/
│   │   └── app.ts
│   └── package.json
└── package.json       # Root workspace configuration
```

## API Endpoints

- `GET /api/specs` - Get all specifications
- `GET /api/specs/:id` - Get specific specification
- `POST /api/specs` - Create new specification
- `DELETE /api/specs/:id` - Delete specification
- `POST /api/preview` - Preview JSON without saving

## License

MIT