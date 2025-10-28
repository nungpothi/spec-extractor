import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSpecStore, useAuthStore } from '../stores';
import { useCopyToClipboard } from '../hooks';
import { LoadingSpinner, ErrorMessage, Navbar } from '../components';

export const PromptSummaryPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    specs,
    isLoading,
    error,
    loadSpecs,
    deleteSpec,
    clearError,
  } = useSpecStore();

  const { isAuthenticated, checkAuthStatus } = useAuthStore();
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
      <div className="min-h-screen bg-gradient-to-b from-pink-50 via-blue-50 to-green-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-blue-50 to-green-50 p-6 space-y-6">
      <Navbar />

      {error && (
        <ErrorMessage
          message={error}
          onDismiss={clearError}
          className="max-w-6xl mx-auto mb-4"
        />
      )}

      <div className="max-w-6xl mx-auto bg-white/80 backdrop-blur p-6 rounded-2xl shadow-md border border-slate-100">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-700">Prompt Summary</h1>
            <p className="text-sm text-slate-500">Total: {specs.length} specifications</p>
          </div>
          <button
            onClick={() => navigate('/preview')}
            className="bg-emerald-300 hover:bg-emerald-400 text-slate-700 px-6 py-2 rounded shadow transition-colors"
          >
            Create New
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100/60">
              <tr>
                <th className="border border-slate-200 p-3 text-left text-slate-600">#</th>
                <th className="border border-slate-200 p-3 text-left text-slate-600">ID</th>
                <th className="border border-slate-200 p-3 text-left text-slate-600">Prompt Summary</th>
                <th className="border border-slate-200 p-3 text-left text-slate-600">Created At</th>
                <th className="border border-slate-200 p-3 text-left text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {specs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="border border-slate-200 p-8 text-center text-slate-500">
                    <div className="flex flex-col items-center space-y-3">
                      <p>No specifications found</p>
                      <button
                        onClick={() => navigate('/preview')}
                        className="bg-sky-300 hover:bg-sky-400 text-slate-700 px-4 py-2 rounded shadow transition-colors"
                      >
                        Create your first prompt summary
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                specs.map((spec, index) => (
                  <tr key={spec.id} className="hover:bg-slate-50/40 transition-colors">
                    <td className="border border-slate-200 p-3 text-slate-700">{index + 1}</td>
                    <td className="border border-slate-200 p-3">
                      <div className="flex items-center space-x-2">
                        <code className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-600">
                          {spec.id.substring(0, 8)}...
                        </code>
                        <button
                          onClick={() => handleCopyId(spec.id)}
                          title="Copy full ID"
                          className="bg-slate-200 hover:bg-slate-300 px-2 py-1 rounded text-xs transition-colors"
                        >
                          📋
                        </button>
                      </div>
                    </td>
                    <td className="border border-slate-200 p-3 max-w-xs truncate text-slate-700" title={spec.summary}>
                      {spec.summary}
                    </td>
                    <td className="border border-slate-200 p-3 text-slate-700">{formatDate(spec.created_at)}</td>
                    <td className="border border-slate-200 p-3">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => navigate(`/spec/${spec.id}`)}
                          className="bg-blue-200 hover:bg-blue-300 text-slate-700 px-3 py-1 rounded text-xs transition-colors"
                        >
                          View
                        </button>
                        <button
                          onClick={() => navigate(`/?copy=${spec.id}`)}
                          className="bg-green-200 hover:bg-green-300 text-slate-700 px-3 py-1 rounded text-xs transition-colors"
                        >
                          Copy JSON
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
      </div>
    </div>
  );
};
