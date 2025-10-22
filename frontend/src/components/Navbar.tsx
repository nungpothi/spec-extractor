import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores';

interface NavbarProps {
  className?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ className = '' }) => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className={`max-w-5xl mx-auto flex justify-between items-center ${className}`}>
      <Link to="/" className="text-2xl font-bold text-slate-700 hover:text-slate-900 transition-colors">
        JSON Preview Tool
      </Link>
      
      <ul className="flex items-center space-x-4 text-slate-600 font-medium">
        {isAuthenticated ? (
          <>
            <li>
              <Link to="/" className="hover:text-slate-900 transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link to="/summary" className="hover:text-slate-900 transition-colors">
                Summary
              </Link>
            </li>
            <li>
              <Link to="/user" className="hover:text-slate-900 transition-colors">
                User
              </Link>
            </li>
            <li>
              <span className="text-sm text-slate-500">
                {user?.email}
              </span>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="bg-red-300 hover:bg-red-400 text-white px-3 py-1 rounded transition-colors"
              >
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/" className="hover:text-slate-900 transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link to="/login" className="bg-sky-300 hover:bg-sky-400 text-white px-3 py-1 rounded transition-colors">
                Login
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};