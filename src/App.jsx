import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Header } from './components/Header';
import { Sidebar } from './views/Sidebar';
import { ChatView } from './views/ChatView';
import { getTutorResponse } from './services/geminiService';

// Key for saving chat data to the browser's local storage
const CHATS_KEY = 'ai_assistant_chats';

function App() {
  // State for managing all chat sessions, loaded from localStorage
  const [chats, setChats] = useState(() => {
    try {
      const savedChats = localStorage.getItem(CHATS_KEY);
      return savedChats ? JSON.parse(savedChats) : [];
    } catch (error) {
      console.error("Failed to parse chats from localStorage", error);
      return [];
    }
  });

  // State for the currently active chat ID
  const [activeChatId, setActiveChatId] = useState(null);
  // State to show a loading indicator while the AI is responding
  const [isLoading, setIsLoading] = useState(false);
  // State to control the visibility of the sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Effect to save chats to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(CHATS_KEY, JSON.stringify(chats));
  }, [chats]);

  // Effect to set an active chat if one isn't set
  useEffect(() => {
    if (!activeChatId && chats.length > 0) {
      setActiveChatId(chats[0].id);
    }
  }, [activeChatId, chats]);

  // Find the full object for the currently active chat
  const activeChat = chats.find(c => c.id === activeChatId);

  /**
   * Creates a new chat session.
   * @param {'flutter' | 'normal'} type - The type of chat to create.
   */
  const newChat = (type) => {
    const title = type === 'flutter' ? 'New Flutter Chat' : 'New General Chat';
    const newChat = {
      id: uuidv4(),
      title,
      type,
      personality: 'default',
      messages: [{
        role: 'model',
        parts: [{ text: type === 'flutter' ? "Hello! I'm your Flutter/Dart tutor. Ask me anything!" : "Hi there! How can I help you today?" }]
      }]
    };
    setChats([newChat, ...chats]);
    setActiveChatId(newChat.id);
  };

  /**
   * Deletes a chat session by its ID.
   * @param {string} id - The ID of the chat to delete.
   */
  const deleteChat = (id) => {
    setChats(chats.filter(c => c.id !== id));
    // If the deleted chat was the active one, switch to another chat
    if (activeChatId === id) {
      const remainingChats = chats.filter(c => c.id !== id);
      setActiveChatId(remainingChats.length > 0 ? remainingChats[0].id : null);
    }
  };

  /**
   * Updates the personality for a specific chat.
   * @param {string} id - The ID of the chat to update.
   * @param {string} personality - The new personality value.
   */
  const updateChatPersonality = (id, personality) => {
    setChats(chats.map(c => c.id === id ? { ...c, personality } : c));
  };
  
  /**
   * Updates the title for a specific chat.
   * @param {string} id - The ID of the chat to update.
   * @param {string} newTitle - The new title for the chat.
   */
  const updateChatTitle = (id, newTitle) => {
    setChats(chats.map(c => c.id === id ? { ...c, title: newTitle } : c));
  };

  /**
   * Handles sending a message to the AI and updating the chat history.
   * @param {string} userMessage - The message from the user.
   */
  const handleSendMessage = async (userMessage) => {
    if (!activeChat) return;
    
    const newUserMessage = { role: 'user', parts: [{ text: userMessage }] };
    const updatedMessages = [...activeChat.messages, newUserMessage];
    
    // Immediately update the UI with the user's message
    setChats(chats.map(c => c.id === activeChatId ? { ...c, messages: updatedMessages } : c));
    setIsLoading(true);

    try {
      // Prepare the history for the API call (excluding the latest user message)
      const history = activeChat.messages.map(msg => ({ role: msg.role, parts: msg.parts }));
      const aiResponseText = await getTutorResponse(userMessage, history, activeChat.type, activeChat.personality);
      const newAiMessage = { role: 'model', parts: [{ text: aiResponseText }] };
      
      // Update the state with the AI's response
      setChats(prevChats => prevChats.map(c => 
        c.id === activeChatId ? { ...c, messages: [...updatedMessages, newAiMessage] } : c
      ));

    } catch (error) {
      console.error("Failed to get AI response:", error);
      const errorMessage = { role: 'model', parts: [{ text: "Sorry, I encountered an error. Please try again." }] };
      // Update the state with an error message if the API call fails
      setChats(prevChats => prevChats.map(c => 
        c.id === activeChatId ? { ...c, messages: [...updatedMessages, errorMessage] } : c
      ));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <Header
        activeChat={activeChat}
        updateChatPersonality={updateChatPersonality}
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar
          isSidebarOpen={isSidebarOpen}
          chats={chats}
          activeChatId={activeChatId}
          setActiveChatId={setActiveChatId}
          newChat={newChat}
          deleteChat={deleteChat}
          updateChatTitle={updateChatTitle}
        />
        <main className={`flex-1 flex flex-col bg-white dark:bg-gray-800/50 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
          <ChatView
            activeChat={activeChat}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
          />
        </main>
      </div>
    </div>
  );
}

export default App;
