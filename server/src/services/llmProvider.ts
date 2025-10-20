import { spawn } from 'child_process';
import { loadEnv } from '../utils/env';

export type LlmGenerateArgs = {
  systemPrompt?: string;
  userPrompt: string;
};

export type LlmGenerateResult = {
  text: string;
  provider: 'ollama' | 'openai';
  model: string;
  fallback?: boolean;
};

export function logLlmStartup() {
  const env = loadEnv();
  if (env.LLM_PROVIDER === 'ollama') {
    console.log(`[LLM] Using local model ${env.LLM_MODEL} from path ${env.LLM_MODEL_PATH} (quantize=${env.LLM_QUANTIZE})`);
  } else {
    console.log('[LLM] Falling back to OpenAI');
  }
}

export async function llmGenerate({ systemPrompt, userPrompt }: LlmGenerateArgs): Promise<LlmGenerateResult> {
  const env = loadEnv();
  const prompt = buildPrompt(systemPrompt, userPrompt);

  if (env.LLM_PROVIDER === 'ollama') {
    try {
      const out = await runOllama(prompt, env.LLM_MODEL, env.LLM_MODEL_PATH, env.LLM_QUANTIZE);
      return { text: out, provider: 'ollama', model: env.LLM_MODEL };
    } catch (err: any) {
      const msg = err?.message || String(err);
      const timestamp = new Date().toISOString();
      console.error(`[${timestamp}] Ollama failed, falling back to OpenAI: ${msg}`);
      const text = await runOpenAI(prompt);
      return { text, provider: 'openai', model: 'openai', fallback: true };
    }
  }

  const text = await runOpenAI(prompt);
  return { text, provider: 'openai', model: 'openai' };
}

function buildPrompt(systemPrompt: string | undefined, userPrompt: string) {
  if (!systemPrompt) return userPrompt;
  return `System:\n${systemPrompt}\n\nUser:\n${userPrompt}`;
}

async function runOllama(prompt: string, model: string, modelPath?: string, quantize?: string): Promise<string> {
  const args: string[] = ['run', model];
  if (modelPath) {
    args.push('--model-path', modelPath);
  }
  if (quantize) {
    args.push('--quantize', quantize);
  }
  args.push(prompt);

  const output = await spawnCollect('ollama', args, { timeoutMs: 120000 });

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

function spawnCollect(cmd: string, args: string[], opts?: { timeoutMs?: number }): Promise<{ code: number; stdout: string; stderr: string }> {
  return new Promise((resolve) => {
    const child = spawn(cmd, args, { shell: false });
    let stdout = '';
    let stderr = '';
    let finished = false;
    const timeout = opts?.timeoutMs ? setTimeout(() => {
      if (finished) return;
      finished = true;
      try { child.kill('SIGKILL'); } catch {}
      resolve({ code: 124, stdout, stderr: stderr + '\n[timeout]' });
    }, opts.timeoutMs) : null;

    child.stdout.on('data', (d) => { stdout += d.toString(); });
    child.stderr.on('data', (d) => { stderr += d.toString(); });
    child.on('error', (e) => {
      if (finished) return;
      finished = true;
      if (timeout) clearTimeout(timeout);
      resolve({ code: 127, stdout, stderr: e?.message || String(e) });
    });
    child.on('close', (code) => {
      if (finished) return;
      finished = true;
      if (timeout) clearTimeout(timeout);
      resolve({ code: code ?? 0, stdout, stderr });
    });
  });
}

