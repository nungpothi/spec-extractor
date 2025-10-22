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
   npm run install:all
   ```

3. Set up PostgreSQL database
4. Configure environment variables (see .env.example)
5. Run migrations:
   ```bash
   cd backend && npm run migration:run
   ```

6. Start development servers:
   ```bash
   npm run dev
   ```

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