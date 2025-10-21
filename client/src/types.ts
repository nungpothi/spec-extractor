export interface PromptCompileResult {
  summary: string;
  uiMock: string;
  apiSpec: string;
  dbSchema: string;
}

export interface PromptCompileResponse extends PromptCompileResult {
  sessionId: string;
}

export type AssistantStatus = 'loading' | 'ready' | 'error';

export interface AssistantMessage {
  id: string;
  role: 'assistant';
  status: AssistantStatus;
  summary?: string;
  uiMock?: string;
  apiSpec?: string;
  dbSchema?: string;
  error?: string;
  createdAt: string;
}

export interface UserMessage {
  id: string;
  role: 'user';
  text: string;
  createdAt: string;
}

export type ChatEntry = UserMessage | AssistantMessage;
