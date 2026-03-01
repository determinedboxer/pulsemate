// Game Systems for PulseMate - Shared across all models

// ==================== DAILY LOGIN REWARD SYSTEM ====================
export interface DailyReward {
  day: number;
  gems: number;
  bonus?: string;
}

export const DAILY_REWARDS: DailyReward[] = [
  { day: 1, gems: 50 },
  { day: 2, gems: 100 },
  { day: 3, gems: 150, bonus: "free_story" },
  { day: 4, gems: 200 },
  { day: 5, gems: 250 },
  { day: 6, gems: 300 },
  { day: 7, gems: 500, bonus: "exclusive_photo" },
];

export interface LoginStreak {
  currentDay: number;
  lastLoginDate: string;
  streakCount: number;
  claimedToday: boolean;
}

export function loadLoginStreak(): LoginStreak {
  if (typeof window === "undefined") {
    return { currentDay: 0, lastLoginDate: "", streakCount: 0, claimedToday: false };
  }
  const saved = localStorage.getItem("loginStreak");
  if (saved) {
    return JSON.parse(saved);
  }
  return { currentDay: 0, lastLoginDate: "", streakCount: 0, claimedToday: false };
}

export function saveLoginStreak(streak: LoginStreak): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("loginStreak", JSON.stringify(streak));
  }
}

export function checkDailyLogin(): { canClaim: boolean; reward: DailyReward | null; streak: LoginStreak } {
  const streak = loadLoginStreak();
  const today = new Date().toDateString();
  
  if (streak.lastLoginDate === today) {
    return { canClaim: !streak.claimedToday, reward: streak.claimedToday ? null : DAILY_REWARDS[streak.currentDay % 7], streak };
  }
  
  // New day - check if streak continues
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (streak.lastLoginDate === yesterday.toDateString()) {
    // Streak continues
    streak.currentDay = (streak.currentDay + 1) % 7;
    streak.streakCount += 1;
  } else {
    // Streak broken
    streak.currentDay = 0;
    streak.streakCount = 1;
  }
  
  streak.lastLoginDate = today;
  streak.claimedToday = false;
  saveLoginStreak(streak);
  
  return { canClaim: true, reward: DAILY_REWARDS[streak.currentDay], streak };
}

export function claimDailyReward(): number {
  const streak = loadLoginStreak();
  if (streak.claimedToday) return 0;
  
  streak.claimedToday = true;
  saveLoginStreak(streak);
  
  return DAILY_REWARDS[streak.currentDay % 7].gems;
}

// ==================== MODEL MOOD SYSTEM ====================
export type ModelMood = "playful" | "flirty" | "horny" | "tired" | "dominant" | "submissive";

export interface MoodConfig {
  mood: ModelMood;
  label: string;
  emoji: string;
  color: string;
  messageModifier: string;
  bonusMultiplier: number;
}

export const MOOD_CONFIGS: Record<ModelMood, MoodConfig> = {
  playful: { mood: "playful", label: "Playful", emoji: "😋", color: "text-yellow-400", messageModifier: "teasing", bonusMultiplier: 1.0 },
  flirty: { mood: "flirty", label: "Flirty", emoji: "😘", color: "text-pink-400", messageModifier: "seductive", bonusMultiplier: 1.2 },
  horny: { mood: "horny", label: "Horny", emoji: "🔥", color: "text-red-500", messageModifier: "explicit", bonusMultiplier: 1.5 },
  tired: { mood: "tired", label: "Tired", emoji: "😴", color: "text-gray-400", messageModifier: "sleepy", bonusMultiplier: 0.8 },
  dominant: { mood: "dominant", label: "Dominant", emoji: "👑", color: "text-purple-500", messageModifier: "commanding", bonusMultiplier: 1.3 },
  submissive: { mood: "submissive", label: "Submissive", emoji: "🥺", color: "text-blue-400", messageModifier: "obedient", bonusMultiplier: 1.3 },
};

export function generateRandomMood(): ModelMood {
  const moods: ModelMood[] = ["playful", "flirty", "horny", "tired", "dominant", "submissive"];
  const weights = [0.3, 0.3, 0.15, 0.1, 0.075, 0.075]; // Horny is rarest
  
  const random = Math.random();
  let cumulative = 0;
  
  for (let i = 0; i < moods.length; i++) {
    cumulative += weights[i];
    if (random <= cumulative) return moods[i];
  }
  
  return "playful";
}

export function loadModelMood(modelId: string): { mood: ModelMood; expiresAt: number } {
  if (typeof window === "undefined") {
    return { mood: "playful", expiresAt: 0 };
  }
  const saved = localStorage.getItem(`modelMood_${modelId}`);
  if (saved) {
    const parsed = JSON.parse(saved);
    if (parsed.expiresAt > Date.now()) {
      return parsed;
    }
  }
  // Generate new mood that lasts 4 hours
  const newMood = { mood: generateRandomMood(), expiresAt: Date.now() + 4 * 60 * 60 * 1000 };
  localStorage.setItem(`modelMood_${modelId}`, JSON.stringify(newMood));
  return newMood;
}

// ==================== PHOTO RATING SYSTEM ====================
export interface PhotoRating {
  photoId: string;
  modelId: string;
  rating: number; // 1-5
  timestamp: number;
}

export function ratePhoto(modelId: string, photoId: string, rating: number): void {
  if (typeof window === "undefined") return;
  const key = `photoRatings_${modelId}`;
  const saved = localStorage.getItem(key);
  const ratings: Record<string, PhotoRating> = saved ? JSON.parse(saved) : {};
  
  ratings[photoId] = {
    photoId,
    modelId,
    rating: Math.max(1, Math.min(5, rating)),
    timestamp: Date.now(),
  };
  
  localStorage.setItem(key, JSON.stringify(ratings));
}

export function getPhotoRating(modelId: string, photoId: string): number | null {
  if (typeof window === "undefined") return null;
  const key = `photoRatings_${modelId}`;
  const saved = localStorage.getItem(key);
  if (!saved) return null;
  
  const ratings: Record<string, PhotoRating> = JSON.parse(saved);
  return ratings[photoId]?.rating || null;
}

export function getTopRatedPhotos(modelId: string): PhotoRating[] {
  if (typeof window === "undefined") return [];
  const key = `photoRatings_${modelId}`;
  const saved = localStorage.getItem(key);
  if (!saved) return [];
  
  const ratings: Record<string, PhotoRating> = JSON.parse(saved);
  return Object.values(ratings)
    .filter(r => r.rating >= 4)
    .sort((a, b) => b.rating - a.rating);
}

// ==================== STREAK BONUS SYSTEM ====================
export interface MessageStreak {
  modelId: string;
  currentStreak: number;
  lastMessageDate: string;
  longestStreak: number;
}

export function updateMessageStreak(modelId: string): { streak: number; bonusGems: number } {
  if (typeof window === "undefined") return { streak: 0, bonusGems: 0 };
  
  const key = `messageStreak_${modelId}`;
  const saved = localStorage.getItem(key);
  const today = new Date().toDateString();
  
  let streak: MessageStreak = saved 
    ? JSON.parse(saved) 
    : { modelId, currentStreak: 0, lastMessageDate: "", longestStreak: 0 };
  
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (streak.lastMessageDate === today) {
    // Already messaged today, no streak update
    return { streak: streak.currentStreak, bonusGems: 0 };
  }
  
  if (streak.lastMessageDate === yesterday.toDateString()) {
    streak.currentStreak += 1;
  } else {
    streak.currentStreak = 1;
  }
  
  streak.lastMessageDate = today;
  if (streak.currentStreak > streak.longestStreak) {
    streak.longestStreak = streak.currentStreak;
  }
  
  localStorage.setItem(key, JSON.stringify(streak));
  
  // Calculate bonus
  let bonusGems = 0;
  if (streak.currentStreak === 3) bonusGems = 50;
  else if (streak.currentStreak === 7) bonusGems = 150;
  else if (streak.currentStreak === 30) bonusGems = 1000;
  
  return { streak: streak.currentStreak, bonusGems };
}

export function getMessageStreak(modelId: string): MessageStreak {
  if (typeof window === "undefined") {
    return { modelId, currentStreak: 0, lastMessageDate: "", longestStreak: 0 };
  }
  const key = `messageStreak_${modelId}`;
  const saved = localStorage.getItem(key);
  return saved 
    ? JSON.parse(saved) 
    : { modelId, currentStreak: 0, lastMessageDate: "", longestStreak: 0 };
}

// ==================== VIRTUAL GIFTS SYSTEM ====================
export interface VirtualGift {
  id: string;
  name: string;
  emoji: string;
  price: number;
  affectionValue: number;
  animation: string;
}

export const VIRTUAL_GIFTS: VirtualGift[] = [
  { id: "rose", name: "Red Rose", emoji: "🌹", price: 50, affectionValue: 5, animation: "float-up" },
  { id: "chocolate", name: "Chocolates", emoji: "🍫", price: 100, affectionValue: 10, animation: "bounce" },
  { id: "teddy", name: "Teddy Bear", emoji: "🧸", price: 200, affectionValue: 20, animation: "wiggle" },
  { id: "jewelry", name: "Diamond Necklace", emoji: "💎", price: 500, affectionValue: 50, animation: "sparkle" },
  { id: "car", name: "Luxury Car", emoji: "🚗", price: 1000, affectionValue: 100, animation: "drive-in" },
  { id: "yacht", name: "Private Yacht", emoji: "🛥️", price: 5000, affectionValue: 500, animation: "sail" },
];

export interface AffectionData {
  modelId: string;
  totalAffection: number;
  giftsReceived: Record<string, number>;
}

export function sendGift(modelId: string, giftId: string): { success: boolean; newAffection: number; message: string } {
  if (typeof window === "undefined") return { success: false, newAffection: 0, message: "" };
  
  const gift = VIRTUAL_GIFTS.find(g => g.id === giftId);
  if (!gift) return { success: false, newAffection: 0, message: "Gift not found" };
  
  const gemsBalance = parseInt(localStorage.getItem("gemsBalance") || "0");
  if (gemsBalance < gift.price) {
    return { success: false, newAffection: 0, message: "Not enough gems" };
  }
  
  // Deduct gems
  localStorage.setItem("gemsBalance", (gemsBalance - gift.price).toString());
  
  // Update affection
  const key = `affection_${modelId}`;
  const saved = localStorage.getItem(key);
  const affection: AffectionData = saved 
    ? JSON.parse(saved) 
    : { modelId, totalAffection: 0, giftsReceived: {} };
  
  affection.totalAffection += gift.affectionValue;
  affection.giftsReceived[giftId] = (affection.giftsReceived[giftId] || 0) + 1;
  
  localStorage.setItem(key, JSON.stringify(affection));
  
  // Generate thank you message based on gift value
  let message = "";
  if (gift.price >= 1000) {
    message = `OMG! You gave me a ${gift.name}?! You're absolutely amazing! I'm speechless... 💕`;
  } else if (gift.price >= 500) {
    message = `A ${gift.name}? You're so generous! I love it! 💎`;
  } else if (gift.price >= 200) {
    message = `Aww, a ${gift.name}! You're so sweet! 🥰`;
  } else {
    message = `Thank you for the ${gift.name}! That made my day! 😊`;
  }
  
  return { success: true, newAffection: affection.totalAffection, message };
}

export function getAffection(modelId: string): AffectionData {
  if (typeof window === "undefined") {
    return { modelId, totalAffection: 0, giftsReceived: {} };
  }
  const key = `affection_${modelId}`;
  const saved = localStorage.getItem(key);
  return saved 
    ? JSON.parse(saved) 
    : { modelId, totalAffection: 0, giftsReceived: {} };
}

// ==================== MODEL RIVALRY/JEALOUSY SYSTEM ====================
export interface JealousyData {
  modelId: string;
  jealousyLevel: number; // 0-100
  lastInteraction: number;
  warningSent: boolean;
}

export function updateJealousy(chattedModelId: string): { jealousModels: string[]; messages: string[] } {
  if (typeof window === "undefined") return { jealousModels: [], messages: [] };
  
  const allModels = ["mia", "sakura", "isabella", "aaliyah", "riley"];
  const jealousModels: string[] = [];
  const messages: string[] = [];
  
  allModels.forEach(modelId => {
    if (modelId === chattedModelId) {
      // Reset jealousy for chatted model
      const key = `jealousy_${modelId}`;
      const data: JealousyData = { modelId, jealousyLevel: 0, lastInteraction: Date.now(), warningSent: false };
      localStorage.setItem(key, JSON.stringify(data));
      return;
    }
    
    const key = `jealousy_${modelId}`;
    const saved = localStorage.getItem(key);
    let data: JealousyData = saved 
      ? JSON.parse(saved) 
      : { modelId, jealousyLevel: 0, lastInteraction: 0, warningSent: false };
    
    // Increase jealousy if they haven't been chatted with recently
    const hoursSinceChat = (Date.now() - data.lastInteraction) / (1000 * 60 * 60);
    if (hoursSinceChat > 2) {
      data.jealousyLevel = Math.min(100, data.jealousyLevel + 15);
    }
    
    // Generate jealousy message if threshold reached
    if (data.jealousyLevel >= 70 && !data.warningSent) {
      jealousModels.push(modelId);
      data.warningSent = true;
      
      const modelNames: Record<string, string> = {
        mia: "Mia",
        sakura: "Sakura",
        isabella: "Isabella",
        aaliyah: "Aaliyah",
        riley: "Riley"
      };
      
      const jealousyMessages = [
        `${modelNames[modelId]} noticed you've been chatting with others... She's feeling a bit jealous 👀`,
        `You haven't visited ${modelNames[modelId]} in a while... She's waiting for you 💔`,
        `${modelNames[modelId]} saw you online but you didn't message her... She's sulking 😤`,
      ];
      messages.push(jealousyMessages[Math.floor(Math.random() * jealousyMessages.length)]);
    }
    
    localStorage.setItem(key, JSON.stringify(data));
  });
  
  return { jealousModels, messages };
}

export function getJealousyLevel(modelId: string): number {
  if (typeof window === "undefined") return 0;
  const key = `jealousy_${modelId}`;
  const saved = localStorage.getItem(key);
  return saved ? JSON.parse(saved).jealousyLevel : 0;
}

// ==================== LIMITED EDITION CONTENT ====================
export interface LimitedEditionItem {
  id: string;
  modelId: string;
  title: string;
  description: string;
  price: number;
  availableFrom: number;
  availableUntil: number;
  type: "photo" | "video" | "story";
}

export function getActiveLimitedEditions(): LimitedEditionItem[] {
  const now = Date.now();
  
  // Define limited edition items (in production, this could come from an API)
  const items: LimitedEditionItem[] = [
    {
      id: "mia_valentine",
      modelId: "mia",
      title: "Valentine's Special",
      description: "Mia in red lingerie - exclusive Valentine's content",
      price: 999,
      availableFrom: new Date("2026-02-10").getTime(),
      availableUntil: new Date("2026-02-15").getTime(),
      type: "photo"
    },
    {
      id: "sakura_halloween",
      modelId: "sakura",
      title: "Halloween Cosplay",
      description: "Sakura as a sexy witch - limited Halloween special",
      price: 899,
      availableFrom: new Date("2026-10-25").getTime(),
      availableUntil: new Date("2026-11-01").getTime(),
      type: "photo"
    },
    {
      id: "isabella_birthday",
      modelId: "isabella",
      title: "Birthday Surprise",
      description: "Isabella's birthday celebration - exclusive content",
      price: 1299,
      availableFrom: new Date("2026-01-20").getTime(),
      availableUntil: new Date("2026-01-22").getTime(),
      type: "video"
    },
  ];
  
  return items.filter(item => now >= item.availableFrom && now <= item.availableUntil);
}

export function hasPurchasedLimitedEdition(itemId: string): boolean {
  if (typeof window === "undefined") return false;
  const key = "purchasedLimitedEditions";
  const saved = localStorage.getItem(key);
  const purchased: string[] = saved ? JSON.parse(saved) : [];
  return purchased.includes(itemId);
}

export function purchaseLimitedEdition(itemId: string): boolean {
  if (typeof window === "undefined") return false;
  
  const items = getActiveLimitedEditions();
  const item = items.find(i => i.id === itemId);
  if (!item) return false;
  
  const gemsBalance = parseInt(localStorage.getItem("gemsBalance") || "0");
  if (gemsBalance < item.price) return false;
  
  // Deduct gems
  localStorage.setItem("gemsBalance", (gemsBalance - item.price).toString());
  
  // Mark as purchased
  const key = "purchasedLimitedEditions";
  const saved = localStorage.getItem(key);
  const purchased: string[] = saved ? JSON.parse(saved) : [];
  purchased.push(itemId);
  localStorage.setItem(key, JSON.stringify(purchased));
  
  return true;
}
