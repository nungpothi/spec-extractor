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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileJsonMenuOpen, setIsMobileJsonMenuOpen] = useState(false);
  const closeMenuTimeoutRef = useRef<number | null>(null);

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
    setIsMobileJsonMenuOpen(false);
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
    setIsMobileMenuOpen(false);
    setIsMobileJsonMenuOpen(false);
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
    <>
      <nav
        className={`fixed inset-x-0 top-0 z-50 w-full border-b border-slate-200 bg-white/80 px-4 py-3 backdrop-blur md:px-6 ${className}`}
      >
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between">
        <Link
          to="/"
          className="text-2xl font-bold text-slate-700 transition-colors hover:text-slate-900"
        >
          JSON Preview Tool
        </Link>

        <div className="flex items-center md:hidden">
          {isAuthenticated && (
            <span className="mr-4 text-sm text-slate-500">
              {user?.email}
            </span>
          )}
          <button
            type="button"
            aria-label="Toggle navigation"
            aria-controls="navbar-menu"
            aria-expanded={isMobileMenuOpen}
            onClick={() => {
              setIsMobileMenuOpen((prev) => !prev);
              setIsMobileJsonMenuOpen(false);
            }}
            className="inline-flex items-center justify-center rounded-md border border-slate-300 p-2 text-slate-600 transition-colors hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
          >
            {isMobileMenuOpen ? (
              <svg
                className="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg
                className="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 5.25h16.5M3.75 12h16.5m-16.5 6.75h16.5" />
              </svg>
            )}
          </button>
        </div>

        <ul className="hidden items-center space-x-4 text-slate-600 font-medium md:flex">
          {isAuthenticated ? (
            <>
              <li>
                <Link to="/" className="transition-colors hover:text-slate-900">
                  Requirement
                </Link>
              </li>
              <li>
                <Link to="/webhook" className="transition-colors hover:text-slate-900">
                  Webhook
                </Link>
              </li>
              <li>
                <Link to="/quotations" className="transition-colors hover:text-slate-900">
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
                      className="flex items-center space-x-1 transition-colors hover:text-slate-900"
                      aria-haspopup="menu"
                      aria-expanded={isJsonMenuOpen}
                      onClick={() => setIsJsonMenuOpen((prev) => !prev)}
                    >
                      <span>JSON</span>
                      <span aria-hidden="true">▾</span>
                    </button>
                    <ul
                      className={`absolute right-0 mt-2 w-44 rounded border border-slate-200 bg-white/95 py-2 text-sm text-slate-700 shadow-lg backdrop-blur z-50 ${
                        isJsonMenuOpen ? 'block' : 'hidden'
                      }`}
                      role="menu"
                      onMouseEnter={clearCloseMenuTimeout}
                      onMouseLeave={scheduleMenuClose}
                    >
                      <li>
                        <Link
                          to="/preview"
                          className="block px-4 py-2 transition-colors hover:bg-slate-100"
                          role="menuitem"
                          onClick={() => setIsJsonMenuOpen(false)}
                        >
                          JSON Viewer
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/summary"
                          className="block px-4 py-2 transition-colors hover:bg-slate-100"
                          role="menuitem"
                          onClick={() => setIsJsonMenuOpen(false)}
                        >
                          Prompt Summary
                        </Link>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <Link to="/user" className="transition-colors hover:text-slate-900">
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
                  className="rounded bg-red-300 px-3 py-1 text-white transition-colors hover:bg-red-400"
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/" className="transition-colors hover:text-slate-900">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className="rounded bg-sky-300 px-3 py-1 text-white transition-colors hover:bg-sky-400"
                >
                  Login
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>

        <div
          id="navbar-menu"
          className={`mx-auto w-full max-w-6xl border-t border-slate-200 bg-white/95 py-4 text-slate-600 backdrop-blur md:hidden ${
            isMobileMenuOpen ? 'block' : 'hidden'
          }`}
        >
        <ul className="flex flex-col space-y-3 font-medium">
          {isAuthenticated ? (
            <>
              <li>
                <Link
                  to="/"
                  className="block rounded px-2 py-2 transition-colors hover:bg-slate-100"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Requirement
                </Link>
              </li>
              <li>
                <Link
                  to="/webhook"
                  className="block rounded px-2 py-2 transition-colors hover:bg-slate-100"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Webhook
                </Link>
              </li>
              <li>
                <Link
                  to="/quotations"
                  className="block rounded px-2 py-2 transition-colors hover:bg-slate-100"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Quotation
                </Link>
              </li>
              {isAdmin && (
                <li>
                  <button
                    type="button"
                    className="flex w-full items-center justify-between rounded px-2 py-2 text-left transition-colors hover:bg-slate-100"
                    onClick={() => setIsMobileJsonMenuOpen((prev) => !prev)}
                    aria-expanded={isMobileJsonMenuOpen}
                    aria-controls="mobile-json-menu"
                  >
                    <span>JSON</span>
                    <span aria-hidden="true">{isMobileJsonMenuOpen ? '▴' : '▾'}</span>
                  </button>
                  <ul
                    id="mobile-json-menu"
                    className={`mt-2 space-y-2 border-l border-slate-200 pl-4 text-sm text-slate-500 ${
                      isMobileJsonMenuOpen ? 'block' : 'hidden'
                    }`}
                  >
                    <li>
                      <Link
                        to="/preview"
                        className="block rounded px-2 py-2 transition-colors hover:bg-slate-100"
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          setIsMobileJsonMenuOpen(false);
                        }}
                      >
                        JSON Viewer
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/summary"
                        className="block rounded px-2 py-2 transition-colors hover:bg-slate-100"
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          setIsMobileJsonMenuOpen(false);
                        }}
                      >
                        Prompt Summary
                      </Link>
                    </li>
                  </ul>
                </li>
              )}
              {isAdmin && (
                <li>
                  <Link
                    to="/user"
                    className="block rounded px-2 py-2 transition-colors hover:bg-slate-100"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    User
                  </Link>
                </li>
              )}
              <li className="pt-2 text-sm text-slate-500">
                {user?.email} ({user?.role})
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="block w-full rounded bg-red-300 px-3 py-2 text-white transition-colors hover:bg-red-400"
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link
                  to="/"
                  className="block rounded px-2 py-2 transition-colors hover:bg-slate-100"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className="block rounded bg-sky-300 px-3 py-2 text-center text-white transition-colors hover:bg-sky-400"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
              </li>
            </>
          )}
        </ul>
        </div>
      </nav>
      <div aria-hidden="true" className="h-20 md:h-24" />
    </>
  );
};
