import { spawnCollect } from '../utils/process';
import { loadEnv } from '../utils/env';

export type LlmGenerateArgs = {
  systemPrompt?: string;
  userPrompt: string;
};

export type LlmGenerateResult = {
  text: string;
  provider: 'ollama' | 'openai' | 'openrouter';
  model: string;
  fallback?: boolean;
};

export function logLlmStartup() {
  const env = loadEnv();
  if (env.LLM_PROVIDER === 'ollama') {
    console.log(`[LLM] Provider=ollama, model=${env.LLM_MODEL}`);
  } else if (env.LLM_PROVIDER === 'openrouter') {
    const model = env.OPENROUTER_MODEL || 'openai/gpt-4o-mini';
    console.log(`[LLM] Using provider: openrouter (model: ${model})`);
  } else {
    console.log('[LLM] Provider=openai');
  }
}

export async function llmGenerate({ systemPrompt, userPrompt }: LlmGenerateArgs): Promise<LlmGenerateResult> {
  const env = loadEnv();
  const prompt = buildPrompt(systemPrompt, userPrompt);

  if (env.LLM_PROVIDER === 'ollama') {
    try {
      const out = await runOllama(prompt, env.LLM_MODEL);
      return { text: out, provider: 'ollama', model: env.LLM_MODEL };
    } catch (err: any) {
      const msg = err?.message || String(err);
      const timestamp = new Date().toISOString();
      console.error(`[${timestamp}] Ollama failed, falling back to OpenAI: ${msg}`);
      const text = await runOpenAI(prompt);
      return { text, provider: 'openai', model: 'openai', fallback: true };
    }
  }

  if (env.LLM_PROVIDER === 'openrouter') {
    const text = await runOpenRouter(systemPrompt, userPrompt);
    const model = env.OPENROUTER_MODEL || 'openai/gpt-4o-mini';
    return { text, provider: 'openrouter', model };
  }

  const text = await runOpenAI(prompt);
  return { text, provider: 'openai', model: 'openai' };
}

function buildPrompt(systemPrompt: string | undefined, userPrompt: string) {
  if (!systemPrompt) return userPrompt;
  return `System:\n${systemPrompt}\n\nUser:\n${userPrompt}`;
}

async function runOllama(prompt: string, model: string): Promise<string> {
  const args: string[] = ['run', model, prompt];

  const output = await spawnCollect('ollama', args);

  const lower = output.stderr.toLowerCase();
  const likelyInsufficientVram = /out of memory|insufficient|cuda|cublas|no cuda|oom/.test(lower);
  const modelMissing = /not found|no such file|pull the model|unknown model/.test(lower);

  if (output.code !== 0 || likelyInsufficientVram || modelMissing) {
    const reason = likelyInsufficientVram ? 'GPU VRAM insufficient' : modelMissing ? 'model not found' : `exit ${output.code}`;
    throw new Error(`Ollama run failed: ${reason}. stderr=${output.stderr}`);
  }

  const text = output.stdout.trim();
  if (!text) throw new Error('Empty response from Ollama');
  return text;
}

async function runOpenAI(prompt: string): Promise<string> {
  const env = loadEnv();
  if (!env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY not set; cannot use OpenAI fallback');
  }

  const body = {
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: 'You are a helpful assistant.' },
      { role: 'user', content: prompt },
    ],
    temperature: 0.2,
  };

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`OpenAI API error: ${res.status} ${res.statusText} - ${errText}`);
  }
  const data: any = await res.json();
  const content = data?.choices?.[0]?.message?.content?.trim();
  if (!content) throw new Error('OpenAI returned empty content');
  return content;
}

async function runOpenRouter(systemPrompt: string | undefined, userPrompt: string): Promise<string> {
  const env = loadEnv();
  const apiKey = env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY not set; cannot use OpenRouter');
  }
  const baseUrl = env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1/chat/completions';
  const model = env.OPENROUTER_MODEL || 'openai/gpt-4o-mini';

  const messages: Array<{ role: 'system' | 'user'; content: string }> = [];
  if (systemPrompt && systemPrompt.trim()) {
    messages.push({ role: 'system', content: systemPrompt });
  }
  messages.push({ role: 'user', content: userPrompt });

  const body = {
    model,
    messages,
  };

  const res = await fetch(baseUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://your-app.localhost',
      'X-Title': 'Spec Extractor',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const reason = await res.text().catch(() => res.statusText);
    const ts = new Date().toISOString();
    console.error(`[${ts}] OpenRouter request failed: ${res.status} ${res.statusText} - ${reason}`);
    throw new Error(`OpenRouter API error: ${res.status} ${res.statusText}`);
  }

  const data: any = await res.json();
  const content = data?.choices?.[0]?.message?.content?.trim();
  if (!content) throw new Error('OpenRouter returned empty content');
  return content;
}

// spawnCollect moved to ../utils/process
