"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AgeVerification() {
  const [showGate, setShowGate] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if user has already verified age
    const ageVerified = localStorage.getItem("ageVerified");
    const verificationTimestamp = localStorage.getItem("ageVerificationTime");
    
    // Age verification expires after 30 days
    const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;
    const isExpired = verificationTimestamp 
      ? (Date.now() - parseInt(verificationTimestamp)) > thirtyDaysInMs 
      : true;

    if (!ageVerified || isExpired) {
      // Show gate after 500ms delay
      setTimeout(() => setShowGate(true), 500);
    }
  }, []);

  const handleEnter = () => {
    if (!agreed) {
      // Shake animation for checkbox
      const checkbox = document.getElementById("age-checkbox");
      checkbox?.classList.add("animate-shake");
      setTimeout(() => checkbox?.classList.remove("animate-shake"), 500);
      return;
    }

    // Store verification
    localStorage.setItem("ageVerified", "true");
    localStorage.setItem("ageVerificationTime", Date.now().toString());
    
    // Fade out animation
    setFadeOut(true);
    setTimeout(() => setShowGate(false), 400);
  };

  const handleExit = () => {
    // Redirect to a safe site (e.g., Google)
    window.location.href = "https://www.google.com";
  };

  if (!showGate) return null;

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black z-[10000] flex items-center justify-center p-4 transition-opacity duration-400 ${
          fadeOut ? "opacity-0" : "opacity-100"
        }`}
      >
        <div className="max-w-2xl w-full bg-gradient-to-br from-purple-950 to-pink-950 rounded-3xl border-2 border-pink-500/50 shadow-2xl overflow-hidden animate-scale-in">
          {/* Header with Warning */}
          <div className="bg-gradient-to-r from-red-600 to-pink-600 p-6 text-center">
            <div className="text-6xl mb-3">⚠️</div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Age Verification Required
            </h1>
            <p className="text-red-100">Adult Content Notice</p>
          </div>

          {/* Content */}
          <div className="p-8 space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-4">
                Welcome to PulseMate
              </h2>
              <p className="text-gray-300 leading-relaxed">
                This website contains <strong className="text-pink-400">adult-oriented content</strong> including 
                suggestive dialogue, flirtation, and mature imagery. Access is restricted to adults who are at least 
                <strong className="text-white"> 18 years of age</strong>.
              </p>
            </div>

            {/* Warning Box */}
            <div className="bg-red-900/30 border-2 border-red-500/50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-red-400 mb-3 flex items-center gap-2">
                <span>🔞</span>
                <span>Age Restriction Notice</span>
              </h3>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-pink-400 mt-1">•</span>
                  <span>You must be <strong className="text-white">18 years or older</strong> to enter this website</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pink-400 mt-1">•</span>
                  <span>By entering, you agree to our <a href="/legal/terms-of-service" className="text-pink-400 hover:underline">Terms of Service</a> and <a href="/legal/privacy-policy" className="text-pink-400 hover:underline">Privacy Policy</a></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pink-400 mt-1">•</span>
                  <span>You confirm that viewing adult content is legal in your jurisdiction</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pink-400 mt-1">•</span>
                  <span>All characters and content are fictional and AI-generated</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pink-400 mt-1">•</span>
                  <span>We use cookies to enhance your experience (<a href="/legal/cookie-policy" className="text-pink-400 hover:underline">Cookie Policy</a>)</span>
                </li>
              </ul>
            </div>

            {/* Checkbox Agreement */}
            <div className="flex items-start gap-3 p-4 bg-purple-900/30 border border-purple-500/30 rounded-xl">
              <input
                id="age-checkbox"
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-1 w-5 h-5 text-pink-500 bg-gray-700 border-gray-600 rounded focus:ring-pink-500 focus:ring-2 cursor-pointer"
              />
              <label htmlFor="age-checkbox" className="text-white cursor-pointer select-none">
                <strong>I confirm that I am 18 years of age or older</strong> and I accept full responsibility 
                for my access to this website. I agree to the Terms of Service and Privacy Policy.
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleEnter}
                disabled={!agreed}
                className={`flex-1 py-4 px-8 rounded-full font-bold text-lg transition-all shadow-lg ${
                  agreed
                    ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:brightness-110 hover:scale-105"
                    : "bg-gray-700 text-gray-400 cursor-not-allowed"
                }`}
              >
                Enter PulseMate (18+)
              </button>
              <button
                onClick={handleExit}
                className="py-4 px-8 bg-gray-800 text-gray-300 rounded-full font-bold hover:bg-gray-700 transition border border-gray-600"
              >
                I Am Under 18 - Exit
              </button>
            </div>

            {/* Additional Info */}
            <div className="text-center text-sm text-gray-400">
              <p>
                By clicking "Enter", you affirm that you are of legal age in your jurisdiction and you 
                consent to viewing adult content.
              </p>
              <p className="mt-2">
                Need help? Contact <a href="mailto:support@pulsemate-ai.com" className="text-pink-400 hover:underline">support@pulsemate-ai.com</a>
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-black/40 p-4 text-center border-t border-purple-500/30">
            <p className="text-xs text-gray-500">
              PulseMate © 2026 • For Entertainment Purposes Only • All Characters Are Fictional
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        
        .animate-scale-in {
          animation: scale-in 0.4s ease-out;
        }
        
        :global(.animate-shake) {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </>
  );
}
