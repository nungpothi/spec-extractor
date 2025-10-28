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
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-sky-100 via-emerald-100 to-rose-100 px-6 py-10">
      <div className="pointer-events-none absolute -left-20 top-10 h-72 w-72 rounded-full bg-sky-200/60 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-emerald-200/60 blur-3xl" />
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-96 w-96 -translate-x-1/2 rounded-full bg-white/30 blur-3xl" />

      {/* Navigation */}
      <nav className="relative z-10 mx-auto mb-14 flex max-w-5xl items-center justify-between rounded-full border border-white/30 bg-white/40 px-6 py-4 shadow-xl backdrop-blur">
        <h1 className="text-2xl font-bold text-slate-700">JSON Preview Tool</h1>
        <ul className="flex items-center space-x-4 text-slate-600 font-medium">
          <li>
            <Link to="/" className="rounded-full px-4 py-2 transition-colors hover:bg-white/60 hover:text-slate-900">
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/login"
              className="rounded-full bg-sky-300/80 px-4 py-2 text-white shadow-sm transition hover:bg-sky-300"
            >
              Login
            </Link>
          </li>
        </ul>
      </nav>

      {/* Welcome Content */}
      <main className="relative z-10 mx-auto flex max-w-3xl flex-col items-center justify-center">
        <section className="w-full rounded-3xl border border-white/30 bg-white/30 p-10 text-center shadow-[0_25px_65px_-30px_rgba(45,99,130,0.45)] backdrop-blur-xl">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-white/40 bg-gradient-to-br from-sky-200/80 to-emerald-200/80 shadow-inner">
            <span className="text-3xl">✨</span>
          </div>
          <h2 className="text-4xl font-extrabold text-slate-700 drop-shadow-sm">Liquid Glass Welcome</h2>
          <p className="mt-4 text-base text-slate-600">
            Step into your pastel workspace and access tools designed for effortless JSON exploration.
          </p>

          {/* Digital Clock */}
          <div className="mx-auto mt-8 inline-flex rounded-full border border-white/40 bg-white/40 px-8 py-3 font-mono text-5xl font-bold tracking-widest text-slate-800 shadow-inner">
            {currentTime}
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              to="/login"
              className="inline-flex items-center justify-center rounded-full bg-sky-400/80 px-10 py-3 text-base font-semibold text-white shadow-lg transition hover:bg-sky-400/90"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center justify-center rounded-full bg-emerald-300/80 px-10 py-3 text-base font-semibold text-slate-700 shadow-lg transition hover:bg-emerald-300/90"
            >
              Register
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
};
