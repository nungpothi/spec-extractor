import React, {useEffect, useRef, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useAuthStore, useSpecStore} from '../stores';
import {useCopyToClipboard, useJsonValidator} from '../hooks';
import {ErrorMessage, LoadingSpinner, Navbar} from '../components';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [jsonInput, setJsonInput] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const { isAuthenticated, checkAuthStatus } = useAuthStore();
  const {
    specs,
    previewHtml,
    isLoading,
    error,
    loadSpecs,
    createSpec,
    deleteSpec,
    previewJson,
    clearPreview,
    clearError,
  } = useSpecStore();

  const { jsonError, validateJson, clearError: clearJsonError } = useJsonValidator();
  const { copyToClipboard } = useCopyToClipboard();

  useEffect(() => {
    checkAuthStatus();
    if (isAuthenticated) {
      loadSpecs();
    }
  }, [loadSpecs, checkAuthStatus, isAuthenticated]);

  // Redirect to welcome page if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/welcome');
    }
  }, [isAuthenticated, navigate]);

  // Add click handler for copy buttons in the preview
  useEffect(() => {
    const handleCopyClick = async (event: Event) => {
      const target = event.target as HTMLElement;
      const button = target.closest('.spec-copy-btn') as HTMLElement;

      if (button) {
        const content = button.getAttribute('data-content');
        const type = button.getAttribute('data-copy');

        if (content) {
          const success = await copyToClipboard(content);
          if (success) {
            // Add visual feedback for icon buttons
            button.classList.add('copied');

            // Create a temporary "Copied!" tooltip or change icon color
            const originalTitle = button.getAttribute('title');
            button.setAttribute('title', 'Copied!');

            setTimeout(() => {
              button.classList.remove('copied');
              if (originalTitle) {
                button.setAttribute('title', originalTitle);
              }
            }, 2000);
          }
        }
      }
    };

    if (previewRef.current) {
      previewRef.current.addEventListener('click', handleCopyClick);
    }

    return () => {
      if (previewRef.current) {
        previewRef.current.removeEventListener('click', handleCopyClick);
      }
    };
  }, [previewHtml, copyToClipboard]);

  const handlePreview = async () => {
    clearJsonError();
    const parsedJson = validateJson(jsonInput);
    if (parsedJson) {
      await previewJson(parsedJson);
    }
  };

  const handleSave = async () => {
    clearJsonError();
    const parsedJson = validateJson(jsonInput);
    if (parsedJson) {
      try {
        await createSpec(parsedJson);
        setJsonInput('');
        clearPreview();
        // Show success message or navigate
      } catch (error) {
        // Error handled by store
      }
    }
  };

  const handleCopy = async () => {
    if (previewHtml) {
      const success = await copyToClipboard(previewHtml);
      if (success) {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this specification?')) {
      await deleteSpec(id);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('th-TH');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-blue-50 to-green-50 p-6 space-y-6">
      <Navbar />

      {error && (
        <ErrorMessage
          message={error}
          onDismiss={clearError}
          className="max-w-5xl mx-auto mb-4"
        />
      )}

      {/* JSON Input Section */}
      <section className="max-w-5xl mx-auto bg-white/80 backdrop-blur p-4 rounded-2xl shadow-md border border-slate-100">
        <h2 className="font-semibold mb-2 text-slate-700">วาง JSON ที่นี่</h2>
        <textarea
          id="json-input"
          className="w-full border border-slate-200 focus:ring-2 focus:ring-sky-200 p-2 rounded-lg h-64 font-mono text-sm bg-white/70 transition-colors"
          placeholder="Paste your JSON here..."
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
        />
        {jsonError && (
          <div className="text-red-600 text-sm mt-1">{jsonError}</div>
        )}
        <div className="flex justify-end mt-3 space-x-2">
          <button
            onClick={handlePreview}
            disabled={isLoading || !jsonInput.trim()}
            className="bg-emerald-300 hover:bg-emerald-400 text-slate-700 px-4 py-2 rounded shadow transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? <LoadingSpinner size="sm" /> : 'Preview'}
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading || !jsonInput.trim()}
            className="bg-sky-300 hover:bg-sky-400 text-slate-700 px-4 py-2 rounded shadow transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? <LoadingSpinner size="sm" /> : 'Save'}
          </button>
        </div>
      </section>

      {/* Preview Section */}
      {previewHtml && (
        <section className="max-w-5xl mx-auto">
          <div
            ref={previewRef}
            className="preview-sections"
          >
            <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
          </div>
        </section>
      )}

      {/* Summary Table Section */}
      <section className="max-w-5xl mx-auto bg-white/80 backdrop-blur p-4 rounded-2xl shadow-md border border-slate-100">
        <h2 className="font-semibold mb-3 text-slate-700">สรุป JSON ทั้งหมด</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100/60">
              <tr>
                <th className="border border-slate-200 p-2 text-left text-slate-600">#</th>
                <th className="border border-slate-200 p-2 text-left text-slate-600">Summary</th>
                <th className="border border-slate-200 p-2 text-left text-slate-600">Created At</th>
                <th className="border border-slate-200 p-2 text-left text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {specs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="border border-slate-200 p-4 text-center text-slate-500">
                    No specifications found
                  </td>
                </tr>
              ) : (
                specs.map((spec, index) => (
                  <tr key={spec.id} className="hover:bg-slate-50/40 transition-colors">
                    <td className="border border-slate-200 p-2 text-slate-700">{index + 1}</td>
                    <td className="border border-slate-200 p-2 text-slate-700">{spec.summary}</td>
                    <td className="border border-slate-200 p-2 text-slate-700">{formatDate(spec.created_at)}</td>
                    <td className="border border-slate-200 p-2">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => navigate(`/spec/${spec.id}`)}
                          className="bg-blue-200 hover:bg-blue-300 text-slate-700 px-3 py-1 rounded text-xs transition-colors"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleDelete(spec.id)}
                          className="bg-red-200 hover:bg-red-300 text-slate-700 px-3 py-1 rounded text-xs transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
