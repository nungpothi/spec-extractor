import 'reflect-metadata';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import specUploadRouter from './routes/specUpload';
import { clientBuildPath } from './config/paths';
import { getAppDataSource } from './typeorm/dataSource';
import { logLlmStartup } from './services/llmProvider';

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 3001;

app.use(cors());
app.use(express.json());
// API routes
app.use(specUploadRouter);

// Serve React static build in production
app.use(express.static(clientBuildPath));
app.get('*', (req: Request, res: Response, next: NextFunction) => {
  if (req.path.startsWith('/api/')) return next();
  const indexPath = path.join(clientBuildPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    return res.sendFile(indexPath);
  }
  return next();
});

// Initialize DB then start server
getAppDataSource()
  .then(() => {
    logLlmStartup();
    app.listen(PORT, () => {
      const timestamp = new Date().toISOString();
      console.log(`[${timestamp}] Server listening on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    const timestamp = new Date().toISOString();
    console.error(`[${timestamp}] Failed to initialize database:`, err?.message || err);
    process.exit(1);
  });
