import { loadEnv } from '../utils/env';
import { spawnCollect } from '../utils/process';

export type OllamaModelInfo = {
  name: string;
  size: string;
  modified: string;
};

function parseJsonLines(input: string): OllamaModelInfo[] {
  const models: OllamaModelInfo[] = [];
  const lines = input.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  for (const line of lines) {
    try {
      const obj = JSON.parse(line);
      const name = obj?.name || '';
      if (!name) continue;
      const size = (obj?.size || obj?.['size'] || '').toString();
      const modified = (
        obj?.modified_at || obj?.modified || obj?.last_modified_at || obj?.last_modified || obj?.updated_at || ''
      ).toString();
      models.push({ name, size, modified });
    } catch {
      // ignore malformed line
    }
  }
  return models;
}

function parseTable(input: string): OllamaModelInfo[] {
  const models: OllamaModelInfo[] = [];
  const lines = input.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  if (lines.length === 0) return models;
  // Skip header if present (e.g., NAME ID SIZE MODIFIED)
  const dataLines = lines[0].toUpperCase().startsWith('NAME') ? lines.slice(1) : lines;
  for (const ln of dataLines) {
    // Expected columns: name, id, size, modified (modified may contain spaces)
    const parts = ln.split(/\s+/);
    if (parts.length < 3) continue;
    const name = parts[0];
    const id = parts[1] || '';
    const size = parts[2] || '';
    const modified = parts.slice(3).join(' ');
    const sizeStr = size || '';
    models.push({ name, size: sizeStr, modified });
  }
  return models;
}

export async function listOllamaModels(): Promise<OllamaModelInfo[]> {
  // Try JSON format first
  const jsonRes = await spawnCollect('ollama', ['list', '--format', 'json'], { timeoutMs: 8000 });
  if (jsonRes.code === 0 && jsonRes.stdout.trim()) {
    const parsed = parseJsonLines(jsonRes.stdout);
    if (parsed.length > 0) return parsed;
  }
  // Fallback to table parsing
  const tabRes = await spawnCollect('ollama', ['list'], { timeoutMs: 8000 });
  if (tabRes.code === 0 && tabRes.stdout.trim()) {
    return parseTable(tabRes.stdout);
  }
  return [];
}

export async function isSelectedModelAvailable(): Promise<{ available: boolean; models: OllamaModelInfo[] }> {
  const env = loadEnv();
  if (env.LLM_PROVIDER !== 'ollama') {
    return { available: true, models: [] };
  }
  const models = await listOllamaModels();
  const found = models.some((m) => m.name === env.LLM_MODEL);
  return { available: found, models };
}

export async function verifyOllamaAtStartup(): Promise<void> {
  const env = loadEnv();
  if (env.LLM_PROVIDER !== 'ollama') {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] LLM provider set to '${env.LLM_PROVIDER}'. Skipping local model checks.`);
    return;
  }

  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] Detecting installed Ollama models...`);
  const { available, models } = await isSelectedModelAvailable();

  if (models.length > 0) {
    console.log(`[${timestamp}] Available Ollama models (${models.length}):`);
    for (const m of models) {
      const mod = m.modified ? `, modified=${m.modified}` : '';
      const size = m.size ? m.size : 'unknown size';
      console.log(`- ${m.name} (${size}${mod})`);
    }
  } else {
    console.log(`[${timestamp}] No Ollama models found. You can pull one with: ollama pull llama3:8b`);
  }

  if (!available) {
    const warnTs = new Date().toISOString();
    console.error(`[${warnTs}] Selected model '${env.LLM_MODEL}' is not installed. Please pull it with: ollama pull ${env.LLM_MODEL}`);
    throw new Error(`Required Ollama model '${env.LLM_MODEL}' not found`);
  }
}
