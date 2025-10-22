import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRequirementStore, useAuthStore } from '../stores';
import { LoadingSpinner, ErrorMessage, Navbar } from '../components';
import type { RequirementStatus, RequirementItem } from '../types';

export const RequirementPage: React.FC = () => {
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Edit state
  const [editingRequirement, setEditingRequirement] = useState<RequirementItem | null>(null);
  const [editContent, setEditContent] = useState('');
  const [editIsPrivate, setEditIsPrivate] = useState(false);
  const [editStatus, setEditStatus] = useState<RequirementStatus>('NEW');

  const { isAuthenticated, user, checkAuthStatus } = useAuthStore();
  const { 
    requirements, 
    isLoading, 
    error, 
    loadRequirements, 
    createRequirement,
    updateRequirement,
    clearError 
  } = useRequirementStore();

  const isAdmin = user?.role === 'ADMIN';

  // Load requirements when authenticated
  useEffect(() => {
    checkAuthStatus();
    if (isAuthenticated) {
      loadRequirements();
    }
  }, [isAuthenticated, user, checkAuthStatus, loadRequirements]);

  // Update time every second for unauthenticated users
  useEffect(() => {
    if (!isAuthenticated) {
      const timer = setInterval(() => {
        setCurrentTime(new Date());
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isAuthenticated]);

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
        // Status will default to 'NEW' on backend
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

  const handleEdit = (requirement: RequirementItem) => {
    setEditingRequirement(requirement);
    setEditContent(requirement.content);
    setEditIsPrivate(requirement.is_private);
    setEditStatus(requirement.status as RequirementStatus);
  };

  const handleCancelEdit = () => {
    setEditingRequirement(null);
    setEditContent('');
    setEditIsPrivate(false);
    setEditStatus('NEW');
  };

  const handleUpdateRequirement = async () => {
    if (!editingRequirement || !editContent.trim()) {
      return;
    }

    try {
      await updateRequirement(editingRequirement.id, {
        content: editContent.trim(),
        is_private: editIsPrivate,
        status: editStatus,
      });
      
      // Reset edit state
      handleCancelEdit();
      
      // Show success message
      alert('Requirement updated successfully!');
    } catch (error) {
      // Error is handled by the store
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'NEW':
        return 'bg-blue-100 text-blue-800';
      case 'IN_PROGRESS':
        return 'bg-yellow-100 text-yellow-800';
      case 'DONE':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 via-blue-50 to-green-50 p-6 space-y-6">
        <Navbar />
        
        <main className="max-w-md mx-auto bg-white/80 backdrop-blur p-6 rounded-2xl shadow-md border border-slate-100">
          <section className="text-center space-y-4">
            <h2 className="text-3xl font-bold text-slate-700">Welcome</h2>
            <p className="text-slate-600">Please log in to access the Requirement module and submit your requirements</p>
            <div className="text-6xl font-bold text-slate-800 tracking-wider">
              {currentTime.toLocaleTimeString('th-TH', { 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: false
              })}
            </div>
            <div className="space-y-2">
              <button
                onClick={() => navigate('/login')}
                className="w-full bg-sky-300 hover:bg-sky-400 text-white font-semibold py-2 rounded shadow transition-colors"
              >
                Login
              </button>
              <button
                onClick={() => navigate('/register')}
                className="w-full bg-emerald-300 hover:bg-emerald-400 text-slate-700 font-semibold py-2 rounded shadow transition-colors"
              >
                Register
              </button>
            </div>
          </section>
        </main>
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
            <div className="flex items-center space-x-2">
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

        {/* Requirements List */}
        <section className="bg-white/80 backdrop-blur p-6 rounded-2xl shadow-md border border-slate-100">
          <h2 className="text-2xl font-semibold text-slate-700 mb-4">
            Requirements
          </h2>
          <p className="text-slate-600 text-sm mb-3">
            ADMIN can see and edit all requirements. VISITOR can see their own or public ones.
          </p>
          
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
                    <th className="border border-slate-200 p-2 text-left">Status</th>
                    <th className="border border-slate-200 p-2 text-left">Created By</th>
                    <th className="border border-slate-200 p-2 text-left">Date</th>
                    {isAdmin && (
                      <th className="border border-slate-200 p-2 text-left">Actions</th>
                    )}
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
                      <td className="border border-slate-200 p-2">
                        <span
                          className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(requirement.status)}`}
                        >
                          {requirement.status}
                        </span>
                      </td>
                      <td className="border border-slate-200 p-2 font-mono text-xs">
                        {requirement.created_by}
                      </td>
                      <td className="border border-slate-200 p-2">
                        {new Date(requirement.created_at).toLocaleDateString()}
                      </td>
                      {isAdmin && (
                        <td className="border border-slate-200 p-2">
                          <button
                            onClick={() => handleEdit(requirement)}
                            className="text-xs bg-sky-200 hover:bg-sky-300 text-slate-700 px-2 py-1 rounded transition-colors"
                          >
                            Edit
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Edit Requirement Section (ADMIN Only) */}
        {isAdmin && editingRequirement && (
          <section className="bg-white/80 backdrop-blur p-6 rounded-2xl shadow-md border border-slate-100">
            <h2 className="text-2xl font-semibold text-slate-700 mb-4">
              Edit Requirement (ADMIN Only)
            </h2>
            
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full h-40 p-3 border border-slate-200 rounded-lg bg-white/70 font-mono text-slate-700 focus:ring-2 focus:ring-sky-200 transition-colors"
              placeholder="Edit requirement content..."
            />
            
            <div className="flex items-center justify-between mt-3">
              <label className="flex items-center space-x-2 text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editIsPrivate}
                  onChange={(e) => setEditIsPrivate(e.target.checked)}
                  className="accent-sky-400"
                />
                <span>Private</span>
              </label>
              
              <select
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value as RequirementStatus)}
                className="border border-slate-200 rounded p-2 bg-white/70 text-slate-700 focus:ring-2 focus:ring-sky-200"
              >
                <option value="NEW">NEW</option>
                <option value="IN_PROGRESS">IN_PROGRESS</option>
                <option value="DONE">DONE</option>
              </select>
            </div>
            
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={handleCancelEdit}
                className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-6 py-2 rounded shadow transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateRequirement}
                disabled={isLoading || !editContent.trim()}
                className="bg-sky-300 hover:bg-sky-400 disabled:bg-slate-200 disabled:text-slate-400 text-white px-6 py-2 rounded shadow transition-colors"
              >
                {isLoading ? <LoadingSpinner size="sm" /> : 'Update'}
              </button>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};