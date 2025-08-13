import { ArrowDown, ArrowUp } from 'lucide-react';
import { useState, useEffect } from 'react';

export const ScrollButtons = ({ chatWindowRef }) => {
  const [showButtons, setShowButtons] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (chatWindowRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = chatWindowRef.current;
        setShowButtons(scrollHeight > clientHeight);
      }
    };
    
    const chatWindow = chatWindowRef.current;
    chatWindow?.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    return () => chatWindow?.removeEventListener('scroll', handleScroll);
  }, [chatWindowRef]);

  const scrollToTop = () => {
    chatWindowRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToBottom = () => {
    chatWindowRef.current?.scrollTo({ top: chatWindowRef.current.scrollHeight, behavior: 'smooth' });
  };

  if (!showButtons) return null;

  return (
    <div className="absolute bottom-20 right-6 space-y-2">
      <button onClick={scrollToTop} className="p-3 rounded-full bg-black/50 text-white backdrop-blur-sm hover:bg-black/70 transition-colors">
        <ArrowUp size={20} />
      </button>
      <button onClick={scrollToBottom} className="p-3 rounded-full bg-black/50 text-white backdrop-blur-sm hover:bg-black/70 transition-colors">
        <ArrowDown size={20} />
      </button>
    </div>
  );
};