import { useRef, useEffect } from 'react';
import { ChatMessage } from './ChatMessage';
import { TypingIndicator } from './TypingIndicator';
import { ScrollButtons } from './ScrollButtons';

export const ChatWindow = ({ messages, isLoading }) => {
  const messagesEndRef = useRef(null);
  const chatWindowRef = useRef(null); // Ref for the scrollable container

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div ref={chatWindowRef} className="flex-1 overflow-y-auto p-4 space-y-4 relative">
      {messages.map((msg, index) => (
        <ChatMessage key={index} message={msg} />
      ))}
      {isLoading && <TypingIndicator />}
      <div ref={messagesEndRef} />
      <ScrollButtons chatWindowRef={chatWindowRef} />
    </div>
  );
};