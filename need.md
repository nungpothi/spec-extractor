Add an automatic Excel spec analysis system into the existing Node.js + TypeScript backend.

Requirements:
## Overview
- The project already has an endpoint POST /api/spec/upload.
- After a file is uploaded, the backend must automatically analyze it using the AI agent extract-spec-excel and save results to PostgreSQL using TypeORM.

## Database
- Use PostgreSQL and TypeORM.
- Create entity named SpecAnalysis with fields:
  - id (uuid primary key)
  - uploadId (uuid)
  - projectId (string)
  - status (string) // 'processing', 'done', 'failed'
  - url (string, nullable)
  - method (string, nullable)
  - markdown (text, nullable)
  - jsonRaw (jsonb, nullable)
  - createdAt, updatedAt (timestamp)
- Add migration or auto-sync configuration.

## Logic flow
1. When POST /api/spec/upload is called:
   - Save the file to /data/uploads/specs/{uploadId}.xlsx
   - Create a SpecAnalysis record with:
     - uploadId, projectId, status = "processing"
   - Respond immediately with success JSON (as already implemented)
   - In background, call async function analyzeSpec(uploadId)

2. Implement analyzeSpec(uploadId):
   - Read the Excel file using 'exceljs'
   - Convert the sheet into JSON structure:
     {
       "sheetName": "search-leasing-owner",
       "columns": [...],
       "rows": [...]
     }
   - Call the AI agent extract-spec-excel by executing Codex CLI command:
     codex run extract-spec-excel --input ./data/uploads/specs/{uploadId}.json
     or equivalent internal call (mock for now)
   - Receive result: markdown + metadata (url, method, entity)
   - Update SpecAnalysis record:
     - status = "done"
     - url, method, markdown, jsonRaw = all returned values
   - If any error occurs:
     - status = "failed"
     - log the error message

3. File management:
   - After successful analysis, optionally move or delete the Excel file.
   - Keep result in DB for later retrieval.

## Example DB Record (after done)
{
  "uploadId": "8c5a1a3f-ef0f-4f76-a347-6b011b9a9f21",
  "projectId": "TEMP-PJ-001",
  "status": "done",
  "url": "/leasing-service/api/v1/search-leasing-owner",
  "method": "GET",
  "markdown": "### Header | parameter | ...",
  "jsonRaw": { "sheetName": "search-leasing-owner", "rows": [...] },
  "createdAt": "2025-10-20T10:00:00Z",
  "updatedAt": "2025-10-20T10:02:00Z"
}

## Technical notes
- Keep everything inside backend (no new worker service).
- Use async/await and proper error handling.
- Use TypeORM Repository pattern.
- Use English logs and messages.
- Ensure database connection config (env variables) is stored in `.env`:
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=postgres
DB_NAME=specdb

- Make sure to initialize TypeORM connection in server startup before routes.
- After implementation, the upload API should immediately trigger the background job and persist AI results to DB automatically.

Output only the complete backend TypeScript source code (no explanations).