// Chat Progress Module
// Specialized functions for chat/dialogue persistence

import { ChatProgress, Message } from "./types";
import { ProgressManager } from "./index";

// Convert Date objects to ISO strings for serialization
const serializeMessage = (msg: any): Message => ({
  ...msg,
  timestamp: msg.timestamp instanceof Date 
    ? msg.timestamp.toISOString() 
    : typeof msg.timestamp === "string" 
      ? msg.timestamp 
      : new Date().toISOString(),
});

// Convert ISO strings back to Date objects
const deserializeMessage = (msg: Message): any => ({
  ...msg,
  timestamp: new Date(msg.timestamp),
});

// Hook for React components to use chat progress
export const useChatProgress = (model: string) => {
  return {
    // Load saved chat state
    loadProgress: (): ChatProgress | null => {
      const progress = ProgressManager.chat.load(model);
      if (!progress) return null;
      
      // Deserialize timestamps
      return {
        ...progress,
        messages: progress.messages.map(deserializeMessage),
        dateMessages: progress.dateMessages?.map(deserializeMessage),
        sexChatMessages: progress.sexChatMessages?.map(deserializeMessage),
      };
    },

    // Save current chat state
    saveProgress: (data: {
      currentStep: number;
      messages: any[];
      activeTab?: "main" | "sex" | "date";
      sexChatStep?: number;
      sexChatMessages?: any[];
      dateScenario?: number;
      dateChoices?: number[];
      dateMessages?: any[];
      sexChatUnlocked?: boolean;
      dateUnlocked?: boolean;
    }): boolean => {
      const progress: ChatProgress = {
        currentStep: data.currentStep,
        messages: data.messages.map(serializeMessage),
        lastActive: Date.now(),
        activeTab: data.activeTab,
        sexChatStep: data.sexChatStep,
        sexChatMessages: data.sexChatMessages?.map(serializeMessage),
        dateScenario: data.dateScenario,
        dateChoices: data.dateChoices,
        dateMessages: data.dateMessages?.map(serializeMessage),
        sexChatUnlocked: data.sexChatUnlocked,
        dateUnlocked: data.dateUnlocked,
      };
      
      return ProgressManager.chat.save(model, progress);
    },

    // Check if there's saved progress
    hasProgress: (): boolean => {
      return ProgressManager.chat.exists(model);
    },

    // Clear saved progress
    clearProgress: (): boolean => {
      return ProgressManager.chat.delete(model);
    },

    // Get last active timestamp
    getLastActive: (): number | null => {
      const progress = ProgressManager.chat.load(model);
      return progress?.lastActive || null;
    },
  };
};

// Helper to track message sent for quest progress
export const trackMessageSent = (model: string): void => {
  ProgressManager.quests.trackModelMessage(model);
  ProgressManager.stats.incrementStat("totalMessagesSent");
};

// Helper to track tab unlock
export const trackTabUnlock = (
  model: string, 
  tabType: "sex" | "date"
): void => {
  if (tabType === "sex") {
    ProgressManager.quests.trackSexChatUnlock(model);
  } else {
    ProgressManager.quests.trackDateComplete(model);
  }
};

// Migration helper for old chat data format
export const migrateOldChatData = (model: string): void => {
  if (typeof window === "undefined") return;
  
  // Check for old format data
  const oldStepKey = `${model}Step`;
  const oldMessagesKey = `${model}Messages`;
  
  const oldStep = localStorage.getItem(oldStepKey);
  const oldMessages = localStorage.getItem(oldMessagesKey);
  
  if (oldStep || oldMessages) {
    // Convert to new format
    const progress: ChatProgress = {
      currentStep: oldStep ? parseInt(oldStep, 10) : 0,
      messages: oldMessages ? JSON.parse(oldMessages).map(serializeMessage) : [],
      lastActive: Date.now(),
    };
    
    // Save in new format
    ProgressManager.chat.save(model, progress);
    
    // Clean up old keys
    localStorage.removeItem(oldStepKey);
    localStorage.removeItem(oldMessagesKey);
  }
};

// Auto-save helper with debounce
let autoSaveTimeouts: Record<string, NodeJS.Timeout> = {};

export const autoSaveChat = (
  model: string, 
  data: Parameters<ReturnType<typeof useChatProgress>["saveProgress"]>[0],
  delay: number = 1000
): void => {
  // Clear existing timeout for this model
  if (autoSaveTimeouts[model]) {
    clearTimeout(autoSaveTimeouts[model]);
  }
  
  // Set new timeout
  autoSaveTimeouts[model] = setTimeout(() => {
    const { saveProgress } = useChatProgress(model);
    saveProgress(data);
    delete autoSaveTimeouts[model];
  }, delay);
};

// Get all models with saved progress
export const getModelsWithProgress = (): string[] => {
  if (typeof window === "undefined") return [];
  
  const models: string[] = [];
  const prefix = "pulsemate_v1_";
  const suffix = "ChatProgress";
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(prefix) && key.endsWith(suffix)) {
      const model = key.replace(prefix, "").replace(suffix, "");
      models.push(model);
    }
  }
  
  return models;
};

// Get total message count across all models
export const getTotalMessageCount = (): number => {
  const models = getModelsWithProgress();
  let total = 0;
  
  models.forEach(model => {
    const progress = ProgressManager.chat.load(model);
    if (progress) {
      total += progress.messages.length;
      total += progress.sexChatMessages?.length || 0;
      total += progress.dateMessages?.length || 0;
    }
  });
  
  return total;
};
