import { FormEvent, useState } from 'react';
import InstructionHistory from './components/InstructionHistory';
import SectionCard from './components/SectionCard';
import { InstructionItem, PromptCompileResult } from './types';

async function postCompilation(
  payload: { userText: string; previousContext?: PromptCompileResult }
): Promise<PromptCompileResult> {
  const response = await fetch('/api/compile-prompt', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let message = 'Request failed';
    try {
      const body = await response.json();
      if (body?.error && typeof body.error === 'string') {
        message = body.error;
      }
    } catch (error) {
      message = `${message}: ${response.status}`;
    }
    throw new Error(message);
  }

  const data = (await response.json()) as PromptCompileResult;
  return data;
}

export default function App() {
  const [initialInput, setInitialInput] = useState('');
  const [detailInput, setDetailInput] = useState('');
  const [instructions, setInstructions] = useState<InstructionItem[]>([]);
  const [result, setResult] = useState<PromptCompileResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInitialSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const trimmed = initialInput.trim();
    if (!trimmed || isLoading) {
      return;
    }

    setError(null);
    setIsLoading(true);
    const instruction: InstructionItem = {
      id: crypto.randomUUID(),
      text: trimmed,
      status: 'pending',
    };
    setInstructions([instruction]);

    try {
      const compiled = await postCompilation({ userText: trimmed });
      setResult(compiled);
      setInstructions([{ ...instruction, status: 'ready' }]);
      setInitialInput('');
      setDetailInput('');
    } catch (err: any) {
      setError(err?.message ?? 'Something went wrong');
      setInstructions([{ ...instruction, status: 'ready' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDetailSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const trimmed = detailInput.trim();
    if (!trimmed || isLoading || !result) {
      return;
    }

    setError(null);
    setIsLoading(true);
    const detail: InstructionItem = {
      id: crypto.randomUUID(),
      text: trimmed,
      status: 'pending',
    };
    setInstructions((prev) => [...prev, detail]);

    try {
      const compiled = await postCompilation({ userText: trimmed, previousContext: result });
      setResult(compiled);
      setInstructions((prev) => prev.map((item) => ({ ...item, status: 'ready' })));
      setDetailInput('');
    } catch (err: any) {
      setError(err?.message ?? 'Something went wrong');
      setInstructions((prev) => prev.map((item) => ({ ...item, status: 'ready' })));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="layout">
        <header className="header">
          <h1>Prompt Compiler</h1>
          <p>Translate free-form ideas into developer-ready specs.</p>
        </header>

        <main className="main">
          <section className="input-panel">
            <form onSubmit={handleInitialSubmit} className="form-card">
              <label htmlFor="initial" className="form-card__label">
                Describe what you need
              </label>
              <textarea
                id="initial"
                placeholder="Enter feature idea in Thai or English"
                value={initialInput}
                onChange={(event) => setInitialInput(event.target.value)}
                disabled={isLoading}
              />
              <button type="submit" disabled={isLoading}>
                {isLoading && !result ? 'Compiling…' : 'Compile Specification'}
              </button>
            </form>

            <form onSubmit={handleDetailSubmit} className="form-card">
              <label htmlFor="detail" className="form-card__label">
                Add detail
              </label>
              <textarea
                id="detail"
                placeholder="Clarify flows, edge cases, integrations, or constraints"
                value={detailInput}
                onChange={(event) => setDetailInput(event.target.value)}
                disabled={isLoading || !result}
              />
              <button type="submit" disabled={isLoading || !result}>
                {isLoading && result ? 'Updating…' : 'Refine Specification'}
              </button>
            </form>

            {error ? <div className="error-banner">{error}</div> : null}
            <InstructionHistory items={instructions} />
          </section>

          <section className="output-panel">
            {result ? (
              <div className="result-grid">
                <SectionCard title="Requirement Summary">
                  <p className="summary-text">{result.summary}</p>
                </SectionCard>

                <SectionCard title="UI Mock">
                  <div
                    className="ui-preview"
                    dangerouslySetInnerHTML={{ __html: result.uiMock }}
                  />
                </SectionCard>

                <SectionCard title="API Spec">
                  <pre className="code-block">{result.apiSpec}</pre>
                </SectionCard>

                <SectionCard title="Database Schema">
                  <pre className="code-block">{result.dbSchema}</pre>
                </SectionCard>
              </div>
            ) : (
              <div className="placeholder">
                <p>Start by describing a feature. Prompt Compiler will craft UI, API, and database plans for you.</p>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
