import botAvatar from '../assets/bot-avatar.svg';
import { User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { CodeBlock } from './CodeBlock'; // Import our new CodeBlock
import { useState } from 'react';

export const ChatMessage = ({ message }) => {
  const { role, parts } = message;
  const isUser = role === 'user';
  const text = parts[0].text;
  const [theme] = useState(localStorage.getItem('theme') || 'light');

  return (
    <div className={`flex items-start gap-4 p-4 ${isUser ? 'justify-end' : ''}`}>
      {!isUser && (
        <img src={botAvatar} alt="AI Avatar" className="w-10 h-10 rounded-full flex-shrink-0" />
      )}
      <div
        className={`max-w-2xl p-4 rounded-2xl shadow-sm ${
          isUser
            ? 'bg-blue-500 text-white rounded-br-lg'
            : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-lg'
        }`}
      >
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <ReactMarkdown
            children={text}
            components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '');
                const codeString = String(children).replace(/\n$/, '');
                return !inline && match ? (
                  <CodeBlock language={match[1]} code={codeString} theme={theme} />
                ) : (
                  <code className="bg-gray-200 dark:bg-gray-600 rounded-md px-1.5 py-0.5 font-mono text-sm" {...props}>
                    {children}
                  </code>
                );
              },
            }}
          />
        </div>
      </div>
       {isUser && (
        <div className="w-10 h-10 rounded-full flex-shrink-0 bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
            <User className="w-6 h-6 text-gray-600 dark:text-gray-300" />
        </div>
      )}
    </div>
  );
};