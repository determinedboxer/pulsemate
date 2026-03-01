// components/MessageBubble.tsx
"use client";

interface Message {
  id: number;
  sender: 'user' | 'mia';
  text: string;
  timestamp: Date | number;
  image?: string;
  blurred?: boolean;
}

interface MessageBubbleProps {
  message: Message;
  onUnlockImage?: () => void;
}

export default function MessageBubble({ message, onUnlockImage }: MessageBubbleProps) {
  const isUser = message.sender === 'user';
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
        isUser 
          ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-br-md' 
          : 'bg-purple-900/50 text-white rounded-bl-md border border-purple-500/30'
      }`}>
        {message.image && (
          <div className="mb-2">
            {message.blurred ? (
              <div className="relative">
                <img 
                  src={message.image} 
                  alt="Teaser" 
                  className="w-full h-32 object-cover rounded-lg blur-sm"
                />
                <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                  <button 
                    onClick={onUnlockImage}
                    className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full text-sm font-medium hover:brightness-110 transition"
                  >
                    Unlock for 400 gems
                  </button>
                </div>
              </div>
            ) : (
              <img 
                src={message.image} 
                alt="Unlocked" 
                className="w-full h-32 object-cover rounded-lg"
              />
            )}
          </div>
        )}
        
        <p className="text-sm">{message.text}</p>
        
        <div className={`text-xs mt-1 ${isUser ? 'text-pink-100' : 'text-purple-300'}`}>
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
}