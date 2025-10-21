import { Router } from 'express';
import { compilePrompt } from '../services/generateSpec';
import { PromptCompileRequestBody } from '../types';

const router = Router();

router.post('/compile-prompt', async (req, res) => {
  const { userText, previousContext } = req.body as PromptCompileRequestBody;

  if (!userText || typeof userText !== 'string' || !userText.trim()) {
    return res.status(400).json({ error: 'userText is required' });
  }

  try {
    const result = await compilePrompt(userText, previousContext);
    return res.json(result);
  } catch (error: any) {
    const message = error?.message ?? 'Unknown error';
    const timestamp = new Date().toISOString();
    console.error(`[${timestamp}] compilePrompt failure: ${message}`);
    return res.status(500).json({ error: message });
  }
});

export default router;
