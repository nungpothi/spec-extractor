import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSpecStore } from '../stores';
import { useCopyToClipboard } from '../hooks';
import { Button, LoadingSpinner, ErrorMessage } from '../components';

export const SummaryPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    specs,
    isLoading,
    error,
    loadSpecs,
    deleteSpec,
    clearError,
  } = useSpecStore();

  const { copyToClipboard } = useCopyToClipboard();

  useEffect(() => {
    loadSpecs();
  }, [loadSpecs]);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this specification?')) {
      await deleteSpec(id);
    }
  };

  const handleCopyId = async (id: string) => {
    await copyToClipboard(id);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('th-TH');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <header className="max-w-6xl mx-auto mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">All JSON Specifications</h1>
        <Button onClick={() => navigate('/')}>
          กลับหน้าหลัก
        </Button>
      </header>

      {error && (
        <ErrorMessage
          message={error}
          onDismiss={clearError}
          className="max-w-6xl mx-auto mb-4"
        />
      )}

      <div className="max-w-6xl mx-auto bg-white p-6 rounded shadow">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            Total: {specs.length} specifications
          </h2>
          <Button variant="success" onClick={() => navigate('/')}>
            เพิ่มใหม่
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-gray-200">
              <tr>
                <th className="border p-3 text-left">#</th>
                <th className="border p-3 text-left">ID</th>
                <th className="border p-3 text-left">Summary</th>
                <th className="border p-3 text-left">Created At</th>
                <th className="border p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {specs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="border p-8 text-center text-gray-500">
                    <div className="flex flex-col items-center space-y-3">
                      <p>No specifications found</p>
                      <Button onClick={() => navigate('/')}>
                        Create your first specification
                      </Button>
                    </div>
                  </td>
                </tr>
              ) : (
                specs.map((spec, index) => (
                  <tr key={spec.id} className="hover:bg-gray-50">
                    <td className="border p-3">{index + 1}</td>
                    <td className="border p-3">
                      <div className="flex items-center space-x-2">
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {spec.id.substring(0, 8)}...
                        </code>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleCopyId(spec.id)}
                          title="Copy full ID"
                        >
                          📋
                        </Button>
                      </div>
                    </td>
                    <td className="border p-3 max-w-xs truncate" title={spec.summary}>
                      {spec.summary}
                    </td>
                    <td className="border p-3">{formatDate(spec.created_at)}</td>
                    <td className="border p-3">
                      <div className="flex space-x-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => navigate(`/spec/${spec.id}`)}
                        >
                          View
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => navigate(`/?copy=${spec.id}`)}
                        >
                          Copy JSON
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
      </div>
    </div>
  );
};