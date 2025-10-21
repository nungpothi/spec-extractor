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
    <form onSubmit={handleSubmit}>
      <div className="rounded-2xl border border-slate-200/70 bg-white/90 shadow-sm backdrop-blur-sm">
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Describe a feature, workflow, or system requirement…"
          rows={3}
          className="w-full resize-none rounded-t-2xl border-0 bg-transparent p-4 text-sm leading-relaxed text-slate-700 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:ring-offset-0"
          disabled={disabled}
        />
        <div className="flex items-center justify-between border-t border-slate-200/50 px-4 py-3">
          <span className="text-xs text-slate-500">Shift + Enter for a new line</span>
          <button
            type="submit"
            disabled={disabled}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
          >
            {disabled ? 'Generating…' : 'Generate Specification'}
          </button>
        </div>
      </div>
    </form>
  );
}
