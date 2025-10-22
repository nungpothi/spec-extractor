import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSpecStore } from '../stores';
import { useCopyToClipboard } from '../hooks';
import { Button, LoadingSpinner, ErrorMessage } from '../components';

export const SpecDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [copySuccess, setCopySuccess] = useState<'json' | 'html' | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const {
    currentSpec,
    isLoading,
    error,
    loadSpec,
    deleteSpec,
    clearError,
  } = useSpecStore();

  const { copyToClipboard } = useCopyToClipboard();

  useEffect(() => {
    if (id) {
      loadSpec(id);
    }
  }, [id, loadSpec]);

  // Add click handler for copy buttons in the preview
  useEffect(() => {
    const handleCopyClick = async (event: Event) => {
      const target = event.target as HTMLElement;
      if (target.classList.contains('spec-copy-btn')) {
        const content = target.getAttribute('data-content');
        
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
  }, [currentSpec?.preview_html, copyToClipboard]);

  const handleCopyJson = async () => {
    if (currentSpec?.json_data) {
      const success = await copyToClipboard(JSON.stringify(currentSpec.json_data, null, 2));
      if (success) {
        setCopySuccess('json');
        setTimeout(() => setCopySuccess(null), 2000);
      }
    }
  };

  const handleCopyHtml = async () => {
    if (currentSpec?.preview_html) {
      const success = await copyToClipboard(currentSpec.preview_html);
      if (success) {
        setCopySuccess('html');
        setTimeout(() => setCopySuccess(null), 2000);
      }
    }
  };

  const handleDelete = async () => {
    if (id && confirm('Are you sure you want to delete this specification?')) {
      await deleteSpec(id);
      navigate('/');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 via-blue-50 to-green-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!currentSpec) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 via-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4 text-slate-700">Specification not found</h2>
          <button 
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-sky-300 hover:bg-sky-400 text-white rounded shadow transition-colors"
          >
            กลับหน้าหลัก
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-blue-50 to-green-50 p-6">
      <header className="max-w-6xl mx-auto mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-700">Specification Detail</h1>
        <div className="flex space-x-2">
          <button 
            onClick={() => navigate('/summary')}
            className="px-4 py-2 bg-slate-300 hover:bg-slate-400 text-slate-700 rounded shadow transition-colors"
          >
            ดูทั้งหมด
          </button>
          <button 
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-sky-300 hover:bg-sky-400 text-white rounded shadow transition-colors"
          >
            กลับหน้าหลัก
          </button>
        </div>
      </header>

      {error && (
        <ErrorMessage
          message={error}
          onDismiss={clearError}
          className="max-w-6xl mx-auto mb-4"
        />
      )}

      <div className="max-w-6xl mx-auto space-y-6">
        {/* Metadata */}
        <div className="bg-white/80 backdrop-blur p-6 rounded-2xl shadow-md border border-slate-100">
          <h2 className="text-lg font-semibold mb-4 text-slate-700">Specification Information</h2>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <dt className="font-medium text-slate-600">ID:</dt>
              <dd className="mt-1">
                <code className="bg-slate-100 px-2 py-1 rounded text-sm text-slate-700">
                  {currentSpec.id}
                </code>
              </dd>
            </div>
          </dl>
        </div>

        {/* JSON Data */}
        <div className="bg-white/80 backdrop-blur p-6 rounded-2xl shadow-md border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-700">JSON Data</h2>
            <button
              onClick={handleCopyJson}
              className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-3 py-1 rounded text-sm transition-colors"
            >
              {copySuccess === 'json' ? 'Copied!' : 'Copy JSON'}
            </button>
          </div>
          <pre className="bg-slate-50 p-4 rounded-lg overflow-auto max-h-96 text-sm border border-slate-200">
            <code className="text-slate-700">
              {JSON.stringify(currentSpec.json_data, null, 2)}
            </code>
          </pre>
        </div>

        {/* Preview HTML */}
        <div className="bg-white/80 backdrop-blur p-6 rounded-2xl shadow-md border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-700">Preview HTML</h2>
            <button
              onClick={handleCopyHtml}
              className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-3 py-1 rounded text-sm transition-colors"
            >
              {copySuccess === 'html' ? 'Copied!' : 'Copy HTML'}
            </button>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium mb-2 text-slate-600">Rendered Output:</h3>
              <div 
                ref={previewRef}
                className="border border-slate-200 p-4 rounded-lg bg-white/60 overflow-auto max-h-96"
                dangerouslySetInnerHTML={{ __html: currentSpec.preview_html }}
              />
            </div>
            <div>
              <h3 className="font-medium mb-2 text-slate-600">HTML Source:</h3>
              <pre className="bg-slate-50 p-4 rounded-lg overflow-auto max-h-96 text-sm border border-slate-200">
                <code className="text-slate-700">{currentSpec.preview_html}</code>
              </pre>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white/80 backdrop-blur p-6 rounded-2xl shadow-md border border-slate-100">
          <h2 className="text-lg font-semibold mb-4 text-slate-700">Actions</h2>
          <div className="flex space-x-4">
            <button
              onClick={() => navigate(`/?copy=${currentSpec.id}`)}
              className="bg-green-300 hover:bg-green-400 text-slate-700 px-4 py-2 rounded shadow transition-colors"
            >
              Copy to Editor
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-300 hover:bg-red-400 text-slate-700 px-4 py-2 rounded shadow transition-colors"
            >
              Delete Specification
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};