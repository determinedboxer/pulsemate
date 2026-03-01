// components/ChatInput.tsx
"use client";

import { useState } from 'react';

interface ChatInputProps {
  onSend: (text: string) => void;
}

export default function ChatInput({ onSend }: ChatInputProps) {
  const [inputText, setInputText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      onSend(inputText);
      setInputText('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3">
      <input
        type="text"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="Type a message..."
        className="flex-1 px-4 py-3 bg-purple-950/50 border border-purple-500/40 rounded-full text-white placeholder-purple-300 focus:outline-none focus:border-pink-500"
      />
      <button 
        type="submit"
        className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full font-medium hover:brightness-110 transition disabled:opacity-50"
        disabled={!inputText.trim()}
      >
        Send
      </button>
    </form>
  );
}