import { randomUUID } from 'crypto';
import { Router } from 'express';
import { AppDataSource } from '../data-source';
import { ConversationHistory } from '../entities/ConversationHistory';
import { compilePrompt } from '../services/generateSpec';
import { PromptCompileRequestBody, PromptCompileResponse } from '../types';

const router = Router();

router.post('/compile-prompt', async (req, res) => {
  const { userText, sessionId } = req.body as PromptCompileRequestBody;
  if (!userText || typeof userText !== 'string' || !userText.trim()) {
    return res.status(400).json({ error: 'userText is required' });
  }

  const trimmed = userText.trim();
  const normalizedSessionId = (typeof sessionId === 'string' && sessionId.trim() ? sessionId.trim() : randomUUID()).slice(0, 64);
  const repository = AppDataSource.getRepository(ConversationHistory);
  const entry = repository.create({
    sessionId: normalizedSessionId,
    userInput: trimmed,
    aiResponse: null,
  });

  try {
    const savedEntry = await repository.save(entry);
    const result = await compilePrompt(trimmed);
    await repository.update(savedEntry.id, { aiResponse: result });
    const response: PromptCompileResponse = { ...result, sessionId: normalizedSessionId };
    return res.json(response);
  } catch (error: any) {
    const message = error?.message ?? 'Unknown error';
    const timestamp = new Date().toISOString();
    console.error(`[${timestamp}] compilePrompt failure: ${message}`);
    return res.status(500).json({ error: message });
  }
});

export default router;
