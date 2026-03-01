// app/gallery/riley/page.tsx
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

export default function RileyGalleryPage() {
  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  const [unlockedPhotos, setUnlockedPhotos] = useState<string[]>([]);
  const [balance, setBalance] = useState(499);

  // Redirect if not signed in
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in");
    }
  }, [isLoaded, isSignedIn, router]);

  // Load unlocked photos and balance from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedUnlocked = localStorage.getItem("unlockedPhotosRiley");
      const savedBalance = localStorage.getItem("gemsBalance");
      
      if (savedUnlocked) {
        setUnlockedPhotos(JSON.parse(savedUnlocked));
      }
      if (savedBalance) {
        setBalance(parseInt(savedBalance));
      }
    }
  }, []);

  // Riley's photos data (12 total: 5 free + 7 PPV)
  const photos: Photo[] = [
    // Free photos (1-5)
    { id: "riley_photo_1", url: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771503243/Riley1_lvyoep.png", previewUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771503243/Riley1_lvyoep.png", price: 0, title: "Main Avatar Glow", isFree: true },
    { id: "riley_photo_2", url: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771502939/Riley2_str4wz.jpg", previewUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771502939/Riley2_str4wz.jpg", price: 0, title: "Victory Stream", isFree: true },
    { id: "riley_photo_3", url: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1772053857/hf_20260225_210507_9bc531fe-0fbd-4a90-98ef-47ff189667c3_glhrjs.jpg", previewUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1772053857/hf_20260225_210507_9bc531fe-0fbd-4a90-98ef-47ff189667c3_glhrjs.jpg", price: 0, title: "Headset Ready", isFree: true },
    { id: "riley_photo_4", url: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1772053968/hf_20260225_210537_79f5df00-129b-4fbc-a0c8-ac6b21dc5c2d_bvgxli.jpg", previewUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1772053968/hf_20260225_210537_79f5df00-129b-4fbc-a0c8-ac6b21dc5c2d_bvgxli.jpg", price: 0, title: "Gaming Setup Tease", isFree: true },
    { id: "riley_photo_5", url: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1772105815/hf_20260226_111631_bbba88c6-78ae-404f-8962-b9f01615b926_wzabft.jpg", previewUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1772105815/hf_20260226_111631_bbba88c6-78ae-404f-8962-b9f01615b926_wzabft.jpg", price: 0, title: "RGB Vibes", isFree: true },

    // PPV photos (6-12) with blur effects
    { id: "riley_photo_19", url: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1772054405/hf_20260225_211525_1e553df2-6ed2-48eb-b448-ca52aecc6318_v5jcrj.jpg", previewUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/e_blur:800/v1772054405/hf_20260225_211525_1e553df2-6ed2-48eb-b448-ca52aecc6318_v5jcrj.jpg", price: 299, title: "Private Lobby Preview", isFree: false },
    { id: "riley_photo_22", url: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1772106215/hf_20260226_113912_524ba02e-728c-436a-a4a0-92858fb27b3c_mn0wh5.jpg", previewUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/e_blur:800/v1772106215/hf_20260226_113912_524ba02e-728c-436a-a4a0-92858fb27b3c_mn0wh5.jpg", price: 399, title: "Rooftop Winner", isFree: false },
    { id: "riley_photo_25", url: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1772129211/hf_20260226_173248_1138b294-dcf5-4daa-922c-980a5732e05f_jdhygz.jpg", previewUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/e_blur:800/v1772129211/hf_20260226_173248_1138b294-dcf5-4daa-922c-980a5732e05f_jdhygz.jpg", price: 499, title: "Urban Rooftop Magic", isFree: false },
    { id: "riley_photo_28", url: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1772130301/hf_20260226_182214_c8dbde12-bfbf-476e-93b2-735a063e340c_kqttz9.jpg", previewUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/e_blur:800/v1772130301/hf_20260226_182214_c8dbde12-bfbf-476e-93b2-735a063e340c_kqttz9.jpg", price: 599, title: "Off-Stream Intimacy", isFree: false },
    { id: "riley_photo_31", url: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1772131674/hf_20260226_182610_8f976435-f628-4558-bc50-eb4d2c017d97_lqfm7j.jpg", previewUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/e_blur:800/v1772131674/hf_20260226_182610_8f976435-f628-4558-bc50-eb4d2c017d97_lqfm7j.jpg", price: 699, title: "Post-Win Celebration", isFree: false },
    { id: "riley_photo_34", url: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1772131726/hf_20260226_182654_b6cad7cb-91e9-4293-8abf-a1ac1cafec84_ixrysl.jpg", previewUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/e_blur:800/v1772131726/hf_20260226_182654_b6cad7cb-91e9-4293-8abf-a1ac1cafec84_ixrysl.jpg", price: 799, title: "Rooftop Conquest", isFree: false },
    { id: "riley_photo_37", url: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1772131801/hf_20260226_184432_e14566dc-d062-4f8b-ade8-e05d6b1fe5eb_ppjbr2.jpg", previewUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/e_blur:800/v1772131801/hf_20260226_184432_e14566dc-d062-4f8b-ade8-e05d6b1fe5eb_ppjbr2.jpg", price: 899, title: "Ultimate Victory Lap", isFree: false },
  ];

  const handleBuyPhoto = (photoId: string, price: number) => {
    if (balance >= price) {
      const newBalance = balance - price;
      const newUnlocked = [...unlockedPhotos, photoId];
      
      setBalance(newBalance);
      setUnlockedPhotos(newUnlocked);
      
      // Save to localStorage
      localStorage.setItem("gemsBalance", newBalance.toString());
      localStorage.setItem("unlockedPhotosRiley", JSON.stringify(newUnlocked));
      
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
  const unlockedCount = photos.filter(p => p.isFree || unlockedPhotos.includes(p.id)).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-cyan-950 to-blue-950 text-white">
      {/* Header */}
      <header className="bg-black/60 backdrop-blur-md border-b border-cyan-500/30 p-6 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/galleries" className="text-cyan-400 hover:text-cyan-300 transition">
            ← Back to Galleries
          </Link>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
            Riley's Gallery 🎮
          </h1>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-cyan-400">{balance} 💎</span>
            <Link href="/shop">
              <button className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg text-sm font-bold hover:brightness-110 transition">
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
              src="https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771503243/Riley1_lvyoep.png"
              alt="Riley Ry Harper"
              className="w-24 h-24 rounded-full object-cover border-4 border-cyan-500 shadow-lg"
              loading="eager"
            />
            <div>
              <h2 className="text-3xl font-bold">Riley "Ry" Harper</h2>
              <p className="text-cyan-300">Nerdy Gamer Girl • 22 • I'll carry you... in more ways than one 🎮💙</p>
              <p className="text-gray-400 text-sm mt-2">
                {photos.length} photos • {freePhotosCount} free • {photos.length - freePhotosCount} exclusive
              </p>
            </div>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map((photo) => {
            const isUnlocked = photo.isFree || unlockedPhotos.includes(photo.id);
            const displayUrl = isUnlocked ? photo.url : photo.previewUrl;
            
            return (
              <div 
                key={photo.id} 
                className="relative group bg-gradient-to-b from-cyan-900/20 to-black/60 rounded-2xl overflow-hidden border border-cyan-500/30 hover:border-cyan-400 transition-all duration-300 aspect-[3/4]"
              >
                <img
                  src={displayUrl}
                  alt={photo.title}
                  loading="lazy"
                  className={`w-full h-full object-cover ${!isUnlocked ? 'blur-[40px] brightness-50' : ''}`}
                />
                
                {/* Lock Icon if not unlocked */}
                {!isUnlocked && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-black/70 backdrop-blur-sm px-6 py-3 rounded-2xl border border-cyan-500/50">
                      <svg className="w-8 h-8 text-cyan-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      <p className="text-xs font-bold text-cyan-400">{photo.price} 💎</p>
                    </div>
                  </div>
                )}
                
                {/* Overlay with title and action */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <h3 className="text-sm font-bold mb-1">{photo.title}</h3>
                  {!isUnlocked && (
                    <button
                      onClick={() => handleBuyPhoto(photo.id, photo.price)}
                      className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full text-xs font-bold hover:brightness-110 transition"
                    >
                      Unlock - {photo.price} 💎
                    </button>
                  )}
                  {isUnlocked && !photo.isFree && (
                    <div className="px-3 py-1 bg-cyan-600/70 rounded-full text-xs font-bold text-center">
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

        {/* Info Box */}
        <div className="mt-12 bg-black/30 backdrop-blur-lg rounded-2xl p-8 border border-cyan-500/30 text-center">
          <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
            Riley's Gaming Gallery 🎮
          </h2>
          <p className="text-gray-300 mb-4">
            {freePhotosCount} free photos • {photos.length - freePhotosCount} exclusive PPV photos
          </p>
          <p className="text-sm text-gray-400 max-w-2xl mx-auto">
            Unlock Riley's private gaming sessions, after-hours streams, and exclusive rooftop content. 
            Nerdy and seductive – see the gamer girl's secret side when the stream ends 😏🎮
          </p>
          <Link href="/chat/riley">
            <button className="mt-6 px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full font-bold hover:brightness-110 hover:scale-105 transition transform">
              Chat with Riley 🎮
            </button>
          </Link>
        </div>
      </main>
    </div>
  );
}
