// lib/payment-products.ts
import { GemPackage, AllAccessTicker } from './payment-types';

// Gem packages configuration
export const gemPackages: GemPackage[] = [
  {
    id: 'starter',
    name: 'Starter Pack',
    gems: 500,
    bonus: 100,
    total: 600,
    price: 4.99,
  },
  {
    id: 'popular',
    name: 'Popular Pack',
    gems: 1500,
    bonus: 500,
    total: 2000,
    price: 14.99,
    popular: true,
  },
  {
    id: 'best_value',
    name: 'Best Value',
    gems: 3000,
    bonus: 1500,
    total: 4500,
    price: 29.99,
  },
  {
    id: 'vip',
    name: 'VIP Pack',
    gems: 10000,
    bonus: 5000,
    total: 15000,
    price: 99.99,
    vip: true,
  },
];

// All-Access Tickers configuration
export const allAccessTickers: AllAccessTicker[] = [
  {
    id: 'mia_all_access',
    name: 'Mia All-Access Ticker',
    modelId: 'mia',
    price: 49.99,
    description: 'Unlock every photo and future content from Mia forever',
  },
  {
    id: 'sakura_all_access',
    name: 'Sakura All-Access Ticker 🌸',
    modelId: 'sakura',
    price: 49.99,
    description: 'Unlock every photo and future content from Sakura forever',
  },
  {
    id: 'isabella_all_access',
    name: 'Isabella All-Access Ticker 🔥',
    modelId: 'isabella',
    price: 49.99,
    description: 'Unlock every photo and future content from Isabella forever',
  },
  {
    id: 'riley_all_access',
    name: 'Riley All-Access Ticker 🎮',
    modelId: 'riley',
    price: 49.99,
    description: 'Unlock every photo and future content from Riley forever',
  },
  {
    id: 'aaliyah_all_access',
    name: 'Aaliyah All-Access Ticker 🍾',
    modelId: 'aaliyah',
    price: 49.99,
    description: 'Unlock every photo and future content from Aaliyah forever',
  },
];

// Helper functions
export function getGemPackageById(id: string): GemPackage | undefined {
  return gemPackages.find(pkg => pkg.id === id);
}

export function getAllAccessTickerById(id: string): AllAccessTicker | undefined {
  return allAccessTickers.find(ticker => ticker.id === id);
}

export function getProductById(productType: string, productId: string): GemPackage | AllAccessTicker | undefined {
  if (productType === 'gems') {
    return getGemPackageById(productId);
  } else if (productType === 'all_access_ticker') {
    return getAllAccessTickerById(productId);
  }
  return undefined;
}
