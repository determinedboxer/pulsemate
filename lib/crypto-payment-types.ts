// lib/crypto-payment-types.ts

export interface CryptoPaymentRequest {
  price_amount: number;
  price_currency: string;
  pay_currency?: string;
  order_id: string;
  order_description: string;
  ipn_callback_url: string;
  success_url: string;
  cancel_url: string;
}

export interface CryptoPaymentResponse {
  payment_id?: string;
  invoice_id?: string;
  payment_status: string;
  pay_address: string;
  price_amount: number;
  price_currency: string;
  pay_amount: number;
  pay_currency: string;
  order_id: string;
  order_description: string;
  purchase_id?: string;
  created_at: string;
  updated_at: string;
  payment_url?: string;
  invoice_url?: string;
}

export interface CryptoPaymentStatus {
  payment_id: string;
  payment_status: 'waiting' | 'confirming' | 'confirmed' | 'sending' | 'partially_paid' | 'finished' | 'failed' | 'refunded' | 'expired';
  pay_address: string;
  price_amount: number;
  price_currency: string;
  pay_amount: number;
  actually_paid: number;
  pay_currency: string;
  order_id: string;
  order_description: string;
  purchase_id: string;
  outcome_amount: number;
  outcome_currency: string;
}

export interface CryptoIPNPayload {
  payment_id: string;
  payment_status: string;
  pay_address: string;
  price_amount: number;
  price_currency: string;
  pay_amount: number;
  actually_paid: number;
  pay_currency: string;
  order_id: string;
  order_description: string;
  purchase_id: string;
  outcome_amount: number;
  outcome_currency: string;
  created_at: string;
  updated_at: string;
}

export interface AvailableCurrency {
  currency: string;
  name: string;
  network?: string;
}

export const AVAILABLE_CRYPTO_CURRENCIES: AvailableCurrency[] = [
  { currency: 'btc', name: 'Bitcoin' },
  { currency: 'eth', name: 'Ethereum' },
  { currency: 'usdttrc20', name: 'USDT (TRC20)', network: 'Tron' },
  { currency: 'usdc', name: 'USD Coin' },
  { currency: 'ltc', name: 'Litecoin' },
  { currency: 'bnb', name: 'BNB (BSC)', network: 'Binance Smart Chain' },
];
