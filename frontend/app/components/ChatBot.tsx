// components/ChatBot.tsx
"use client";

import { useState, ChangeEvent } from 'react';

type Message = {
  text: string;
  from: 'user' | 'bot';
};

const ChatBot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');

  const handleSendMessage = () => {
    if (input.trim()) {
      setMessages((prevMessages) => [...prevMessages, { text: input, from: 'user' }]);
      setInput('');

      setTimeout(() => {
        setMessages((prevMessages) => [...prevMessages, { text: "Bot's response", from: 'bot' }]);
      }, 500);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  return (
    <div className="fixed bottom-0 right-0 bg-white shadow-lg w-96 p-4 rounded-lg">
      <div className="h-72 overflow-y-scroll space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
            <p className={`p-3 rounded-lg text-sm ${msg.from === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
              {msg.text}
            </p>
          </div>
        ))}
      </div>
      <input
        className="border border-gray-300 rounded-full py-2 px-4 text-sm text-gray-700 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 mt-4"
        value={input}
        onChange={handleInputChange}
        placeholder="Type a message..."
      />
      <button
        className="bg-blue-500 text-white rounded-full py-2 px-6 mt-2 hover:bg-blue-600 transition-all"
        onClick={handleSendMessage}
      >
        Send
      </button>
    </div>
  );
};

export default ChatBot;
