// Progress System Types
// Defines all interfaces for user progress tracking

export interface Message {
  id: number;
  sender: string;
  text: string;
  timestamp: string; // ISO string for serialization
  photoId?: string;
  options?: ReplyOption[];
}

export interface ReplyOption {
  id: number;
  text: string;
}

export interface ChatProgress {
  currentStep: number;
  messages: Message[];
  lastActive: number; // timestamp
  activeTab?: "main" | "sex" | "date";
  sexChatStep?: number;
  sexChatMessages?: Message[];
  dateScenario?: number;
  dateChoices?: number[];
  dateMessages?: Message[];
  sexChatUnlocked?: boolean;
  dateUnlocked?: boolean;
}

export interface GalleryProgress {
  viewedPhotos: string[]; // photo IDs
  favoritePhotos: string[];
  totalViews: number;
  lastViewed: Record<string, number>; // photoId -> timestamp
}

export interface QuestsProgress {
  // Daily & General Quests
  dailyStreak: number;
  photosBought: number;
  totalSpent: number;
  
  // Model-Specific Message Quests
  messagesMia: number;
  messagesAaliyah: number;
  messagesIsabella: number;
  messagesSakura: number;
  messagesRiley: number;
  
  // Date Completion Quests
  miaDateComplete: number;
  aaliyahDateComplete: number;
  isabellaDateComplete: number;
  sakuraDateComplete: number;
  rileyDateComplete: number;
  
  // Sex Chat Unlock Quests
  miaSexChatUnlocked: number;
  aaliyahSexChatUnlocked: number;
  isabellaSexChatUnlocked: number;
  sakuraSexChatUnlocked: number;
  rileySexChatUnlocked: number;
  
  // Collection Quests
  modelsExplored: number;
  allSexChats: number;
  allDates: number;
  kissLevel5: number;
  sendSparks: number;
}

export interface UserPreferences {
  soundEnabled: boolean;
  notificationsEnabled: boolean;
  theme: 'dark' | 'light';
  language: string;
  autoPlayVideos: boolean;
  lastVisitedModel: string;
  favoriteModels: string[];
}

export interface UserStats {
  totalTimeSpent: number; // minutes
  totalMessagesSent: number;
  totalPhotosUnlocked: number;
  totalGemsSpent: number;
  totalSparksSent: number;
  loginCount: number;
  firstLoginDate: number;
  longestStreak: number;
  achievementsUnlocked: string[];
}

export interface KissProgress {
  totalKisses: number;
  level: number;
  lastKissTimestamp: number;
  dailyKissAvailable: boolean;
  rewards: Record<string, boolean>;
}

// Default values for initialization
export const DEFAULT_QUESTS_PROGRESS: QuestsProgress = {
  dailyStreak: 0,
  photosBought: 0,
  totalSpent: 0,
  messagesMia: 0,
  messagesAaliyah: 0,
  messagesIsabella: 0,
  messagesSakura: 0,
  messagesRiley: 0,
  miaDateComplete: 0,
  aaliyahDateComplete: 0,
  isabellaDateComplete: 0,
  sakuraDateComplete: 0,
  rileyDateComplete: 0,
  miaSexChatUnlocked: 0,
  aaliyahSexChatUnlocked: 0,
  isabellaSexChatUnlocked: 0,
  sakuraSexChatUnlocked: 0,
  rileySexChatUnlocked: 0,
  modelsExplored: 0,
  allSexChats: 0,
  allDates: 0,
  kissLevel5: 0,
  sendSparks: 0,
};

export const DEFAULT_USER_PREFERENCES: UserPreferences = {
  soundEnabled: true,
  notificationsEnabled: true,
  theme: 'dark',
  language: 'en',
  autoPlayVideos: false,
  lastVisitedModel: '',
  favoriteModels: [],
};

export const DEFAULT_USER_STATS: UserStats = {
  totalTimeSpent: 0,
  totalMessagesSent: 0,
  totalPhotosUnlocked: 0,
  totalGemsSpent: 0,
  totalSparksSent: 0,
  loginCount: 0,
  firstLoginDate: 0,
  longestStreak: 0,
  achievementsUnlocked: [],
};

export const DEFAULT_GALLERY_PROGRESS: GalleryProgress = {
  viewedPhotos: [],
  favoritePhotos: [],
  totalViews: 0,
  lastViewed: {},
};
