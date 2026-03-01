// app/gallery/mia/page.tsx
"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";

interface MediaItem {
  id: string;
  url: string;
  previewUrl: string;
  price: number;
  title: string;
  type: "photo" | "video";
  duration?: string;
}

export default function MiaGalleryPage() {
  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  const [unlockedPhotos, setUnlockedPhotos] = useState<string[]>([]);
  const [balance, setBalance] = useState(499);
  const [selectedPhoto, setSelectedPhoto] = useState<{id: string, url: string, isUnlocked: boolean} | null>(null);

  // Redirect if not signed in
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in");
    }
  }, [isLoaded, isSignedIn, router]);

  // Load unlocked photos and balance from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedUnlocked = localStorage.getItem("unlockedPhotos");
      const savedBalance = localStorage.getItem("gemsBalance");
      
      if (savedUnlocked) {
        setUnlockedPhotos(JSON.parse(savedUnlocked));
      }
      if (savedBalance) {
        setBalance(parseInt(savedBalance));
      }
    }
  }, []);

  // Mia's media data - Mix of free and PPV content from chat
  const media: MediaItem[] = [
    {
      id: "mia_stadium_1",
      url: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771611341/3_zwqcnh.png",
      previewUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/e_blur:1600,e_brightness:-50/v1771611341/3_zwqcnh.png",
      price: 0,
      title: "Stadium After Game",
      type: "photo"
    },
    {
      id: "mia_gym_stretch",
      url: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771611276/9_oresfb.png",
      previewUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/e_blur:1600,e_brightness:-50/v1771611276/9_oresfb.png",
      price: 0,
      title: "Post-Game Stretch",
      type: "photo"
    },
    {
      id: "mia_locker_room",
      url: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771611277/17_rg0yle.png",
      previewUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/e_blur:1600,e_brightness:-50/v1771611277/17_rg0yle.png",
      price: 0,
      title: "Locker Room Moment",
      type: "photo"
    },
    {
      id: "mia_gym_pink",
      url: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771614385/hf_20260220_190434_14778d49-8214-4b27-9ec4-24f83c9f4cb7_va48oa.jpg",
      previewUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/e_blur:1600,e_brightness:-50/v1771614385/hf_20260220_190434_14778d49-8214-4b27-9ec4-24f83c9f4cb7_va48oa.jpg",
      price: 0,
      title: "Pink Workout Set",
      type: "photo"
    },
    {
      id: "mia_workout_gym",
      url: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771615629/hf_20260220_191439_ca386776-c582-4bdf-8a5f-d2ee9e649981_pzyi7g.png",
      previewUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/e_blur:1600,e_brightness:-50/v1771615629/hf_20260220_191439_ca386776-c582-4bdf-8a5f-d2ee9e649981_pzyi7g.png",
      price: 0,
      title: "Intense Workout",
      type: "photo"
    },
    {
      id: "mia_towel_bathroom",
      url: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771616304/hf_20260220_193617_4961a182-ff4f-4d7c-a860-2e8d1c45a086_k6zqot.jpg",
      previewUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/e_blur:1600,e_brightness:-50/v1771616304/hf_20260220_193617_4961a182-ff4f-4d7c-a860-2e8d1c45a086_k6zqot.jpg",
      price: 299,
      title: "Bathroom Tease",
      type: "photo"
    },
    {
      id: "mia_towel_drop",
      url: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771616668/hf_20260220_194136_3c44ea7e-f47a-43ff-ae11-510dff7e6a57_zklnmy.jpg",
      previewUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/e_blur:1600,e_brightness:-50/v1771616668/hf_20260220_194136_3c44ea7e-f47a-43ff-ae11-510dff7e6a57_zklnmy.jpg",
      price: 399,
      title: "Towel Drop",
      type: "photo"
    },
    {
      id: "mia_mirror_change",
      url: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771617736/hf_20260220_195215_f8ae15a4-7e7a-400a-a6ac-024ce4f60379_jwagw9.jpg",
      previewUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/e_blur:1600,e_brightness:-50/v1771617736/hf_20260220_195215_f8ae15a4-7e7a-400a-a6ac-024ce4f60379_jwagw9.jpg",
      price: 499,
      title: "Mirror Reveal",
      type: "photo"
    },
    {
      id: "mia_lingerie_black",
      url: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1770662090/9_nqljqj.jpg",
      previewUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/e_blur:1600,e_brightness:-50/v1770662090/9_nqljqj.jpg",
      price: 599,
      title: "Black Lingerie",
      type: "photo"
    },
    {
      id: "mia_bedroom_lingerie",
      url: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771618067/hf_20260220_200607_236ac0a9-47c0-4dc3-8a90-8699a7184511_pp5o4x.jpg",
      previewUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/e_blur:1600,e_brightness:-50/v1771618067/hf_20260220_200607_236ac0a9-47c0-4dc3-8a90-8699a7184511_pp5o4x.jpg",
      price: 699,
      title: "Bedroom Seduction",
      type: "photo"
    },
    {
      id: "mia_candlelit",
      url: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771618277/hf_20260220_200942_60db0873-056f-4e86-9fcd-753c92a2c563_utv2g8.jpg",
      previewUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/e_blur:1600,e_brightness:-50/v1771618277/hf_20260220_200942_60db0873-056f-4e86-9fcd-753c92a2c563_utv2g8.jpg",
      price: 799,
      title: "Candlelit Romance",
      type: "photo"
    },
    {
      id: "mia_bedroom_explicit",
      url: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771618772/hf_20260220_201550_1e506b3e-e7ca-4a9b-bb6b-693186222536_juvqe9.jpg",
      previewUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/e_blur:1600,e_brightness:-50/v1771618772/hf_20260220_201550_1e506b3e-e7ca-4a9b-bb6b-693186222536_juvqe9.jpg",
      price: 899,
      title: "Private Moment",
      type: "photo"
    }
  ];

  const handleBuyPhoto = (photoId: string, price: number) => {
    if (balance >= price) {
      const newBalance = balance - price;
      const newUnlocked = [...unlockedPhotos, photoId];
      
      setBalance(newBalance);
      setUnlockedPhotos(newUnlocked);
      
      // Save to localStorage
      localStorage.setItem("gemsBalance", newBalance.toString());
      localStorage.setItem("unlockedPhotos", JSON.stringify(newUnlocked));
      
      alert(`Photo purchased! Remaining balance: ${newBalance} gems`);
    } else {
      alert(`Not enough gems! You need ${price - balance} more gems.`);
    }
  };

  if (!isLoaded || !isSignedIn) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-purple-950 to-pink-950 text-white">
      {/* Header */}
      <header className="bg-black/60 backdrop-blur-md border-b border-pink-500/30 p-6 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/galleries" className="text-pink-400 hover:text-pink-300 transition">
            ← Back to Galleries
          </Link>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
            Mia's Gallery 💗
          </h1>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-pink-400">{balance} 💎</span>
            <Link href="/shop">
              <button className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg text-sm font-bold hover:brightness-110 transition">
                Buy Gems
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* Profile Section */}
      <main className="max-w-6xl mx-auto p-8">
        <div className="mb-12">
          <div className="flex items-center gap-6 mb-6">
            <img
              src="https://res.cloudinary.com/ddnaxqmdw/image/upload/v1769080927/13_k3ynrk.png"
              alt="Mia Thompson"
              className="w-24 h-24 rounded-full object-cover border-4 border-pink-500 shadow-lg"
              loading="eager"
            />
            <div>
              <h2 className="text-3xl font-bold">Mia Thompson</h2>
              <p className="text-pink-300">Cheerleader • 22 • Athletic & Playful 💗✨</p>
              <p className="text-gray-400 text-sm mt-2">
                {media.length} photos • {media.filter(m => m.price === 0).length} free • {media.filter(m => m.price > 0).length} exclusive
              </p>
            </div>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {media.map((item) => {
            const isUnlocked = item.price === 0 || unlockedPhotos.includes(item.id);
            const displayUrl = isUnlocked ? item.url : item.previewUrl;
            
            return (
              <div 
                key={item.id} 
                className="relative group bg-gradient-to-b from-pink-900/20 to-black/60 rounded-2xl overflow-hidden border border-pink-500/30 hover:border-pink-400 transition-all duration-300 aspect-[3/4]"
              >
                <img
                  src={displayUrl}
                  alt={item.title}
                  className={`w-full h-full object-cover ${!isUnlocked ? 'blur-[40px] brightness-50' : ''}`}
                />
                
                {/* Lock Icon if not unlocked */}
                {!isUnlocked && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-black/70 backdrop-blur-sm px-6 py-3 rounded-2xl border border-pink-500/50">
                      <svg className="w-8 h-8 text-pink-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      <p className="text-xs font-bold text-pink-400">{item.price} 💎</p>
                    </div>
                  </div>
                )}
                
                {/* Overlay with title and action */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <h3 className="text-sm font-bold mb-1">{item.title}</h3>
                  {!isUnlocked && (
                    <button
                      onClick={() => handleBuyPhoto(item.id, item.price)}
                      className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full text-xs font-bold hover:brightness-110 transition"
                    >
                      Unlock - {item.price} 💎
                    </button>
                  )}
                  {isUnlocked && item.price > 0 && (
                    <div className="px-3 py-1 bg-pink-600/70 rounded-full text-xs font-bold text-center">
                      Purchased ✓
                    </div>
                  )}
                  {item.price === 0 && (
                    <div className="px-3 py-1 bg-green-600/70 rounded-full text-xs font-bold text-center">
                      Free ✓
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="p-8 text-center text-gray-500 border-t border-purple-500/30 mt-12">
        © 2026 PulseMate. All rights reserved.
      </footer>

      {/* Fullscreen Photo Modal */}
      {selectedPhoto && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-lg"
          onClick={() => setSelectedPhoto(null)}
        >
          {/* Back Button - Top Left */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedPhoto(null);
            }}
            className="absolute top-4 left-4 px-5 py-3 bg-gradient-to-r from-pink-500 to-purple-600 hover:brightness-110 rounded-xl flex items-center gap-2 text-white font-bold transition-all z-20 shadow-2xl border border-white/20 hover:scale-105 active:scale-95"
          >
            <span className="text-xl">←</span>
            <span>Back</span>
          </button>
          
          {/* Close Button - Top Right */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedPhoto(null);
            }}
            className="absolute top-4 right-4 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white text-3xl font-bold transition-all z-20 border border-white/30 shadow-2xl hover:scale-110 active:scale-95"
          >
            ×
          </button>
          
          <div 
            className="relative w-full h-full flex items-center justify-center p-4 sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedPhoto.url}
              alt="Mia"
              className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}