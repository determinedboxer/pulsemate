"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function CookieSettingsPage() {
  const [preferences, setPreferences] = useState({
    necessary: true,
    functional: true,
    analytics: false,
    marketing: false,
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Load current preferences
    const consent = localStorage.getItem("cookieConsent");
    if (consent) {
      const parsed = JSON.parse(consent);
      setPreferences({
        necessary: true, // Always true
        functional: parsed.functional ?? true,
        analytics: parsed.analytics ?? false,
        marketing: parsed.marketing ?? false,
      });
    }
  }, []);

  const handleSave = () => {
    const savedPreferences = {
      ...preferences,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem("cookieConsent", JSON.stringify(savedPreferences));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleAcceptAll = () => {
    const allAccepted = {
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem("cookieConsent", JSON.stringify(allAccepted));
    setPreferences(allAccepted);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleRejectAll = () => {
    const essentialOnly = {
      necessary: true,
      functional: false,
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem("cookieConsent", JSON.stringify(essentialOnly));
    setPreferences(essentialOnly);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-purple-950 to-pink-950 text-white">
      <header className="p-6 border-b border-purple-500/30 bg-black/40 backdrop-blur-md">
        <div className="max-w-4xl mx-auto">
          <Link href="/dashboard" className="inline-block mb-4 text-pink-400 hover:text-pink-300 transition">
            ← Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold mb-2">Cookie Settings</h1>
          <p className="text-gray-400">Manage your cookie preferences</p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6">
        {/* Success Message */}
        {saved && (
          <div className="mb-6 p-4 bg-green-500/20 border border-green-500 rounded-xl text-green-400 text-center animate-fade-in">
            ✓ Cookie preferences saved successfully!
          </div>
        )}

        {/* Cookie Settings */}
        <div className="space-y-6">
          {/* Essential Cookies */}
          <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 backdrop-blur-lg rounded-2xl p-6 border border-green-500/30">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="text-3xl">✓</div>
                <div>
                  <h2 className="text-xl font-bold">Essential Cookies</h2>
                  <p className="text-sm text-gray-400">Required for the site to function</p>
                </div>
              </div>
              <div className="px-4 py-2 bg-green-500/20 text-green-400 rounded-full text-sm font-bold">
                Always Active
              </div>
            </div>
            <p className="text-gray-300 mb-4">
              These cookies are necessary for the website to function and cannot be switched off. They are usually 
              only set in response to actions made by you, such as setting your privacy preferences, logging in, 
              or filling in forms.
            </p>
            <div className="bg-black/30 rounded-lg p-4">
              <h3 className="font-bold mb-2">Used for:</h3>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• Authentication and security</li>
                <li>• Session management</li>
                <li>• Form submissions</li>
                <li>• Core site functionality</li>
              </ul>
            </div>
          </div>

          {/* Functional Cookies */}
          <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 backdrop-blur-lg rounded-2xl p-6 border border-blue-500/30">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="text-3xl">⚙️</div>
                <div>
                  <h2 className="text-xl font-bold">Functional Cookies</h2>
                  <p className="text-sm text-gray-400">Enhanced features and personalization</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.functional}
                  onChange={(e) => setPreferences({ ...preferences, functional: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-14 h-7 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-500"></div>
              </label>
            </div>
            <p className="text-gray-300 mb-4">
              These cookies enable enhanced functionality and personalization, such as remembering your preferences, 
              chat history, and settings across sessions.
            </p>
            <div className="bg-black/30 rounded-lg p-4">
              <h3 className="font-bold mb-2">Used for:</h3>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• Remembering your preferences</li>
                <li>• Saving chat history</li>
                <li>• Language and region settings</li>
                <li>• UI customization</li>
              </ul>
            </div>
          </div>

          {/* Analytics Cookies */}
          <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/30">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="text-3xl">📊</div>
                <div>
                  <h2 className="text-xl font-bold">Analytics Cookies</h2>
                  <p className="text-sm text-gray-400">Help us improve the platform</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.analytics}
                  onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-14 h-7 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-purple-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-purple-500"></div>
              </label>
            </div>
            <p className="text-gray-300 mb-4">
              These cookies help us understand how visitors interact with our website by collecting and reporting 
              information anonymously. This helps us improve the user experience.
            </p>
            <div className="bg-black/30 rounded-lg p-4">
              <h3 className="font-bold mb-2">Used for:</h3>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• Page view statistics</li>
                <li>• Feature usage tracking</li>
                <li>• Performance monitoring</li>
                <li>• Error tracking</li>
              </ul>
            </div>
          </div>

          {/* Marketing Cookies */}
          <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 backdrop-blur-lg rounded-2xl p-6 border border-pink-500/30">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="text-3xl">🎯</div>
                <div>
                  <h2 className="text-xl font-bold">Marketing Cookies</h2>
                  <p className="text-sm text-gray-400">Personalized content and offers</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.marketing}
                  onChange={(e) => setPreferences({ ...preferences, marketing: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-14 h-7 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-pink-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-pink-500"></div>
              </label>
            </div>
            <p className="text-gray-300 mb-4">
              These cookies track your activity across websites to deliver personalized advertising and content 
              that matches your interests.
            </p>
            <div className="bg-black/30 rounded-lg p-4">
              <h3 className="font-bold mb-2">Used for:</h3>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• Personalized recommendations</li>
                <li>• Targeted offers and promotions</li>
                <li>• Ad campaign effectiveness</li>
                <li>• Social media integration</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleSave}
            className="flex-1 py-4 px-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full font-bold text-white hover:brightness-110 transition shadow-lg text-lg"
          >
            Save My Preferences
          </button>
          <button
            onClick={handleAcceptAll}
            className="py-4 px-8 bg-white/20 rounded-full font-bold text-white hover:bg-white/30 transition border border-white/30"
          >
            Accept All
          </button>
          <button
            onClick={handleRejectAll}
            className="py-4 px-8 bg-gray-700/50 rounded-full font-medium text-gray-300 hover:bg-gray-700 transition"
          >
            Reject All
          </button>
        </div>

        {/* Legal Links */}
        <div className="mt-8 p-6 bg-black/40 rounded-xl border border-purple-500/30 text-center">
          <p className="text-gray-400 mb-3">For more information about our data practices:</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link href="/legal/privacy-policy" className="text-pink-400 hover:text-pink-300 underline">
              Privacy Policy
            </Link>
            <Link href="/legal/cookie-policy" className="text-pink-400 hover:text-pink-300 underline">
              Cookie Policy
            </Link>
            <Link href="/legal/terms-of-service" className="text-pink-400 hover:text-pink-300 underline">
              Terms of Service
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
