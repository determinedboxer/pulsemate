// app/gallery/sophia/page.tsx
"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

export default function SophiaGalleryPage() {
  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();

  // Redirect if not signed in
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in");
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded || !isSignedIn) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-purple-950 to-pink-950 text-white">
      {/* Header */}
      <header className="p-6 border-b border-purple-500/30 bg-black/40 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-6xl mx-auto">
          <Link href="/galleries" className="inline-block mb-2 text-pink-400 hover:text-pink-300 transition">
            ← Back to Galleries
          </Link>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
            Sophia Chen 💗
          </h1>
        </div>
      </header>

      {/* Coming Soon Content */}
      <main className="max-w-6xl mx-auto p-6 flex items-center justify-center min-h-[60vh]">
        <div className="text-center bg-black/40 backdrop-blur-lg rounded-2xl p-12 border border-purple-500/30 max-w-2xl">
          <div className="w-32 h-32 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-5xl">🎮</span>
          </div>
          <h2 className="text-3xl font-bold mb-4">Coming Soon</h2>
          <p className="text-gray-300 mb-6 text-lg">
            Sophia Chen's gaming collection is loading... 
            Get ready for tech-savvy streams and digital lifestyle content!
          </p>
          <div className="bg-gray-800/50 rounded-lg p-4 inline-block">
            <p className="text-gray-400">Expected Release: Coming Soon</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-8 text-center text-gray-500 border-t border-purple-500/30 mt-12">
        © 2026 PulseMate. All rights reserved.
      </footer>
    </div>
  );
}