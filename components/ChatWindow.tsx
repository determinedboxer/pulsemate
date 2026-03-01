// components/ChatWindow.tsx
"use client";

import { useState } from 'react';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';
import BlurredImagePreview from './BlurredImagePreview';

interface Message {
  id: number;
  sender: 'user' | 'mia';
  text: string;
  timestamp: Date | number;
  image?: string;
  blurred?: boolean;
}

interface ChatWindowProps {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

export default function ChatWindow({ messages, setMessages }: ChatWindowProps) {
  const [inputText, setInputText] = useState('');

  const handleSendMessage = () => {
    if (inputText.trim()) {
      const newMessage: Message = {
        id: messages.length + 1,
        sender: 'user',
        text: inputText,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, newMessage]);
      setInputText('');
      
      // Simulate Mia's response after delay
      setTimeout(() => {
        const miaResponse: Message = {
          id: messages.length + 2,
          sender: 'mia',
          text: "Mmm... I like how you talk 😘 Want to see more?",
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, miaResponse]);
      }, 1500);
    }
  };

  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <MessageBubble 
          key={message.id} 
          message={message} 
          onUnlockImage={() => {
            // Handle image unlock logic here
            console.log('Unlocking image for message:', message.id);
          }}
        />
      ))}
      
      <div className="h-20" /> {/* Spacer for input area */}
    </div>
  );
}