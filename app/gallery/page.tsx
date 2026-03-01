// app/gallery/page.tsx
"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

interface Model {
  id: string;
  name: string;
  avatarUrl: string;
  description: string;
  photoCount: number;
  route: string;
  available: boolean;
}

export default function GalleryPage() {
  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in");
    }
  }, [isLoaded, isSignedIn, router]);

  const models: Model[] = [
    {
      id: "mia",
      name: "Mia Thompson",
      avatarUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1769080927/13_k3ynrk.png",
      description: "22yo athletic blonde cheerleader • Exclusive photos and content",
      photoCount: 12,
      route: "/gallery/mia",
      available: true
    },
    {
      id: "isabella",
      name: "Isabella Brooks",
      avatarUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1770599989/hf_20260209_011732_673f8c7a-41cb-45f6-9cb4-cd071b69f2cd_mwrsey.png",
      description: "Exotic Dancer • 24 • Sensual & Mysterious 🔥",
      photoCount: 12,
      route: "/gallery/isabella",
      available: true
    },
    {
      id: "sakura",
      name: "Sakura \"Suki\" Lin",
      avatarUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771497629/Sakura1_kmjnpc.png",
      description: "Kawaii Cosplayer & Collector • Sweet & Mysterious 🌸",
      photoCount: 12,
      route: "/gallery/sakura",
      available: true
    },
    {
      id: "riley",
      name: "Riley \"Ry\" Harper",
      avatarUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771503243/Riley1_lvyoep.png",
      description: "Nerdy Gamer Girl • 22 • I'll carry you... in more ways than one 🎮💙",
      photoCount: 12,
      route: "/gallery/riley",
      available: true
    },
    {
      id: "aaliyah",
      name: "Aaliyah \"Liyah\"",
      avatarUrl: "https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771497563/Isabella1_pvijrq.png",
      description: "Nightlife Queen • 23 • VIP rooms & champagne dreams 🍾🔥",
      photoCount: 12,
      route: "/gallery/aaliyah",
      available: true
    }
  ];



  if (!isLoaded || !isSignedIn) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-purple-950 to-pink-950 text-white">
      <header className="p-6 border-b border-purple-500/30 bg-black/40 backdrop-blur-md">
        <div className="max-w-6xl mx-auto">
          <Link href="/dashboard" className="inline-block mb-4 text-pink-400 hover:text-pink-300 transition">
            ← Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold mb-2">My Galleries 📷</h1>
          <p className="text-gray-400">Browse exclusive content from your favorite models</p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {models.map((model) => (
            <div
              key={model.id}
              className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 backdrop-blur-lg rounded-3xl overflow-hidden border border-purple-500/30 hover:border-pink-500 transition-all duration-300 hover:scale-105"
            >
              <div className="relative h-64 bg-gray-900">
                <img
                  src={model.avatarUrl}
                  alt={model.name}
                  className="w-full h-full object-cover"
                  loading="eager"
                  crossOrigin="anonymous"
                  onError={(e) => {
                    console.error(`Failed to load image for ${model.name}:`, model.avatarUrl);
                    e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="white"%3EImage Error%3C/text%3E%3C/svg%3E';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              </div>
              
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-2">{model.name}</h2>
                <p className="text-sm text-gray-300 mb-1">{model.photoCount} photos</p>
                <p className="text-xs text-gray-400 mb-4">{model.description}</p>
                
                {model.available ? (
                  <Link href={model.route}>
                    <button className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl font-bold hover:brightness-110 transition">
                      View Gallery
                    </button>
                  </Link>
                ) : (
                  <div>
                    <div className="text-center mb-3">
                      <p className="text-gray-400 text-sm mb-1">Coming Soon</p>
                      <p className="text-xs text-gray-500">New personality arriving soon</p>
                    </div>
                    <button className="w-full py-3 bg-gray-700/50 rounded-xl font-bold text-gray-400 cursor-not-allowed">
                      Available Soon
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-gradient-to-br from-pink-900/40 to-purple-900/40 backdrop-blur-lg rounded-3xl p-8 border border-pink-500/30 text-center">
          <h2 className="text-3xl font-bold mb-4">Want Unlimited Access?</h2>
          <p className="text-gray-300 mb-6">
            Get the Mia All-Access Ticker for $49.99 and unlock every photo forever!
          </p>
          <Link href="/shop">
            <button className="px-8 py-4 bg-gradient-to-r from-amber-500 to-yellow-600 rounded-full text-xl font-bold hover:brightness-110 hover:scale-105 transition transform shadow-2xl">
              Buy All-Access Ticker
            </button>
          </Link>
        </div>
      </main>
    </div>
  );
}
