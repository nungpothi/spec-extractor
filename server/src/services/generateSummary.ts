import { SummaryResponse } from '../types';

const SUMMARY_PROMPT_TEMPLATE = `You are a summarization assistant.
Summarize the conversation below into a clear, concise developer-oriented overview.
Emphasize what was designed, requested, and generated (UI, API, DB, etc).
Keep it short, structured, and easy to read.

Conversation:
{{conversation}}`;

type Provider = 'openai' | 'openrouter' | 'ollama';

export async function generateSummary(conversationText: string): Promise<SummaryResponse> {
  const provider = resolveProvider();
  const prompt = SUMMARY_PROMPT_TEMPLATE.replace('{{conversation}}', escapeForPrompt(conversationText));
  const raw = await dispatch(provider, prompt);
  
  return { summaryText: raw.trim() };
}

function resolveProvider(): Provider {
  const explicit = process.env.LLM_PROVIDER?.toLowerCase();
  if (explicit === 'openai' || explicit === 'openrouter' || explicit === 'ollama') {
    return explicit;
  }
  if (process.env.OPENAI_API_KEY) return 'openai';
  if (process.env.OPENROUTER_API_KEY) return 'openrouter';
  return 'ollama';
}

function escapeForPrompt(value: string): string {
  return value
    .trim()
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n');
}

async function dispatch(provider: Provider, prompt: string): Promise<string> {
  if (provider === 'openai') {
    return callOpenAI(prompt);
  }
  if (provider === 'openrouter') {
    return callOpenRouter(prompt);
  }
  return callOllama(prompt);
}

async function callOpenAI(prompt: string): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is required for OpenAI provider');
  }
  const model = process.env.OPENAI_MODEL ?? 'gpt-4o-mini';

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: 'You are a helpful summarization assistant. Provide clear, concise summaries.' },
        { role: 'user', content: prompt },
      ],
      temperature: 0.3,
    }),
  });

  if (!response.ok) {
    const message = await safeReadError(response);
    throw new Error(`OpenAI request failed: ${response.status} ${message}`);
  }

  const data: any = await response.json();
  const content = data?.choices?.[0]?.message?.content;
  if (!content || typeof content !== 'string') {
    throw new Error('OpenAI response missing content');
  }
  return content;
}

async function callOpenRouter(prompt: string): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY is required for OpenRouter provider');
  }
  const model = process.env.OPENROUTER_MODEL ?? 'anthropic/claude-3.5-sonnet';
  const site = process.env.OPENROUTER_SITE_URL;
  const appName = process.env.OPENROUTER_APP_NAME ?? 'Prompt Compiler';

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${apiKey}`,
    'X-Title': appName,
  };
  if (site) {
    headers['X-Referer'] = site;
  }

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: 'You are a helpful summarization assistant. Provide clear, concise summaries.' },
        { role: 'user', content: prompt },
      ],
      temperature: 0.3,
    }),
  });

  if (!response.ok) {
    const message = await safeReadError(response);
    throw new Error(`OpenRouter request failed: ${response.status} ${message}`);
  }

  const data: any = await response.json();
  const content = data?.choices?.[0]?.message?.content;
  if (!content || typeof content !== 'string') {
    throw new Error('OpenRouter response missing content');
  }
  return content;
}

async function callOllama(prompt: string): Promise<string> {
  const model = process.env.OLLAMA_MODEL ?? 'llama3.1';
  const endpoint = process.env.OLLAMA_ENDPOINT ?? 'http://127.0.0.1:11434';

  const response = await fetch(`${endpoint.replace(/\/$/, '')}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: 'You are a helpful summarization assistant. Provide clear, concise summaries.' },
        { role: 'user', content: prompt },
      ],
      stream: false,
      options: { temperature: 0.3 },
    }),
  });

  if (!response.ok) {
    const message = await safeReadError(response);
    throw new Error(`Ollama request failed: ${response.status} ${message}`);
  }

  const data: any = await response.json();
  const content = data?.message?.content;
  if (!content || typeof content !== 'string') {
    throw new Error('Ollama response missing content');
  }
  return content;
}

async function safeReadError(response: globalThis.Response): Promise<string> {
  try {
    const text = await response.text();
    return text.slice(0, 4000);
  } catch (err) {
    return 'Unable to read error body';
  }
}