"use client";

import { useState } from "react";
import { VIRTUAL_GIFTS, sendGift, getAffection } from "@/lib/gameSystems";

interface VirtualGiftsProps {
  modelId: string;
  modelName: string;
  gemsBalance: number;
  onGiftSent: (newBalance: number, message: string) => void;
}

export default function VirtualGifts({ modelId, modelName, gemsBalance, onGiftSent }: VirtualGiftsProps) {
  const [selectedGift, setSelectedGift] = useState<string | null>(null);
  const [showAnimation, setShowAnimation] = useState(false);
  const [animationGift, setAnimationGift] = useState<string>("");
  const affection = getAffection(modelId);

  const handleSendGift = (giftId: string) => {
    const result = sendGift(modelId, giftId);
    if (result.success) {
      const gift = VIRTUAL_GIFTS.find(g => g.id === giftId);
      setAnimationGift(gift?.emoji || "🎁");
      setShowAnimation(true);
      setTimeout(() => setShowAnimation(false), 2000);
      onGiftSent(gemsBalance - (gift?.price || 0), result.message);
      setSelectedGift(null);
    } else {
      alert(result.message);
    }
  };

  return (
    <div className="bg-black/40 backdrop-blur-lg rounded-2xl p-4 border border-purple-500/30">
      {/* Affection Meter */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-bold text-pink-400">❤️ Affection Level</span>
          <span className="text-sm font-bold">{affection.totalAffection}</span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-pink-500 to-red-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, (affection.totalAffection % 100))}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Level {Math.floor(affection.totalAffection / 100) + 1} • Send gifts to increase!
        </p>
      </div>

      {/* Gift Grid */}
      <div className="grid grid-cols-3 gap-2">
        {VIRTUAL_GIFTS.map((gift) => {
          const canAfford = gemsBalance >= gift.price;
          return (
            <button
              key={gift.id}
              onClick={() => canAfford && setSelectedGift(gift.id)}
              disabled={!canAfford}
              className={`p-3 rounded-xl border transition-all ${
                selectedGift === gift.id
                  ? "bg-pink-500/30 border-pink-500"
                  : canAfford
                  ? "bg-gray-800/50 border-gray-700 hover:border-pink-500/50"
                  : "bg-gray-900/30 border-gray-800 opacity-50 cursor-not-allowed"
              }`}
            >
              <div className="text-2xl mb-1">{gift.emoji}</div>
              <div className="text-xs font-bold">{gift.name}</div>
              <div className={`text-xs ${canAfford ? "text-yellow-400" : "text-gray-600"}`}>
                {gift.price} 💎
              </div>
            </button>
          );
        })}
      </div>

      {/* Send Button */}
      {selectedGift && (
        <button
          onClick={() => handleSendGift(selectedGift)}
          className="w-full mt-4 py-3 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl font-bold hover:brightness-110 transition animate-pulse"
        >
          Send Gift to {modelName}! 🎁
        </button>
      )}

      {/* Gift Animation Overlay */}
      {showAnimation && (
        <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-[300]">
          <div className="text-[150px] animate-bounce drop-shadow-[0_0_50px_rgba(255,0,255,0.8)]">
            {animationGift}
          </div>
        </div>
      )}
    </div>
  );
}
