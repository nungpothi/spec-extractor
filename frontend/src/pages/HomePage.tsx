import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSpecStore } from '../stores';
import { useJsonValidator, useCopyToClipboard } from '../hooks';
import { Button, LoadingSpinner, ErrorMessage } from '../components';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [jsonInput, setJsonInput] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  
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
    loadSpecs();
  }, [loadSpecs]);

  // Add click handler for copy buttons in the preview
  useEffect(() => {
    const handleCopyClick = async (event: Event) => {
      const target = event.target as HTMLElement;
      if (target.classList.contains('spec-copy-btn')) {
        const content = target.getAttribute('data-content');
        const type = target.getAttribute('data-copy');
        
        if (content) {
          const success = await copyToClipboard(content);
          if (success) {
            const originalText = target.textContent;
            target.textContent = 'Copied!';
            target.classList.add('bg-green-200');
            target.classList.remove('bg-gray-200');
            
            setTimeout(() => {
              target.textContent = originalText;
              target.classList.remove('bg-green-200');
              target.classList.add('bg-gray-200');
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
    <div className="min-h-screen bg-gray-50 p-6 space-y-6">
      <header className="max-w-5xl mx-auto flex items-center justify-between">
        <h1 className="text-2xl font-bold">JSON Preview & Storage Tool</h1>
        <Button onClick={() => navigate('/summary')}>
          ดูทั้งหมด
        </Button>
      </header>

      {error && (
        <ErrorMessage
          message={error}
          onDismiss={clearError}
          className="max-w-5xl mx-auto mb-4"
        />
      )}

      {/* JSON Input Section */}
      <section className="max-w-5xl mx-auto bg-white p-4 rounded shadow">
        <h2 className="font-semibold mb-2">วาง JSON ที่นี่</h2>
        <textarea
          id="json-input"
          className="w-full border p-2 rounded h-64 font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Paste your JSON here..."
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
        />
        {jsonError && (
          <div className="text-red-600 text-sm mt-1">{jsonError}</div>
        )}
        <div className="flex justify-end mt-3 space-x-2">
          <Button
            variant="success"
            onClick={handlePreview}
            disabled={isLoading || !jsonInput.trim()}
          >
            {isLoading ? <LoadingSpinner size="sm" /> : 'Preview'}
          </Button>
          <Button
            onClick={handleSave}
            disabled={isLoading || !jsonInput.trim()}
          >
            {isLoading ? <LoadingSpinner size="sm" /> : 'Save'}
          </Button>
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
      <section className="max-w-5xl mx-auto bg-white p-4 rounded shadow">
        <h2 className="font-semibold mb-3">สรุป JSON ทั้งหมด</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-gray-200">
              <tr>
                <th className="border p-2 text-left">#</th>
                <th className="border p-2 text-left">Summary</th>
                <th className="border p-2 text-left">Created At</th>
                <th className="border p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {specs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="border p-4 text-center text-gray-500">
                    No specifications found
                  </td>
                </tr>
              ) : (
                specs.map((spec, index) => (
                  <tr key={spec.id} className="hover:bg-gray-50">
                    <td className="border p-2">{index + 1}</td>
                    <td className="border p-2">{spec.summary}</td>
                    <td className="border p-2">{formatDate(spec.created_at)}</td>
                    <td className="border p-2">
                      <div className="flex space-x-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => navigate(`/spec/${spec.id}`)}
                        >
                          View
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(spec.id)}
                        >
                          Delete
                        </Button>
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