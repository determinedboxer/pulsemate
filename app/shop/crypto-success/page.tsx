// app/shop/crypto-success/page.tsx
"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function CryptoSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");
  const [status, setStatus] = useState<string>("checking");
  const [paymentInfo, setPaymentInfo] = useState<any>(null);
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    if (!orderId) {
      router.push("/shop");
      return;
    }

    // Poll payment status
    const checkStatus = async () => {
      try {
        const response = await fetch(`/api/crypto/payment-status?order_id=${orderId}`);
        if (response.ok) {
          const data = await response.json();
          setPaymentInfo(data);
          setStatus(data.status);

          // If completed, stop polling
          if (data.status === 'completed') {
            return true;
          }
        }
      } catch (error) {
        console.error('Failed to check payment status:', error);
      }
      return false;
    };

    // Initial check
    checkStatus();

    // Poll every 5 seconds
    const interval = setInterval(async () => {
      const completed = await checkStatus();
      if (completed) {
        clearInterval(interval);
      }
    }, 5000);

    // Countdown timer
    const countdownTimer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownTimer);
          if (status === 'completed') {
            router.push("/shop");
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(countdownTimer);
    };
  }, [orderId, router, status]);

  const getStatusIcon = () => {
    switch (status) {
      case 'completed':
        return (
          <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'processing':
      case 'pending':
        return (
          <svg className="w-12 h-12 text-yellow-500 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        );
      case 'failed':
        return (
          <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      default:
        return (
          <svg className="w-12 h-12 text-blue-500 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  const getStatusMessage = () => {
    switch (status) {
      case 'completed':
        return {
          title: 'Payment Confirmed! 🎉',
          message: 'Your cryptocurrency payment has been confirmed and your purchase is complete!',
          color: 'green',
        };
      case 'processing':
        return {
          title: 'Payment Processing ⏳',
          message: 'Your payment is being confirmed on the blockchain. This may take a few minutes.',
          color: 'yellow',
        };
      case 'pending':
        return {
          title: 'Waiting for Payment 💳',
          message: 'Waiting to receive your cryptocurrency payment.',
          color: 'blue',
        };
      case 'failed':
        return {
          title: 'Payment Failed ❌',
          message: 'Your payment could not be completed. Please try again.',
          color: 'red',
        };
      default:
        return {
          title: 'Checking Payment Status...',
          message: 'Please wait while we verify your payment.',
          color: 'blue',
        };
    }
  };

  const statusInfo = getStatusMessage();

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-purple-950 to-pink-950 text-white flex items-center justify-center p-6">
      <div className={`max-w-md w-full bg-black/40 backdrop-blur-lg rounded-2xl p-8 border border-${statusInfo.color}-500/30 text-center`}>
        {/* Status Icon */}
        <div className="mb-6">
          <div className={`w-20 h-20 mx-auto bg-${statusInfo.color}-500/20 rounded-full flex items-center justify-center`}>
            {getStatusIcon()}
          </div>
        </div>

        {/* Status Message */}
        <h1 className={`text-3xl font-bold mb-4 bg-gradient-to-r from-${statusInfo.color}-400 to-${statusInfo.color}-600 bg-clip-text text-transparent`}>
          {statusInfo.title}
        </h1>
        
        <p className="text-gray-300 mb-6">
          {statusInfo.message}
        </p>

        {/* Payment Info */}
        {paymentInfo?.liveStatus && (
          <div className={`mb-6 p-4 bg-${statusInfo.color}-500/10 rounded-lg border border-${statusInfo.color}-500/30 text-left`}>
            <div className="text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Amount:</span>
                <span className="font-bold">{paymentInfo.liveStatus.payAmount} {paymentInfo.liveStatus.payCurrency.toUpperCase()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Status:</span>
                <span className={`font-bold text-${statusInfo.color}-400`}>{paymentInfo.liveStatus.paymentStatus}</span>
              </div>
              {paymentInfo.liveStatus.actuallyPaid > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Paid:</span>
                  <span className="font-bold text-green-400">{paymentInfo.liveStatus.actuallyPaid} {paymentInfo.liveStatus.payCurrency.toUpperCase()}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Redirect Info */}
        {status === 'completed' && (
          <p className="text-gray-400 text-sm mb-6">
            Redirecting to shop in {countdown} seconds...
          </p>
        )}

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

export default function CryptoSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-b from-black via-purple-950 to-pink-950 text-white flex items-center justify-center">Loading...</div>}>
      <CryptoSuccessContent />
    </Suspense>
  );
}
