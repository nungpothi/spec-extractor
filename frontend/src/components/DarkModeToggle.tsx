import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useDarkMode } from '@/hooks/useDarkMode';

export const DarkModeToggle: React.FC = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <button
      onClick={toggleDarkMode}
      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-pastel-accent dark:bg-gray-700 text-white hover:opacity-90 transition-all duration-200 shadow-md hover:shadow-lg"
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDarkMode ? (
        <>
          <Sun size={18} />
          <span className="hidden sm:inline">Light Mode</span>
        </>
      ) : (
        <>
          <Moon size={18} />
          <span className="hidden sm:inline">Dark Mode</span>
        </>
      )}
    </button>
  );
};