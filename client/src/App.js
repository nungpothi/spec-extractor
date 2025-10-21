import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import InstructionHistory from './components/InstructionHistory';
import SectionCard from './components/SectionCard';
async function postCompilation(payload) {
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
        }
        catch (error) {
            message = `${message}: ${response.status}`;
        }
        throw new Error(message);
    }
    const data = (await response.json());
    return data;
}
export default function App() {
    const [initialInput, setInitialInput] = useState('');
    const [detailInput, setDetailInput] = useState('');
    const [instructions, setInstructions] = useState([]);
    const [result, setResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const handleInitialSubmit = async (event) => {
        event.preventDefault();
        const trimmed = initialInput.trim();
        if (!trimmed || isLoading) {
            return;
        }
        setError(null);
        setIsLoading(true);
        const instruction = {
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
        }
        catch (err) {
            setError(err?.message ?? 'Something went wrong');
            setInstructions([{ ...instruction, status: 'ready' }]);
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleDetailSubmit = async (event) => {
        event.preventDefault();
        const trimmed = detailInput.trim();
        if (!trimmed || isLoading || !result) {
            return;
        }
        setError(null);
        setIsLoading(true);
        const detail = {
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
        }
        catch (err) {
            setError(err?.message ?? 'Something went wrong');
            setInstructions((prev) => prev.map((item) => ({ ...item, status: 'ready' })));
        }
        finally {
            setIsLoading(false);
        }
    };
    return (_jsx("div", { className: "page", children: _jsxs("div", { className: "layout", children: [_jsxs("header", { className: "header", children: [_jsx("h1", { children: "Prompt Compiler" }), _jsx("p", { children: "Translate free-form ideas into developer-ready specs." })] }), _jsxs("main", { className: "main", children: [_jsxs("section", { className: "input-panel", children: [_jsxs("form", { onSubmit: handleInitialSubmit, className: "form-card", children: [_jsx("label", { htmlFor: "initial", className: "form-card__label", children: "Describe what you need" }), _jsx("textarea", { id: "initial", placeholder: "Enter feature idea in Thai or English", value: initialInput, onChange: (event) => setInitialInput(event.target.value), disabled: isLoading }), _jsx("button", { type: "submit", disabled: isLoading, children: isLoading && !result ? 'Compiling…' : 'Compile Specification' })] }), _jsxs("form", { onSubmit: handleDetailSubmit, className: "form-card", children: [_jsx("label", { htmlFor: "detail", className: "form-card__label", children: "Add detail" }), _jsx("textarea", { id: "detail", placeholder: "Clarify flows, edge cases, integrations, or constraints", value: detailInput, onChange: (event) => setDetailInput(event.target.value), disabled: isLoading || !result }), _jsx("button", { type: "submit", disabled: isLoading || !result, children: isLoading && result ? 'Updating…' : 'Refine Specification' })] }), error ? _jsx("div", { className: "error-banner", children: error }) : null, _jsx(InstructionHistory, { items: instructions })] }), _jsx("section", { className: "output-panel", children: result ? (_jsxs("div", { className: "result-grid", children: [_jsx(SectionCard, { title: "Requirement Summary", children: _jsx("p", { className: "summary-text", children: result.summary }) }), _jsx(SectionCard, { title: "UI Mock", children: _jsx("div", { className: "ui-preview", dangerouslySetInnerHTML: { __html: result.uiMock } }) }), _jsx(SectionCard, { title: "API Spec", children: _jsx("pre", { className: "code-block", children: result.apiSpec }) }), _jsx(SectionCard, { title: "Database Schema", children: _jsx("pre", { className: "code-block", children: result.dbSchema }) })] })) : (_jsx("div", { className: "placeholder", children: _jsx("p", { children: "Start by describing a feature. Prompt Compiler will craft UI, API, and database plans for you." }) })) })] })] }) }));
}
