import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRequirementStore, useAuthStore } from '../stores';
import { LoadingSpinner, ErrorMessage, Navbar } from '../components';

export const RequirementPage: React.FC = () => {
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  const { isAuthenticated, user, checkAuthStatus } = useAuthStore();
  const { 
    requirements, 
    isLoading, 
    error, 
    loadRequirements, 
    createRequirement, 
    clearError 
  } = useRequirementStore();

  const isAdmin = user?.role === 'ADMIN';

  useEffect(() => {
    checkAuthStatus();
    if (isAuthenticated) {
      if (isAdmin) {
        loadRequirements();
      }
    }
  }, [isAuthenticated, user, checkAuthStatus, loadRequirements, isAdmin]);

  // Redirect to welcome page if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/welcome');
    }
  }, [isAuthenticated, navigate]);

  // Handle privacy toggle
  useEffect(() => {
    if (!isPrivate) {
      setShowWarning(true);
      const timer = setTimeout(() => setShowWarning(false), 3000);
      return () => clearTimeout(timer);
    } else {
      setShowWarning(false);
    }
  }, [isPrivate]);

  const handleSubmit = async () => {
    if (!content.trim()) {
      return;
    }

    try {
      await createRequirement({
        content: content.trim(),
        is_private: isPrivate,
      });
      
      // Reset form
      setContent('');
      setIsPrivate(false);
      
      // Show success message
      alert('Requirement saved successfully!');
    } catch (error) {
      // Error is handled by the store
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-blue-50 to-green-50 p-6 space-y-6">
      <Navbar />

      {error && (
        <ErrorMessage
          message={error}
          onDismiss={clearError}
          className="max-w-4xl mx-auto"
        />
      )}

      <main className="max-w-4xl mx-auto space-y-6">
        {/* Requirement Form */}
        <section className="bg-white/80 backdrop-blur p-6 rounded-2xl shadow-md border border-slate-100">
          <h2 className="text-2xl font-semibold text-slate-700 mb-4">New Requirement</h2>
          
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-48 p-3 border border-slate-200 rounded-lg bg-white/70 font-mono text-slate-700 placeholder-slate-400 focus:ring-2 focus:ring-sky-200 transition-colors"
            placeholder="Describe your requirement here..."
          />
          
          <div className="flex items-center justify-between mt-3">
            <label className="flex items-center space-x-2 text-slate-600 cursor-pointer">
              <input
                type="checkbox"
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
                className="accent-sky-400"
              />
              <span>Private</span>
            </label>
            
            {showWarning && !isPrivate && (
              <p className="text-sm text-red-500 animate-pulse">
                This message will be visible to others (Public)
              </p>
            )}
          </div>
          
          <div className="flex justify-end mt-4">
            <button
              onClick={handleSubmit}
              disabled={isLoading || !content.trim()}
              className="bg-emerald-300 hover:bg-emerald-400 disabled:bg-slate-200 disabled:text-slate-400 text-slate-700 px-6 py-2 rounded shadow transition-colors"
            >
              {isLoading ? <LoadingSpinner size="sm" /> : 'Save'}
            </button>
          </div>
        </section>

        {/* Requirements List (ADMIN Only) */}
        {isAdmin && (
          <section className="bg-white/80 backdrop-blur p-6 rounded-2xl shadow-md border border-slate-100">
            <h2 className="text-2xl font-semibold text-slate-700 mb-4">
              All Requirements (ADMIN Only)
            </h2>
            
            {isLoading && requirements.length === 0 ? (
              <div className="flex justify-center py-8">
                <LoadingSpinner size="lg" />
              </div>
            ) : requirements.length === 0 ? (
              <p className="text-center text-slate-500 py-8">No requirements found</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead className="bg-slate-100 text-slate-700">
                    <tr>
                      <th className="border border-slate-200 p-2 text-left">#</th>
                      <th className="border border-slate-200 p-2 text-left">Content</th>
                      <th className="border border-slate-200 p-2 text-left">Visibility</th>
                      <th className="border border-slate-200 p-2 text-left">Created By</th>
                      <th className="border border-slate-200 p-2 text-left">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requirements.map((requirement, index) => (
                      <tr key={requirement.id} className="hover:bg-slate-50">
                        <td className="border border-slate-200 p-2">{index + 1}</td>
                        <td className="border border-slate-200 p-2">
                          <div className="max-w-md truncate" title={requirement.content}>
                            {requirement.content}
                          </div>
                        </td>
                        <td className="border border-slate-200 p-2">
                          <span
                            className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                              requirement.is_private
                                ? 'bg-red-100 text-red-800'
                                : 'bg-green-100 text-green-800'
                            }`}
                          >
                            {requirement.is_private ? 'Private' : 'Public'}
                          </span>
                        </td>
                        <td className="border border-slate-200 p-2 font-mono text-xs">
                          {requirement.created_by}
                        </td>
                        <td className="border border-slate-200 p-2">
                          {new Date(requirement.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
};