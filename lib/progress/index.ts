// Unified Progress Manager
// Centralized user progress management for PulseMate

import {
  ChatProgress,
  GalleryProgress,
  QuestsProgress,
  UserPreferences,
  UserStats,
  DEFAULT_QUESTS_PROGRESS,
  DEFAULT_USER_PREFERENCES,
  DEFAULT_USER_STATS,
  DEFAULT_GALLERY_PROGRESS,
} from "./types";

// Storage key prefixes to avoid conflicts
const STORAGE_PREFIX = "pulsemate_v1_";

// Storage keys
const KEYS = {
  chatProgress: (model: string) => `${STORAGE_PREFIX}${model}ChatProgress`,
  galleryProgress: `${STORAGE_PREFIX}galleryProgress`,
  questsProgress: `${STORAGE_PREFIX}questsProgress`,
  userPreferences: `${STORAGE_PREFIX}userPreferences`,
  userStats: `${STORAGE_PREFIX}userStats`,
  kissProgress: (model: string) => `${STORAGE_PREFIX}${model}KissData`,
  unlockedPhotos: (model: string) => `${STORAGE_PREFIX}unlockedPhotos${model}`,
  gemsBalance: `${STORAGE_PREFIX}gemsBalance`,
  sparksBalance: `${STORAGE_PREFIX}sparksBalance`,
};

// Safe localStorage wrapper with error handling
const safeStorage = {
  get: (key: string): string | null => {
    if (typeof window === "undefined") return null;
    try {
      return localStorage.getItem(key);
    } catch (e) {
      console.error(`Error reading ${key} from localStorage:`, e);
      return null;
    }
  },
  set: (key: string, value: string): boolean => {
    if (typeof window === "undefined") return false;
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (e) {
      console.error(`Error writing ${key} to localStorage:`, e);
      return false;
    }
  },
  remove: (key: string): boolean => {
    if (typeof window === "undefined") return false;
    try {
      localStorage.removeItem(key);
      return true;
    } catch (e) {
      console.error(`Error removing ${key} from localStorage:`, e);
      return false;
    }
  },
};

// ==================== CHAT PROGRESS ====================

export const ChatProgressManager = {
  save: (model: string, progress: ChatProgress): boolean => {
    const data = {
      ...progress,
      lastActive: Date.now(),
    };
    return safeStorage.set(KEYS.chatProgress(model), JSON.stringify(data));
  },

  load: (model: string): ChatProgress | null => {
    const data = safeStorage.get(KEYS.chatProgress(model));
    if (!data) return null;
    try {
      return JSON.parse(data) as ChatProgress;
    } catch (e) {
      console.error(`Error parsing chat progress for ${model}:`, e);
      return null;
    }
  },

  delete: (model: string): boolean => {
    return safeStorage.remove(KEYS.chatProgress(model));
  },

  exists: (model: string): boolean => {
    return !!safeStorage.get(KEYS.chatProgress(model));
  },
};

// ==================== GALLERY PROGRESS ====================

export const GalleryProgressManager = {
  getProgress: (): GalleryProgress => {
    const data = safeStorage.get(KEYS.galleryProgress);
    if (!data) return { ...DEFAULT_GALLERY_PROGRESS };
    try {
      return { ...DEFAULT_GALLERY_PROGRESS, ...JSON.parse(data) };
    } catch (e) {
      return { ...DEFAULT_GALLERY_PROGRESS };
    }
  },

  saveProgress: (progress: GalleryProgress): boolean => {
    return safeStorage.set(KEYS.galleryProgress, JSON.stringify(progress));
  },

  markPhotoViewed: (photoId: string): boolean => {
    const progress = GalleryProgressManager.getProgress();
    if (!progress.viewedPhotos.includes(photoId)) {
      progress.viewedPhotos.push(photoId);
    }
    progress.totalViews++;
    progress.lastViewed[photoId] = Date.now();
    return GalleryProgressManager.saveProgress(progress);
  },

  isPhotoViewed: (photoId: string): boolean => {
    const progress = GalleryProgressManager.getProgress();
    return progress.viewedPhotos.includes(photoId);
  },

  toggleFavorite: (photoId: string): boolean => {
    const progress = GalleryProgressManager.getProgress();
    const index = progress.favoritePhotos.indexOf(photoId);
    if (index > -1) {
      progress.favoritePhotos.splice(index, 1);
    } else {
      progress.favoritePhotos.push(photoId);
    }
    return GalleryProgressManager.saveProgress(progress);
  },

  isPhotoFavorited: (photoId: string): boolean => {
    const progress = GalleryProgressManager.getProgress();
    return progress.favoritePhotos.includes(photoId);
  },
};

// ==================== QUESTS PROGRESS ====================

export const QuestProgressManager = {
  getProgress: (): QuestsProgress => {
    const data = safeStorage.get(KEYS.questsProgress);
    if (!data) return { ...DEFAULT_QUESTS_PROGRESS };
    try {
      return { ...DEFAULT_QUESTS_PROGRESS, ...JSON.parse(data) };
    } catch (e) {
      return { ...DEFAULT_QUESTS_PROGRESS };
    }
  },

  saveProgress: (progress: QuestsProgress): boolean => {
    return safeStorage.set(KEYS.questsProgress, JSON.stringify(progress));
  },

  updateQuest: (questId: keyof QuestsProgress, value: number | boolean): boolean => {
    const progress = QuestProgressManager.getProgress();
    (progress as any)[questId] = value;
    return QuestProgressManager.saveProgress(progress);
  },

  incrementQuest: (questId: keyof QuestsProgress, amount: number = 1): boolean => {
    const progress = QuestProgressManager.getProgress();
    const current = (progress as any)[questId] || 0;
    (progress as any)[questId] = current + amount;
    return QuestProgressManager.saveProgress(progress);
  },

  getQuestValue: (questId: keyof QuestsProgress): number | boolean => {
    const progress = QuestProgressManager.getProgress();
    return (progress as any)[questId] || 0;
  },

  // Helper to track model messages
  trackModelMessage: (model: string): boolean => {
    const questMap: Record<string, keyof QuestsProgress> = {
      mia: "messagesMia",
      aaliyah: "messagesAaliyah",
      isabella: "messagesIsabella",
      sakura: "messagesSakura",
      riley: "messagesRiley",
    };
    const questId = questMap[model.toLowerCase()];
    if (questId) {
      return QuestProgressManager.incrementQuest(questId);
    }
    return false;
  },

  // Helper to track date completion
  trackDateComplete: (model: string): boolean => {
    const questMap: Record<string, keyof QuestsProgress> = {
      mia: "miaDateComplete",
      aaliyah: "aaliyahDateComplete",
      isabella: "isabellaDateComplete",
      sakura: "sakuraDateComplete",
      riley: "rileyDateComplete",
    };
    const questId = questMap[model.toLowerCase()];
    if (questId) {
      return QuestProgressManager.updateQuest(questId, 1);
    }
    return false;
  },

  // Helper to track sex chat unlock
  trackSexChatUnlock: (model: string): boolean => {
    const questMap: Record<string, keyof QuestsProgress> = {
      mia: "miaSexChatUnlocked",
      aaliyah: "aaliyahSexChatUnlocked",
      isabella: "isabellaSexChatUnlocked",
      sakura: "sakuraSexChatUnlocked",
      riley: "rileySexChatUnlocked",
    };
    const questId = questMap[model.toLowerCase()];
    if (questId) {
      return QuestProgressManager.updateQuest(questId, 1);
    }
    return false;
  },

  // Track claimed achievement rewards
  claimAchievementReward: (achievementId: string): boolean => {
    const stats = UserStatsManager.getStats();
    const claimedKey = `claimed_${achievementId}`;
    
    // Check if already claimed
    if ((stats as any)[claimedKey]) {
      return false;
    }
    
    // Mark as claimed
    (stats as any)[claimedKey] = true;
    return UserStatsManager.saveStats(stats);
  },

  isAchievementRewardClaimed: (achievementId: string): boolean => {
    const stats = UserStatsManager.getStats();
    const claimedKey = `claimed_${achievementId}`;
    return !!(stats as any)[claimedKey];
  },
};

// ==================== USER PREFERENCES ====================

export const UserPreferencesManager = {
  getPreferences: (): UserPreferences => {
    const data = safeStorage.get(KEYS.userPreferences);
    if (!data) return { ...DEFAULT_USER_PREFERENCES };
    try {
      return { ...DEFAULT_USER_PREFERENCES, ...JSON.parse(data) };
    } catch (e) {
      return { ...DEFAULT_USER_PREFERENCES };
    }
  },

  savePreferences: (prefs: UserPreferences): boolean => {
    return safeStorage.set(KEYS.userPreferences, JSON.stringify(prefs));
  },

  updatePreference: <K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ): boolean => {
    const prefs = UserPreferencesManager.getPreferences();
    prefs[key] = value;
    return UserPreferencesManager.savePreferences(prefs);
  },

  getPreference: <K extends keyof UserPreferences>(key: K): UserPreferences[K] => {
    const prefs = UserPreferencesManager.getPreferences();
    return prefs[key];
  },
};

// ==================== USER STATS ====================

export const UserStatsManager = {
  getStats: (): UserStats => {
    const data = safeStorage.get(KEYS.userStats);
    if (!data) return { ...DEFAULT_USER_STATS };
    try {
      return { ...DEFAULT_USER_STATS, ...JSON.parse(data) };
    } catch (e) {
      return { ...DEFAULT_USER_STATS };
    }
  },

  saveStats: (stats: UserStats): boolean => {
    return safeStorage.set(KEYS.userStats, JSON.stringify(stats));
  },

  incrementStat: (statId: keyof UserStats, amount: number = 1): boolean => {
    const stats = UserStatsManager.getStats();
    const current = (stats as any)[statId] || 0;
    (stats as any)[statId] = current + amount;
    return UserStatsManager.saveStats(stats);
  },

  addTimeSpent: (minutes: number): boolean => {
    return UserStatsManager.incrementStat("totalTimeSpent", minutes);
  },

  recordLogin: (): boolean => {
    const stats = UserStatsManager.getStats();
    stats.loginCount++;
    if (stats.firstLoginDate === 0) {
      stats.firstLoginDate = Date.now();
    }
    return UserStatsManager.saveStats(stats);
  },

  trackGemSpending: (amount: number): boolean => {
    return UserStatsManager.incrementStat("totalGemsSpent", amount);
  },

  trackSparkSent: (): boolean => {
    return UserStatsManager.incrementStat("totalSparksSent");
  },

  unlockAchievement: (achievementId: string): boolean => {
    const stats = UserStatsManager.getStats();
    if (!stats.achievementsUnlocked.includes(achievementId)) {
      stats.achievementsUnlocked.push(achievementId);
      return UserStatsManager.saveStats(stats);
    }
    return true;
  },
};

// ==================== CURRENCY ====================

export const CurrencyManager = {
  getGemsBalance: (): number => {
    const balance = safeStorage.get(KEYS.gemsBalance);
    return balance ? parseInt(balance, 10) : 499; // Default starting balance
  },

  setGemsBalance: (amount: number): boolean => {
    return safeStorage.set(KEYS.gemsBalance, amount.toString());
  },

  addGems: (amount: number): number => {
    const current = CurrencyManager.getGemsBalance();
    const newBalance = current + amount;
    CurrencyManager.setGemsBalance(newBalance);
    return newBalance;
  },

  spendGems: (amount: number): { success: boolean; newBalance: number } => {
    const current = CurrencyManager.getGemsBalance();
    if (current >= amount) {
      const newBalance = current - amount;
      CurrencyManager.setGemsBalance(newBalance);
      UserStatsManager.trackGemSpending(amount);
      QuestProgressManager.incrementQuest("totalSpent", amount);
      return { success: true, newBalance };
    }
    return { success: false, newBalance: current };
  },

  getSparksBalance: (): number => {
    const balance = safeStorage.get(KEYS.sparksBalance);
    return balance ? parseInt(balance, 10) : 0;
  },

  setSparksBalance: (amount: number): boolean => {
    return safeStorage.set(KEYS.sparksBalance, amount.toString());
  },

  addSparks: (amount: number): number => {
    const current = CurrencyManager.getSparksBalance();
    const newBalance = current + amount;
    CurrencyManager.setSparksBalance(newBalance);
    QuestProgressManager.incrementQuest("sendSparks", amount);
    UserStatsManager.trackSparkSent();
    return newBalance;
  },
};

// ==================== UNLOCKED PHOTOS ====================

export const UnlockedPhotosManager = {
  getUnlocked: (model: string): string[] => {
    const data = safeStorage.get(KEYS.unlockedPhotos(model));
    if (!data) return [];
    try {
      return JSON.parse(data);
    } catch (e) {
      return [];
    }
  },

  addUnlocked: (model: string, photoId: string): boolean => {
    const unlocked = UnlockedPhotosManager.getUnlocked(model);
    if (!unlocked.includes(photoId)) {
      unlocked.push(photoId);
      const result = safeStorage.set(KEYS.unlockedPhotos(model), JSON.stringify(unlocked));
      if (result) {
        QuestProgressManager.incrementQuest("photosBought");
        UserStatsManager.incrementStat("totalPhotosUnlocked");
      }
      return result;
    }
    return true;
  },

  isUnlocked: (model: string, photoId: string): boolean => {
    const unlocked = UnlockedPhotosManager.getUnlocked(model);
    return unlocked.includes(photoId);
  },
};

// ==================== EXPORT/IMPORT ====================

export const ProgressExportImport = {
  exportAll: (): string => {
    const allData: Record<string, any> = {};
    
    if (typeof window !== "undefined") {
      // Get all pulsemate keys
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(STORAGE_PREFIX)) {
          const value = localStorage.getItem(key);
          if (value) {
            try {
              allData[key] = JSON.parse(value);
            } catch {
              allData[key] = value;
            }
          }
        }
      }
    }
    
    return JSON.stringify(allData, null, 2);
  },

  importAll: (jsonData: string): boolean => {
    try {
      const data = JSON.parse(jsonData);
      
      if (typeof window !== "undefined") {
        // Clear existing pulsemate data
        const keysToRemove: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith(STORAGE_PREFIX)) {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key));
        
        // Import new data
        Object.entries(data).forEach(([key, value]) => {
          if (typeof value === "object") {
            localStorage.setItem(key, JSON.stringify(value));
          } else {
            localStorage.setItem(key, String(value));
          }
        });
      }
      
      return true;
    } catch (e) {
      console.error("Error importing progress data:", e);
      return false;
    }
  },

  clearAll: (): boolean => {
    if (typeof window !== "undefined") {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(STORAGE_PREFIX)) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));
      return true;
    }
    return false;
  },
};

// ==================== MAIN EXPORT ====================

export const ProgressManager = {
  chat: ChatProgressManager,
  gallery: GalleryProgressManager,
  quests: QuestProgressManager,
  preferences: UserPreferencesManager,
  stats: UserStatsManager,
  currency: CurrencyManager,
  photos: UnlockedPhotosManager,
  exportImport: ProgressExportImport,
};

export default ProgressManager;
