"use client";

import { useUser, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import TinderCard from 'react-tinder-card';
import DailyRewardModal from "@/components/DailyRewardModal";
import LimitedEditionBanner from "@/components/LimitedEditionBanner";
import AchievementsModal from "@/components/AchievementsModal";
import { checkDailyLogin } from "@/lib/gameSystems";
import { ProgressManager } from "@/lib/progress";
import { getModelsWithProgress } from "@/lib/progress/chatProgress";

export default function DashboardClient() {
  const { isLoaded, isSignedIn, user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<"my" | "new">("my");
  const [swipeModels, setSwipeModels] = useState<any[]>([]);
  const [modelsWithChats, setModelsWithChats] = useState<string[]>([]);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showQuestsModal, setShowQuestsModal] = useState(false);
  const [showAchievementsModal, setShowAchievementsModal] = useState(false);

  const allModels = useMemo(() => [
    { id: 'mia', name: 'Mia Thompson', role: 'Cheerleader', age: 22, avatar: 'https://res.cloudinary.com/ddnaxqmdw/image/upload/v1769080927/13_k3ynrk.png', desc: 'Ready to play?' },
    { id: 'sakura', name: 'Sakura "Suki" Lin', role: 'Cosplayer', age: 20, avatar: 'https://res.cloudinary.com/ddnaxqmdw/image/upload/v1770393771/Sakura1_nctckh.png', desc: 'Ready to play roles? 🌸' },
    { id: 'isabella', name: 'Isabella Brooks', role: 'Luxury Escort', age: 23, avatar: 'https://res.cloudinary.com/ddnaxqmdw/image/upload/v1770599989/hf_20260209_011732_673f8c7a-41cb-45f6-9cb4-cd071b69f2cd_mwrsey.png', desc: 'My time is expensive… but for the right king 🔥🖖👑' },
    { id: 'aaliyah', name: 'Aaliyah "Liyah"', role: 'Exotic Dancer', age: 24, avatar: 'https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771497563/Isabella1_pvijrq.png', desc: 'Sensual & mysterious 🔥' },
    { id: 'riley', name: 'Riley "Ry" Harper', role: 'Gamer Girl', age: 21, avatar: 'https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771503243/Riley1_lvyoep.png', desc: 'Nerdy & seductive… ready to duo? 🎮😏' },
  ], []);

  useEffect(() => {
    // Get models that user has started chatting with
    const modelsWithProgress = getModelsWithProgress();
    setModelsWithChats(modelsWithProgress);
    
    // Filter new models: only show models NOT in chat progress
    const newModels = allModels.filter(model => !modelsWithProgress.includes(model.id));
    setSwipeModels([...newModels].reverse());
  }, [allModels]);

  const onSwipe = (direction: string, modelId: string) => {
    if (direction === 'right') {
      router.push(`/chat/${modelId}`);
    }
    setSwipeModels(prev => prev.filter(m => m.id !== modelId));
  };
  const [gemsBalance, setGemsBalance] = useState(499);
  const [lastMiaMessage, setLastMiaMessage] = useState<{text: string, isNew: boolean} | null>(null);
  const [referralCode, setReferralCode] = useState("");
  const [referralStats, setReferralStats] = useState({ invited: 0, earned: 0 });
  const [dailyStories, setDailyStories] = useState<any[]>([]);
  const [questsProgress, setQuestsProgress] = useState({
    messagesMia: 0,
    photosBought: 0,
    dailyStreak: 0,
    modelsExplored: 2,
    totalSpent: 0
  });
  const [showDailyReward, setShowDailyReward] = useState(false);

  // Load balance and quests from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedGems = localStorage.getItem("gemsBalance");
      if (savedGems) {
        setGemsBalance(parseInt(savedGems));
      } else {
        localStorage.setItem("gemsBalance", "499");
      }

      const savedQuests = localStorage.getItem("questsProgress");
      if (savedQuests) {
        setQuestsProgress(JSON.parse(savedQuests));
      } else {
        localStorage.setItem("questsProgress", JSON.stringify(questsProgress));
      }

      // Load Last Message
      const savedLastMsg = localStorage.getItem("lastMiaMessage");
      if (savedLastMsg) setLastMiaMessage(JSON.parse(savedLastMsg));

      // Load Referral
      let savedRef = localStorage.getItem("referralCode");
      if (!savedRef) {
        savedRef = "REF-" + Math.random().toString(36).substring(2, 8).toUpperCase();
        localStorage.setItem("referralCode", savedRef);
      }
      setReferralCode(savedRef);

      const savedRefStats = localStorage.getItem("referralStats");
      if (savedRefStats) setReferralStats(JSON.parse(savedRefStats));

      // Load Stories
      const savedStories = localStorage.getItem("dailyStories");
      const now = new Date().getTime();
      if (savedStories) {
        const parsed = JSON.parse(savedStories);
        if (now - parsed.date < 24 * 60 * 60 * 1000) {
          setDailyStories(parsed.items);
        } else {
          generateNewStories();
        }
      } else {
        generateNewStories();
      }

      // Check daily login reward
      const loginStatus = checkDailyLogin();
      if (loginStatus.canClaim) {
        setShowDailyReward(true);
      }
      
      // Update models with chat progress whenever localStorage might change
      const modelsWithProgress = getModelsWithProgress();
      setModelsWithChats(modelsWithProgress);
      const newModels = allModels.filter(model => !modelsWithProgress.includes(model.id));
      setSwipeModels([...newModels].reverse());
    }
  }, [allModels]);

  const generateNewStories = () => {
    const storyPhotos = [
      "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1770662087/1_pe3zwx.png",
      "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1770661724/17_vwjfzi.png",
      "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1770662123/32_rzxwjt.png",
      "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1770662142/38_j0lys6.png",
    ];
    const newItems = storyPhotos.map((url, i) => ({
      id: i,
      url,
      unlocked: false
    }));
    setDailyStories(newItems);
    localStorage.setItem("dailyStories", JSON.stringify({ items: newItems, date: new Date().getTime() }));
  };

  const handleUnlockStory = (id: number) => {
    if (gemsBalance < 199) {
      alert("Not enough gems. Buy more in Shop");
      return;
    }
    const newBalance = gemsBalance - 199;
    setGemsBalance(newBalance);
    localStorage.setItem("gemsBalance", newBalance.toString());

    const newItems = dailyStories.map(s => s.id === id ? { ...s, unlocked: true } : s);
    setDailyStories(newItems);
    localStorage.setItem("dailyStories", JSON.stringify({ items: newItems, date: new Date().getTime() }));
    alert("Story Unlocked! 🔥");
  };

  const handleLogOut = async () => {
    try {
      await signOut();
      router.push("/");
    } catch (error) {
      console.error("Sign out error:", error);
      alert("Failed to sign out. Please try again.");
    }
  };

  const copyReferral = () => {
    const link = `pulsemate-ai.com?ref=${referralCode}`;
    navigator.clipboard.writeText(link);
    alert("Referral link copied to clipboard!");
  };

  const claimQuestReward = (questId: string, reward: string) => {
    // Check if quest is complete
    const questProgress = (questsProgress as any)[questId] || 0;
    const questGoal = getQuestGoal(questId);
    
    if (questProgress < questGoal) {
      alert("Quest not completed yet!");
      return;
    }

    // Check if already claimed
    if (ProgressManager.quests.isAchievementRewardClaimed(questId)) {
      alert("Reward already claimed!");
      return;
    }

    // Claim the reward
    const claimed = ProgressManager.quests.claimAchievementReward(questId);
    if (claimed) {
      // Parse reward amount (e.g., "200 gems" -> 200)
      const rewardAmount = parseInt(reward.match(/\d+/)?.[0] || "0");
      const newBalance = gemsBalance + rewardAmount;
      setGemsBalance(newBalance);
      localStorage.setItem("gemsBalance", newBalance.toString());
      alert(`Quest completed! +${rewardAmount} gems added to your balance! ✨`);
    }
  };

  const getQuestGoal = (questId: string): number => {
    const questGoals: Record<string, number> = {
      dailyStreak: 7,
      photosBought: 10,
      totalSpent: 5000,
      messagesMia: 50,
      miaDateComplete: 1,
      messagesSakura: 50,
      sakuraCosplay: 1,
      messagesIsabella: 50,
      isabellaVIP: 1,
      messagesAaliyah: 50,
      aaliyahLuxury: 6,
      messagesRiley: 50,
      rileyGaming: 1,
      modelsExplored: 5,
      allSexChats: 5,
      allDates: 5,
      kissLevel5: 5,
      sendSparks: 20,
    };
    return questGoals[questId] || 1;
  };

  if (!isLoaded || !isSignedIn || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-purple-950 to-pink-950 text-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header removed to avoid duplication with layout.tsx header */}
        {/* 
        <header className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
            Welcome, {user.firstName || user.username} 💗
          </h1>
          <div className="flex items-center gap-4">
            <div className="bg-purple-900/50 px-6 py-3 rounded-full text-lg font-medium">
              Gems: {gemsBalance}
            </div>
            <Link href="/">
              <button className="px-4 py-2 bg-gray-700/70 hover:bg-gray-600 text-white rounded-xl font-medium transition">
                ← Landing
              </button>
            </Link>
            <button
              onClick={handleLogOut}
              className="px-4 py-2 bg-red-600/70 hover:bg-red-700 text-white rounded-xl font-medium transition"
            >
              Log Out
            </button>
          </div>
        </header>
        */}
        
        {/* User Balance Display (since header is removed) */}
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => setShowDailyReward(true)}
            className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full font-bold text-sm hover:brightness-110 transition animate-pulse"
          >
            🎁 Daily Reward
          </button>
          <div className="bg-purple-900/50 px-6 py-3 rounded-full text-lg font-medium border border-purple-500/30">
            Gems: {gemsBalance} 💎
          </div>
        </div>

        {/* Daily Reward Modal */}
        <DailyRewardModal
          isOpen={showDailyReward}
          onClose={() => setShowDailyReward(false)}
          onClaim={(gems) => {
            const newBalance = gemsBalance + gems;
            setGemsBalance(newBalance);
            localStorage.setItem("gemsBalance", newBalance.toString());
          }}
        />

        {/* Limited Edition Content */}
        <LimitedEditionBanner
          gemsBalance={gemsBalance}
          onPurchase={(newBalance) => {
            setGemsBalance(newBalance);
            localStorage.setItem("gemsBalance", newBalance.toString());
          }}
        />
        
        {/* Model Stories Carousel */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <span className="text-pink-500">Stories</span>
            <span className="text-xs text-gray-400 font-normal">24h</span>
            <div className="flex-1 h-[1px] bg-purple-500/20" />
          </h2>
          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
            {allModels.map((model) => (
              <Link key={model.id} href={`/stories/${model.id}`}>
                <div className="flex flex-col items-center gap-2 cursor-pointer group">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full p-[3px] bg-gradient-to-tr from-pink-500 via-purple-500 to-pink-500 hover:scale-105 transition-transform">
                      <div className="w-full h-full rounded-full bg-black p-[2px]">
                        <img
                          src={model.avatar}
                          alt={model.name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-gray-300 group-hover:text-white transition max-w-[80px] text-center truncate">
                    {model.name.split(' ')[0]}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Quick Actions (5-card: Gallery, Shop, Quests, Achievements, Profile) */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
          <Link href="/galleries" className="group">
            <div className="bg-black/40 backdrop-blur-lg p-6 rounded-3xl border border-purple-500/30 hover:border-pink-500 transition-all shadow-xl hover:shadow-pink-500/10 h-full">
              <div className="text-purple-500 text-3xl mb-3 group-hover:scale-110 transition-transform">📸</div>
              <h3 className="text-lg font-bold mb-1 text-white">Gallery</h3>
              <p className="text-gray-400 text-xs">Unlock exclusive photos and videos.</p>
            </div>
          </Link>
          <Link href="/shop" className="group">
            <div className="bg-black/40 backdrop-blur-lg p-6 rounded-3xl border border-purple-500/30 hover:border-pink-500 transition-all shadow-xl hover:shadow-pink-500/10 bg-gradient-to-br from-pink-500/10 to-purple-600/10 h-full">
              <div className="text-yellow-500 text-3xl mb-3 group-hover:scale-110 transition-transform">💎</div>
              <h3 className="text-lg font-bold mb-1 text-white">Shop</h3>
              <p className="text-gray-400 text-xs">Refill your gem balance.</p>
            </div>
          </Link>
          <div onClick={() => setShowQuestsModal(true)} className="group cursor-pointer">
            <div className="bg-black/40 backdrop-blur-lg p-6 rounded-3xl border border-purple-500/30 hover:border-pink-500 transition-all shadow-xl hover:shadow-pink-500/10 h-full">
              <div className="text-green-500 text-3xl mb-3 group-hover:scale-110 transition-transform">🎯</div>
              <h3 className="text-lg font-bold mb-1 text-white">Quests</h3>
              <p className="text-gray-400 text-xs">Complete quests to earn gems.</p>
            </div>
          </div>
          <div onClick={() => setShowAchievementsModal(true)} className="group cursor-pointer">
            <div className="bg-black/40 backdrop-blur-lg p-6 rounded-3xl border border-purple-500/30 hover:border-pink-500 transition-all shadow-xl hover:shadow-pink-500/10 h-full">
              <div className="text-yellow-500 text-3xl mb-3 group-hover:scale-110 transition-transform">🏆</div>
              <h3 className="text-lg font-bold mb-1 text-white">Achievements</h3>
              <p className="text-gray-400 text-xs">Unlock badges and rewards.</p>
            </div>
          </div>
          <Link href="/profile" className="group">
            <div className="bg-black/40 backdrop-blur-lg p-6 rounded-3xl border border-purple-500/30 hover:border-pink-500 transition-all shadow-xl hover:shadow-pink-500/10 h-full">
              <div className="text-blue-500 text-3xl mb-3 group-hover:scale-110 transition-transform">👤</div>
              <h3 className="text-lg font-bold mb-1 text-white">Profile</h3>
              <p className="text-gray-400 text-xs">View stats and settings.</p>
            </div>
          </Link>
        </section>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-purple-500/20">
          <button 
            onClick={() => setActiveTab("my")}
            className={`pb-4 px-4 font-bold transition-all ${activeTab === "my" ? "text-pink-500 border-b-2 border-pink-500" : "text-gray-500 hover:text-gray-300"}`}
          >
            My Models
          </button>
          <button 
            onClick={() => setActiveTab("new")}
            className={`pb-4 px-4 font-bold transition-all ${activeTab === "new" ? "text-pink-500 border-b-2 border-pink-500" : "text-gray-500 hover:text-gray-300"}`}
          >
            New Models (Swipe)
          </button>
        </div>

        {activeTab === "new" ? (
          <section className="mb-12 flex flex-col items-center justify-center min-h-[500px]">
            <h2 className="text-2xl font-bold mb-8 bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">Swipe to Start Chatting 💗</h2>
            <div className="relative w-80 h-[450px]">
              {swipeModels.length > 0 ? swipeModels.map((model) => (
                <TinderCard
                  key={model.id}
                  className="absolute"
                  onSwipe={(dir: string) => onSwipe(dir, model.id)}
                  preventSwipe={['up', 'down']}
                >
                  <div className="w-80 h-[450px] bg-black/40 backdrop-blur-xl rounded-3xl border border-purple-500/30 overflow-hidden shadow-2xl group cursor-grab active:cursor-grabbing">
                    <div className="h-2/3 relative">
                      {model.avatar ? (
                        <img src={model.avatar} alt={model.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gray-800 flex items-center justify-center text-gray-500">No Image</div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                    </div>
                    <div className="p-6">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-2xl font-bold">{model.name}, {model.age}</h3>
                      </div>
                      <p className="text-pink-400 text-sm font-bold uppercase tracking-widest mb-2">{model.role}</p>
                      <p className="text-gray-400 text-sm">{model.desc}</p>
                    </div>
                    {/* Swipe Hints */}
                    <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      <div className="px-3 py-1 bg-red-500/80 rounded-lg text-white font-black border-2 border-white rotate-[-15deg]">SKIP</div>
                    </div>
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      <div className="px-3 py-1 bg-green-500/80 rounded-lg text-white font-black border-2 border-white rotate-[15deg]">CHAT</div>
                    </div>
                  </div>
                </TinderCard>
              )) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-center p-8 bg-black/20 rounded-3xl border border-dashed border-purple-500/30">
                  <div className="text-6xl mb-4">💋</div>
                  <h3 className="text-xl font-bold mb-2 text-white">No New Models</h3>
                  <p className="text-gray-400 mb-4">You've started chatting with all available models!</p>
                  <p className="text-sm text-purple-400">New models will be added soon ✨</p>
                </div>
              )}
            </div>
            {swipeModels.length > 0 && (
              <div className="mt-8 flex gap-8">
                <div className="text-xs text-gray-500 uppercase tracking-widest animate-pulse">← Swipe Left to Skip</div>
                <div className="text-xs text-pink-500 uppercase tracking-widest animate-pulse">Swipe Right to Chat →</div>
              </div>
            )}
          </section>
        ) : (
          <>
            {/* My Models - Dynamic based on chat progress */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <span className="text-pink-500">My Models</span>
                <div className="flex-1 h-[1px] bg-purple-500/20" />
              </h2>
                  
              {modelsWithChats.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="text-6xl mb-4">💔</div>
                  <h3 className="text-xl font-bold mb-2 text-white">No Models Yet</h3>
                  <p className="text-gray-400 mb-6">Start chatting with models to see them here!</p>
                  <button
                    onClick={() => setActiveTab("new")}
                    className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full font-bold hover:brightness-110 transition"
                  >
                    Discover New Models →
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {allModels.filter(model => modelsWithChats.includes(model.id)).map((model) => (
                    <div key={model.id} className="group bg-black/40 backdrop-blur-lg rounded-3xl overflow-hidden border border-purple-500/30 hover:border-pink-500 transition-all duration-300 flex flex-col shadow-2xl">
                      <div className="h-48 relative">
                        <img 
                          src={model.avatar} 
                          alt={model.name} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                        <div className="absolute bottom-4 left-4">
                          <h3 className="text-xl font-bold text-white">{model.name}</h3>
                          <p className="text-pink-300 text-xs font-bold uppercase tracking-widest">{model.role} • {model.age}</p>
                        </div>
                        <span className="absolute top-4 right-4 px-2 py-1 bg-green-500/20 text-green-400 text-[10px] font-bold rounded-full border border-green-500/30">ONLINE</span>
                      </div>
                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <p className="text-gray-400 text-sm mb-4 line-clamp-2">{model.desc}</p>
                        <div className="flex gap-2">
                          <Link href={`/chat/${model.id}`} className="flex-1 py-2 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl text-center text-sm font-bold hover:brightness-110 transition">
                            Chat
                          </Link>
                          <Link href={`/gallery/${model.id}`} className="px-3 py-2 bg-white/5 hover:bg-white/10 rounded-xl transition border border-white/10 text-sm">
                            📸
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}

    {/* Quests Modal */}
    {showQuestsModal && (
      <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-[100] p-6 overflow-y-auto">
        <div className="bg-gradient-to-b from-[#1a102e] to-[#0f0a1a] rounded-[2rem] p-8 max-w-4xl w-full border border-purple-500/40 shadow-[0_0_50px_rgba(192,132,252,0.2)] max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-green-500 to-emerald-600 flex items-center justify-center text-3xl shadow-2xl">
                🏆
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white">Quests & Achievements</h2>
                <p className="text-gray-400 text-sm">Complete quests to earn gems!</p>
              </div>
            </div>
            <button 
              onClick={() => setShowQuestsModal(false)}
              className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all text-3xl font-light"
            >
              ×
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              // Daily & General Quests
              { id: 'dailyStreak', title: 'Daily Devotion', desc: 'Login for 7 days streak', reward: '200 gems', goal: 7 },
              { id: 'photosBought', title: 'Photo Collector', desc: 'Unlock 10 private photos', reward: '500 gems', goal: 10 },
              { id: 'totalSpent', title: 'Big Spender', desc: 'Spend 5000 gems total', reward: '1000 gems', goal: 5000 },
              
              // Model-Specific Quests
              { id: 'messagesMia', title: 'Mia\'s Favorite', desc: 'Send 50 messages to Mia', reward: '200 gems', goal: 50 },
              { id: 'miaDateComplete', title: 'Cheerleader Date', desc: 'Complete Mia\'s Date scenario', reward: '300 gems', goal: 1 },
              { id: 'messagesSakura', title: 'Sakura\'s Senpai', desc: 'Send 50 messages to Sakura', reward: '200 gems', goal: 50 },
              { id: 'sakuraCosplay', title: 'Cosplay Connoisseur', desc: 'Unlock Sakura\'s Sex Chatting', reward: '300 gems', goal: 1 },
              { id: 'messagesIsabella', title: 'Isabella\'s King', desc: 'Send 50 messages to Isabella', reward: '200 gems', goal: 50 },
              { id: 'isabellaVIP', title: 'VIP Treatment', desc: 'Unlock Isabella\'s Date mode', reward: '300 gems', goal: 1 },
              { id: 'messagesAaliyah', title: 'Aaliyah\'s VIP', desc: 'Send 50 messages to Aaliyah', reward: '200 gems', goal: 50 },
              { id: 'aaliyahLuxury', title: 'Luxury Experience', desc: 'Buy all Aaliyah\'s PPV photos', reward: '500 gems', goal: 6 },
              { id: 'messagesRiley', title: 'Riley\'s Duo Partner', desc: 'Send 50 messages to Riley', reward: '200 gems', goal: 50 },
              { id: 'rileyGaming', title: 'Gaming Night', desc: 'Complete Riley\'s Date scenario', reward: '300 gems', goal: 1 },
              
              // Collection Quests
              { id: 'modelsExplored', title: 'Model Explorer', desc: 'Start chat with all 5 models', reward: '500 gems', goal: 5 },
              { id: 'allSexChats', title: 'Master Seducer', desc: 'Unlock Sex Chatting for all models', reward: '1000 gems', goal: 5 },
              { id: 'allDates', title: 'Romantic Legend', desc: 'Unlock Date mode for all models', reward: '1000 gems', goal: 5 },
              { id: 'kissLevel5', title: 'Kiss Master', desc: 'Reach Kiss Level 5 with any model', reward: '500 gems', goal: 5 },
              { id: 'sendSparks', title: 'Spark Spreader', desc: 'Send 20 Sparks total', reward: '300 gems', goal: 20 },
            ].map((quest) => {
              const progress = (questsProgress as any)[quest.id] || 0;
              const isComplete = progress >= quest.goal;
              const isClaimed = ProgressManager.quests.isAchievementRewardClaimed(quest.id);
              
              return (
              <div key={quest.id} className="bg-black/40 backdrop-blur-lg rounded-2xl p-5 border border-purple-500/30 hover:border-pink-500 transition-all group">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-bold text-white">{quest.title}</h3>
                  <span className="text-green-400 font-bold text-sm">+{quest.reward}</span>
                </div>
                <p className="text-gray-400 text-sm mb-4">{quest.desc}</p>
                <div className="w-full bg-gray-800 rounded-full h-2 mb-3">
                  <div 
                    className="bg-gradient-to-r from-pink-500 to-purple-600 h-full rounded-full transition-all"
                    style={{ width: `${Math.min(100, (progress / quest.goal) * 100)}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 text-center mb-3">
                  Progress: {Math.min(progress, quest.goal)} / {quest.goal}
                </p>
                
                {/* Claim Button */}
                {isComplete && !isClaimed && (
                  <button
                    onClick={() => claimQuestReward(quest.id, quest.reward)}
                    className="w-full py-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl text-sm font-bold hover:brightness-110 transition"
                  >
                    Claim Reward
                  </button>
                )}
                {isComplete && isClaimed && (
                  <div className="w-full py-2 bg-green-600/30 border border-green-500/50 rounded-xl text-sm font-bold text-green-400 text-center">
                    ✓ Claimed
                  </div>
                )}
              </div>
            );})}
          </div>
        </div>
      </div>
    )}

    {/* Profile Modal */}
    {showProfileModal && (
      <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-[100] p-6 overflow-y-auto">
        <div className="bg-gradient-to-b from-[#1a102e] to-[#0f0a1a] rounded-[2rem] p-10 max-w-2xl w-full border border-purple-500/40 shadow-[0_0_50px_rgba(192,132,252,0.2)]">
          <div className="flex justify-between items-center mb-10">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center text-2xl font-bold border-2 border-white/10 shadow-2xl">
                {user.firstName?.[0] || user.username?.[0] || 'U'}
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white">Your Profile</h2>
                <p className="text-gray-400 text-sm">Manage your account and stats</p>
              </div>
            </div>
            <button 
              onClick={() => setShowProfileModal(false)}
              className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all text-3xl font-light"
            >
              ×
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-white/5 rounded-2xl p-6 text-center border border-white/5 shadow-inner group hover:bg-white/10 transition-colors">
              <div className="text-3xl font-black text-yellow-400 mb-1">{gemsBalance}</div>
              <div className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-bold">Total Gems</div>
            </div>
            <div className="bg-white/5 rounded-2xl p-6 text-center border border-white/5 shadow-inner group hover:bg-white/10 transition-colors">
              <div className="text-3xl font-black text-pink-500 mb-1">{questsProgress.modelsExplored}</div>
              <div className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-bold">Models Met</div>
            </div>
            <div className="bg-white/5 rounded-2xl p-6 text-center border border-white/5 shadow-inner group hover:bg-white/10 transition-colors">
              <div className="text-3xl font-black text-purple-500 mb-1">{questsProgress.photosBought}</div>
              <div className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-bold">Unlocked</div>
            </div>
          </div>

          <div className="space-y-4">
            <button className="w-full py-4 bg-gradient-to-r from-pink-500/20 to-purple-600/20 border border-purple-500/30 rounded-2xl font-bold text-purple-200 hover:brightness-125 transition-all text-lg shadow-xl">
              Edit Profile Details
            </button>
            <button 
              onClick={handleLogOut}
              className="w-full py-4 bg-red-500/10 border border-red-500/30 rounded-2xl font-bold text-red-400 hover:bg-red-500/20 transition-all text-lg"
            >
              Log Out
            </button>
            <button 
              onClick={() => setShowProfileModal(false)}
              className="w-full py-4 bg-white/5 rounded-2xl font-bold text-gray-400 hover:text-white hover:bg-white/10 transition-all text-lg"
            >
              Close Settings
            </button>
          </div>
        </div>
      </div>
    )}

        {/* Achievements Modal */}
        <AchievementsModal 
          isOpen={showAchievementsModal}
          onClose={() => setShowAchievementsModal(false)}
        />
      </div>
    </div>
  );
}
