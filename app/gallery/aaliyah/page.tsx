// app/gallery/aaliyah/page.tsx (Aaliyah "Liyah" - Exotic Dancer)
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

export default function AaliyahGalleryPage() {
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
      const savedUnlocked = localStorage.getItem("unlockedPhotosAaliyah");
      const savedBalance = localStorage.getItem("gemsBalance");
      
      if (savedUnlocked) {
        setUnlockedPhotos(JSON.parse(savedUnlocked));
      }
      if (savedBalance) {
        setBalance(parseInt(savedBalance));
      }
    }
  }, []);

  // Aaliyah "Liyah" photos - 12 total: 5 FREE + 7 PPV
  const photos: Photo[] = [
    // Free photos (5)
    { id: "aaliyah_main", url: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771497563/Isabella1_pvijrq.png", previewUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771497563/Isabella1_pvijrq.png", price: 0, title: "Main Portrait", isFree: true },
    { id: "aaliyah_photo_1", url: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771497352/Aaliyah1_c2mitb.png", previewUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771497352/Aaliyah1_c2mitb.png", price: 0, title: "Gym Locker Room", isFree: true },
    { id: "aaliyah_photo_4", url: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771497336/Aaliyah4_qebaax.png", previewUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771497336/Aaliyah4_qebaax.png", price: 0, title: "Athletic Form", isFree: true },
    { id: "aaliyah_photo_7", url: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771497393/Aaliyah7_asspas.png", previewUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771497393/Aaliyah7_asspas.png", price: 0, title: "VIP Lounge Entrance", isFree: true },
    { id: "aaliyah_photo_9", url: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771497403/Aaliyah9_lc8qci.png", previewUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771497403/Aaliyah9_lc8qci.png", price: 0, title: "Flexibility Showcase", isFree: true },
    
    // PPV Photos (7)
    { id: "aaliyah_photo_19", url: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771497368/Aaliyah12_spntjh.png", previewUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/e_blur:800/v1771497368/Aaliyah12_spntjh.png", price: 299, title: "Cool Down Session", isFree: false },
    { id: "aaliyah_photo_22", url: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771497494/Aaliyah22_cvwzcp.png", previewUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/e_blur:800/v1771497494/Aaliyah22_cvwzcp.png", price: 399, title: "VIP Room Exclusive", isFree: false },
    { id: "aaliyah_photo_25", url: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771497498/Aaliyah25_wzboph.png", previewUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/e_blur:800/v1771497498/Aaliyah25_wzboph.png", price: 499, title: "Stage Intimacy", isFree: false },
    { id: "aaliyah_photo_28", url: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771497534/Aaliyah28_ngzqz1.png", previewUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/e_blur:800/v1771497534/Aaliyah28_ngzqz1.png", price: 599, title: "Rooftop Freedom", isFree: false },
    { id: "aaliyah_photo_31", url: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771497524/Aaliyah31_nw7omp.jpg", previewUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/e_blur:800/v1771497524/Aaliyah31_nw7omp.jpg", price: 699, title: "Penthouse View", isFree: false },
    { id: "aaliyah_photo_34", url: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771497530/Aaliyah34_zjqsoc.jpg", previewUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/e_blur:800/v1771497530/Aaliyah34_zjqsoc.jpg", price: 799, title: "Intimate Moment", isFree: false },
    { id: "aaliyah_photo_37", url: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771497531/Aaliyah37_wphufp.jpg", previewUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/e_blur:800/v1771497531/Aaliyah37_wphufp.jpg", price: 899, title: "Ultimate Fantasy", isFree: false },
  ];

  const handleBuyPhoto = (photoId: string, price: number) => {
    if (balance >= price) {
      const newBalance = balance - price;
      const newUnlocked = [...unlockedPhotos, photoId];
      
      setBalance(newBalance);
      setUnlockedPhotos(newUnlocked);
      
      // Save to localStorage
      localStorage.setItem("gemsBalance", newBalance.toString());
      localStorage.setItem("unlockedPhotosAaliyah", JSON.stringify(newUnlocked));
      
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
    <div className="min-h-screen bg-gradient-to-b from-black via-purple-950 to-amber-950 text-white">
      {/* Header */}
      <header className="bg-black/60 backdrop-blur-md border-b border-amber-500/30 p-6 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/galleries" className="text-amber-400 hover:text-amber-300 transition">
            ← Back to Galleries
          </Link>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">
            Aaliyah's Gallery 🔥
          </h1>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-amber-400">{balance} 💎</span>
            <Link href="/shop">
              <button className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 rounded-lg text-sm font-bold hover:brightness-110 transition">
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
              src="https://res.cloudinary.com/ddnaxqmdw/image/upload/v1770599989/hf_20260209_011732_673f8c7a-41cb-45f6-9cb4-cd071b69f2cd_mwrsey.png"
              alt="Aaliyah Liyah"
              className="w-24 h-24 rounded-full object-cover border-4 border-amber-500 shadow-lg"
              loading="eager"
            />
            <div>
              <h2 className="text-3xl font-bold">Aaliyah "Liyah"</h2>
              <p className="text-amber-300">Exotic Dancer • 24 • VIP treatment for the right king 🔥🖤👑</p>
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
                className="relative group bg-gradient-to-b from-amber-900/20 to-black/60 rounded-2xl overflow-hidden border border-amber-500/30 hover:border-amber-400 transition-all duration-300 aspect-[3/4]"
              >
                <img 
                  src={displayUrl} 
                  alt={photo.title}
                  className={`w-full h-full object-cover ${!isUnlocked ? 'blur-[40px] brightness-50' : ''}`}
                />
                
                {/* Lock Icon if not unlocked */}
                {!isUnlocked && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-black/70 backdrop-blur-sm px-6 py-3 rounded-2xl border border-amber-500/50">
                      <svg className="w-8 h-8 text-amber-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      <p className="text-xs font-bold text-amber-400">{photo.price} 💎</p>
                    </div>
                  </div>
                )}
                
                {/* Overlay with title and action */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <h3 className="text-sm font-bold mb-1">{photo.title}</h3>
                  {!isUnlocked && (
                    <button
                      onClick={() => handleBuyPhoto(photo.id, photo.price)}
                      className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full text-xs font-bold hover:brightness-110 transition"
                    >
                      Unlock - {photo.price} 💎
                    </button>
                  )}
                  {isUnlocked && !photo.isFree && (
                    <div className="px-3 py-1 bg-amber-600/70 rounded-full text-xs font-bold text-center">
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
      </main>

      {/* Footer */}
      <footer className="p-8 text-center text-gray-500 border-t border-purple-500/30 mt-12">
        © 2026 PulseMate. All rights reserved.
      </footer>
    </div>
  );
}
