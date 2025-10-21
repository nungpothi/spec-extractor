export interface PromptCompileResult {
  summary: string;
  uiMock: string;
  apiSpec: string;
  dbSchema: string;
}

type InstructionStatus = 'ready' | 'pending';

export interface InstructionItem {
  id: string;
  text: string;
  status: InstructionStatus;
}
