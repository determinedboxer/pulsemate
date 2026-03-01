"use client";

import { useState, useEffect } from "react";
import { getMessageStreak, updateMessageStreak } from "@/lib/gameSystems";

interface StreakDisplayProps {
  modelId: string;
  modelName: string;
}

export default function StreakDisplay({ modelId, modelName }: StreakDisplayProps) {
  const [streak, setStreak] = useState(0);
  const [showBonus, setShowBonus] = useState(false);
  const [bonusAmount, setBonusAmount] = useState(0);

  useEffect(() => {
    const streakData = getMessageStreak(modelId);
    setStreak(streakData.currentStreak);
  }, [modelId]);

  const handleMessageSent = () => {
    const result = updateMessageStreak(modelId);
    setStreak(result.streak);
    
    if (result.bonusGems > 0) {
      setBonusAmount(result.bonusGems);
      setShowBonus(true);
      setTimeout(() => setShowBonus(false), 3000);
      
      // Add gems to balance
      const currentBalance = parseInt(localStorage.getItem("gemsBalance") || "0");
      localStorage.setItem("gemsBalance", (currentBalance + result.bonusGems).toString());
    }
  };

  const getStreakEmoji = (s: number) => {
    if (s >= 30) return "🔥🔥🔥";
    if (s >= 7) return "🔥🔥";
    if (s >= 3) return "🔥";
    return "💬";
  };

  const getNextMilestone = (s: number) => {
    if (s < 3) return { days: 3, reward: 50 };
    if (s < 7) return { days: 7, reward: 150 };
    if (s < 30) return { days: 30, reward: 1000 };
    return null;
  };

  const nextMilestone = getNextMilestone(streak);

  return (
    <div className="relative">
      <div className="bg-black/40 backdrop-blur-lg rounded-2xl p-4 border border-purple-500/30">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-bold text-orange-400">Message Streak</span>
          <span className="text-2xl">{getStreakEmoji(streak)}</span>
        </div>
        
        <div className="text-center mb-3">
          <span className="text-4xl font-black text-white">{streak}</span>
          <span className="text-sm text-gray-400 ml-2">days</span>
        </div>

        {/* Progress to next milestone */}
        {nextMilestone && (
          <div className="mb-3">
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>Next: {nextMilestone.days} days</span>
              <span>+{nextMilestone.reward} 💎</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-orange-500 to-red-500 h-full rounded-full transition-all"
                style={{ width: `${(streak / nextMilestone.days) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Milestone badges */}
        <div className="flex justify-center gap-2">
          {[3, 7, 30].map((milestone) => (
            <div
              key={milestone}
              className={`px-2 py-1 rounded-lg text-xs font-bold ${
                streak >= milestone
                  ? "bg-gradient-to-r from-orange-500 to-red-500 text-white"
                  : "bg-gray-800 text-gray-500"
              }`}
            >
              {milestone}d
            </div>
          ))}
        </div>

        <p className="text-xs text-gray-500 mt-3 text-center">
          Message {modelName} daily to keep your streak!
        </p>
      </div>

      {/* Bonus Animation */}
      {showBonus && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm rounded-2xl animate-in fade-in zoom-in">
          <div className="text-center">
            <div className="text-5xl mb-2">🎉</div>
            <p className="text-xl font-bold text-yellow-400">Streak Bonus!</p>
            <p className="text-2xl font-black text-white">+{bonusAmount} 💎</p>
          </div>
        </div>
      )}
    </div>
  );
}
