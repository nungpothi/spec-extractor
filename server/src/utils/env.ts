import dotenv from 'dotenv';

type Env = {
  DB_HOST: string;
  DB_PORT: string;
  DB_USER: string;
  DB_PASS: string;
  DB_NAME: string;
  LLM_PROVIDER: string;
  LLM_MODEL: string;
  LLM_MODEL_PATH: string;
  LLM_QUANTIZE: string;
  OPENAI_API_KEY?: string;
  // OpenRouter
  OPENROUTER_API_KEY?: string;
  OPENROUTER_MODEL?: string;
  OPENROUTER_BASE_URL?: string;
};

let cachedEnv: Env | null = null;

export function loadEnv(): Env {
  if (cachedEnv) return cachedEnv;
  dotenv.config();
  cachedEnv = {
    DB_HOST: process.env.DB_HOST || 'localhost',
    DB_PORT: process.env.DB_PORT || '5432',
    DB_USER: process.env.DB_USER || 'postgres',
    DB_PASS: process.env.DB_PASS || 'postgres',
    DB_NAME: process.env.DB_NAME || 'specdb',
    LLM_PROVIDER: process.env.LLM_PROVIDER || 'ollama',
    LLM_MODEL: process.env.LLM_MODEL || 'llama3:8b',
    // Do not assume any local filesystem path by default
    LLM_MODEL_PATH: process.env.LLM_MODEL_PATH || '',
    LLM_QUANTIZE: process.env.LLM_QUANTIZE || 'Q4',
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    // OpenRouter
    OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY,
    OPENROUTER_MODEL: process.env.OPENROUTER_MODEL,
    OPENROUTER_BASE_URL: process.env.OPENROUTER_BASE_URL,
  };
  return cachedEnv;
}
