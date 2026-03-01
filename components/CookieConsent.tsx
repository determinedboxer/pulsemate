"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true, // Always required
    functional: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    // Check if user has already consented
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      // Show banner after 1 second delay for better UX
      setTimeout(() => setShowBanner(true), 1000);
    }
  }, []);

  const handleAcceptAll = () => {
    const allAccepted = {
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem("cookieConsent", JSON.stringify(allAccepted));
    setShowBanner(false);
    setShowSettings(false);
  };

  const handleDecline = () => {
    const essentialOnly = {
      necessary: true,
      functional: false,
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem("cookieConsent", JSON.stringify(essentialOnly));
    setShowBanner(false);
    setShowSettings(false);
  };

  const handleSavePreferences = () => {
    const savedPreferences = {
      ...preferences,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem("cookieConsent", JSON.stringify(savedPreferences));
    setShowBanner(false);
    setShowSettings(false);
  };

  if (!showBanner) return null;

  return (
    <>
      {/* Cookie Consent Banner */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-end justify-center p-4">
        <div className="w-full max-w-4xl bg-gradient-to-br from-purple-900/95 to-pink-900/95 backdrop-blur-lg rounded-3xl border border-purple-500/50 shadow-2xl p-6 md:p-8 animate-slide-up">
          {!showSettings ? (
            // Main Banner View
            <>
              <div className="flex items-start gap-4 mb-6">
                <div className="text-4xl">🍪</div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white mb-2">
                    We Value Your Privacy
                  </h2>
                  <p className="text-gray-200 text-sm leading-relaxed">
                    We use cookies to enhance your experience, analyze site traffic, and personalize content. 
                    This site is for adults only (18+). By using PulseMate, you accept our use of cookies and confirm you are of legal age.
                  </p>
                </div>
              </div>

              {/* Cookie Types Summary */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                <div className="bg-white/10 rounded-lg p-3 text-center">
                  <div className="text-green-400 font-bold text-sm mb-1">✓ Essential</div>
                  <div className="text-xs text-gray-300">Required for site function</div>
                </div>
                <div className="bg-white/10 rounded-lg p-3 text-center">
                  <div className="text-blue-400 font-bold text-sm mb-1">⚙️ Functional</div>
                  <div className="text-xs text-gray-300">Remember preferences</div>
                </div>
                <div className="bg-white/10 rounded-lg p-3 text-center">
                  <div className="text-purple-400 font-bold text-sm mb-1">📊 Analytics</div>
                  <div className="text-xs text-gray-300">Usage statistics</div>
                </div>
                <div className="bg-white/10 rounded-lg p-3 text-center">
                  <div className="text-pink-400 font-bold text-sm mb-1">🎯 Marketing</div>
                  <div className="text-xs text-gray-300">Personalized ads</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleAcceptAll}
                  className="flex-1 py-3 px-6 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full font-bold text-white hover:brightness-110 transition shadow-lg"
                >
                  Accept All Cookies
                </button>
                <button
                  onClick={() => setShowSettings(true)}
                  className="flex-1 py-3 px-6 bg-white/20 rounded-full font-bold text-white hover:bg-white/30 transition border border-white/30"
                >
                  Customize Settings
                </button>
                <button
                  onClick={handleDecline}
                  className="py-3 px-6 bg-gray-700/50 rounded-full font-medium text-gray-300 hover:bg-gray-700 transition"
                >
                  Decline
                </button>
              </div>

              {/* Legal Links */}
              <div className="mt-4 text-center text-xs text-gray-400">
                Read our{" "}
                <Link href="/legal/privacy-policy" className="text-pink-400 hover:text-pink-300 underline">
                  Privacy Policy
                </Link>
                {" · "}
                <Link href="/legal/cookie-policy" className="text-pink-400 hover:text-pink-300 underline">
                  Cookie Policy
                </Link>
                {" · "}
                <Link href="/legal/terms-of-service" className="text-pink-400 hover:text-pink-300 underline">
                  Terms of Service
                </Link>
              </div>
            </>
          ) : (
            // Settings View
            <>
              <div className="flex items-start gap-4 mb-6">
                <button
                  onClick={() => setShowSettings(false)}
                  className="text-2xl hover:scale-110 transition"
                >
                  ← 
                </button>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Cookie Preferences
                  </h2>
                  <p className="text-gray-200 text-sm">
                    Choose which cookies you want to allow. Essential cookies are always enabled.
                  </p>
                </div>
              </div>

              {/* Cookie Settings */}
              <div className="space-y-4 mb-6">
                {/* Essential Cookies */}
                <div className="bg-white/10 rounded-xl p-4 border border-green-500/30">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">✓</div>
                      <div>
                        <h3 className="font-bold text-white">Essential Cookies</h3>
                        <p className="text-xs text-gray-300">Required for the site to function</p>
                      </div>
                    </div>
                    <div className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-bold">
                      Always Active
                    </div>
                  </div>
                  <p className="text-sm text-gray-400">
                    Authentication, security, and core functionality. Cannot be disabled.
                  </p>
                </div>

                {/* Functional Cookies */}
                <div className="bg-white/10 rounded-xl p-4 border border-blue-500/30">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">⚙️</div>
                      <div>
                        <h3 className="font-bold text-white">Functional Cookies</h3>
                        <p className="text-xs text-gray-300">Enhanced features and personalization</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences.functional}
                        onChange={(e) => setPreferences({ ...preferences, functional: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-pink-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
                    </label>
                  </div>
                  <p className="text-sm text-gray-400">
                    Remember your preferences, chat history, and settings.
                  </p>
                </div>

                {/* Analytics Cookies */}
                <div className="bg-white/10 rounded-xl p-4 border border-purple-500/30">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">📊</div>
                      <div>
                        <h3 className="font-bold text-white">Analytics Cookies</h3>
                        <p className="text-xs text-gray-300">Help us improve the platform</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences.analytics}
                        onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-purple-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
                    </label>
                  </div>
                  <p className="text-sm text-gray-400">
                    Anonymous usage statistics to help us understand how you use PulseMate.
                  </p>
                </div>

                {/* Marketing Cookies */}
                <div className="bg-white/10 rounded-xl p-4 border border-pink-500/30">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">🎯</div>
                      <div>
                        <h3 className="font-bold text-white">Marketing Cookies</h3>
                        <p className="text-xs text-gray-300">Personalized content and offers</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences.marketing}
                        onChange={(e) => setPreferences({ ...preferences, marketing: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-pink-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
                    </label>
                  </div>
                  <p className="text-sm text-gray-400">
                    Show you relevant content and special offers based on your interests.
                  </p>
                </div>
              </div>

              {/* Save Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleSavePreferences}
                  className="flex-1 py-3 px-6 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full font-bold text-white hover:brightness-110 transition shadow-lg"
                >
                  Save Preferences
                </button>
                <button
                  onClick={handleAcceptAll}
                  className="py-3 px-6 bg-white/20 rounded-full font-medium text-white hover:bg-white/30 transition border border-white/30"
                >
                  Accept All
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(100px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.4s ease-out;
        }
      `}</style>
    </>
  );
}
