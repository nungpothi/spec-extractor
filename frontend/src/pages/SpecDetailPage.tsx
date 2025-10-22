import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSpecStore } from '../stores';
import { useCopyToClipboard } from '../hooks';
import { Button, LoadingSpinner, ErrorMessage } from '../components';

export const SpecDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [copySuccess, setCopySuccess] = useState<'json' | 'html' | null>(null);

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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!currentSpec) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">Specification not found</h2>
          <Button onClick={() => navigate('/')}>
            กลับหน้าหลัก
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <header className="max-w-6xl mx-auto mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Specification Detail</h1>
        <div className="flex space-x-2">
          <Button variant="secondary" onClick={() => navigate('/summary')}>
            ดูทั้งหมด
          </Button>
          <Button onClick={() => navigate('/')}>
            กลับหน้าหลัก
          </Button>
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
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-lg font-semibold mb-4">Specification Information</h2>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <dt className="font-medium text-gray-700">ID:</dt>
              <dd className="mt-1">
                <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                  {currentSpec.id}
                </code>
              </dd>
            </div>
          </dl>
        </div>

        {/* JSON Data */}
        <div className="bg-white p-6 rounded shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">JSON Data</h2>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleCopyJson}
            >
              {copySuccess === 'json' ? 'Copied!' : 'Copy JSON'}
            </Button>
          </div>
          <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96 text-sm">
            <code>
              {JSON.stringify(currentSpec.json_data, null, 2)}
            </code>
          </pre>
        </div>

        {/* Preview HTML */}
        <div className="bg-white p-6 rounded shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Preview HTML</h2>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleCopyHtml}
            >
              {copySuccess === 'html' ? 'Copied!' : 'Copy HTML'}
            </Button>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium mb-2">Rendered Output:</h3>
              <div 
                className="border p-4 rounded bg-gray-50 overflow-auto max-h-96"
                dangerouslySetInnerHTML={{ __html: currentSpec.preview_html }}
              />
            </div>
            <div>
              <h3 className="font-medium mb-2">HTML Source:</h3>
              <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96 text-sm">
                <code>{currentSpec.preview_html}</code>
              </pre>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-lg font-semibold mb-4">Actions</h2>
          <div className="flex space-x-4">
            <Button
              variant="primary"
              onClick={() => navigate(`/?copy=${currentSpec.id}`)}
            >
              Copy to Editor
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
            >
              Delete Specification
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};