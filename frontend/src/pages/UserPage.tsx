import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores';
import { LoadingSpinner, ErrorMessage } from '../components';

export const UserPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isLoading, error, logout, getProfile, isAuthenticated, clearError } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (!user) {
      getProfile();
    }
  }, [isAuthenticated, user, getProfile, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!isAuthenticated) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 via-blue-50 to-green-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-blue-50 to-green-50 p-6 space-y-6">
      <header className="max-w-5xl mx-auto flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-700">User Profile</h1>
        <button 
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-slate-300 hover:bg-slate-400 text-slate-700 rounded shadow transition-colors"
        >
          Back to Home
        </button>
      </header>

      {error && (
        <ErrorMessage
          message={error}
          onDismiss={clearError}
          className="max-w-2xl mx-auto"
        />
      )}

      <div className="max-w-2xl mx-auto bg-white/80 backdrop-blur p-6 rounded-2xl shadow-md border border-slate-100">
        {user ? (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-slate-700 mb-2">Profile Information</h2>
              <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                user.role === 'ADMIN' 
                  ? 'bg-purple-100 text-purple-800' 
                  : 'bg-blue-100 text-blue-800'
              }`}>
                {user.role}
              </div>
            </div>

            <div className="grid gap-4">
              <div className="bg-slate-50 p-4 rounded-lg">
                <label className="block text-sm font-medium text-slate-600 mb-1">Email</label>
                <p className="text-slate-800 font-medium">{user.email}</p>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg">
                <label className="block text-sm font-medium text-slate-600 mb-1">Phone</label>
                <p className="text-slate-800 font-medium">{user.phone}</p>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg">
                <label className="block text-sm font-medium text-slate-600 mb-1">User ID</label>
                <p className="text-slate-800 font-mono text-sm">{user.id}</p>
              </div>
            </div>

            <div className="flex justify-center pt-4">
              <button
                onClick={handleLogout}
                className="bg-red-300 hover:bg-red-400 text-slate-700 font-semibold px-6 py-3 rounded-lg shadow transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center text-slate-600">
            <p>Unable to load user profile</p>
            <button
              onClick={() => getProfile()}
              className="mt-4 bg-sky-300 hover:bg-sky-400 text-white px-4 py-2 rounded shadow transition-colors"
            >
              Retry
            </button>
          </div>
        )}
      </div>
    </div>
  );
};