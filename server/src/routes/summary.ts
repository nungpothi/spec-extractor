import { Router } from 'express';
import { AppDataSource } from '../data-source';
import { ConversationHistory } from '../entities/ConversationHistory';
import { generateSummary } from '../services/generateSummary';
import { SummaryResponse } from '../types';

const router = Router();

router.get('/summary/:sessionId', async (req, res) => {
  const { sessionId } = req.params;
  
  if (!sessionId || typeof sessionId !== 'string' || !sessionId.trim()) {
    return res.status(400).json({ error: 'sessionId is required' });
  }

  const normalizedSessionId = sessionId.trim().slice(0, 64);
  const repository = AppDataSource.getRepository(ConversationHistory);

  try {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [INFO] Summarizing session ${normalizedSessionId.slice(0, 8)}...`);

    const conversations = await repository.find({
      where: { sessionId: normalizedSessionId },
      order: { createdAt: 'ASC' },
    });

    if (conversations.length === 0) {
      return res.status(404).json({ error: 'No conversation found for this session' });
    }

    console.log(`[${timestamp}] [INFO] Summarizing session ${normalizedSessionId.slice(0, 8)}... – ${conversations.length} messages aggregated.`);

    let combinedText = '';
    for (const conversation of conversations) {
      combinedText += `User: ${conversation.userInput}\n\n`;
      if (conversation.aiResponse) {
        const response = conversation.aiResponse;
        combinedText += `Assistant: Summary: ${response.summary}\n`;
        combinedText += `UI Mock: ${response.uiMock}\n`;
        combinedText += `API Spec: ${response.apiSpec}\n`;
        combinedText += `DB Schema: ${response.dbSchema}\n\n`;
      }
    }

    const summary = await generateSummary(combinedText);
    const response: SummaryResponse = { summaryText: summary.summaryText };
    
    return res.json(response);
  } catch (error: any) {
    const message = error?.message ?? 'Unknown error';
    const timestamp = new Date().toISOString();
    console.error(`[${timestamp}] Summary generation failure for session ${normalizedSessionId.slice(0, 8)}: ${message}`);
    return res.status(500).json({ error: message });
  }
});

export default router;