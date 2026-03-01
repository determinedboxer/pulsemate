// app/api/crypto/test/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { nowpaymentsAPI } from '@/lib/nowpayments-api';

export async function GET(req: NextRequest) {
  try {
    // Test 1: Check if API key is loaded
    const apiKeyExists = !!process.env.NOWPAYMENTS_API_KEY;
    const ipnSecretExists = !!process.env.NOWPAYMENTS_IPN_SECRET;

    // Test 2: Try to get API status
    let apiStatus = null;
    let apiStatusError = null;
    try {
      const response = await fetch('https://api.nowpayments.io/v1/status', {
        headers: {
          'x-api-key': process.env.NOWPAYMENTS_API_KEY!,
        },
      });
      apiStatus = {
        status: response.status,
        statusText: response.statusText,
        data: response.ok ? await response.json() : await response.text(),
      };
    } catch (error: any) {
      apiStatusError = error.message;
    }

    // Test 3: Try to get available currencies
    let currencies = null;
    let currenciesError = null;
    try {
      currencies = await nowpaymentsAPI.getAvailableCurrencies();
    } catch (error: any) {
      currenciesError = error.message;
    }

    // Test 4: Try to get minimum payment amount
    let minAmount = null;
    let minAmountError = null;
    try {
      minAmount = await nowpaymentsAPI.getMinimumPaymentAmount('usd', 'btc');
    } catch (error: any) {
      minAmountError = error.message;
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      config: {
        apiKeyExists,
        ipnSecretExists,
        apiKeyPreview: process.env.NOWPAYMENTS_API_KEY ? 
          `${process.env.NOWPAYMENTS_API_KEY.substring(0, 8)}...${process.env.NOWPAYMENTS_API_KEY.slice(-4)}` : 'missing',
      },
      tests: {
        apiStatus: {
          success: !!apiStatus,
          data: apiStatus,
          error: apiStatusError,
        },
        currencies: {
          success: !!currencies,
          data: currencies?.slice(0, 10), // Show first 10 currencies
          count: currencies?.length,
          error: currenciesError,
        },
        minAmount: {
          success: !!minAmount,
          data: minAmount,
          error: minAmountError,
        },
      },
      recommendations: [
        !apiKeyExists && 'Add NOWPAYMENTS_API_KEY to .env.local',
        !ipnSecretExists && 'Add NOWPAYMENTS_IPN_SECRET to .env.local',
        apiStatusError && 'API key might be invalid - check NOWPayments dashboard',
        currenciesError && 'Cannot fetch currencies - verify API key has correct permissions',
      ].filter(Boolean),
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack,
    }, { status: 500 });
  }
}
