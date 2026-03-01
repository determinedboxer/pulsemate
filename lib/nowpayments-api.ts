// lib/nowpayments-api.ts
import { CryptoPaymentRequest, CryptoPaymentResponse, CryptoPaymentStatus } from './crypto-payment-types';

const NOWPAYMENTS_API_URL = 'https://api.nowpayments.io/v1';
const API_KEY = process.env.NOWPAYMENTS_API_KEY!;

export class NOWPaymentsAPI {
  private apiKey: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || API_KEY;
  }

  private async makeRequest(endpoint: string, method: string = 'GET', body?: any) {
    console.log('NOWPayments API Request:', {
      endpoint,
      method,
      body,
      apiKeyExists: !!this.apiKey,
      apiKeyPrefix: this.apiKey ? this.apiKey.substring(0, 8) : 'missing',
    });

    const headers: HeadersInit = {
      'x-api-key': this.apiKey,
      'Content-Type': 'application/json',
    };

    const options: RequestInit = {
      method,
      headers,
    };

    if (body && method !== 'GET') {
      options.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(`${NOWPAYMENTS_API_URL}${endpoint}`, options);

      console.log('NOWPayments API Response:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('NOWPayments API Error Response:', errorText);
        throw new Error(`NOWPayments API Error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('NOWPayments API Success:', data);
      return data;
    } catch (error: any) {
      console.error('NOWPayments API Request Failed:', {
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  async createPayment(request: CryptoPaymentRequest): Promise<CryptoPaymentResponse> {
    // NOWPayments requires invoice endpoint for creating payments
    return this.makeRequest('/invoice', 'POST', request);
  }

  async getPaymentStatus(paymentId: string): Promise<CryptoPaymentStatus> {
    return this.makeRequest(`/payment/${paymentId}`);
  }

  async getAvailableCurrencies(): Promise<string[]> {
    const response = await this.makeRequest('/currencies');
    return response.currencies || [];
  }

  async getEstimatedPrice(amount: number, currency_from: string, currency_to: string): Promise<{ estimated_amount: number }> {
    return this.makeRequest(`/estimate?amount=${amount}&currency_from=${currency_from}&currency_to=${currency_to}`);
  }

  async getMinimumPaymentAmount(currency_from: string, currency_to: string): Promise<{ min_amount: number }> {
    return this.makeRequest(`/min-amount?currency_from=${currency_from}&currency_to=${currency_to}`);
  }
}

export const nowpaymentsAPI = new NOWPaymentsAPI();
