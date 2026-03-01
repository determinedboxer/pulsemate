// app/gallery/sakura/page.tsx
"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";

interface Photo {
  id: string;
  url: string;
  previewUrl: string;
  price: number;
  title: string;
  isFree: boolean;
}

export default function SakuraGalleryPage() {
  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  const [unlockedPhotos, setUnlockedPhotos] = useState<string[]>([]);
  const [balance, setBalance] = useState(499);
  const [sakuraAllAccess, setSakuraAllAccess] = useState(false);

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
      const savedAllAccess = localStorage.getItem("sakuraAllAccess");
      
      if (savedUnlocked) {
        setUnlockedPhotos(JSON.parse(savedUnlocked));
      }
      if (savedBalance) {
        setBalance(parseInt(savedBalance));
      }
      if (savedAllAccess === "true") {
        setSakuraAllAccess(true);
      }
    }
  }, []);

  // Sakura's photos data (12 total: 5 free + 7 PPV)
  const photos: Photo[] = [
    // Free photos (1-5)
    { id: "sakura_photo_1", url: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771497629/Sakura1_kmjnpc.png", previewUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771497629/Sakura1_kmjnpc.png", price: 0, title: "Morning Workout Glow", isFree: true },
    { id: "sakura_photo_2", url: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771497629/Sakura2_sdxzjx.png", previewUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771497629/Sakura2_sdxzjx.png", price: 0, title: "Convention Sailor Moon", isFree: true },
    { id: "sakura_photo_3", url: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771497675/Sakura3_frf5og.png", previewUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771497675/Sakura3_frf5og.png", price: 0, title: "Maid Costume Testing", isFree: true },
    { id: "sakura_photo_4", url: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771497676/Sakura4_izmaqp.png", previewUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771497676/Sakura4_izmaqp.png", price: 0, title: "Iron Man Bodysuit", isFree: true },
    { id: "sakura_photo_5", url: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771497654/Sakura5_apdshc.png", previewUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771497654/Sakura5_apdshc.png", price: 0, title: "Adorable Pikachu", isFree: true },
    
    // PPV photos (6-12)
    { id: "sakura_photo_19", url: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771497771/Sakura19_zkg5jh.png", previewUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/e_blur:800/v1771497771/Sakura19_zkg5jh.png", price: 299, title: "Black Lace Candlelight", isFree: false },
    { id: "sakura_photo_22", url: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771497749/Sakura22_ury10s.jpg", previewUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/e_blur:800/v1771497749/Sakura22_ury10s.jpg", price: 399, title: "Artistic Nude Study", isFree: false },
    { id: "sakura_photo_25", url: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771497792/Sakura25_rc4qlw.png", previewUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/e_blur:800/v1771497792/Sakura25_rc4qlw.png", price: 499, title: "Book & Bare Beauty", isFree: false },
    { id: "sakura_photo_28", url: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771497775/Sakura28_ebargc.jpg", previewUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/e_blur:800/v1771497775/Sakura28_ebargc.jpg", price: 599, title: "Red Lace Candlelight", isFree: false },
    { id: "sakura_photo_31", url: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771497788/Sakura31_vifj6m.jpg", previewUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/e_blur:800/v1771497788/Sakura31_vifj6m.jpg", price: 699, title: "Transparent Lingerie", isFree: false },
    { id: "sakura_photo_34", url: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771497792/Sakura34_mkl0bm.jpg", previewUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/e_blur:800/v1771497792/Sakura34_mkl0bm.jpg", price: 799, title: "White Lace Ultimate", isFree: false },
    { id: "sakura_photo_37", url: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1772134015/hf_20260226_192443_7f556afc-3ad2-4dfa-9d13-5722e53add0b_lbd1if.jpg", previewUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/e_blur:800/v1772134015/hf_20260226_192443_7f556afc-3ad2-4dfa-9d13-5722e53add0b_lbd1if.jpg", price: 899, title: "Ultimate Intimate Collection", isFree: false },
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
      
      // Track spending for quests
      const savedQuests = localStorage.getItem("questsProgress");
      if (savedQuests) {
        const quests = JSON.parse(savedQuests);
        quests.totalSpent += price;
        quests.photosBought += 1;
        localStorage.setItem("questsProgress", JSON.stringify(quests));
      }
      
      alert(`Photo purchased! Remaining balance: ${newBalance} gems`);
    } else {
      alert(`Not enough gems! You need ${price - balance} more gems.`);
    }
  };

  if (!isLoaded || !isSignedIn) {
    return null;
  }

  const freePhotosCount = photos.filter(p => p.isFree).length;
  const unlockedCount = sakuraAllAccess ? photos.length : photos.filter(p => p.isFree || unlockedPhotos.includes(p.id)).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-pink-950 to-purple-950 text-white">
      {/* Header */}
      <header className="bg-black/60 backdrop-blur-md border-b border-pink-500/30 p-6 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/galleries" className="text-pink-400 hover:text-pink-300 transition">
            ← Back to Galleries
          </Link>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
            Sakura's Gallery 🌸
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
              src="https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771497629/Sakura1_kmjnpc.png"
              alt="Sakura Suki Lin"
              className="w-24 h-24 rounded-full object-cover border-4 border-pink-500 shadow-lg"
              loading="eager"
            />
            <div>
              <h2 className="text-3xl font-bold">Sakura "Suki" Lin</h2>
              <p className="text-pink-300">Kawaii Cosplayer • 20 • Mysterious, flirty, and always in character 🌸✨</p>
              <p className="text-gray-400 text-sm mt-2">
                {photos.length} photos • {freePhotosCount} free • {photos.length - freePhotosCount} exclusive
              </p>
            </div>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map((photo) => {
            const isUnlocked = photo.isFree || sakuraAllAccess || unlockedPhotos.includes(photo.id);
            const displayUrl = isUnlocked ? photo.url : photo.previewUrl;
            
            return (
              <div 
                key={photo.id} 
                className="relative group bg-gradient-to-b from-pink-900/20 to-black/60 rounded-2xl overflow-hidden border border-pink-500/30 hover:border-pink-400 transition-all duration-300 aspect-[3/4]"
              >
                <img
                  src={displayUrl}
                  alt={photo.title}
                  loading="lazy"
                  className={`w-full h-full object-cover ${!isUnlocked ? "blur-[40px] brightness-50" : ""}`}
                />
                
                {/* Lock Icon if not unlocked */}
                {!isUnlocked && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-black/70 backdrop-blur-sm px-6 py-3 rounded-2xl border border-pink-500/50">
                      <svg className="w-8 h-8 text-pink-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      <p className="text-xs font-bold text-pink-400">{photo.price} 💎</p>
                    </div>
                  </div>
                )}
                
                {/* Overlay with title and action */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <h3 className="text-sm font-bold mb-1">{photo.title}</h3>
                  {!isUnlocked && (
                    <button
                      onClick={() => handleBuyPhoto(photo.id, photo.price)}
                      className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full text-xs font-bold hover:brightness-110 transition"
                    >
                      Unlock - {photo.price} 💎
                    </button>
                  )}
                  {isUnlocked && !photo.isFree && (
                    <div className="px-3 py-1 bg-pink-600/70 rounded-full text-xs font-bold text-center">
                      Purchased ✓
                    </div>
                  )}
                  {photo.isFree && (
                    <div className="px-3 py-1 bg-green-600/70 rounded-full text-xs font-bold text-center">
                      Free ✓
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* All-Access Offer */}
        {!sakuraAllAccess && (
          <div className="mt-12 bg-gradient-to-br from-pink-900/40 to-purple-900/40 backdrop-blur-lg rounded-2xl p-8 border border-pink-500/50">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                Sakura All-Access 🌸
              </h2>
              <p className="text-gray-300 mb-6">
                Unlock all {photos.length} photos + future content forever
              </p>
              <div className="flex items-center justify-center gap-4 mb-6">
                <span className="text-4xl font-bold text-yellow-400">$49.99</span>
                <span className="text-gray-400 line-through">$89.99</span>
              </div>
              <Link href="/shop">
                <button className="px-12 py-4 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full text-xl font-bold hover:brightness-110 hover:scale-105 transition shadow-2xl shadow-pink-500/30">
                  Get All-Access Now
                </button>
              </Link>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="p-8 text-center text-gray-500 border-t border-purple-500/30 mt-12">
        © 2026 PulseMate. All rights reserved.
      </footer>
    </div>
  );
}
