import { FormEvent, KeyboardEvent } from 'react';

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled: boolean;
}

export default function ChatInput({ value, onChange, onSubmit, disabled }: ChatInputProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!disabled) {
      onSubmit();
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      if (!disabled) {
        onSubmit();
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border-t border-slate-200/70 bg-white/85 p-4 backdrop-blur">
      <div className="rounded-3xl border border-slate-200/70 bg-white/70 shadow-inner">
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Describe a feature, workflow, or system requirement…"
          rows={4}
          className="h-32 w-full resize-none rounded-3xl border-0 bg-transparent p-5 text-base leading-relaxed text-slate-700 focus:outline-none"
          disabled={disabled}
        />
        <div className="flex items-center justify-between border-t border-slate-200/70 px-5 py-3 text-xs text-slate-500">
          <span>Shift + Enter for a new line</span>
          <button
            type="submit"
            disabled={disabled}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-sky-400 via-indigo-400 to-rose-400 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-rose-200 transition hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
          >
            {disabled ? 'Generating…' : 'Generate Specification'}
          </button>
        </div>
      </div>
    </form>
  );
}
