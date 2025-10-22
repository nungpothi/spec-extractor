import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export const WelcomePage: React.FC = () => {
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
      setCurrentTime(timeString);
    };

    // Update immediately
    updateTime();

    // Update every second
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-blue-50 to-green-50 p-6">
      {/* Navigation */}
      <nav className="max-w-5xl mx-auto flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-slate-700">JSON Preview Tool</h1>
        <ul className="flex space-x-4 text-slate-600 font-medium">
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
        </ul>
      </nav>

      {/* Welcome Content */}
      <main className="max-w-md mx-auto bg-white/80 backdrop-blur p-6 rounded-2xl shadow-md border border-slate-100">
        <section className="text-center space-y-6">
          <h2 className="text-3xl font-bold text-slate-700">Welcome</h2>
          <p className="text-slate-600">Please log in to access all features</p>
          
          {/* Digital Clock */}
          <div className="text-6xl font-bold text-slate-800 tracking-wider font-mono">
            {currentTime}
          </div>

          <div className="pt-4 space-y-3">
            <Link
              to="/login"
              className="block w-full bg-sky-300 hover:bg-sky-400 text-white font-semibold py-3 rounded-lg shadow transition-colors text-center"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="block w-full bg-emerald-300 hover:bg-emerald-400 text-slate-700 font-semibold py-3 rounded-lg shadow transition-colors text-center"
            >
              Register
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
};