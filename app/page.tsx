// app/page.tsx
"use client";

import { SignInButton, SignUpButton, useUser, SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();
  const [showAgeVerification, setShowAgeVerification] = useState(true);

  // Auto-redirect signed-in users to dashboard
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.push("/dashboard");
    }
  }, [isSignedIn, isLoaded, router]);

  // Check age verification
  useEffect(() => {
    const ageVerified = localStorage.getItem("ageVerified");
    if (ageVerified === "true") {
      setShowAgeVerification(false);
    }
  }, []);

  const handleAgeVerification = (isAdult: boolean) => {
    if (isAdult) {
      localStorage.setItem("ageVerified", "true");
      setShowAgeVerification(false);
    } else {
      window.location.href = "https://www.google.com";
    }
  };

  // Show loading while redirecting
  if (isLoaded && isSignedIn) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white text-xl animate-pulse">Redirecting to Dashboard...</p>
      </div>
    );
  }

  return (
    <>
      {/* Age Verification Modal */}
      {showAgeVerification && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-lg">
          <div className="bg-gradient-to-b from-purple-900/40 to-black/60 backdrop-blur-xl rounded-3xl p-12 border border-pink-500/30 max-w-lg mx-4 text-center">
            <div className="text-6xl mb-6">🔞</div>
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              Age Verification Required
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              You must be 18 years or older to access this website.
            </p>
            <p className="text-lg text-gray-400 mb-10">
              This website contains adult content and is intended for adults only.
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => handleAgeVerification(true)}
                className="px-10 py-4 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full text-xl font-bold hover:brightness-110 hover:scale-105 transition transform"
              >
                I am 18 or older
              </button>
              <button
                onClick={() => handleAgeVerification(false)}
                className="px-10 py-4 bg-gray-700 hover:bg-gray-600 rounded-full text-xl font-bold transition"
              >
                Exit
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-gradient-to-b from-black via-purple-950 to-pink-950 text-white">
      {/* Header removed to avoid duplication with layout.tsx header */}
      {/* 
      <header className="p-6 flex justify-between items-center border-b border-purple-500/30 bg-black/40 backdrop-blur-md sticky top-0 z-50">
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
          PulseMate
        </h1>
        <div className="flex gap-4">
          <SignInButton mode="modal">
            <button className="px-6 py-3 bg-purple-600 rounded-full font-medium hover:brightness-110 transition">
              Log In
            </button>
          </SignInButton>
          <SignUpButton mode="modal">
            <button className="px-6 py-3 bg-pink-500 rounded-full font-medium hover:brightness-110 transition">
              Sign Up
            </button>
          </SignUpButton>
        </div>
      </header>
      */}

      {/* Hero */}
      <main className="max-w-7xl mx-auto px-6 py-16">
        <section className="text-center mb-24">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 bg-gradient-to-r from-pink-500 via-purple-600 to-pink-500 bg-clip-text text-transparent animate-pulse">
            Exclusive Chats Await 💗
          </h1>
          <p className="text-xl md:text-2xl mb-4 max-w-3xl mx-auto text-gray-200">
            Private conversations with stunning AI companions — cheerleaders, fitness models, gamers, cosplayers and more. Voice messages, exclusive photos, and real chemistry — all unlocked for you 💗
          </p>
          <p className="text-lg md:text-xl mb-12 max-w-3xl mx-auto text-gray-300">
            Connect with your dream AI companion — intimate chats, voice messages, private photos and more await 💗
          </p>
          <SignedOut>
            <SignUpButton mode="modal">
              <button className="px-12 py-5 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full text-xl font-bold hover:brightness-110 hover:scale-105 transition transform duration-300 shadow-lg shadow-pink-500/30">
                Join Now & Get Started
              </button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <Link href="/dashboard">
              <button className="px-12 py-5 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full text-xl font-bold hover:brightness-110 hover:scale-105 transition transform duration-300 shadow-lg shadow-pink-500/30">
                Go to Dashboard
              </button>
            </Link>
          </SignedIn>
        </section>

        {/* Models Grid */}
        <section className="mb-24">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-6 bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
            Meet Our Models
          </h2>
          <p className="text-center text-gray-300 max-w-3xl mx-auto mb-16">
            Exclusive chats with your favorite AI companions — cheerleaders, fitness models, gamers, cosplayers, exotic dancers and more. Voice messages, private photos, and real chemistry — all unlocked for you 💗
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {/* Mia */}
            <div className="group bg-gradient-to-b from-purple-900/20 to-black/60 backdrop-blur-lg rounded-2xl overflow-hidden border border-purple-500/30 hover:border-pink-500 hover:scale-105 transition-all duration-300 shadow-2xl">
              <div className="relative h-80 sm:h-96">
                <img
                  src="https://res.cloudinary.com/ddnaxqmdw/image/upload/v1769080927/13_k3ynrk.png"
                  alt="Mia Thompson"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-xl font-bold">Mia Thompson</h3>
                  <p className="text-[10px] text-pink-300 font-bold uppercase tracking-widest">Cheerleader • Playful</p>
                </div>
              </div>
              <div className="p-5">
                <p className="text-gray-400 text-xs mb-4 line-clamp-2">
                  Athletic blonde with a teasing smile — ready to make your heart race.
                </p>
                <SignedOut>
                  <SignInButton mode="modal">
                    <button className="w-full py-2.5 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl font-bold text-xs hover:brightness-110 transition">
                      Chat Now
                    </button>
                  </SignInButton>
                </SignedOut>
                <SignedIn>
                  <Link href="/dashboard">
                    <button className="w-full py-2.5 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl font-bold text-xs hover:brightness-110 transition">
                      Chat with Mia
                    </button>
                  </Link>
                </SignedIn>
              </div>
            </div>

            {/* Isabella Brooks (was Aaliyah) */}
            <div className="group bg-gradient-to-b from-purple-900/20 to-black/60 backdrop-blur-lg rounded-2xl overflow-hidden border border-purple-500/30 hover:border-pink-500 hover:scale-105 transition-all duration-300 shadow-2xl">
              <div className="relative h-80 sm:h-96">
                <img
                  src="https://res.cloudinary.com/ddnaxqmdw/image/upload/v1770599989/hf_20260209_011732_673f8c7a-41cb-45f6-9cb4-cd071b69f2cd_mwrsey.png"
                  alt="Isabella Brooks"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-xl font-bold">Isabella Brooks</h3>
                  <p className="text-[10px] text-amber-400 font-bold uppercase tracking-widest">Luxury Escort • Dominant</p>
                </div>
              </div>
              <div className="p-5">
                <p className="text-gray-400 text-xs mb-4 line-clamp-2">
                  Sensual & mysterious elite companion with cold confidence and a dominant vibe 🔥🖤👑
                </p>
                <SignedOut>
                  <SignInButton mode="modal">
                    <button className="w-full py-2.5 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl font-bold text-xs hover:brightness-110 transition">
                      Chat Now
                    </button>
                  </SignInButton>
                </SignedOut>
                <SignedIn>
                  <Link href="/dashboard">
                    <button className="w-full py-2.5 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl font-bold text-xs hover:brightness-110 transition">
                      Chat with Isabella
                    </button>
                  </Link>
                </SignedIn>
              </div>
            </div>

            {/* Riley "Ry" Harper */}
            <div className="group bg-gradient-to-b from-purple-900/20 to-black/60 backdrop-blur-lg rounded-2xl overflow-hidden border border-purple-500/30 hover:border-pink-500 hover:scale-105 transition-all duration-300 shadow-2xl">
              <div className="relative h-80 sm:h-96">
                <img
                  src="https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771503243/Riley1_lvyoep.png"
                  alt="Riley Ry Harper"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-xl font-bold">Riley "Ry" Harper</h3>
                  <p className="text-[10px] text-orange-400 font-bold uppercase tracking-widest">Gamer Girl • Nerdy</p>
                </div>
              </div>
              <div className="p-5">
                <p className="text-gray-400 text-xs mb-4 line-clamp-2">
                  Nerdy & seductive redhead gamer girl — ready to duo? 🎮😏
                </p>
                <SignedOut>
                  <SignInButton mode="modal">
                    <button className="w-full py-2.5 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl font-bold text-xs hover:brightness-110 transition">
                      Chat Now
                    </button>
                  </SignInButton>
                </SignedOut>
                <SignedIn>
                  <Link href="/chat/riley">
                    <button className="w-full py-2.5 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl font-bold text-xs hover:brightness-110 transition">
                      Chat with Riley
                    </button>
                  </Link>
                </SignedIn>
              </div>
            </div>

            {/* Sakura "Suki" Lin */}
            <div className="group bg-gradient-to-b from-purple-900/20 to-black/60 backdrop-blur-lg rounded-2xl overflow-hidden border border-purple-500/30 hover:border-pink-500 hover:scale-105 transition-all duration-300 shadow-2xl">
              <div className="relative h-80 sm:h-96">
                <img
                  src="https://res.cloudinary.com/ddnaxqmdw/image/upload/v1770393771/Sakura1_nctckh.png"
                  alt="Sakura Suki Lin"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-xl font-bold">Sakura "Suki" Lin</h3>
                  <p className="text-[10px] text-pink-300 font-bold uppercase tracking-widest">Cosplayer • Mysterious</p>
                </div>
              </div>
              <div className="p-5">
                <p className="text-gray-400 text-xs mb-4 line-clamp-2">
                  Kawaii cosplayer & collector — ready to play roles? 🌸
                </p>
                <SignedOut>
                  <SignInButton mode="modal">
                    <button className="w-full py-2.5 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl font-bold text-xs hover:brightness-110 transition">
                      Chat Now
                    </button>
                  </SignInButton>
                </SignedOut>
                <SignedIn>
                  <Link href="/chat/sakura">
                    <button className="w-full py-2.5 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl font-bold text-xs hover:brightness-110 transition">
                      Chat with Sakura
                    </button>
                  </Link>
                </SignedIn>
              </div>
            </div>

            {/* Aaliyah "Liyah" (was Isabella) */}
            <div className="group bg-gradient-to-b from-purple-900/20 to-black/60 backdrop-blur-lg rounded-2xl overflow-hidden border border-purple-500/30 hover:border-pink-500 hover:scale-105 transition-all duration-300 shadow-2xl">
              <div className="relative h-80 sm:h-96">
                <img
                  src="https://res.cloudinary.com/ddnaxqmdw/image/upload/v1771497563/Isabella1_pvijrq.png"
                  alt="Aaliyah Liyah"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-xl font-bold">Aaliyah "Liyah"</h3>
                  <p className="text-[10px] text-red-300 font-bold uppercase tracking-widest">Exotic Dancer • Sensual</p>
                </div>
              </div>
              <div className="p-5">
                <p className="text-gray-400 text-xs mb-4 line-clamp-2">
                  Sensual & mysterious exotic dancer — ready to show you her fire. 🔥
                </p>
                <SignedOut>
                  <SignInButton mode="modal">
                    <button className="w-full py-2.5 bg-gradient-to-r from-red-500 to-orange-600 rounded-xl font-bold text-xs hover:brightness-110 transition">
                      Chat Now
                    </button>
                  </SignInButton>
                </SignedOut>
                <SignedIn>
                  <Link href="/chat/isabella">
                    <button className="w-full py-2.5 bg-gradient-to-r from-red-500 to-orange-600 rounded-xl font-bold text-xs hover:brightness-110 transition">
                      Chat with Aaliyah
                    </button>
                  </Link>
                </SignedIn>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center bg-black/30 backdrop-blur-lg rounded-3xl p-12 border border-purple-500/30 mb-20">
          <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
            Ready for Private Chats?
          </h2>
          <p className="text-xl mb-10 max-w-3xl mx-auto text-gray-200">
            Sign up now to unlock exclusive content, voice messages, private photos and more. Your first 100 gems are on us!
          </p>
          <SignedOut>
            <SignUpButton mode="modal">
              <button className="px-16 py-6 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full text-2xl font-bold hover:brightness-110 hover:scale-105 transition transform duration-300 shadow-2xl shadow-pink-500/30">
                Join PulseMate Now
              </button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <Link href="/dashboard">
              <button className="px-16 py-6 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full text-2xl font-bold hover:brightness-110 hover:scale-105 transition transform duration-300 shadow-2xl shadow-pink-500/30">
                Explore Dashboard
              </button>
            </Link>
          </SignedIn>
        </section>
      </main>

      {/* Footer */}
      <footer className="p-10 border-t border-purple-500/30 bg-black/40 backdrop-blur-md">
        <div className="max-w-6xl mx-auto">
          {/* Social Media Links */}
          <div className="flex justify-center gap-6 mb-8">
            <a 
              href="https://www.instagram.com/pulsematecom?igsh=MXZwMzRzcXM4bjRvNQ%3D%3D&utm_source=qr" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600/50 to-pink-600/50 rounded-full hover:from-purple-600 hover:to-pink-600 transition-all"
            >
              <span className="text-2xl">📷</span>
              <span className="font-medium">Instagram</span>
            </a>
            <a 
              href="https://www.reddit.com/u/AddressLoud2553/s/6MlMwCPADU" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-600/50 to-red-600/50 rounded-full hover:from-orange-600 hover:to-red-600 transition-all"
            >
              <span className="text-2xl">🔴</span>
              <span className="font-medium">Reddit</span>
            </a>
            <a 
              href="https://x.com/PulseMateCOM" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600/50 to-purple-600/50 rounded-full hover:from-blue-600 hover:to-purple-600 transition-all"
            >
              <span className="text-2xl">🐦</span>
              <span className="font-medium">X (Twitter)</span>
            </a>
          </div>

          {/* Links */}
          <div className="flex justify-center gap-8 mb-6 flex-wrap">
            <Link href="/terms" className="text-gray-400 hover:text-pink-400 transition">
              Terms of Service
            </Link>
            <Link href="/privacy" className="text-gray-400 hover:text-pink-400 transition">
              Privacy Policy
            </Link>
            <Link href="/faq" className="text-gray-400 hover:text-pink-400 transition">
              FAQ
            </Link>
            <Link href="/contact" className="text-gray-400 hover:text-pink-400 transition">
              Contact Us
            </Link>
          </div>

          {/* Copyright */}
          <p className="text-center text-gray-500">
            © 2026 PulseMate. All rights reserved. • Private & Secure • 18+
          </p>
        </div>
      </footer>
      </div>
    </>
  );
}