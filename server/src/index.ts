import fs from 'fs';
import path from 'path';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeDataSource } from './data-source';
import compilePromptRouter from './routes/compilePrompt';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT ?? 3001);

app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.use('/api', compilePromptRouter);

const clientBuildPath = path.resolve(__dirname, '../../client/dist');
if (fs.existsSync(clientBuildPath)) {
  app.use(express.static(clientBuildPath));
  app.get('*', (req, res) => {
    if (req.path.startsWith('/api/')) {
      return res.status(404).json({ error: 'Not found' });
    }
    return res.sendFile(path.join(clientBuildPath, 'index.html'));
  });
}

async function bootstrap() {
  try {
    await initializeDataSource();
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] Database connection established`);
  } catch (error) {
    const timestamp = new Date().toISOString();
    console.error(`[${timestamp}] Failed to initialize data source`, error);
    process.exit(1);
  }

  app.listen(PORT, () => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] Prompt Compiler backend listening on http://localhost:${PORT}`);
  });
}

bootstrap();
