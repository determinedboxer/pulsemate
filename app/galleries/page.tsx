// app/galleries/page.tsx
"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";

interface GalleryPhoto {
  id: string;
  url: string;
  previewUrl: string;
  price: number;
  title: string;
}

interface ModelGallery {
  id: string;
  name: string;
  avatar: string;
  photoCount: number;
  photos: GalleryPhoto[];
}

export default function GalleriesPage() {
  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  const [unlockedPhotos, setUnlockedPhotos] = useState<string[]>([]);
  const [miaAllAccess, setMiaAllAccess] = useState(false);

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

  // Mia's gallery data
  const miaGallery: ModelGallery = {
    id: "mia_thompson",
    name: "Mia Thompson",
    avatar: "https://res.cloudinary.com/ddnaqdmw/image/upload/w_100,h_100,c_fill,r_max/locker_lean_or_mirror_selfie",
    photoCount: 6,
    photos: [
      {
        id: "gallery_13_k3ynrk",
        url: "https://res.cloudinary.com/ddnaqdmw/image/upload/w_800,h_600,c_fill,q_auto/13_k3ynrk",
        previewUrl: "https://res.cloudinary.com/ddnaqdmw/image/upload/e_blur:800,w_800,h_600,c_fill,q_auto/13_k3ynrk",
        price: 299,
        title: "Locker Room Selfie"
      },
      {
        id: "gallery_yoga_stretch_4",
        url: "https://res.cloudinary.com/ddnaqdmw/image/upload/w_800,h_600,c_fill,q_auto/yoga_stretch_4",
        previewUrl: "https://res.cloudinary.com/ddnaqdmw/image/upload/e_blur:800,w_800,h_600,c_fill,q_auto/yoga_stretch_4",
        price: 399,
        title: "Post-Practice Stretch"
      },
      {
        id: "gallery_towel_mirror_wet_tshirt",
        url: "https://res.cloudinary.com/ddnaqdmw/image/upload/w_800,h_600,c_fill,q_auto/towel_mirror_wet_tshirt",
        previewUrl: "https://res.cloudinary.com/ddnaqdmw/image/upload/e_blur:800,w_800,h_600,c_fill,q_auto/towel_mirror_wet_tshirt",
        price: 499,
        title: "Cooling Down"
      },
      {
        id: "gallery_lingerie_hand_bra",
        url: "https://res.cloudinary.com/ddnaqdmw/image/upload/w_800,h_600,c_fill,q_auto/lingerie_hand_bra",
        previewUrl: "https://res.cloudinary.com/ddnaqdmw/image/upload/e_blur:800,w_800,h_600,c_fill,q_auto/lingerie_hand_bra",
        price: 599,
        title: "Getting Ready"
      },
      {
        id: "gallery_lounge_chair_lace",
        url: "https://res.cloudinary.com/ddnaqdmw/image/upload/w_800,h_600,c_fill,q_auto/lounge_chair_lace",
        previewUrl: "https://res.cloudinary.com/ddnaqdmw/image/upload/e_blur:800,w_800,h_600,c_fill,q_auto/lounge_chair_lace",
        price: 699,
        title: "Relaxing Moments"
      },
      {
        id: "gallery_locker_lean_or_mirror_selfie",
        url: "https://res.cloudinary.com/ddnaqdmw/image/upload/w_800,h_600,c_fill,q_auto/locker_lean_or_mirror_selfie",
        previewUrl: "https://res.cloudinary.com/ddnaqdmw/image/upload/e_blur:800,w_800,h_600,c_fill,q_auto/locker_lean_or_mirror_selfie",
        price: 349,
        title: "Mirror Selfie"
      }
    ]
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
          <Link href="/dashboard" className="inline-block mb-4 text-pink-400 hover:text-pink-300 transition">
            ← Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
            My Galleries 📸
          </h1>
          <p className="text-gray-300 mt-2">Browse exclusive content from your favorite models</p>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto p-6">
        {/* Model Galleries Grid - All 5 Models */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* Mia Thompson Gallery */}
          <div className="bg-black/40 backdrop-blur-lg rounded-2xl overflow-hidden border border-purple-500/30 hover:border-pink-500 transition hover:scale-105">
            <div className="relative">
              <img
                src="https://res.cloudinary.com/ddnaxqmdw/image/upload/v1769080927/13_k3ynrk.png"
                alt="Mia Thompson"
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-4 left-4">
                <h2 className="text-2xl font-bold">Mia Thompson</h2>
                <p className="text-pink-300">12 photos</p>
              </div>
              {miaAllAccess && (
                <div className="absolute top-4 right-4 bg-yellow-500 text-black px-3 py-1 rounded-full text-sm font-bold">
                  ALL ACCESS
                </div>
              )}
            </div>
            <div className="p-6">
              <p className="text-gray-300 mb-4">
                22yo athletic blonde cheerleader • Exclusive photos and content
              </p>
              <button
                onClick={() => router.push(`/gallery/mia`)}
                className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full font-bold hover:brightness-110 transition"
              >
                View Gallery
              </button>
            </div>
          </div>

          {/* Sakura Lin Gallery */}
          <div className="bg-black/40 backdrop-blur-lg rounded-2xl overflow-hidden border border-purple-500/30 hover:border-pink-500 transition hover:scale-105">
            <div className="relative">
              <img
                src="https://res.cloudinary.com/ddnaxqmdw/image/upload/v1770393771/Sakura1_nctckh.png"
                alt="Sakura Lin"
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-4 left-4">
                <h2 className="text-2xl font-bold">Sakura "Suki" Lin</h2>
                <p className="text-pink-300">11 photos</p>
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-300 mb-4">
                20yo anime cosplayer • Cute, playful & mysterious
              </p>
              <button
                onClick={() => router.push(`/gallery/sakura`)}
                className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full font-bold hover:brightness-110 transition"
              >
                View Gallery
              </button>
            </div>
          </div>

          {/* Isabella Brooks Gallery */}
          <div className="bg-black/40 backdrop-blur-lg rounded-2xl overflow-hidden border border-purple-500/30 hover:border-pink-500 transition hover:scale-105">
            <div className="relative">
              <img
                src="https://res.cloudinary.com/ddnaxqmdw/image/upload/v1770663514/51_i1g5u3.jpg"
                alt="Isabella Brooks"
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-4 left-4">
                <h2 className="text-2xl font-bold">Isabella Brooks</h2>
                <p className="text-pink-300">13 photos • 1 video</p>
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-300 mb-4">
                23yo exotic dancer • Sensual & mysterious
              </p>
              <button
                onClick={() => router.push(`/gallery/isabella`)}
                className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full font-bold hover:brightness-110 transition"
              >
                View Gallery
              </button>
            </div>
          </div>

          {/* Aaliyah Gallery */}
          <div className="bg-black/40 backdrop-blur-lg rounded-2xl overflow-hidden border border-purple-500/30 hover:border-pink-500 transition hover:scale-105">
            <div className="relative">
              <img
                src="https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771497563/Isabella1_pvijrq.png"
                alt="Aaliyah"
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-4 left-4">
                <h2 className="text-2xl font-bold">Aaliyah "Liyah"</h2>
                <p className="text-pink-300">15 photos</p>
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-300 mb-4">
                24yo luxury companion • VIP treatment awaits
              </p>
              <button
                onClick={() => router.push(`/gallery/aaliyah`)}
                className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full font-bold hover:brightness-110 transition"
              >
                View Gallery
              </button>
            </div>
          </div>

          {/* Riley Harper Gallery */}
          <div className="bg-black/40 backdrop-blur-lg rounded-2xl overflow-hidden border border-purple-500/30 hover:border-pink-500 transition hover:scale-105">
            <div className="relative">
              <img
                src="https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771503243/Riley1_lvyoep.png"
                alt="Riley Harper"
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-4 left-4">
                <h2 className="text-2xl font-bold">Riley "Ry" Harper</h2>
                <p className="text-pink-300">15 photos</p>
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-300 mb-4">
                21yo gamer girl • Nerdy & seductive
              </p>
              <button
                onClick={() => router.push(`/gallery/riley`)}
                className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full font-bold hover:brightness-110 transition"
              >
                View Gallery
              </button>
            </div>
          </div>
        </div>

        {/* All Access Banner */}
        {!miaAllAccess && (
          <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-2xl p-6 border border-purple-500/30 text-center">
            <h3 className="text-2xl font-bold mb-2">Want Unlimited Access?</h3>
            <p className="text-gray-300 mb-4">
              Get the Mia All-Access Ticker for $49.99 and unlock every photo forever!
            </p>
            <Link href="/shop">
              <button className="px-8 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full font-bold hover:brightness-110 transition">
                Buy All-Access Ticker
              </button>
            </Link>
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