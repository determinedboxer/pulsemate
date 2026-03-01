// app/gallery/isabella/page.tsx (Isabella Brooks - Luxury Escort)
"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";

interface Photo {
  id: string;
  url: string;
  title: string;
  price?: number;
  isFree: boolean;
}

interface Video {
  id: string;
  videoUrl: string;
  thumbnailUrl: string;
  blurredThumbnail?: string;
  title: string;
  duration: string;
  price: number;
  isFree: boolean;
}

export default function IsabellaGalleryPage() {
  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();

  const [unlockedPhotos, setUnlockedPhotos] = useState<string[]>([]);
  const [gemsBalance, setGemsBalance] = useState(0);
  const [isabellaAllAccess, setIsabellaAllAccess] = useState(false);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in");
    }
  }, [isLoaded, isSignedIn, router]);

  const mainAvatarUrl = useMemo(() => {
    const url = "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1770663514/51_i1g5u3.jpg?v=" + Date.now();
    console.log("Isabella main avatar URL:", url);
    return url;
  }, []);

  const allPhotos: Photo[] = [
    // Free photos (5)
    { id: "photo_isabella_1", url: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1770663514/51_i1g5u3.jpg", title: "Elegant Portrait", isFree: true },
    { id: "isabella_free_1", url: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771624231/hf_20260220_214759_973af8d3-c931-4f75-a7a7-4458cd1cd84c_igztgj.jpg", title: "Rooftop Elegance", isFree: true },
    { id: "isabella_free_2", url: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771624559/hf_20260220_215403_d1987db1-1338-40f8-bc76-9f2d8e58b897_cg1svu.jpg", title: "Penthouse Morning", isFree: true },
    { id: "isabella_free_3", url: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771624630/hf_20260220_215432_37c9c075-c7c8-4102-879b-2bcbe0456875_rzwcxa.jpg", title: "Getting Ready", isFree: true },
    { id: "isabella_free_4", url: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771624795/hf_20260220_215803_ec85b8a8-1da7-4cdd-a8c2-c7d44b995530_rfeyci.jpg", title: "Fine Dining", isFree: true },
    // PPV photos (7)
    { id: "photo_isabella_2", url: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771626233/hf_20260220_221800_f3ef5394-7da7-4872-8458-45ddfd0065f0_xq5mcv.jpg", title: "Penthouse Lace", price: 299, isFree: false },
    { id: "photo_isabella_3", url: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771626288/hf_20260220_221816_0366dc6d-175b-4637-ab39-0e1504d180b1_xy8hm9.jpg", title: "Red Room Temptation", price: 499, isFree: false },
    { id: "photo_isabella_3b", url: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771626878/hf_20260220_223116_fecff4bf-54e1-4a0a-a808-0e8d0111121b_umnc2o.jpg", title: "Mirror Reveal", price: 549, isFree: false },
    { id: "photo_isabella_4", url: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771626644/hf_20260220_222742_188bd840-f65f-4ae9-8f62-a323b49538b3_yb0xez.jpg", title: "Golden Hour Suite", price: 699, isFree: false },
    { id: "photo_isabella_4b", url: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771626726/hf_20260220_223021_40db7c6d-4a7b-470e-b1ce-d64dea7bf3e8_xkx4gb.jpg", title: "Candlelit Desire", price: 749, isFree: false },
    { id: "photo_isabella_5", url: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771626985/hf_20260220_223325_914ecb79-f7a8-49c4-8c9c-a8fd8c08e2f0_kajxnm.jpg", title: "Bathtub Luxury", price: 799, isFree: false },
    { id: "photo_isabella_6", url: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771627225/hf_20260220_223744_6b92d8ae-8b9f-40e1-8c07-3908a143230f_ebrynz.jpg", title: "Suite Finale", price: 899, isFree: false },
  ];

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedGems = localStorage.getItem("gemsBalance");
      if (savedGems) setGemsBalance(parseInt(savedGems));

      const savedUnlocked = localStorage.getItem("isabellaUnlockedPhotos");
      if (savedUnlocked) {
        try {
          setUnlockedPhotos(JSON.parse(savedUnlocked));
        } catch (e) {
          console.error("Failed to parse unlocked photos:", e);
        }
      }

      const savedAllAccess = localStorage.getItem("isabellaAllAccess");
      if (savedAllAccess === "true") {
        setIsabellaAllAccess(true);
      }
    }
  }, []);

  const handleUnlock = (photoId: string, price: number) => {
    if (gemsBalance < price) {
      alert(`Not enough gems! You need ${price} gems. Visit the Shop.`);
      return;
    }

    const newBalance = gemsBalance - price;
    setGemsBalance(newBalance);
    localStorage.setItem("gemsBalance", newBalance.toString());

    const newUnlocked = [...unlockedPhotos, photoId];
    setUnlockedPhotos(newUnlocked);
    localStorage.setItem("isabellaUnlockedPhotos", JSON.stringify(newUnlocked));

    alert("Photo unlocked! 🔥");
  };

  if (!isLoaded || !isSignedIn) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white text-xl">Loading...</p>
      </div>
    );
  }

  const totalFree = allPhotos.filter(p => p.isFree).length;
  const totalPPV = allPhotos.length - totalFree;

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-red-950 to-black text-white">
      {/* Header */}
      <header className="bg-black/60 backdrop-blur-md border-b border-red-500/30 p-6 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/galleries" className="text-red-400 hover:text-red-300 transition">
            ← Back to Galleries
          </Link>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-red-500 to-orange-600 bg-clip-text text-transparent">
            Isabella's Gallery 🔥
          </h1>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-amber-400">{gemsBalance} 💎</span>
            <Link href="/shop">
              <button className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 rounded-lg text-sm font-bold hover:brightness-110 transition">
                Buy Gems
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* Gallery */}
      <main className="max-w-6xl mx-auto p-8">
        <div className="mb-12">
          <div className="flex items-center gap-6 mb-6">
            <img
              src={mainAvatarUrl}
              alt="Isabella Brooks"
              className="w-24 h-24 rounded-full object-cover border-4 border-red-500 shadow-lg"
              loading="eager"
            />
            <div>
              <h2 className="text-3xl font-bold">Isabella Brooks</h2>
              <p className="text-red-300">Luxury Escort • 23 • My time is expensive... but for the right king 🔥🖖👑</p>
              <p className="text-gray-400 text-sm mt-2">
                {allPhotos.length} photos • {totalFree} free • {totalPPV} exclusive
              </p>
            </div>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {allPhotos.map((photo) => {
            const isUnlocked = photo.isFree || isabellaAllAccess || unlockedPhotos.includes(photo.id);
            const displayUrl = isUnlocked ? photo.url : `${photo.url.replace('/upload/', '/upload/e_blur:800/')}`;

            return (
              <div
                key={photo.id}
                className="relative group bg-gradient-to-b from-red-900/20 to-black/60 rounded-2xl overflow-hidden border border-red-500/30 hover:border-red-400 transition-all duration-300 aspect-[3/4]"
              >
                <img
                  src={displayUrl}
                  alt={photo.title}
                  className={`w-full h-full object-cover ${!isUnlocked ? "blur-[40px] brightness-50" : ""}`}
                  loading="lazy"
                />
                
                {/* Lock Icon if not unlocked */}
                {!isUnlocked && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-black/70 backdrop-blur-sm px-6 py-3 rounded-2xl border border-red-500/50">
                      <svg className="w-8 h-8 text-red-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      <p className="text-xs font-bold text-red-400">{photo.price || 0} 💎</p>
                    </div>
                  </div>
                )}
                
                {/* Overlay with title and action */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <h3 className="text-sm font-bold mb-1">{photo.title}</h3>
                  {!isUnlocked && (
                    <button
                      onClick={() => handleUnlock(photo.id, photo.price || 0)}
                      className="px-4 py-2 bg-gradient-to-r from-red-500 to-orange-600 rounded-full text-xs font-bold hover:brightness-110 transition"
                    >
                      Unlock - {photo.price} 💎
                    </button>
                  )}
                  {isUnlocked && !photo.isFree && (
                    <div className="px-3 py-1 bg-red-600/70 rounded-full text-xs font-bold text-center">
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
        {!isabellaAllAccess && (
          <div className="mt-12 bg-gradient-to-br from-red-900/40 to-orange-900/40 backdrop-blur-lg rounded-3xl p-8 border border-red-500/30 text-center">
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-red-400 to-orange-500 bg-clip-text text-transparent">
              Isabella All-Access 🔥
            </h2>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Unlock all {allPhotos.length} photos + future exclusive content from Isabella forever.
            </p>
            <div className="flex items-center justify-center gap-4 mb-6">
              <span className="text-4xl font-black text-red-400">$49.99</span>
              <span className="text-gray-400 line-through">$99.99</span>
            </div>
            <Link href="/shop">
              <button className="px-12 py-4 bg-gradient-to-r from-red-500 to-orange-600 rounded-full text-xl font-bold hover:brightness-110 hover:scale-105 transition transform shadow-2xl">
                Get All-Access Now
              </button>
            </Link>
          </div>
        )}
      </main>

    </div>
  );
}
