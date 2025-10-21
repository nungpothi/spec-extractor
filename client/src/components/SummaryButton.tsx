import { useState } from 'react';
import { SummaryResponse } from '../types.js';

interface SummaryButtonProps {
  sessionId: string | undefined;
}

async function requestSummary(sessionId: string): Promise<SummaryResponse> {
  const response = await fetch(`/api/summary/${encodeURIComponent(sessionId)}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    let message = 'Failed to generate summary.';
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

  const data = (await response.json()) as SummaryResponse;
  return data;
}

export default function SummaryButton({ sessionId }: SummaryButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [summaryText, setSummaryText] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleViewSummary = async () => {
    if (!sessionId) {
      setError('No active session found');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const summary = await requestSummary(sessionId);
      setSummaryText(summary.summaryText);
      setIsExpanded(true);
    } catch (error: any) {
      const message = typeof error?.message === 'string' && error.message.trim()
        ? error.message.trim()
        : 'Failed to generate summary. Please try again.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <button
          onClick={handleViewSummary}
          disabled={isLoading || !sessionId}
          className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-purple-200 to-pink-200 px-4 py-2 text-sm font-medium text-purple-800 shadow-sm transition hover:shadow-md disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isLoading ? (
            <>
              <span className="h-3 w-3 animate-spin rounded-full border-[2px] border-purple-600 border-t-transparent" aria-hidden="true" />
              Summarizing...
            </>
          ) : (
            'View Summary'
          )}
        </button>
        
        {summaryText && (
          <button
            onClick={toggleExpanded}
            className="text-sm text-slate-500 hover:text-slate-700 transition"
          >
            {isExpanded ? 'Hide Summary' : 'Show Summary'}
          </button>
        )}
      </div>

      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50/90 px-4 py-3 text-rose-700">
          <p className="text-sm">{error}</p>
        </div>
      )}

      {summaryText && isExpanded && (
        <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-soft">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
            Conversation Summary
          </h3>
          <div className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
            {summaryText}
          </div>
        </div>
      )}
    </div>
  );
}