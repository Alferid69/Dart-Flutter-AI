import { useState, useEffect } from 'react';
import { Sun, Moon, Menu, X } from 'lucide-react'; // 1. Import the X icon

const personalities = [
  { value: 'default', label: 'Default Tutor' },
  { value: 'gen_z', label: 'Gen-Z' },
  { value: 'formal', label: 'Formal' },
  { value: 'pirate', label: 'Pirate' },
];

// 2. Accept isSidebarOpen prop
export const Header = ({ activeChat, updateChatPersonality, isSidebarOpen, toggleSidebar }) => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  const handlePersonalityChange = (e) => {
    if (activeChat) {
      updateChatPersonality(activeChat.id, e.target.value);
    }
  };

  return (
    <header className="p-4 border-b dark:border-gray-700 flex justify-between items-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          {/* 3. Conditionally render the icon */}
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <h1 className="text-xl font-bold text-gray-800 dark:text-white">
          AI Assistant
        </h1>
      </div>
      <div className="flex items-center gap-4">
        {activeChat && (
          <select
            value={activeChat.personality}
            onChange={handlePersonalityChange}
            className="bg-gray-200 dark:bg-gray-700 border-none rounded-md px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          >
            {personalities.map(p => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>
        )}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
      </div>
    </header>
  );
};