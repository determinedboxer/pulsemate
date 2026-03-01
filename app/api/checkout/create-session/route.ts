// app/api/checkout/create-session/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth as clerkAuth } from '@clerk/nextjs/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { CheckoutSessionRequest } from '@/lib/payment-types';
import { getProductById } from '@/lib/payment-products';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-02-25.clover',
});

// Initialize Supabase
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
    const body: CheckoutSessionRequest = await req.json();
    const { productType, productId, amount, gemsAmount, sparksAmount, modelId } = body;

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
        sparks_amount: sparksAmount || 0,
        model_id: modelId,
        status: 'pending',
        metadata: {
          product_name: product.name,
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

    // Create Stripe checkout session
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const successUrl = body.successUrl || `${appUrl}/shop/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = body.cancelUrl || `${appUrl}/shop`;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: product.name,
              description: 'description' in product ? product.description : `${gemsAmount} gems package`,
              metadata: {
                product_type: productType,
                product_id: productId,
              },
            },
            unit_amount: Math.round(amount * 100), // Stripe uses cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      client_reference_id: dbUserId,
      metadata: {
        transaction_id: transaction.id,
        product_type: productType,
        product_id: productId,
        gems_amount: gemsAmount?.toString() || '0',
        sparks_amount: sparksAmount?.toString() || '0',
        model_id: modelId || '',
        user_id: dbUserId,
      },
    });

    // Update transaction with Stripe session ID
    await supabase
      .from('payment_transactions')
      .update({
        stripe_session_id: session.id,
        status: 'processing',
      })
      .eq('id', transaction.id);

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
