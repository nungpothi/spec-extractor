import 'reflect-metadata';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import specUploadRouter from './routes/specUpload';
import healthRouter from './routes/health';
import { clientBuildPath } from './config/paths';
import { getAppDataSource } from './typeorm/dataSource';
import { logLlmStartup } from './services/llmProvider';
import { verifyOllamaAtStartup } from './services/ollamaModels';

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 3001;

app.use(cors());
app.use(express.json());
// API routes
app.use(specUploadRouter);
app.use(healthRouter);

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
async function start() {
  try {
    await getAppDataSource();
    logLlmStartup();
    await verifyOllamaAtStartup();
    app.listen(PORT, () => {
      const timestamp = new Date().toISOString();
      console.log(`[${timestamp}] Server listening on http://localhost:${PORT}`);
    });
  } catch (err: any) {
    const timestamp = new Date().toISOString();
    const msg = err?.message || err;
    console.error(`[${timestamp}] Startup error: ${msg}`);
    process.exit(1);
  }
}

start();
