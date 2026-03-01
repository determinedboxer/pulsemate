// app/galleries/mia_thompson/page.tsx
"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import Lightbox from "@/components/Lightbox";

interface GalleryPhoto {
  id: string;
  url: string;
  previewUrl: string;
  price: number;
  title: string;
}

export default function MiaGalleryPage() {
  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  const [unlockedPhotos, setUnlockedPhotos] = useState<string[]>([]);
  const [miaAllAccess, setMiaAllAccess] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState("");

  // Redirect if not signed in
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in");
    }
  }, [isLoaded, isSignedIn, router]);

  // Load localStorage data
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedUnlocked = localStorage.getItem("unlockedPhotos");
      const savedAllAccess = localStorage.getItem("miaAllAccess");
      
      if (savedUnlocked) {
        setUnlockedPhotos(JSON.parse(savedUnlocked));
      }
      if (savedAllAccess === "true") {
        setMiaAllAccess(true);
      }
    }
  }, []);

  // Mia's photos - Free previews from chat
  const photos: GalleryPhoto[] = [
    {
      id: "gallery_stadium",
      url: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771611341/3_zwqcnh.png",
      previewUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/e_blur:1600,e_brightness:-50/v1771611341/3_zwqcnh.png",
      price: 0,
      title: "Stadium Energy"
    },
    {
      id: "gallery_outdoor_wet",
      url: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771611337/1_vlu3vm.png",
      previewUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/e_blur:1600,e_brightness:-50/v1771611337/1_vlu3vm.png",
      price: 0,
      title: "Fresh & Wet"
    },
    {
      id: "gallery_gym_stretch",
      url: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771611276/9_oresfb.png",
      previewUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/e_blur:1600,e_brightness:-50/v1771611276/9_oresfb.png",
      price: 0,
      title: "Post-Game Stretch"
    },
    {
      id: "gallery_locker_room",
      url: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771611277/17_rg0yle.png",
      previewUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/e_blur:1600,e_brightness:-50/v1771611277/17_rg0yle.png",
      price: 0,
      title: "Locker Room"
    },
    {
      id: "gallery_balcony",
      url: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771614111/hf_20260220_185912_0b0e170a-3155-4999-9254-e51a28bcae79_xw99ln.jpg",
      previewUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/e_blur:1600,e_brightness:-50/v1771614111/hf_20260220_185912_0b0e170a-3155-4999-9254-e51a28bcae79_xw99ln.jpg",
      price: 0,
      title: "Balcony Vibes"
    },
    {
      id: "gallery_gym_pink",
      url: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771614385/hf_20260220_190434_14778d49-8214-4b27-9ec4-24f83c9f4cb7_va48oa.jpg",
      previewUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/e_blur:1600,e_brightness:-50/v1771614385/hf_20260220_190434_14778d49-8214-4b27-9ec4-24f83c9f4cb7_va48oa.jpg",
      price: 0,
      title: "Pink Workout"
    }
  ];

  const openLightbox = (imageUrl: string) => {
    setLightboxImage(imageUrl);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setLightboxImage("");
  };

  const handleBuyPhoto = (photoId: string, price: number) => {
    const savedBalance = localStorage.getItem("gemsBalance");
    const currentBalance = savedBalance ? parseInt(savedBalance) : 499;
    
    if (currentBalance >= price) {
      const newBalance = currentBalance - price;
      const newUnlocked = [...unlockedPhotos, photoId];
      
      setUnlockedPhotos(newUnlocked);
      localStorage.setItem("gemsBalance", newBalance.toString());
      localStorage.setItem("unlockedPhotos", JSON.stringify(newUnlocked));
      
      alert(`Photo purchased! Remaining balance: ${newBalance} gems`);
    } else {
      alert(`Not enough gems! You need ${price - currentBalance} more gems.`);
    }
  };

  if (!isLoaded || !isSignedIn) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-purple-950 to-pink-950 text-white">
      {/* Header */}
      <header className="p-6 border-b border-purple-500/30 bg-black/40 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-6xl mx-auto">
          <Link href="/galleries" className="inline-block mb-4 text-pink-400 hover:text-pink-300 transition">
            ← Back to Galleries
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-pink-500">
              <img
                src="https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771611341/3_zwqcnh.png"
                alt="Mia Thompson"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                Mia Thompson's Gallery
              </h1>
              {miaAllAccess ? (
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-yellow-500 text-black rounded-full text-sm font-bold">
                    ALL ACCESS UNLOCKED
                  </span>
                  <span className="text-green-400 text-sm">All photos free</span>
                </div>
              ) : (
                <p className="text-gray-300">{unlockedPhotos.length} of {photos.length} photos unlocked</p>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Gallery Grid */}
      <main className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {photos.map((photo) => {
            const isUnlocked = miaAllAccess || unlockedPhotos.includes(photo.id);
            const displayUrl = isUnlocked ? photo.url : photo.previewUrl;
            
            return (
              <div 
                key={photo.id} 
                className="bg-black/40 backdrop-blur-lg rounded-2xl overflow-hidden border border-purple-500/30 hover:border-pink-500 transition hover:scale-105"
              >
                <div className="relative">
                  <img
                    src={displayUrl}
                    alt={photo.title}
                    onClick={() => isUnlocked && openLightbox(photo.url)}
                    className={`w-full h-64 object-cover ${!isUnlocked ? "blur-[40px] brightness-50" : "cursor-pointer hover:opacity-90 transition"}`}
                  />
                  {!isUnlocked && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-black/70 backdrop-blur-md px-4 py-2 rounded-full">
                        <span className="text-pink-300 font-bold">
                          {photo.price === 0 ? "Free" : `${photo.price} gems`}
                        </span>
                      </div>
                    </div>
                  )}
                  {miaAllAccess && (
                    <div className="absolute top-3 right-3 bg-yellow-500 text-black px-2 py-1 rounded-full text-xs font-bold">
                      FREE
                    </div>
                  )}
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{photo.title}</h3>
                  <div className="flex justify-between items-center">
                    {isUnlocked ? (
                      <span className="px-4 py-2 bg-green-500/20 text-green-400 rounded-full font-medium">
                        Unlocked ✓
                      </span>
                    ) : (
                      <button
                        onClick={() => handleBuyPhoto(photo.id, photo.price)}
                        className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full font-bold hover:brightness-110 transition"
                      >
                        Buy {photo.price} gems
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Stats */}
        <div className="mt-12 text-center p-6 bg-black/40 backdrop-blur-lg rounded-2xl border border-purple-500/30">
          <div className="grid grid-cols-3 gap-8">
            <div>
              <div className="text-3xl font-bold text-yellow-400">{photos.length}</div>
              <div className="text-gray-300">Total Photos</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-400">{miaAllAccess ? photos.length : unlockedPhotos.length}</div>
              <div className="text-gray-300">Unlocked</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-pink-400">{miaAllAccess ? 0 : photos.length - unlockedPhotos.length}</div>
              <div className="text-gray-300">Locked</div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-8 text-center text-gray-500 border-t border-purple-500/30 mt-12">
        © 2026 PulseMate. All rights reserved.
      </footer>

      {/* Lightbox */}
      <Lightbox
        imageUrl={lightboxImage}
        isOpen={lightboxOpen}
        onClose={closeLightbox}
        alt="Gallery Photo"
      />
    </div>
  );
}