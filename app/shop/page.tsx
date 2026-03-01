// app/shop/page.tsx
"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { gemPackages, allAccessTickers } from "@/lib/payment-products";
import { AVAILABLE_CRYPTO_CURRENCIES } from "@/lib/crypto-payment-types";

export default function ShopPage() {
  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  const [balance, setBalance] = useState(499);
  const [purchasedTickers, setPurchasedTickers] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState('btc');
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);
  const [pendingPurchase, setPendingPurchase] = useState<any>(null);

  // Redirect if not signed in
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in");
    }
  }, [isLoaded, isSignedIn, router]);

  // Load data from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedBalance = localStorage.getItem("gemsBalance");
      const savedTickers = localStorage.getItem("purchasedTickers");
      const savedCurrency = localStorage.getItem("preferredCryptoCurrency");
      
      if (savedBalance) setBalance(parseInt(savedBalance));
      if (savedCurrency) setSelectedCurrency(savedCurrency);
      if (savedTickers) {
        try {
          setPurchasedTickers(new Set(JSON.parse(savedTickers)));
        } catch (e) {
          console.error('Failed to parse purchased tickers:', e);
        }
      }
    }
  }, []);

  // Handle crypto payment
  const handleCryptoPayment = async (productType: 'gems' | 'all_access_ticker', productId: string, amount: number, gemsAmount?: number, modelId?: string) => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/crypto/create-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productType,
          productId,
          amount,
          gemsAmount,
          modelId,
          payCurrency: selectedCurrency,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create crypto payment');
      }
      
      // Redirect to NOWPayments payment page
      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else {
        throw new Error('No payment URL received');
      }
    } catch (error: any) {
      console.error('Crypto payment error:', error);
      alert(`Payment Error: ${error.message || 'Failed to initiate crypto payment. Please try again.'}`);
      setIsLoading(false);
    }
  };

  const handlePurchaseClick = (productType: 'gems' | 'all_access_ticker', productId: string, amount: number, gemsAmount?: number, modelId?: string) => {
    setPendingPurchase({ productType, productId, amount, gemsAmount, modelId });
    setShowCurrencyModal(true);
  };

  const confirmPurchase = () => {
    if (pendingPurchase) {
      setShowCurrencyModal(false);
      localStorage.setItem("preferredCryptoCurrency", selectedCurrency);
      handleCryptoPayment(
        pendingPurchase.productType,
        pendingPurchase.productId,
        pendingPurchase.amount,
        pendingPurchase.gemsAmount,
        pendingPurchase.modelId
      );
      setPendingPurchase(null);
    }
  };

  const isTickerPurchased = (tickerId: string) => purchasedTickers.has(tickerId);

  if (!isLoaded || !isSignedIn) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-purple-950 to-pink-950 text-white">
      {/* Currency Selection Modal */}
      {showCurrencyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-purple-900/90 to-pink-900/90 backdrop-blur-lg rounded-2xl p-8 max-w-md w-full mx-4 border border-purple-500/30">
            <h2 className="text-2xl font-bold mb-4 text-center">Select Cryptocurrency</h2>
            <p className="text-gray-300 text-sm mb-6 text-center">Choose your preferred payment method</p>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              {AVAILABLE_CRYPTO_CURRENCIES.map((currency) => (
                <button
                  key={currency.currency}
                  onClick={() => setSelectedCurrency(currency.currency)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedCurrency === currency.currency
                      ? 'border-pink-500 bg-pink-500/20'
                      : 'border-purple-500/30 hover:border-purple-500/60'
                  }`}
                >
                  <div className="font-bold text-lg">{currency.currency.toUpperCase()}</div>
                  <div className="text-xs text-gray-400">{currency.name}</div>
                  {currency.network && <div className="text-xs text-purple-400">{currency.network}</div>}
                </button>
              ))}
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => {
                  setShowCurrencyModal(false);
                  setPendingPurchase(null);
                }}
                className="flex-1 py-3 bg-gray-600 rounded-full font-bold hover:brightness-110 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmPurchase}
                className="flex-1 py-3 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full font-bold hover:brightness-110 transition"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="p-6 border-b border-purple-500/30 bg-black/40 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div>
            <Link href="/dashboard" className="inline-block mb-2 text-pink-400 hover:text-pink-300 transition">← Back to Dashboard</Link>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">Shop 💎</h1>
            <p className="text-sm text-gray-400 mt-1">💳 Crypto Payments Only</p>
          </div>
          <div className="text-right">
            <p className="text-gray-300">Your Balance</p>
            <p className="text-2xl font-bold text-yellow-400">{balance} 💎 Gems</p>
          </div>
        </div>
      </header>

      {/* Shop Content */}
      <main className="max-w-6xl mx-auto p-6">
        {/* Crypto Payment Info Banner */}
        <div className="mb-8 p-6 bg-gradient-to-r from-blue-900/40 to-purple-900/40 backdrop-blur-lg rounded-2xl border border-blue-500/30">
          <div className="flex items-center gap-4">
            <div className="text-5xl">₿</div>
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-2">Cryptocurrency Payments Accepted</h3>
              <p className="text-gray-300 text-sm">We accept Bitcoin, Ethereum, USDT, USDC, Litecoin, and BNB. Choose your preferred currency at checkout.</p>
            </div>
          </div>
        </div>

        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Special Offers</h2>
            <p className="text-gray-300">Unlock unlimited access to exclusive content</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {allAccessTickers.map((ticker) => {
              const isPurchased = isTickerPurchased(ticker.id);
              const colorScheme = {
                mia: { from: 'yellow', to: 'orange', accent: 'yellow' },
                sakura: { from: 'pink', to: 'purple', accent: 'pink' },
                isabella: { from: 'red', to: 'orange', accent: 'red' },
                riley: { from: 'blue', to: 'cyan', accent: 'blue' },
                aaliyah: { from: 'purple', to: 'pink', accent: 'purple' },
              }[ticker.modelId] || { from: 'pink', to: 'purple', accent: 'pink' };

              return (
                <div key={ticker.id} className={`bg-gradient-to-r from-${colorScheme.from}-900/30 to-${colorScheme.to}-900/30 rounded-2xl p-8 border border-${colorScheme.accent}-500/30`}>
                  <h3 className={`text-2xl font-bold text-${colorScheme.accent}-400 mb-3`}>{ticker.name}</h3>
                  <p className="text-gray-300 mb-6">{ticker.description}</p>
                  <div className="flex justify-between items-center">
                    <span className={`text-3xl font-bold text-${colorScheme.accent}-400`}>${ticker.price}</span>
                    {isPurchased ? (
                      <span className="px-6 py-2 bg-green-500 text-white rounded-full font-bold">Unlocked ✓</span>
                    ) : (
                      <button 
                        onClick={() => handlePurchaseClick('all_access_ticker', ticker.id, ticker.price, undefined, ticker.modelId)} 
                        disabled={isLoading}
                        className={`px-6 py-2 bg-gradient-to-r from-${colorScheme.from}-500 to-${colorScheme.to}-500 rounded-full font-bold hover:brightness-110 transition ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {isLoading ? 'Processing...' : 'Buy with Crypto'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Gem Packages */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">💎 Gem Packages</h2>
          <p className="text-gray-300">Purchase gems with cryptocurrency to unlock photos, videos, and exclusive content</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {gemPackages.map((pkg) => (
            <div key={pkg.id} className={`bg-black/40 backdrop-blur-lg rounded-2xl p-6 border transition-all hover:scale-105 ${pkg.popular ? "border-pink-500 ring-2 ring-pink-500/30" : "border-purple-500/30"}`}>
              {pkg.popular && <div className="text-center mb-2 text-xs font-bold text-pink-400">⭐ MOST POPULAR</div>}
              <h3 className="text-xl font-bold mb-4 text-center">{pkg.name}</h3>
              <div className="text-center mb-4">
                <div className="text-4xl font-bold text-yellow-400">{pkg.gems}</div>
                <div className="text-gray-300">gems</div>
              </div>
              <div className="bg-green-500/20 rounded-lg p-2 mb-4 text-center text-green-400 font-bold">+{pkg.bonus} BONUS</div>
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-white">${pkg.price}</div>
              </div>
              <button 
                onClick={() => handlePurchaseClick('gems', pkg.id, pkg.price, pkg.total)} 
                disabled={isLoading}
                className={`w-full py-3 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full font-bold hover:brightness-110 transition ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isLoading ? 'Processing...' : 'Buy with Crypto'}
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
