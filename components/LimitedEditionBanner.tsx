"use client";

import { useState, useEffect } from "react";
import { getActiveLimitedEditions, hasPurchasedLimitedEdition, purchaseLimitedEdition, LimitedEditionItem } from "@/lib/gameSystems";

interface LimitedEditionBannerProps {
  gemsBalance: number;
  onPurchase: (newBalance: number) => void;
}

const modelNames: Record<string, string> = {
  mia: "Mia",
  sakura: "Sakura",
  isabella: "Isabella",
  aaliyah: "Aaliyah",
  riley: "Riley"
};

export default function LimitedEditionBanner({ gemsBalance, onPurchase }: LimitedEditionBannerProps) {
  const [items, setItems] = useState<LimitedEditionItem[]>([]);
  const [purchased, setPurchased] = useState<string[]>([]);

  useEffect(() => {
    const active = getActiveLimitedEditions();
    setItems(active);
    
    // Check which ones user already owns
    const owned = active.filter(item => hasPurchasedLimitedEdition(item.id)).map(item => item.id);
    setPurchased(owned);
  }, []);

  const handlePurchase = (itemId: string, price: number) => {
    if (purchaseLimitedEdition(itemId)) {
      setPurchased([...purchased, itemId]);
      onPurchase(gemsBalance - price);
      alert("Limited edition content unlocked! 🎉");
    } else {
      alert("Not enough gems or item no longer available!");
    }
  };

  if (items.length === 0) return null;

  return (
    <div className="bg-gradient-to-r from-yellow-900/50 via-orange-900/50 to-red-900/50 backdrop-blur-xl rounded-2xl p-6 border border-yellow-500/50 mb-8">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-3xl">⚡</span>
        <div>
          <h2 className="text-xl font-bold text-yellow-400">Limited Edition Content</h2>
          <p className="text-sm text-gray-300">Available for a limited time only!</p>
        </div>
        <div className="ml-auto px-3 py-1 bg-red-500/30 rounded-full text-xs font-bold text-red-300 animate-pulse">
          FLASH SALE
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => {
          const isPurchased = purchased.includes(item.id);
          const canAfford = gemsBalance >= item.price;
          const timeLeft = Math.ceil((item.availableUntil - Date.now()) / (1000 * 60 * 60));

          return (
            <div
              key={item.id}
              className={`relative rounded-xl overflow-hidden border ${
                isPurchased
                  ? "bg-green-900/30 border-green-500/50"
                  : "bg-black/40 border-yellow-500/30"
              }`}
            >
              {/* Content placeholder */}
              <div className="h-32 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                {isPurchased ? (
                  <span className="text-4xl">✅</span>
                ) : (
                  <span className="text-4xl opacity-50">🔒</span>
                )}
              </div>

              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg font-bold">{modelNames[item.modelId]}</span>
                  <span className="text-xs bg-yellow-500/30 px-2 py-0.5 rounded-full text-yellow-300">
                    {item.type.toUpperCase()}
                  </span>
                </div>
                <h3 className="font-bold text-white mb-1">{item.title}</h3>
                <p className="text-xs text-gray-400 mb-3">{item.description}</p>

                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <span className="text-yellow-400 font-bold">{item.price} 💎</span>
                  </div>
                  <div className="text-xs text-red-400">
                    {timeLeft}h left
                  </div>
                </div>

                {isPurchased ? (
                  <button
                    disabled
                    className="w-full mt-3 py-2 bg-green-500/30 rounded-lg text-sm font-bold text-green-400 cursor-default"
                  >
                    Owned ✓
                  </button>
                ) : (
                  <button
                    onClick={() => handlePurchase(item.id, item.price)}
                    disabled={!canAfford}
                    className={`w-full mt-3 py-2 rounded-lg text-sm font-bold transition ${
                      canAfford
                        ? "bg-gradient-to-r from-yellow-500 to-orange-500 hover:brightness-110"
                        : "bg-gray-700 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    {canAfford ? "Buy Now" : "Not Enough Gems"}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
