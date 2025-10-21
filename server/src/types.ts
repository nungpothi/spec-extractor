export interface PromptCompileRequestBody {
  userText: string;
  sessionId?: string;
}

export interface PromptCompileResult {
  summary: string;
  uiMock: string;
  apiSpec: string;
  dbSchema: string;
}

export interface PromptCompileResponse extends PromptCompileResult {
  sessionId: string;
}

export interface SummaryResponse {
  summaryText: string;
}
