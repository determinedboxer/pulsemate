// app/shop/cancel/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function PaymentCancelPage() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // Countdown and redirect
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push("/shop");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-purple-950 to-pink-950 text-white flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-black/40 backdrop-blur-lg rounded-2xl p-8 border border-yellow-500/30 text-center">
        {/* Cancel Icon */}
        <div className="mb-6">
          <div className="w-20 h-20 mx-auto bg-yellow-500/20 rounded-full flex items-center justify-center">
            <svg
              className="w-12 h-12 text-yellow-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
        </div>

        {/* Cancel Message */}
        <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-orange-600 bg-clip-text text-transparent">
          Payment Cancelled
        </h1>
        
        <p className="text-gray-300 mb-6">
          Your payment was cancelled. No charges were made to your account.
        </p>

        <div className="mb-6 p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/30">
          <p className="text-sm text-yellow-400">
            Don't worry, you can try again anytime!
          </p>
        </div>

        {/* Redirect Info */}
        <p className="text-gray-400 text-sm mb-6">
          Redirecting to shop in {countdown} seconds...
        </p>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <Link
            href="/shop"
            className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full font-bold hover:brightness-110 transition"
          >
            Back to Shop
          </Link>
          <Link
            href="/dashboard"
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full font-bold hover:brightness-110 transition"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
