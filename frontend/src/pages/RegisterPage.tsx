import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores';
import { Button, LoadingSpinner, ErrorMessage } from '../components';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { register, isLoading, error, clearError, isAuthenticated } = useAuthStore();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || !email || !password) {
      return;
    }

    try {
      await register({ phone, email, password });
      navigate('/');
    } catch (error) {
      // Error handled by store
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-blue-50 to-green-50 p-6">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="text-2xl font-bold text-slate-700 hover:text-slate-900">
            JSON Preview Tool
          </Link>
        </div>

        {/* Register Form */}
        <div className="bg-white/80 backdrop-blur p-6 rounded-2xl shadow-md border border-slate-100">
          <h2 className="text-2xl font-semibold text-slate-700 mb-6 text-center">Register</h2>

          {error && (
            <ErrorMessage
              message={error}
              onDismiss={clearError}
              className="mb-4"
            />
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="tel"
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-3 border border-slate-200 rounded-lg bg-white/70 focus:ring-2 focus:ring-sky-200 focus:border-sky-300 transition-colors"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-slate-200 rounded-lg bg-white/70 focus:ring-2 focus:ring-sky-200 focus:border-sky-300 transition-colors"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-slate-200 rounded-lg bg-white/70 focus:ring-2 focus:ring-sky-200 focus:border-sky-300 transition-colors"
                required
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !phone || !email || !password}
              className="w-full bg-emerald-300 hover:bg-emerald-400 text-slate-700 font-semibold py-3 rounded-lg shadow transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? <LoadingSpinner size="sm" /> : 'Register'}
            </button>
          </form>

          <div className="text-center mt-6">
            <p className="text-sm text-slate-600">
              Already have an account?{' '}
              <Link to="/login" className="text-sky-600 hover:text-sky-800 hover:underline font-medium">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};