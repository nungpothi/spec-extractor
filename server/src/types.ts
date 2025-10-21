export interface PromptCompileRequestBody {
  userText: string;
  previousContext?: PromptCompileResult;
}

export interface PromptCompileResult {
  summary: string;
  uiMock: string;
  apiSpec: string;
  dbSchema: string;
}
