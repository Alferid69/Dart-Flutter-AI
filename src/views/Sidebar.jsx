import { useState } from 'react';
import { Plus, MessageSquare, Trash2, Pencil, Check } from 'lucide-react';

export const Sidebar = ({ isSidebarOpen, chats, activeChatId, setActiveChatId, newChat, deleteChat, updateChatTitle }) => {
  // State to track which chat is currently being edited
  const [editingChatId, setEditingChatId] = useState(null);
  // State to hold the temporary value of the title while editing
  const [editingTitle, setEditingTitle] = useState('');

  const handleStartEditing = (chat) => {
    setEditingChatId(chat.id);
    setEditingTitle(chat.title);
  };

  const handleSaveTitle = (chatId) => {
    if (editingTitle.trim()) {
      updateChatTitle(chatId, editingTitle.trim());
    }
    setEditingChatId(null); // Exit editing mode
    setEditingTitle('');
  };

  const handleKeyDown = (e, chatId) => {
    if (e.key === 'Enter') {
      handleSaveTitle(chatId);
    } else if (e.key === 'Escape') {
      setEditingChatId(null);
      setEditingTitle('');
    }
  };

  return (
    <div
      className={`absolute top-0 left-0 h-full w-64 bg-gray-100 dark:bg-gray-800 p-4 flex flex-col border-r dark:border-gray-700 z-20 transition-transform duration-300 ease-in-out ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Chats</h2>
      <div className="space-y-2 mb-4">
        <button
          onClick={() => newChat('flutter')}
          className="w-full flex items-center gap-2 p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
        >
          <Plus size={18} /> New Flutter Chat
        </button>
        <button
          onClick={() => newChat('normal')}
          className="w-full flex items-center gap-2 p-2 rounded-lg bg-gray-500 text-white hover:bg-gray-600 transition-colors"
        >
          <Plus size={18} /> New General Chat
        </button>
      </div>
      <div className="flex-1 overflow-y-auto -mr-2 pr-2">
        {chats.map(chat => (
          <div
            key={chat.id}
            onClick={() => editingChatId !== chat.id && setActiveChatId(chat.id)}
            className={`flex justify-between items-center p-3 rounded-lg group cursor-pointer mb-2 transition-colors ${
              activeChatId === chat.id && !editingChatId
                ? 'bg-blue-100 dark:bg-blue-900/50'
                : 'hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <MessageSquare size={18} className="text-gray-600 dark:text-gray-400 flex-shrink-0" />
              {/* Conditionally render either the title or an input field */}
              {editingChatId === chat.id ? (
                <input
                  type="text"
                  value={editingTitle}
                  onChange={(e) => setEditingTitle(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, chat.id)}
                  onBlur={() => handleSaveTitle(chat.id)}
                  className="bg-transparent text-sm font-medium w-full focus:outline-none focus:ring-1 focus:ring-blue-500 rounded px-1"
                  autoFocus
                />
              ) : (
                <span className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                  {chat.title}
                </span>
              )}
            </div>
            
            {/* Conditionally render the action buttons (edit/delete or save) */}
            <div className="flex items-center flex-shrink-0">
              {editingChatId === chat.id ? (
                <button onClick={() => handleSaveTitle(chat.id)} className="p-1 text-green-500 hover:text-green-600">
                  <Check size={16} />
                </button>
              ) : (
                <div className="flex items-center">
                  {/* The edit and delete buttons only appear when hovering over the chat item */}
                  <button onClick={() => handleStartEditing(chat)} className="p-1 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteChat(chat.id); }}
                    className="p-1 text-gray-500 hover:text-red-500 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
