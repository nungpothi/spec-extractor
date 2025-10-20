import { Router, Request, Response } from 'express';
import { loadEnv } from '../utils/env';
import { isSelectedModelAvailable } from '../services/ollamaModels';

const router = Router();

router.get('/health/llm', async (_req: Request, res: Response) => {
  try {
    const env = loadEnv();
    let available = true;
    if (env.LLM_PROVIDER === 'ollama') {
      const result = await isSelectedModelAvailable();
      available = result.available;
    }
    return res.json({ provider: env.LLM_PROVIDER, model: env.LLM_MODEL, available });
  } catch {
    const env = loadEnv();
    return res.json({ provider: env.LLM_PROVIDER, model: env.LLM_MODEL, available: false });
  }
});

export default router;

