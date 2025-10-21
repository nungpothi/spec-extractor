import { ReactNode } from 'react';
import { AssistantMessage, ChatEntry, UserMessage } from '../types.js';

interface ChatListProps {
  items: ChatEntry[];
}

export default function ChatList({ items }: ChatListProps) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
        <div className="rounded-2xl bg-white/60 p-8 shadow-sm backdrop-blur-sm">
          <p className="text-lg font-medium text-slate-700">Welcome to Prompt Compiler</p>
          <p className="mt-2 max-w-md text-sm text-slate-600">
            Describe a feature or workflow in Thai or English. The assistant will draft a developer-ready summary, UI mock, API spec, and database schema.
          </p>
        </div>
      </div>
    );
  }

  const groupedMessages: Array<{ user: UserMessage; assistant?: AssistantMessage }> = [];
  
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (item.role === 'user') {
      const nextItem = items[i + 1];
      groupedMessages.push({
        user: item,
        assistant: nextItem?.role === 'assistant' ? nextItem : undefined,
      });
      if (nextItem?.role === 'assistant') {
        i++; // Skip the assistant message since we've already included it
      }
    }
  }

  return (
    <div className="space-y-6">
      {groupedMessages.map((group) => (
        <div key={group.user.id} className="space-y-4">
          {/* User Message */}
          <div className="flex justify-end">
            <div className="max-w-lg rounded-2xl bg-gradient-to-r from-blue-100 to-indigo-100 px-4 py-3 shadow-sm">
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-800">{group.user.text}</p>
            </div>
          </div>

          {/* Assistant Message */}
          {group.assistant && (
            <div className="flex justify-start">
              <div className="w-full max-w-3xl">
                {group.assistant.status === 'loading' && (
                  <div className="flex items-center gap-3 rounded-2xl bg-white/80 px-4 py-3 shadow-sm backdrop-blur-sm">
                    <span className="h-3 w-3 animate-spin rounded-full border-[2px] border-rose-400 border-t-transparent" />
                    <p className="text-sm text-slate-600">Designing a specification…</p>
                  </div>
                )}

                {group.assistant.status === 'error' && (
                  <div className="rounded-2xl border border-rose-200 bg-rose-50/90 px-4 py-3 shadow-sm">
                    <p className="font-medium text-rose-800">We hit a snag.</p>
                    <p className="mt-1 text-sm text-rose-700">
                      {group.assistant.error ?? 'Unable to generate a response. Try again in a moment.'}
                    </p>
                  </div>
                )}

                {group.assistant.status === 'ready' && (
                  <div className="space-y-4 rounded-2xl bg-white/80 p-5 shadow-sm backdrop-blur-sm">
                    <ChatSection title="Requirement Summary">
                      <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
                        {group.assistant.summary}
                      </p>
                    </ChatSection>

                    <ChatSection title="UI Mock">
                      <div
                        className="overflow-auto rounded-xl border border-slate-200/80 bg-slate-50/80 p-4 text-sm text-slate-700"
                        dangerouslySetInnerHTML={{ __html: group.assistant.uiMock ?? '' }}
                      />
                    </ChatSection>

                    <ChatSection title="API Spec">
                      <pre className="overflow-x-auto rounded-xl bg-slate-900 p-4 text-xs leading-relaxed text-slate-100">
                        {group.assistant.apiSpec}
                      </pre>
                    </ChatSection>

                    <ChatSection title="Database Schema">
                      <pre className="overflow-x-auto rounded-xl bg-slate-900 p-4 text-xs leading-relaxed text-slate-100">
                        {group.assistant.dbSchema}
                      </pre>
                    </ChatSection>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

interface ChatSectionProps {
  title: string;
  children: ReactNode;
}

function ChatSection({ title, children }: ChatSectionProps) {
  return (
    <section className="space-y-2">
      <header className="text-xs font-semibold uppercase tracking-wide text-slate-500">{title}</header>
      <div className="text-sm leading-relaxed text-slate-700">{children}</div>
    </section>
  );
}
