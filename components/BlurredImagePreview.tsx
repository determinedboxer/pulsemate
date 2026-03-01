// components/BlurredImagePreview.tsx
"use client";

interface BlurredImagePreviewProps {
  imageUrl: string;
  onUnlock: () => void;
  gemCost?: number;
}

export default function BlurredImagePreview({ 
  imageUrl, 
  onUnlock, 
  gemCost = 400 
}: BlurredImagePreviewProps) {
  return (
    <div className="relative">
      <img 
        src={imageUrl} 
        alt="Teaser preview" 
        className="w-full h-32 object-cover rounded-lg blur-sm"
      />
      <div className="absolute inset-0 bg-black/50 rounded-lg flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <p className="text-white font-medium mb-3">
            Unlock this photo for {gemCost} gems 💎
          </p>
          <button 
            onClick={onUnlock}
            className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full text-sm font-medium hover:brightness-110 transition transform hover:scale-105"
          >
            Unlock Now
          </button>
        </div>
      </div>
    </div>
  );
}