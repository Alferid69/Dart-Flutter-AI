import { useState } from 'react';
import { Send } from 'lucide-react';

export const ChatInput = ({ onSend, isLoading }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) {
      onSend(inputValue);
      setInputValue('');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-t dark:border-gray-700"
    >
      <div className="relative">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Ask me anything about Dart or Flutter..."
          disabled={isLoading}
          className="w-full pl-4 pr-12 py-3 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
        />
        <button
          type="submit"
          disabled={isLoading || !inputValue.trim()}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-blue-500 text-white disabled:bg-gray-400 disabled:dark:bg-gray-600 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
        >
          <Send size={18} />
        </button>
      </div>
    </form>
  );
};