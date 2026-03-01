"use client";

import { useState, useEffect } from "react";
import { ProgressManager } from "@/lib/progress";
import { getTotalMessageCount, getModelsWithProgress } from "@/lib/progress/chatProgress";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  requirement: number;
  current: number;
  unlocked: boolean;
  claimed: boolean;
  reward: number;
  category: "chat" | "gallery" | "social" | "collection";
}

interface AchievementsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AchievementsModal({ isOpen, onClose }: AchievementsModalProps) {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [activeCategory, setActiveCategory] = useState<"all" | "chat" | "gallery" | "social" | "collection">("all");
  const [totalUnlocked, setTotalUnlocked] = useState(0);

  useEffect(() => {
    if (isOpen && typeof window !== "undefined") {
      loadAchievements();
    }
  }, [isOpen]);

  const loadAchievements = () => {
    const stats = ProgressManager.stats.getStats();
    const totalMessages = getTotalMessageCount();
    const modelsWithProgress = getModelsWithProgress();
    const unlockedPhotos = stats.totalPhotosUnlocked || 0;
    const gemsSpent = stats.totalGemsSpent || 0;
    const sparksSent = stats.totalSparksSent || 0;
    const loginCount = stats.loginCount || 1;

    const achievementList: Achievement[] = [
      // Chat Achievements
      {
        id: "first_message",
        title: "First Words",
        description: "Send your first message to any model",
        icon: "💬",
        requirement: 1,
        current: Math.min(totalMessages, 1),
        unlocked: totalMessages >= 1,
        claimed: ProgressManager.quests.isAchievementRewardClaimed("first_message"),
        reward: 50,
        category: "chat"
      },
      {
        id: "chat_enthusiast",
        title: "Chat Enthusiast",
        description: "Send 50 messages total",
        icon: "💭",
        requirement: 50,
        current: Math.min(totalMessages, 50),
        unlocked: totalMessages >= 50,
        claimed: ProgressManager.quests.isAchievementRewardClaimed("chat_enthusiast"),
        reward: 100,
        category: "chat"
      },
      {
        id: "conversation_master",
        title: "Conversation Master",
        description: "Send 200 messages total",
        icon: "🗣️",
        requirement: 200,
        current: Math.min(totalMessages, 200),
        unlocked: totalMessages >= 200,
        claimed: ProgressManager.quests.isAchievementRewardClaimed("conversation_master"),
        reward: 250,
        category: "chat"
      },
      {
        id: "social_butterfly",
        title: "Social Butterfly",
        description: "Chat with all 5 models",
        icon: "🦋",
        requirement: 5,
        current: Math.min(modelsWithProgress.length, 5),
        unlocked: modelsWithProgress.length >= 5,
        claimed: ProgressManager.quests.isAchievementRewardClaimed("social_butterfly"),
        reward: 300,
        category: "chat"
      },
      // Gallery Achievements
      {
        id: "first_photo",
        title: "Collector's Start",
        description: "Unlock your first photo",
        icon: "📸",
        requirement: 1,
        current: Math.min(unlockedPhotos, 1),
        unlocked: unlockedPhotos >= 1,
        claimed: ProgressManager.quests.isAchievementRewardClaimed("first_photo"),
        reward: 75,
        category: "gallery"
      },
      {
        id: "photo_hunter",
        title: "Photo Hunter",
        description: "Unlock 10 photos",
        icon: "🖼️",
        requirement: 10,
        current: Math.min(unlockedPhotos, 10),
        unlocked: unlockedPhotos >= 10,
        claimed: ProgressManager.quests.isAchievementRewardClaimed("photo_hunter"),
        reward: 150,
        category: "gallery"
      },
      {
        id: "gallery_master",
        title: "Gallery Master",
        description: "Unlock 25 photos",
        icon: "🎨",
        requirement: 25,
        current: Math.min(unlockedPhotos, 25),
        unlocked: unlockedPhotos >= 25,
        claimed: ProgressManager.quests.isAchievementRewardClaimed("gallery_master"),
        reward: 400,
        category: "gallery"
      },
      // Social Achievements
      {
        id: "spark_giver",
        title: "Spark Giver",
        description: "Send 10 sparks to models",
        icon: "⚡",
        requirement: 10,
        current: Math.min(sparksSent, 10),
        unlocked: sparksSent >= 10,
        claimed: ProgressManager.quests.isAchievementRewardClaimed("spark_giver"),
        reward: 100,
        category: "social"
      },
      {
        id: "big_spender",
        title: "Big Spender",
        description: "Spend 1000 gems",
        icon: "💎",
        requirement: 1000,
        current: Math.min(gemsSpent, 1000),
        unlocked: gemsSpent >= 1000,
        claimed: ProgressManager.quests.isAchievementRewardClaimed("big_spender"),
        reward: 200,
        category: "social"
      },
      // Collection Achievements
      {
        id: "loyal_fan",
        title: "Loyal Fan",
        description: "Login 7 days total",
        icon: "📅",
        requirement: 7,
        current: Math.min(loginCount, 7),
        unlocked: loginCount >= 7,
        claimed: ProgressManager.quests.isAchievementRewardClaimed("loyal_fan"),
        reward: 150,
        category: "collection"
      },
      {
        id: "dedicated_follower",
        title: "Dedicated Follower",
        description: "Login 30 days total",
        icon: "🏆",
        requirement: 30,
        current: Math.min(loginCount, 30),
        unlocked: loginCount >= 30,
        claimed: ProgressManager.quests.isAchievementRewardClaimed("dedicated_follower"),
        reward: 500,
        category: "collection"
      }
    ];

    setAchievements(achievementList);
    setTotalUnlocked(achievementList.filter(a => a.unlocked).length);
  };

  const claimReward = (achievementId: string, reward: number) => {
    const claimed = ProgressManager.quests.claimAchievementReward(achievementId);
    if (claimed) {
      // Add gems to balance
      const currentGems = parseInt(localStorage.getItem("gemsBalance") || "0");
      const newBalance = currentGems + reward;
      localStorage.setItem("gemsBalance", newBalance.toString());
      
      alert(`Reward claimed! +${reward} gems added to your balance!`);
      loadAchievements(); // Refresh
    } else {
      alert("Reward already claimed or achievement not unlocked!");
    }
  };

  const filteredAchievements = activeCategory === "all" 
    ? achievements 
    : achievements.filter(a => a.category === activeCategory);

  const categories = [
    { id: "all", label: "All", icon: "🏆" },
    { id: "chat", label: "Chat", icon: "💬" },
    { id: "gallery", label: "Gallery", icon: "📸" },
    { id: "social", label: "Social", icon: "⚡" },
    { id: "collection", label: "Collection", icon: "📅" },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden border border-purple-500/30 shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-purple-500/30 bg-gradient-to-r from-purple-900/50 to-pink-900/50">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                Achievements
              </h2>
              <p className="text-gray-400 mt-1">
                {totalUnlocked} of {achievements.length} unlocked
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition"
            >
              ✕
            </button>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-pink-500 to-purple-600 transition-all duration-500"
                style={{ width: `${(totalUnlocked / achievements.length) * 100}%` }}
              />
            </div>
            <p className="text-sm text-gray-400 mt-2 text-center">
              {Math.round((totalUnlocked / achievements.length) * 100)}% Complete
            </p>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 p-4 border-b border-purple-500/30 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as any)}
              className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition ${
                activeCategory === cat.id
                  ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }`}
            >
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>

        {/* Achievements Grid */}
        <div className="p-6 overflow-y-auto max-h-[50vh]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredAchievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`p-4 rounded-2xl border transition ${
                  achievement.unlocked
                    ? "bg-gradient-to-br from-purple-900/30 to-pink-900/30 border-purple-500/50"
                    : "bg-gray-800/50 border-gray-700/50 opacity-70"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl ${
                    achievement.unlocked ? "bg-purple-600/50" : "bg-gray-700/50 grayscale"
                  }`}>
                    {achievement.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{achievement.title}</h3>
                    <p className="text-sm text-gray-400">{achievement.description}</p>
                    
                    {/* Progress Bar */}
                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>{achievement.current} / {achievement.requirement}</span>
                        <span className="text-yellow-400">+{achievement.reward} gems</span>
                      </div>
                      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${
                            achievement.unlocked 
                              ? "bg-gradient-to-r from-green-500 to-emerald-400" 
                              : "bg-gray-600"
                          }`}
                          style={{ width: `${Math.min((achievement.current / achievement.requirement) * 100, 100)}%` }}
                        />
                      </div>
                    </div>

                    {/* Claim Button */}
                    {achievement.unlocked && !achievement.claimed && (
                      <button
                        onClick={() => claimReward(achievement.id, achievement.reward)}
                        className="mt-3 px-4 py-1.5 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full text-sm font-bold hover:brightness-110 transition"
                      >
                        Claim Reward
                      </button>
                    )}
                    {achievement.unlocked && achievement.claimed && (
                      <div className="mt-3 px-4 py-1.5 bg-green-600/30 border border-green-500/50 rounded-full text-sm font-bold text-green-400 text-center">
                        ✓ Claimed
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-purple-500/30 bg-gray-900/50 text-center">
          <p className="text-sm text-gray-500">
            Complete achievements to earn gems and show off your dedication! 💎
          </p>
        </div>
      </div>
    </div>
  );
}
