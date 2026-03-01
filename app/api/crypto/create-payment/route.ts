// app/api/crypto/create-payment/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth as clerkAuth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';
import { nowpaymentsAPI } from '@/lib/nowpayments-api';
import { getProductById } from '@/lib/payment-products';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    // Authenticate user
    const { userId: clerkUserId } = await clerkAuth();

    if (!clerkUserId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get or create user in database
    const { data: dbUser, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('clerk_user_id', clerkUserId)
      .single();

    if (userError && userError.code !== 'PGRST116') {
      console.error('Database error:', userError);
      return NextResponse.json(
        { error: 'Failed to fetch user' },
        { status: 500 }
      );
    }

    let dbUserId = dbUser?.id;

    // Create user if doesn't exist
    if (!dbUserId) {
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert({
          clerk_user_id: clerkUserId,
          username: 'User',
          email: '',
        })
        .select('id')
        .single();

      if (createError) {
        console.error('Failed to create user:', createError);
        return NextResponse.json(
          { error: 'Failed to create user' },
          { status: 500 }
        );
      }

      dbUserId = newUser.id;
    }

    // Parse request body
    const body = await req.json();
    const { productType, productId, amount, gemsAmount, modelId, payCurrency } = body;

    // Validate product
    const product = getProductById(productType, productId);
    if (!product) {
      return NextResponse.json(
        { error: 'Invalid product' },
        { status: 400 }
      );
    }

    // Create payment transaction record
    const { data: transaction, error: transactionError } = await supabase
      .from('payment_transactions')
      .insert({
        user_id: dbUserId,
        product_type: productType,
        product_id: productId,
        amount_usd: amount,
        gems_amount: gemsAmount || 0,
        sparks_amount: 0,
        model_id: modelId,
        status: 'pending',
        payment_method: 'crypto',
        metadata: {
          product_name: product.name,
          pay_currency: payCurrency,
        },
      })
      .select()
      .single();

    if (transactionError) {
      console.error('Transaction creation error:', transactionError);
      return NextResponse.json(
        { error: 'Failed to create transaction' },
        { status: 500 }
      );
    }

    // Create NOWPayments payment
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const paymentRequest = {
      price_amount: amount,
      price_currency: 'usd',
      pay_currency: payCurrency,
      order_id: transaction.id,
      order_description: `${product.name} - PulseMate`,
      ipn_callback_url: `${appUrl}/api/crypto/ipn`,
      success_url: `${appUrl}/shop/crypto-success?order_id=${transaction.id}`,
      cancel_url: `${appUrl}/shop`,
    };

    let cryptoPayment;
    try {
      cryptoPayment = await nowpaymentsAPI.createPayment(paymentRequest);
      console.log('NOWPayments response:', JSON.stringify(cryptoPayment, null, 2));
    } catch (apiError: any) {
      console.error('NOWPayments API error:', apiError);
      
      // Update transaction as failed
      await supabase
        .from('payment_transactions')
        .update({ status: 'failed' })
        .eq('id', transaction.id);
      
      return NextResponse.json(
        { error: `Payment provider error: ${apiError.message}` },
        { status: 500 }
      );
    }

    // Validate response
    const paymentUrl = cryptoPayment.payment_url || cryptoPayment.invoice_url;
    const paymentId = cryptoPayment.payment_id || cryptoPayment.invoice_id;
    
    if (!cryptoPayment || !paymentUrl) {
      console.error('Invalid NOWPayments response - missing payment/invoice URL:', cryptoPayment);
      
      await supabase
        .from('payment_transactions')
        .update({ status: 'failed' })
        .eq('id', transaction.id);
      
      return NextResponse.json(
        { error: 'Payment provider did not return a payment URL. Please check your NOWPayments account status.' },
        { status: 500 }
      );
    }

    // Update transaction with crypto payment ID
    await supabase
      .from('payment_transactions')
      .update({
        stripe_session_id: paymentId, // Reuse this field for crypto payment ID
        status: 'processing',
        metadata: {
          ...transaction.metadata,
          payment_id: paymentId,
          invoice_id: cryptoPayment.invoice_id,
          pay_address: cryptoPayment.pay_address,
          pay_amount: cryptoPayment.pay_amount,
          pay_currency: cryptoPayment.pay_currency,
        },
      })
      .eq('id', transaction.id);

    return NextResponse.json({
      paymentId: paymentId,
      paymentUrl: paymentUrl,
      payAddress: cryptoPayment.pay_address,
      payAmount: cryptoPayment.pay_amount,
      payCurrency: cryptoPayment.pay_currency,
      orderId: transaction.id,
    });
  } catch (error: any) {
    console.error('Crypto payment creation error:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });
    return NextResponse.json(
      { error: error.message || 'Failed to create crypto payment' },
      { status: 500 }
    );
  }
}
