import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores';

interface NavbarProps {
  className?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ className = '' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuthStore();
  const [isJsonMenuOpen, setIsJsonMenuOpen] = useState(false);
  const closeMenuTimeoutRef = useRef<number | null>(null);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isAdmin = user?.role === 'ADMIN';

  const clearCloseMenuTimeout = () => {
    if (closeMenuTimeoutRef.current !== null) {
      window.clearTimeout(closeMenuTimeoutRef.current);
      closeMenuTimeoutRef.current = null;
    }
  };

  const scheduleMenuClose = () => {
    clearCloseMenuTimeout();
    closeMenuTimeoutRef.current = window.setTimeout(() => {
      setIsJsonMenuOpen(false);
    }, 150);
  };

  useEffect(() => {
    setIsJsonMenuOpen(false);
    clearCloseMenuTimeout();
  }, [location.pathname]);

  const handleJsonMenuBlur = (event: React.FocusEvent<HTMLLIElement>) => {
    const nextFocus = event.relatedTarget as HTMLElement | null;
    if (!nextFocus || !event.currentTarget.contains(nextFocus)) {
      setIsJsonMenuOpen(false);
    }
  };

  useEffect(() => {
    return () => {
      clearCloseMenuTimeout();
    };
  }, []);

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
                Requirement
              </Link>
            </li>
            <li>
              <Link to="/webhook" className="hover:text-slate-900 transition-colors">
                Webhook
              </Link>
            </li>
            <li>
              <Link to="/quotations" className="hover:text-slate-900 transition-colors">
                Quotation
              </Link>
            </li>
            {isAdmin && (
              <>
                <li
                  className="relative"
                  onMouseEnter={() => {
                    clearCloseMenuTimeout();
                    setIsJsonMenuOpen(true);
                  }}
                  onMouseLeave={scheduleMenuClose}
                  onFocus={() => setIsJsonMenuOpen(true)}
                  onBlur={handleJsonMenuBlur}
                >
                  <button
                    type="button"
                    className="hover:text-slate-900 transition-colors flex items-center space-x-1"
                    aria-haspopup="menu"
                    aria-expanded={isJsonMenuOpen}
                    onClick={() => setIsJsonMenuOpen((prev) => !prev)}
                  >
                    <span>JSON</span>
                    <span aria-hidden="true">▾</span>
                  </button>
                  <ul
                    className={`absolute right-0 mt-2 w-44 bg-white/90 backdrop-blur border border-slate-200 rounded shadow-lg text-sm text-slate-700 py-2 z-10 ${
                      isJsonMenuOpen ? 'block' : 'hidden'
                    }`}
                    role="menu"
                    onMouseEnter={clearCloseMenuTimeout}
                    onMouseLeave={scheduleMenuClose}
                  >
                    <li>
                      <Link
                        to="/preview"
                        className="block px-4 py-2 hover:bg-slate-100 transition-colors"
                        role="menuitem"
                        onClick={() => setIsJsonMenuOpen(false)}
                      >
                        JSON Viewer
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/summary"
                        className="block px-4 py-2 hover:bg-slate-100 transition-colors"
                        role="menuitem"
                        onClick={() => setIsJsonMenuOpen(false)}
                      >
                        Prompt Summary
                      </Link>
                    </li>
                  </ul>
                </li>
                <li>
                  <Link to="/user" className="hover:text-slate-900 transition-colors">
                    User
                  </Link>
                </li>
              </>
            )}
            <li>
              <span className="text-sm text-slate-500">
                {user?.email} ({user?.role})
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
