// IMPORTANT: Replace this with your actual Google AI Gemini API key
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

// This is the core prompt that defines the AI's role.
// It's sent with every request to keep the AI focused.
const systemPrompt = `
You are my dedicated programming tutor for dart and flutter. I will request one specific topic or concept at a time. For each topic:

Start by asking me what I already know about it to gauge my current understanding.

Explain the concept clearly, starting with the basics but including all relevant technical depth.

Show multiple code examples — including correct, incorrect, and optimized versions — and explain why each works or fails.

Give me targeted exercises of increasing difficulty, one at a time. Review my solution after each exercise and point out mistakes, improvements, and performance considerations.

Ask me follow-up questions to confirm I understand the 'why', not just the 'how'.

Offer an optional mini-project that applies the concept in a real-world context.

Do not move to the next concept until I explicitly say I'm ready. Keep challenging me until my answers show mastery.

Always adapt your teaching style based on my responses. Push me to think, but give hints instead of direct answers when I'm stuck. The goal is deep understanding, not memorization`;

export const getTutorResponse = async (userMessage, chatHistory) => {
  // We'll combine the system prompt with the chat history for a more robust request.
  const fullHistory = [
    // Start with the system prompt to set the context.
    {
      role: "user",
      parts: [{ text: systemPrompt }],
    },
    {
      role: "model",
      parts: [{ text: "OK, I understand my role. I'm ready to help teach Dart and Flutter!" }],
    },
    // Then add the rest of the conversation
    ...chatHistory,
    // Finally, add the latest user message
    {
      role: "user",
      parts: [{ text: userMessage }],
    }
  ];

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        // The API key is now sent as a header, which is the correct method.
        'X-goog-api-key': API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: fullHistory,
        generationConfig: {
          temperature: 0.7,
          topK: 1,
          topP: 1,
          maxOutputTokens: 2048,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("API Error Response:", errorData);
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!text) {
      throw new Error("Failed to extract text from API response.");
    }

    return text;

  } catch (error) {
    console.error("Error communicating with Gemini API:", error);
    return "😥 Oops! I'm having a little trouble connecting right now. Please check the API key and your connection, then try again.";
  }
};