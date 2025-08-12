import botAvatar from '../assets/bot-avatar.svg';
import { User } from 'lucide-react';

// Use a markdown parser to render code blocks correctly
import { memo } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

const MemoizedMarkdown = memo(({ theme, markdown }) => {
    return (
        <ReactMarkdown
            children={markdown}
            components={{
                code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '');
                    return !inline && match ? (
                        <SyntaxHighlighter
                            children={String(children).replace(/\n$/, '')}
                            style={theme === 'dark' ? oneDark : oneLight}
                            language={match[1]}
                            PreTag="div"
                            {...props}
                        />
                    ) : (
                        <code className="bg-gray-200 dark:bg-gray-700 rounded-md px-1.5 py-0.5 font-mono text-sm" {...props}>
                            {children}
                        </code>
                    );
                },
            }}
        >
            {markdown}
        </ReactMarkdown>
    );
});


export const ChatMessage = ({ message, theme }) => {
  const { role, parts } = message;
  const isUser = role === 'user';
  const text = parts[0].text;

  return (
    <div className={`flex items-start gap-4 p-4 ${isUser ? 'justify-end' : ''}`}>
      {!isUser && (
        <img src={botAvatar} alt="AI Avatar" className="w-10 h-10 rounded-full flex-shrink-0" />
      )}
      <div
        className={`max-w-xl p-4 rounded-2xl ${
          isUser
            ? 'bg-blue-500 text-white rounded-br-lg'
            : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-lg'
        }`}
      >
        <div className="prose prose-sm dark:prose-invert max-w-none">
            <MemoizedMarkdown theme={theme} markdown={text} />
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