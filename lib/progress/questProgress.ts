// Quest Progress Module
// Specialized functions for quest and achievement tracking

import { QuestsProgress, DEFAULT_QUESTS_PROGRESS } from "./types";
import { ProgressManager } from "./index";

// Quest definitions with metadata
export const QUESTS = {
  // Daily & General
  dailyStreak: { title: "Daily Devotion", desc: "Login for 7 days streak", reward: "200 gems", goal: 7, category: "daily" },
  photosBought: { title: "Photo Collector", desc: "Unlock 10 private photos", reward: "500 gems", goal: 10, category: "collection" },
  totalSpent: { title: "Big Spender", desc: "Spend 5000 gems total", reward: "1000 gems", goal: 5000, category: "general" },
  
  // Model Messages
  messagesMia: { title: "Mia's Favorite", desc: "Send 50 messages to Mia", reward: "200 gems", goal: 50, category: "model", model: "mia" },
  messagesAaliyah: { title: "Aaliyah's VIP", desc: "Send 50 messages to Aaliyah", reward: "200 gems", goal: 50, category: "model", model: "aaliyah" },
  messagesIsabella: { title: "Isabella's King", desc: "Send 50 messages to Isabella", reward: "200 gems", goal: 50, category: "model", model: "isabella" },
  messagesSakura: { title: "Sakura's Senpai", desc: "Send 50 messages to Sakura", reward: "200 gems", goal: 50, category: "model", model: "sakura" },
  messagesRiley: { title: "Riley's Duo Partner", desc: "Send 50 messages to Riley", reward: "200 gems", goal: 50, category: "model", model: "riley" },
  
  // Date Completion
  miaDateComplete: { title: "Cheerleader Date", desc: "Complete Mia's Date scenario", reward: "300 gems", goal: 1, category: "date", model: "mia" },
  aaliyahDateComplete: { title: "Luxury Date", desc: "Complete Aaliyah's Date scenario", reward: "300 gems", goal: 1, category: "date", model: "aaliyah" },
  isabellaDateComplete: { title: "VIP Treatment", desc: "Complete Isabella's Date scenario", reward: "300 gems", goal: 1, category: "date", model: "isabella" },
  sakuraDateComplete: { title: "Cosplay Date", desc: "Complete Sakura's Date scenario", reward: "300 gems", goal: 1, category: "date", model: "sakura" },
  rileyDateComplete: { title: "Gaming Night", desc: "Complete Riley's Date scenario", reward: "300 gems", goal: 1, category: "date", model: "riley" },
  
  // Sex Chat Unlock
  miaSexChatUnlocked: { title: "Mia's Intimate", desc: "Unlock Mia's Sex Chatting", reward: "300 gems", goal: 1, category: "sexchat", model: "mia" },
  aaliyahSexChatUnlocked: { title: "Aaliyah's Passion", desc: "Unlock Aaliyah's Sex Chatting", reward: "300 gems", goal: 1, category: "sexchat", model: "aaliyah" },
  isabellaSexChatUnlocked: { title: "Isabella's Fire", desc: "Unlock Isabella's Sex Chatting", reward: "300 gems", goal: 1, category: "sexchat", model: "isabella" },
  sakuraSexChatUnlocked: { title: "Sakura's Desire", desc: "Unlock Sakura's Sex Chatting", reward: "300 gems", goal: 1, category: "sexchat", model: "sakura" },
  rileySexChatUnlocked: { title: "Riley's Heat", desc: "Unlock Riley's Sex Chatting", reward: "300 gems", goal: 1, category: "sexchat", model: "riley" },
  
  // Collection
  modelsExplored: { title: "Model Explorer", desc: "Start chat with all 5 models", reward: "500 gems", goal: 5, category: "collection" },
  allSexChats: { title: "Master Seducer", desc: "Unlock Sex Chatting for all models", reward: "1000 gems", goal: 5, category: "collection" },
  allDates: { title: "Romantic Legend", desc: "Unlock Date mode for all models", reward: "1000 gems", goal: 5, category: "collection" },
  kissLevel5: { title: "Kiss Master", desc: "Reach Kiss Level 5 with any model", reward: "500 gems", goal: 5, category: "collection" },
  sendSparks: { title: "Spark Spreader", desc: "Send 20 Sparks total", reward: "300 gems", goal: 20, category: "collection" },
} as const;

export type QuestId = keyof typeof QUESTS;

// Hook for React components
export const useQuestProgress = () => {
  return {
    // Get all quest progress
    getProgress: (): QuestsProgress => {
      return ProgressManager.quests.getProgress();
    },

    // Get specific quest value
    getQuestValue: (questId: QuestId): number => {
      return ProgressManager.quests.getQuestValue(questId) as number;
    },

    // Get quest completion percentage
    getQuestProgress: (questId: QuestId): number => {
      const quest = QUESTS[questId];
      const value = ProgressManager.quests.getQuestValue(questId) as number;
      return Math.min(100, (value / quest.goal) * 100);
    },

    // Check if quest is complete
    isQuestComplete: (questId: QuestId): boolean => {
      const quest = QUESTS[questId];
      const value = ProgressManager.quests.getQuestValue(questId) as number;
      return value >= quest.goal;
    },

    // Get completed quests count
    getCompletedCount: (): number => {
      return (Object.keys(QUESTS) as QuestId[]).filter(id => 
        useQuestProgress().isQuestComplete(id)
      ).length;
    },

    // Get total quests count
    getTotalCount: (): number => {
      return Object.keys(QUESTS).length;
    },

    // Get quests by category
    getQuestsByCategory: (category: string): Array<{ id: QuestId; quest: typeof QUESTS[QuestId] }> => {
      return (Object.entries(QUESTS) as Array<[QuestId, typeof QUESTS[QuestId]]>)
        .filter(([, q]) => q.category === category)
        .map(([id, quest]) => ({ id, quest }));
    },

    // Get quests for a specific model
    getModelQuests: (model: string): Array<{ id: QuestId; quest: typeof QUESTS[QuestId] }> => {
      return (Object.entries(QUESTS) as Array<[QuestId, typeof QUESTS[QuestId]]>)
        .filter(([, q]) => (q as any).model === model)
        .map(([id, quest]) => ({ id, quest }));
    },

    // Update quest progress
    updateQuest: (questId: QuestId, value: number): boolean => {
      return ProgressManager.quests.updateQuest(questId, value);
    },

    // Increment quest progress
    incrementQuest: (questId: QuestId, amount: number = 1): boolean => {
      return ProgressManager.quests.incrementQuest(questId, amount);
    },

    // Track model message
    trackModelMessage: (model: string): boolean => {
      return ProgressManager.quests.trackModelMessage(model);
    },

    // Track date completion
    trackDateComplete: (model: string): boolean => {
      // Update model-specific quest
      const result = ProgressManager.quests.trackDateComplete(model);
      
      // Check if all dates complete
      const progress = ProgressManager.quests.getProgress();
      const allDatesComplete = [
        progress.miaDateComplete,
        progress.aaliyahDateComplete,
        progress.isabellaDateComplete,
        progress.sakuraDateComplete,
        progress.rileyDateComplete,
      ].filter(Boolean).length;
      
      ProgressManager.quests.updateQuest("allDates", allDatesComplete);
      
      return result;
    },

    // Track sex chat unlock
    trackSexChatUnlock: (model: string): boolean => {
      // Update model-specific quest
      const result = ProgressManager.quests.trackSexChatUnlock(model);
      
      // Check if all sex chats unlocked
      const progress = ProgressManager.quests.getProgress();
      const allSexChatsUnlocked = [
        progress.miaSexChatUnlocked,
        progress.aaliyahSexChatUnlocked,
        progress.isabellaSexChatUnlocked,
        progress.sakuraSexChatUnlocked,
        progress.rileySexChatUnlocked,
      ].filter(Boolean).length;
      
      ProgressManager.quests.updateQuest("allSexChats", allSexChatsUnlocked);
      
      return result;
    },

    // Track model explored (first message)
    trackModelExplored: (model: string): boolean => {
      const progress = ProgressManager.quests.getProgress();
      
      // Get list of models with progress
      const { getModelsWithProgress } = require("./chatProgress");
      const models = getModelsWithProgress();
      
      // Update modelsExplored count
      return ProgressManager.quests.updateQuest("modelsExplored", models.length);
    },

    // Get rewards summary
    getRewardsSummary: (): {
      totalGems: number;
      completedQuests: number;
      availableRewards: number;
    } => {
      const completed = useQuestProgress().getCompletedCount();
      const totalGems = (Object.keys(QUESTS) as QuestId[])
        .filter(id => useQuestProgress().isQuestComplete(id))
        .reduce((sum, id) => {
          const reward = QUESTS[id].reward;
          const match = reward.match(/(\d+)/);
          return sum + (match ? parseInt(match[1], 10) : 0);
        }, 0);
      
      return {
        totalGems,
        completedQuests: completed,
        availableRewards: Object.keys(QUESTS).length - completed,
      };
    },

    // Reset all quest progress (for testing)
    resetAll: (): boolean => {
      return ProgressManager.quests.saveProgress({ ...DEFAULT_QUESTS_PROGRESS });
    },
  };
};

// Achievement definitions
export const ACHIEVEMENTS = {
  first_message: { title: "First Contact", desc: "Send your first message", icon: "💬" },
  first_photo: { title: "Collector", desc: "Unlock your first photo", icon: "📸" },
  first_date: { title: "Romantic", desc: "Complete your first date", icon: "💕" },
  first_sexchat: { title: "Intimate", desc: "Unlock your first sex chat", icon: "🔥" },
  all_models: { title: "Explorer", desc: "Chat with all 5 models", icon: "🌍" },
  gem_hoarder: { title: "Hoarder", desc: "Save up 1000 gems", icon: "💎" },
  big_spender: { title: "Big Spender", desc: "Spend 5000 gems", icon: "💸" },
  loyal_fan: { title: "Loyal Fan", desc: "Login 7 days in a row", icon: "⭐" },
  kiss_master: { title: "Kiss Master", desc: "Reach level 5 kisses", icon: "💋" },
  completionist: { title: "Completionist", desc: "Complete all quests", icon: "🏆" },
} as const;

export type AchievementId = keyof typeof ACHIEVEMENTS;

// Achievement tracking
export const useAchievements = () => {
  return {
    unlock: (achievementId: AchievementId): boolean => {
      return ProgressManager.stats.unlockAchievement(achievementId);
    },

    isUnlocked: (achievementId: AchievementId): boolean => {
      const stats = ProgressManager.stats.getStats();
      return stats.achievementsUnlocked.includes(achievementId);
    },

    getAll: (): Array<{ id: AchievementId; achievement: typeof ACHIEVEMENTS[AchievementId]; unlocked: boolean }> => {
      return (Object.entries(ACHIEVEMENTS) as Array<[AchievementId, typeof ACHIEVEMENTS[AchievementId]]>)
        .map(([id, achievement]) => ({
          id,
          achievement,
          unlocked: useAchievements().isUnlocked(id),
        }));
    },

    getUnlockedCount: (): number => {
      const stats = ProgressManager.stats.getStats();
      return stats.achievementsUnlocked.length;
    },

    getTotalCount: (): number => {
      return Object.keys(ACHIEVEMENTS).length;
    },

    // Check and unlock achievements based on progress
    checkAndUnlock: (): AchievementId[] => {
      const unlocked: AchievementId[] = [];
      const quests = useQuestProgress();
      const stats = ProgressManager.stats.getStats();
      const gems = ProgressManager.currency.getGemsBalance();

      // Check each achievement condition
      if (stats.totalMessagesSent >= 1 && !useAchievements().isUnlocked("first_message")) {
        useAchievements().unlock("first_message");
        unlocked.push("first_message");
      }

      if (stats.totalPhotosUnlocked >= 1 && !useAchievements().isUnlocked("first_photo")) {
        useAchievements().unlock("first_photo");
        unlocked.push("first_photo");
      }

      if (quests.isQuestComplete("miaDateComplete") && !useAchievements().isUnlocked("first_date")) {
        useAchievements().unlock("first_date");
        unlocked.push("first_date");
      }

      if (quests.isQuestComplete("miaSexChatUnlocked") && !useAchievements().isUnlocked("first_sexchat")) {
        useAchievements().unlock("first_sexchat");
        unlocked.push("first_sexchat");
      }

      if (quests.isQuestComplete("modelsExplored") && !useAchievements().isUnlocked("all_models")) {
        useAchievements().unlock("all_models");
        unlocked.push("all_models");
      }

      if (gems >= 1000 && !useAchievements().isUnlocked("gem_hoarder")) {
        useAchievements().unlock("gem_hoarder");
        unlocked.push("gem_hoarder");
      }

      if (stats.totalGemsSpent >= 5000 && !useAchievements().isUnlocked("big_spender")) {
        useAchievements().unlock("big_spender");
        unlocked.push("big_spender");
      }

      if (quests.isQuestComplete("dailyStreak") && !useAchievements().isUnlocked("loyal_fan")) {
        useAchievements().unlock("loyal_fan");
        unlocked.push("loyal_fan");
      }

      if (quests.isQuestComplete("kissLevel5") && !useAchievements().isUnlocked("kiss_master")) {
        useAchievements().unlock("kiss_master");
        unlocked.push("kiss_master");
      }

      if (quests.getCompletedCount() === quests.getTotalCount() && !useAchievements().isUnlocked("completionist")) {
        useAchievements().unlock("completionist");
        unlocked.push("completionist");
      }

      return unlocked;
    },
  };
};
