import { ChatWindow } from '../components/ChatWindow';
import { ChatInput } from '../components/ChatInput';

export const ChatView = ({ activeChat, onSendMessage, isLoading }) => {
  if (!activeChat) {
    return (
      <div className="flex-1 flex items-center justify-center text-center text-gray-500 dark:text-gray-400">
        <div>
          <h2 className="text-2xl font-semibold">Welcome to your AI Assistant</h2>
          <p>Select a chat or create a new one to get started.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col w-full h-full overflow-hidden">
      <ChatWindow messages={activeChat.messages} isLoading={isLoading} />
      <ChatInput onSend={onSendMessage} isLoading={isLoading} />
    </div>
  );
};