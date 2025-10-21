import { useEffect, useRef, useState } from 'react';
import ChatInput from './components/ChatInput.js';
import ChatList from './components/ChatList.js';
import SummaryButton from './components/SummaryButton.js';
import {
  AssistantMessage,
  ChatEntry,
  PromptCompileResponse,
  UserMessage,
} from './types.js';

const SESSION_STORAGE_KEY = 'prompt-compiler:session-id';

async function requestSpecification(
  payload: { userText: string; sessionId?: string }
): Promise<PromptCompileResponse> {
  const body: Record<string, unknown> = { userText: payload.userText };
  if (payload.sessionId) {
    body.sessionId = payload.sessionId;
  }

  const response = await fetch('/api/compile-prompt', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    let message = 'Failed to generate specification.';
    try {
      const errorBody = (await response.json()) as { error?: string };
      if (errorBody?.error && typeof errorBody.error === 'string') {
        message = errorBody.error.trim() || message;
      }
    } catch (parseError) {
      console.warn('Failed to parse error response', parseError);
    }
    throw new Error(message);
  }

  const data = (await response.json()) as PromptCompileResponse;
  return data;
}

function readPersistedSession(): string | undefined {
  if (typeof window === 'undefined') {
    return undefined;
  }
  try {
    return window.localStorage.getItem(SESSION_STORAGE_KEY) ?? undefined;
  } catch (error) {
    console.warn('Unable to read session id from storage', error);
    return undefined;
  }
}

function persistSession(sessionId: string) {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    window.localStorage.setItem(SESSION_STORAGE_KEY, sessionId);
  } catch (error) {
    console.warn('Unable to persist session id', error);
  }
}

export default function App() {
  const [messages, setMessages] = useState<ChatEntry[]>([]);
  const [draft, setDraft] = useState('');
  const [sessionId, setSessionId] = useState<string | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const endOfFeedRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setSessionId(readPersistedSession());
  }, []);

  useEffect(() => {
    endOfFeedRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async () => {
    const trimmed = draft.trim();
    if (!trimmed || isSubmitting) {
      return;
    }

    setDraft('');
    setIsSubmitting(true);

    const timestamp = new Date().toISOString();
    const userMessage: UserMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      text: trimmed,
      createdAt: timestamp,
    };
    const pendingId = crypto.randomUUID();
    const pendingAssistant: AssistantMessage = {
      id: pendingId,
      role: 'assistant',
      status: 'loading',
      createdAt: timestamp,
    };

    setMessages((prev) => [...prev, userMessage, pendingAssistant]);

    try {
      const response = await requestSpecification({ userText: trimmed, sessionId });
      if (!sessionId || sessionId !== response.sessionId) {
        setSessionId(response.sessionId);
        persistSession(response.sessionId);
      }

      setMessages((prev) =>
        prev.map((message) => {
          if (message.role !== 'assistant' || message.id !== pendingId) {
            return message;
          }
          return {
            ...message,
            status: 'ready',
            summary: response.summary,
            uiMock: response.uiMock,
            apiSpec: response.apiSpec,
            dbSchema: response.dbSchema,
            createdAt: new Date().toISOString(),
          } satisfies AssistantMessage;
        })
      );
    } catch (error: any) {
      const fallback =
        typeof error?.message === 'string' && error.message.trim()
          ? error.message.trim()
          : 'Failed to generate specification. Please try again.';

      setMessages((prev) =>
        prev.map((message) => {
          if (message.role !== 'assistant' || message.id !== pendingId) {
            return message;
          }
          return {
            ...message,
            status: 'error',
            error: fallback,
          } satisfies AssistantMessage;
        })
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
      <div className="mx-auto max-w-4xl px-4 pb-32 pt-6">
        <header className="mb-6 rounded-2xl border border-white/60 bg-white/80 p-6 text-center shadow-sm backdrop-blur-sm">
          <h1 className="text-2xl font-semibold text-slate-900">Prompt Compiler</h1>
          <p className="mt-2 text-sm text-slate-600">
            Translate natural-language ideas into concise developer specifications.
          </p>
          <div className="mt-4">
            <SummaryButton sessionId={sessionId} />
          </div>
        </header>

        <main className="space-y-1">
          <ChatList items={messages} />
          <div ref={endOfFeedRef} />
        </main>
      </div>
      
      <div className="fixed bottom-0 left-0 right-0 border-t border-slate-200/50 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto max-w-4xl px-4 py-4">
          <ChatInput value={draft} onChange={setDraft} onSubmit={handleSubmit} disabled={isSubmitting} />
        </div>
      </div>
    </div>
  );
}
