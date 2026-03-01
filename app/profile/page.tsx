"use client";

import { useUser, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ProgressManager } from "@/lib/progress";
import { getTotalMessageCount, getModelsWithProgress } from "@/lib/progress/chatProgress";

interface UserStats {
  totalTimeSpent: number;
  totalMessagesSent: number;
  totalPhotosUnlocked: number;
  totalGemsSpent: number;
  totalSparksSent: number;
  loginCount: number;
  firstLoginDate: number;
  longestStreak: number;
  achievementsUnlocked: string[];
}

export default function ProfilePage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();

  const [gemsBalance, setGemsBalance] = useState(499);
  const [sparksBalance, setSparksBalance] = useState(0);
  const [stats, setStats] = useState<UserStats>({
    totalTimeSpent: 0,
    totalMessagesSent: 0,
    totalPhotosUnlocked: 0,
    totalGemsSpent: 0,
    totalSparksSent: 0,
    loginCount: 0,
    firstLoginDate: 0,
    longestStreak: 0,
    achievementsUnlocked: [],
  });
  const [modelsWithProgress, setModelsWithProgress] = useState<string[]>([]);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importData, setImportData] = useState("");
  const [exportData, setExportData] = useState("");
  const [activeModels, setActiveModels] = useState(0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Load balances
      const savedGems = localStorage.getItem("gemsBalance");
      if (savedGems) setGemsBalance(parseInt(savedGems));

      const savedSparks = localStorage.getItem("sparksBalance");
      if (savedSparks) setSparksBalance(parseInt(savedSparks));

      // Load stats from ProgressManager
      const userStats = ProgressManager.stats.getStats();
      const totalMessages = getTotalMessageCount();
      setStats({
        totalTimeSpent: userStats.totalTimeSpent || 0,
        totalMessagesSent: Math.max(totalMessages, userStats.totalMessagesSent || 0),
        totalPhotosUnlocked: userStats.totalPhotosUnlocked || 0,
        totalGemsSpent: userStats.totalGemsSpent || 0,
        totalSparksSent: userStats.totalSparksSent || 0,
        loginCount: userStats.loginCount || 1,
        firstLoginDate: userStats.firstLoginDate || Date.now(),
        longestStreak: userStats.longestStreak || 0,
        achievementsUnlocked: userStats.achievementsUnlocked || [],
      });

      // Get models with progress
      setModelsWithProgress(getModelsWithProgress());

      // Count active models (those with messages)
      const models = getModelsWithProgress();
      setActiveModels(models.length);
    }
  }, []);

  const handleLogOut = async () => {
    try {
      await signOut();
      router.push("/");
    } catch (error) {
      console.error("Sign out error:", error);
      alert("Failed to sign out. Please try again.");
    }
  };

  const handleExport = () => {
    const data = ProgressManager.exportImport.exportAll();
    setExportData(data);
    setShowExportModal(true);
  };

  const handleImport = () => {
    if (!importData.trim()) {
      alert("Please paste your backup data");
      return;
    }
    
    const success = ProgressManager.exportImport.importAll(importData);
    if (success) {
      alert("Data imported successfully! Page will reload.");
      window.location.reload();
    } else {
      alert("Failed to import data. Please check the format.");
    }
  };

  const handleClearAll = () => {
    if (confirm("Are you sure? This will delete ALL your progress permanently!")) {
      ProgressManager.exportImport.clearAll();
      alert("All progress cleared. Page will reload.");
      window.location.reload();
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(exportData);
    alert("Copied to clipboard!");
  };

  const daysSinceJoin = stats.firstLoginDate 
    ? Math.floor((Date.now() - stats.firstLoginDate) / (1000 * 60 * 60 * 24))
    : 0;

  if (!isLoaded || !isSignedIn || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-purple-950 to-pink-950 text-white p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <Link href="/dashboard">
            <button className="px-4 py-2 bg-gray-700/70 hover:bg-gray-600 text-white rounded-xl font-medium transition">
              ← Back to Dashboard
            </button>
          </Link>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
            Profile & Settings
          </h1>
          <div className="w-24"></div>
        </div>

        {/* User Info Card */}
        <div className="bg-gray-800/50 backdrop-blur-md rounded-2xl p-6 border border-purple-500/30 mb-6">
          <div className="flex items-center gap-4">
            {user.imageUrl ? (
              <img 
                src={user.imageUrl} 
                alt="Profile" 
                className="w-20 h-20 rounded-full border-2 border-pink-500"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-2xl font-bold">
                {user.firstName?.[0] || user.username?.[0] || "?"}
              </div>
            )}
            <div>
              <h2 className="text-2xl font-bold">{user.firstName || user.username}</h2>
              <p className="text-gray-400">{user.emailAddresses[0]?.emailAddress}</p>
              <p className="text-sm text-purple-400 mt-1">Member for {daysSinceJoin} days</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-800/50 backdrop-blur-md rounded-xl p-4 border border-purple-500/30 text-center">
            <div className="text-3xl font-bold text-pink-500">{gemsBalance}</div>
            <div className="text-sm text-gray-400">Gems 💎</div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-md rounded-xl p-4 border border-purple-500/30 text-center">
            <div className="text-3xl font-bold text-purple-500">{sparksBalance}</div>
            <div className="text-sm text-gray-400">Sparks ⚡</div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-md rounded-xl p-4 border border-purple-500/30 text-center">
            <div className="text-3xl font-bold text-yellow-500">{stats.totalMessagesSent}</div>
            <div className="text-sm text-gray-400">Messages 💬</div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-md rounded-xl p-4 border border-purple-500/30 text-center">
            <div className="text-3xl font-bold text-green-500">{stats.totalPhotosUnlocked}</div>
            <div className="text-sm text-gray-400">Photos 📸</div>
          </div>
        </div>

        {/* Detailed Stats */}
        <div className="bg-gray-800/50 backdrop-blur-md rounded-2xl p-6 border border-purple-500/30 mb-6">
          <h3 className="text-xl font-bold mb-4">Your Journey</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex justify-between items-center p-3 bg-black/30 rounded-lg">
              <span className="text-gray-400">Total Gems Spent</span>
              <span className="font-bold text-pink-500">{stats.totalGemsSpent} 💎</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-black/30 rounded-lg">
              <span className="text-gray-400">Total Sparks Sent</span>
              <span className="font-bold text-purple-500">{stats.totalSparksSent} ⚡</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-black/30 rounded-lg">
              <span className="text-gray-400">Models Chatted With</span>
              <span className="font-bold text-blue-500">{activeModels} / 5</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-black/30 rounded-lg">
              <span className="text-gray-400">Login Count</span>
              <span className="font-bold text-green-500">{stats.loginCount}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-black/30 rounded-lg">
              <span className="text-gray-400">Achievements Unlocked</span>
              <span className="font-bold text-yellow-500">{stats.achievementsUnlocked.length}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-black/30 rounded-lg">
              <span className="text-gray-400">Longest Streak</span>
              <span className="font-bold text-orange-500">{stats.longestStreak} days</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-black/30 rounded-lg">
              <span className="text-gray-400">Time Spent</span>
              <span className="font-bold text-cyan-500">{Math.floor(stats.totalTimeSpent / 60)}h {stats.totalTimeSpent % 60}m</span>
            </div>
          </div>
        </div>

        {/* Active Models */}
        {modelsWithProgress.length > 0 && (
          <div className="bg-gray-800/50 backdrop-blur-md rounded-2xl p-6 border border-purple-500/30 mb-6">
            <h3 className="text-xl font-bold mb-4">Active Conversations</h3>
            <div className="flex flex-wrap gap-2">
              {modelsWithProgress.map((model) => (
                <Link key={model} href={`/chat/${model}`}>
                  <span className="px-4 py-2 bg-purple-600/50 rounded-full text-sm capitalize hover:bg-purple-600 transition cursor-pointer">
                    {model}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Data Management */}
        <div className="bg-gray-800/50 backdrop-blur-md rounded-2xl p-6 border border-purple-500/30 mb-6">
          <h3 className="text-xl font-bold mb-4">Data Management</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={handleExport}
              className="p-4 bg-blue-600/50 hover:bg-blue-600 rounded-xl transition text-center"
            >
              <div className="text-2xl mb-2">📥</div>
              <div className="font-medium">Export Data</div>
              <div className="text-xs text-gray-400 mt-1">Backup your progress</div>
            </button>
            <button
              onClick={() => setShowImportModal(true)}
              className="p-4 bg-green-600/50 hover:bg-green-600 rounded-xl transition text-center"
            >
              <div className="text-2xl mb-2">📤</div>
              <div className="font-medium">Import Data</div>
              <div className="text-xs text-gray-400 mt-1">Restore from backup</div>
            </button>
            <button
              onClick={handleClearAll}
              className="p-4 bg-red-600/50 hover:bg-red-600 rounded-xl transition text-center"
            >
              <div className="text-2xl mb-2">🗑️</div>
              <div className="font-medium">Clear All</div>
              <div className="text-xs text-gray-400 mt-1">Delete everything</div>
            </button>
          </div>
        </div>

        {/* Logout */}
        <div className="text-center">
          <button
            onClick={handleLogOut}
            className="px-8 py-3 bg-red-600/70 hover:bg-red-700 text-white rounded-xl font-medium transition"
          >
            Log Out
          </button>
        </div>
      </div>

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-2xl p-6 max-w-lg w-full border border-purple-500/30">
            <h3 className="text-xl font-bold mb-4">Export Your Data</h3>
            <p className="text-gray-400 text-sm mb-4">
              Copy this data and save it somewhere safe. You can use it to restore your progress later.
            </p>
            <textarea
              value={exportData}
              readOnly
              className="w-full h-40 bg-black/50 rounded-lg p-3 text-xs font-mono text-gray-300 mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={copyToClipboard}
                className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition"
              >
                Copy to Clipboard
              </button>
              <button
                onClick={() => setShowExportModal(false)}
                className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-2xl p-6 max-w-lg w-full border border-purple-500/30">
            <h3 className="text-xl font-bold mb-4">Import Your Data</h3>
            <p className="text-gray-400 text-sm mb-4">
              Paste your backup data below. This will replace all your current progress!
            </p>
            <textarea
              value={importData}
              onChange={(e) => setImportData(e.target.value)}
              placeholder="Paste your backup data here..."
              className="w-full h-40 bg-black/50 rounded-lg p-3 text-xs font-mono text-gray-300 mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={handleImport}
                className="flex-1 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition"
              >
                Import
              </button>
              <button
                onClick={() => setShowImportModal(false)}
                className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
