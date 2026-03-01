// lib/payment-types.ts

export interface GemPackage {
  id: string;
  name: string;
  gems: number;
  bonus: number;
  total: number;
  price: number;
  popular?: boolean;
  vip?: boolean;
  stripeProductId?: string;
  stripePriceId?: string;
}

export interface AllAccessTicker {
  id: string;
  name: string;
  modelId: string;
  price: number;
  description: string;
  stripeProductId?: string;
  stripePriceId?: string;
}

export interface SparksPackage {
  id: string;
  name: string;
  sparks: number;
  gemsRequired: number;
  popular?: boolean;
}

export type ProductType = 'gems' | 'all_access_ticker' | 'sparks';
export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';

export interface PaymentTransaction {
  id: string;
  userId: string;
  stripeSessionId?: string;
  stripePaymentIntentId?: string;
  productType: ProductType;
  productId: string;
  amountUsd: number;
  gemsAmount?: number;
  sparksAmount?: number;
  modelId?: string;
  status: PaymentStatus;
  paymentMethod?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  completedAt?: Date;
  updatedAt: Date;
}

export interface Purchase {
  id: string;
  userId: string;
  transactionId?: string;
  purchaseType: 'all_access_ticker' | 'permanent_unlock';
  modelId?: string;
  contentId?: string;
  priceUsd: number;
  isActive: boolean;
  purchasedAt: Date;
  expiresAt?: Date;
}

export interface CheckoutSessionRequest {
  productType: ProductType;
  productId: string;
  amount: number;
  gemsAmount?: number;
  sparksAmount?: number;
  modelId?: string;
  successUrl?: string;
  cancelUrl?: string;
}

export interface CheckoutSessionResponse {
  sessionId: string;
  url: string;
}
