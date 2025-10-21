import { ReactNode } from 'react';
import { ChatEntry } from '../types';

interface ChatListProps {
  items: ChatEntry[];
}

export default function ChatList({ items }: ChatListProps) {
  if (items.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-2 py-16 text-center text-slate-500">
        <p className="text-lg font-medium">Welcome to Prompt Compiler</p>
        <p className="max-w-md text-sm text-slate-500">
          Describe a feature or workflow in Thai or English. The assistant will draft a developer-ready summary, UI mock, API spec, and database schema.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 py-8">
      {items.map((item) => {
        if (item.role === 'user') {
          return (
            <div key={item.id} className="flex justify-end">
              <div className="max-w-3xl rounded-3xl bg-white/90 px-5 py-4 text-slate-700 shadow-lg shadow-sky-100">
                <p className="whitespace-pre-wrap text-base leading-relaxed">{item.text}</p>
              </div>
            </div>
          );
        }

        if (item.status === 'loading') {
          return (
            <div key={item.id} className="flex justify-start">
              <div className="flex max-w-3xl items-center gap-3 rounded-3xl border border-slate-200/60 bg-white/80 px-5 py-4 shadow">
                <span className="h-3 w-3 animate-spin rounded-full border-[3px] border-rose-300 border-t-transparent" aria-hidden="true" />
                <p className="text-sm text-slate-500">Designing a specification…</p>
              </div>
            </div>
          );
        }

        if (item.status === 'error') {
          return (
            <div key={item.id} className="flex justify-start">
              <div className="max-w-3xl rounded-3xl border border-rose-200 bg-rose-50/90 px-5 py-4 text-rose-700 shadow">
                <p className="font-medium">We hit a snag.</p>
                <p className="mt-2 text-sm text-rose-600">{item.error ?? 'Unable to generate a response. Try again in a moment.'}</p>
              </div>
            </div>
          );
        }

        return (
          <div key={item.id} className="flex justify-start">
            <div className="w-full max-w-3xl space-y-5 rounded-3xl border border-slate-200/70 bg-white/90 p-6 shadow-soft">
              <ChatSection title="Requirement Summary">
                <p className="whitespace-pre-wrap text-base leading-relaxed text-slate-700">{item.summary}</p>
              </ChatSection>

              <ChatSection title="UI Mock">
                <div
                  className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4 text-sm text-slate-700"
                  dangerouslySetInnerHTML={{ __html: item.uiMock ?? '' }}
                />
              </ChatSection>

              <ChatSection title="API Spec">
                <pre className="overflow-x-auto rounded-2xl bg-slate-900/90 p-4 text-sm text-slate-100">{item.apiSpec}</pre>
              </ChatSection>

              <ChatSection title="Database Schema">
                <pre className="overflow-x-auto rounded-2xl bg-slate-900/90 p-4 text-sm text-slate-100">{item.dbSchema}</pre>
              </ChatSection>
            </div>
          </div>
        );
      })}
    </div>
  );
}

interface ChatSectionProps {
  title: string;
  children: ReactNode;
}

function ChatSection({ title, children }: ChatSectionProps) {
  return (
    <section className="space-y-3">
      <header className="text-sm font-semibold uppercase tracking-wide text-slate-500">{title}</header>
      <div className="text-sm leading-relaxed text-slate-700">{children}</div>
    </section>
  );
}
