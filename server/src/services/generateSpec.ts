import { PromptCompileResult } from '../types';
import { extractJson } from '../utils/parseJson';

const PROMPT_TEMPLATE = `You are a software system designer.
Analyze the following user request and generate a structured system specification.
Input: "{{input}}"
Output JSON:
{
  "summary": "main objective in concise developer language",
  "uiMock": "<html or react code snippet for UI mock>",
  "apiSpec": "markdown table showing URL, Method, Header, Body, Response",
  "dbSchema": "markdown table showing table name, fields, types"
}`;

type Provider = 'openai' | 'openrouter' | 'ollama';

export async function compilePrompt(userText: string): Promise<PromptCompileResult> {
  const provider = resolveProvider();
  const prompt = PROMPT_TEMPLATE.replace('{{input}}', escapeForPrompt(userText));
  const raw = await dispatch(provider, prompt);
  return extractJson(raw);
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
        { role: 'system', content: 'You output JSON only.' },
        { role: 'user', content: prompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0,
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
        { role: 'system', content: 'You output JSON only.' },
        { role: 'user', content: prompt },
      ],
      temperature: 0,
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
        { role: 'system', content: 'You output JSON only.' },
        { role: 'user', content: prompt },
      ],
      stream: false,
      options: { temperature: 0 },
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
