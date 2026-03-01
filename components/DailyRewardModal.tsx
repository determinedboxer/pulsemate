"use client";

import { useState, useEffect } from "react";
import { checkDailyLogin, claimDailyReward, DAILY_REWARDS, LoginStreak } from "@/lib/gameSystems";

interface DailyRewardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClaim: (gems: number) => void;
}

export default function DailyRewardModal({ isOpen, onClose, onClaim }: DailyRewardModalProps) {
  const [streak, setStreak] = useState<LoginStreak | null>(null);
  const [canClaim, setCanClaim] = useState(false);
  const [claimed, setClaimed] = useState(false);
  const [rewardGems, setRewardGems] = useState(0);

  useEffect(() => {
    if (isOpen) {
      const status = checkDailyLogin();
      setStreak(status.streak);
      setCanClaim(status.canClaim);
      setRewardGems(status.reward?.gems || 0);
    }
  }, [isOpen]);

  const handleClaim = () => {
    const gems = claimDailyReward();
    if (gems > 0) {
      setClaimed(true);
      onClaim(gems);
      setTimeout(() => {
        onClose();
        setClaimed(false);
      }, 2000);
    }
  };

  if (!isOpen || !streak) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[200] flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-[#1a102e] to-[#0f0a1a] p-8 rounded-[2rem] border border-pink-500/50 max-w-md w-full text-center shadow-[0_0_50px_rgba(219,39,119,0.3)]">
        <div className="text-6xl mb-4">🎁</div>
        <h2 className="text-3xl font-black mb-2 bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
          Daily Reward
        </h2>
        <p className="text-gray-300 mb-6">
          Day {streak.currentDay + 1} of 7
        </p>

        {/* 7-Day Calendar */}
        <div className="grid grid-cols-7 gap-2 mb-6">
          {DAILY_REWARDS.map((reward, index) => {
            const isCurrent = index === streak.currentDay;
            const isPast = index < streak.currentDay;
            const isFuture = index > streak.currentDay;

            return (
              <div
                key={index}
                className={`aspect-square rounded-xl flex flex-col items-center justify-center text-xs font-bold transition-all ${
                  isCurrent
                    ? "bg-gradient-to-br from-pink-500 to-purple-600 scale-110 shadow-[0_0_20px_rgba(219,39,119,0.5)]"
                    : isPast
                    ? "bg-green-500/30 border border-green-500/50"
                    : "bg-gray-800/50 border border-gray-700"
                }`}
              >
                <span className="text-[10px] opacity-70">Day {index + 1}</span>
                <span className="text-lg">{reward.gems}</span>
                <span className="text-[8px]">💎</span>
                {reward.bonus && <span className="text-[8px] mt-1">✨</span>}
              </div>
            );
          })}
        </div>

        {claimed ? (
          <div className="text-2xl font-bold text-green-400 animate-bounce">
            +{rewardGems} Gems Claimed! 💎
          </div>
        ) : canClaim ? (
          <button
            onClick={handleClaim}
            className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl font-bold text-lg hover:brightness-110 transition-all shadow-lg shadow-pink-500/30 animate-pulse"
          >
            Claim {rewardGems} Gems! 💎
          </button>
        ) : (
          <div className="text-gray-400">
            <p>Already claimed today!</p>
            <p className="text-sm mt-2">Come back tomorrow for Day {((streak.currentDay + 1) % 7) + 1}</p>
          </div>
        )}

        <button
          onClick={onClose}
          className="mt-4 text-gray-500 hover:text-white text-sm transition"
        >
          Close
        </button>
      </div>
    </div>
  );
}
