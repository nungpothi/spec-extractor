import { PromptCompileResult } from '../types';

export function extractJson(text: string): PromptCompileResult {
  const blockMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = blockMatch ? blockMatch[1] : text;
  const trimmed = candidate.trim();
  let parsed: unknown;

  try {
    parsed = JSON.parse(trimmed);
  } catch (err) {
    throw new Error('Unable to parse model response as JSON');
  }

  if (!isPromptCompileResult(parsed)) {
    throw new Error('Model response missing required fields');
  }

  return {
    summary: parsed.summary,
    uiMock: parsed.uiMock,
    apiSpec: parsed.apiSpec,
    dbSchema: parsed.dbSchema,
  };
}

function isPromptCompileResult(value: unknown): value is PromptCompileResult {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.summary === 'string' &&
    typeof candidate.uiMock === 'string' &&
    typeof candidate.apiSpec === 'string' &&
    typeof candidate.dbSchema === 'string'
  );
}
