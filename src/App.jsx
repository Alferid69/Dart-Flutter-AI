import { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { ChatWindow } from "./components/ChatWindow";
import { ChatInput } from "./components/ChatInput";
import { getTutorResponse } from "./services/geminiService";
import { Analytics } from "@vercel/analytics/react";

// The key we'll use to save and retrieve the chat history in localStorage.
const CHAT_HISTORY_KEY = "flutter_tutor_history";

function App() {
  // 1. LOAD a aINITAL STATE FROM LOCALSTORAGE
  // When the app starts, it tries to load the history from localStorage.
  // If it can't find anything, it creates the initial welcome message.
  const [messages, setMessages] = useState(() => {
    const savedHistory = localStorage.getItem(CHAT_HISTORY_KEY);
    if (savedHistory) {
      return JSON.parse(savedHistory);
    } else {
      return [
        {
          role: "model",
          parts: [
            {
              text: "Hello! I'm your personal Dart and Flutter tutor. What would you like to learn about first?",
            },
          ],
        },
      ];
    }
  });

  const [isLoading, setIsLoading] = useState(false);

  // 2. SAVE STATE TO LOCALSTORAGE ON CHANGE
  // This `useEffect` hook runs every time the `messages` state changes.
  // It saves the updated array to localStorage.
  useEffect(() => {
    localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(messages));
  }, [messages]);

  const handleSend = async (userMessage) => {
    const newUserMessage = { role: "user", parts: [{ text: userMessage }] };

    // We get the latest messages directly from the state-updating function
    // to ensure we have the most current history for the API call.
    const updatedMessages = [...messages, newUserMessage];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      const chatHistory = updatedMessages.slice(0, -1).map((msg) => ({
        // Exclude the new user message we just added
        role: msg.role === "user" ? "user" : "model",
        parts: msg.parts,
      }));

      const aiResponseText = await getTutorResponse(userMessage, chatHistory);
      const newAiMessage = { role: "model", parts: [{ text: aiResponseText }] };
      setMessages([...updatedMessages, newAiMessage]);
    } catch (error) {
      console.error("Failed to get AI response:", error);
      const errorMessage = {
        role: "model",
        parts: [{ text: "Sorry, I encountered an error. Please try again." }],
      };
      setMessages([...updatedMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors">
      <Header />
      <main className="flex-1 flex flex-col max-w-4xl w-full mx-auto">
        <ChatWindow messages={messages} isLoading={isLoading} />
        <ChatInput onSend={handleSend} isLoading={isLoading} />
      </main>
      <Analytics />
    </div>
  );
}

export default App;
