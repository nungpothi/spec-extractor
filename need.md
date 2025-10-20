Create a full-stack project in Node.js + TypeScript + React for uploading Excel spec files.

Requirements:
## Backend
- Framework: Express + TypeScript
- Endpoint: POST /api/spec/upload
- Accept multipart/form-data with fields:
  - file: Excel file (.xlsx or .xls)
  - projectId: optional string (use "TEMP-PJ-001" by default)
- Save uploaded file to /data/uploads/specs/{uploadId}.xlsx
- Generate UUID for uploadId
- Trigger async mock job startSpecAnalysis(uploadId)
- Respond immediately with:
  {
    "success": true,
    "uploadId": "uuid",
    "projectId": "TEMP-PJ-001",
    "message": "File received and processing started."
  }
- Validate file type (xlsx, xls only)
- Return 400 JSON if invalid file
- Log timestamp, filename, and uploadId
- Serve React build statically from /client/build
- Project uses TypeScript configuration for both backend and frontend

## Frontend (React + TypeScript)
- Framework: React + Vite or Create React App (TypeScript template)
- Theme: pastel color palette (soft background, rounded card, minimal)
- Use SweetAlert2 for success/error popups
- Components:
  - UploadForm.tsx:
    - file input
    - upload button
    - optional projectId field (default “TEMP-PJ-001”)
    - on submit: POST to /api/spec/upload
    - show SweetAlert2 success or error message
  - Simple progress placeholder (can be extended to realtime later)
- Display a centered card layout with pastel theme:
  - light pink/blue gradient background
  - white rounded card
  - “Upload Spec File” title
  - small footer note “Powered by Codex AI Spec Analyzer”
- Ensure the frontend can run in dev mode (React dev server) or be built and served by Express in production.

## General
- TypeScript everywhere
- npm scripts:
  - `dev` to run backend and frontend concurrently (using concurrently or turbo)
  - `build` to build frontend then start backend
- Folder structure:
/server
/src
index.ts
routes/specUpload.ts
/client
/src
components/UploadForm.tsx

- Use English only for UI and messages
- Make code clean and modular for future feature expansion

Output only the complete project source code (both backend and frontend folders) — no explanation.
