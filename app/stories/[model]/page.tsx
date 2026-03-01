"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";

interface Story {
  id: string;
  url: string;
  unlocked: boolean;
}

const modelStories: Record<string, { name: string; avatar: string; stories: string[]; version: number }> = {
  mia: {
    name: "Mia Thompson",
    avatar: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1769080927/13_k3ynrk.png",
    stories: [
      "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1770662087/1_pe3zwx.png",
      "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1770661724/17_vwjfzi.png",
      "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1770662123/32_rzxwjt.png",
      "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1770662142/38_j0lys6.png",
    ],
    version: 1,
  },
  sakura: {
    name: "Sakura \"Suki\" Lin",
    avatar: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1770393771/Sakura1_nctckh.png",
    stories: [
      "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1770393721/Sakura10_usu93r.png",
      "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1770393732/Sakura11_kk1umf.png",
      "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771497703/Sakura12_dzse0e.png",
      "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771497714/Sakura13_qsrkhh.png",
    ],
    version: 2,
  },
  isabella: {
    name: "Isabella Brooks",
    avatar: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1770599989/hf_20260209_011732_673f8c7a-41cb-45f6-9cb4-cd071b69f2cd_mwrsey.png",
    stories: [
      "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1770663510/57_rn4rnf.jpg",
      "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1770663516/49_wwkmwj.jpg",
      "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1770663517/46_cwsesj.jpg",
      "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1770663522/47_n0pkgy.jpg",
    ],
    version: 2,
  },
  aaliyah: {
    name: "Aaliyah \"Liyah\"",
    avatar: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771497563/Isabella1_pvijrq.png",
    stories: [
      "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771497336/Aaliyah4_qebaax.png",
      "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771497494/Aaliyah22_cvwzcp.png",
      "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771497517/Aaliyah29_qthxja.jpg",
      "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771497523/Aaliyah32_xrekdm.jpg",
    ],
    version: 2,
  },
  riley: {
    name: "Riley \"Ry\" Harper",
    avatar: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771503243/Riley1_lvyoep.png",
    stories: [
      "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771502939/Riley2_str4wz.jpg",
      "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771502953/Riley6_oxogfn.png",
      "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771503095/Riley19_z8twbd.png",
      "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771503098/Riley18_mkrnx1.png",
    ],
    version: 2,
  },
};

export default function ModelStoriesPage() {
  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  const params = useParams();
  const modelId = params?.model as string;

  const [stories, setStories] = useState<Story[]>([]);
  const [gemsBalance, setGemsBalance] = useState(499);
  const [timeRemaining, setTimeRemaining] = useState("");
  const [expiryTime, setExpiryTime] = useState<number>(0);

  // Redirect if not signed in
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in");
    }
  }, [isLoaded, isSignedIn, router]);

  // Load or generate stories
  useEffect(() => {
    if (typeof window !== "undefined" && modelId && modelStories[modelId]) {
      const storageKey = `stories_${modelId}`;
      const savedData = localStorage.getItem(storageKey);
      const now = new Date().getTime();

      if (savedData) {
        const parsed = JSON.parse(savedData);
        const currentVersion = modelStories[modelId]?.version || 1;
        const savedVersion = parsed.version || 1;
        
        // Check if stories expired (24 hours) OR version mismatch
        if (now - parsed.createdAt < 24 * 60 * 60 * 1000 && savedVersion === currentVersion) {
          setStories(parsed.stories);
          setExpiryTime(parsed.createdAt + 24 * 60 * 60 * 1000);
        } else {
          // Generate new stories
          generateNewStories();
        }
      } else {
        generateNewStories();
      }

      // Load balance
      const savedGems = localStorage.getItem("gemsBalance");
      if (savedGems) {
        setGemsBalance(parseInt(savedGems));
      }
    }
  }, [modelId]);

  // Timer countdown
  useEffect(() => {
    if (expiryTime === 0) return;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const diff = expiryTime - now;

      if (diff <= 0) {
        setTimeRemaining("Expired");
        generateNewStories();
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expiryTime]);

  const generateNewStories = () => {
    if (!modelId || !modelStories[modelId]) return;

    const modelData = modelStories[modelId];
    const newStories: Story[] = modelData.stories.map((url, index) => ({
      id: `${modelId}_story_${index}`,
      url,
      unlocked: false,
    }));

    const now = new Date().getTime();
    const storageKey = `stories_${modelId}`;
    
    setStories(newStories);
    setExpiryTime(now + 24 * 60 * 60 * 1000);
    
    localStorage.setItem(
      storageKey,
      JSON.stringify({
        stories: newStories,
        createdAt: now,
        version: modelStories[modelId]?.version || 1,
      })
    );
  };

  const handleUnlockStory = (storyId: string) => {
    if (gemsBalance < 199) {
      alert("Not enough gems! Visit the Shop to buy more.");
      return;
    }

    const newBalance = gemsBalance - 199;
    setGemsBalance(newBalance);
    localStorage.setItem("gemsBalance", newBalance.toString());

    const newStories = stories.map((s) =>
      s.id === storyId ? { ...s, unlocked: true } : s
    );
    setStories(newStories);

    const storageKey = `stories_${modelId}`;
    const savedData = localStorage.getItem(storageKey);
    if (savedData) {
      const parsed = JSON.parse(savedData);
      parsed.stories = newStories;
      localStorage.setItem(storageKey, JSON.stringify(parsed));
    }

    alert("Story Unlocked! 🔥");
  };

  if (!isLoaded || !isSignedIn) {
    return null;
  }

  if (!modelId || !modelStories[modelId]) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <div className="text-center">
          <p className="text-xl mb-4">Model not found</p>
          <Link href="/dashboard">
            <button className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full font-bold hover:brightness-110 transition">
              Back to Dashboard
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const modelData = modelStories[modelId];

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-purple-950 to-pink-950 text-white">
      {/* Header with Timer */}
      <header className="bg-black/60 backdrop-blur-md border-b border-pink-500/30 p-6 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <Link href="/dashboard">
              <button className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl transition border border-white/10 text-sm font-medium">
                ← Dashboard
              </button>
            </Link>
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-pink-400">{gemsBalance} 💎</span>
              <Link href="/shop">
                <button className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg text-sm font-bold hover:brightness-110 transition">
                  Buy Gems
                </button>
              </Link>
            </div>
          </div>

          {/* Model Info & Timer */}
          <div className="flex items-center gap-4">
            <img
              src={modelData.avatar}
              alt={modelData.name}
              className="w-16 h-16 rounded-full border-4 border-pink-500 object-cover"
            />
            <div className="flex-1">
              <h1 className="text-2xl font-bold">{modelData.name}'s Stories</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-gray-400">Expires in:</span>
                <span className="text-sm font-bold text-pink-400 animate-pulse">
                  {timeRemaining || "Loading..."}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Stories Grid */}
      <main className="max-w-6xl mx-auto p-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {stories.map((story) => (
            <div
              key={story.id}
              className="relative group bg-black/40 backdrop-blur-lg rounded-2xl overflow-hidden border border-purple-500/30 hover:border-pink-500 transition-all aspect-[3/4] cursor-pointer"
              onClick={() => !story.unlocked && handleUnlockStory(story.id)}
            >
              <img
                src={story.url}
                alt="Story"
                className={`w-full h-full object-cover transition-all duration-500 ${
                  !story.unlocked
                    ? "blur-md brightness-50 grayscale group-hover:scale-110"
                    : "group-hover:scale-110"
                }`}
              />

              {!story.unlocked && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                  <div className="text-center">
                    <div className="text-6xl mb-3">🔒</div>
                    <p className="text-lg font-bold mb-2">199 gems</p>
                    <button className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full text-sm font-bold hover:brightness-110 transition">
                      Unlock Story
                    </button>
                  </div>
                </div>
              )}

              {story.unlocked && (
                <div className="absolute top-3 right-3 px-2 py-1 bg-green-500/80 rounded-full text-xs font-bold">
                  UNLOCKED ✓
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Info Box */}
        <div className="mt-12 bg-black/30 backdrop-blur-lg rounded-2xl p-8 border border-purple-500/30 text-center">
          <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
            Limited Time Stories 🔥
          </h2>
          <p className="text-gray-300 mb-4">
            These stories are available for 24 hours only. Unlock them now before they disappear!
          </p>
          <p className="text-sm text-gray-400">
            New stories refresh every 24 hours • 199 gems per story
          </p>
        </div>
      </main>
    </div>
  );
}
