import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

export const Header = () => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <header className="p-4 border-b dark:border-gray-700 flex justify-between items-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0">
      <h1 className="text-xl font-bold text-gray-800 dark:text-white">
        My Dart/Flutter AI Tutor 🚀
      </h1>
      <button
        onClick={toggleTheme}
        className="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      >
        {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
      </button>
    </header>
  );
};