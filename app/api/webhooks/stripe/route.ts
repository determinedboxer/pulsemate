// app/api/webhooks/stripe/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { headers } from 'next/headers';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-02-25.clover',
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const headersList = await headers();
    const signature = headersList.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'No signature' },
        { status: 400 }
      );
    }

    // Verify webhook signature
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case 'payment_intent.succeeded':
        await handlePaymentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;

      case 'payment_intent.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.PaymentIntent);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  try {
    const transactionId = session.metadata?.transaction_id;
    const productType = session.metadata?.product_type;
    const gemsAmount = parseInt(session.metadata?.gems_amount || '0');
    const modelId = session.metadata?.model_id;
    const userId = session.metadata?.user_id;

    if (!transactionId || !userId) {
      console.error('Missing transaction ID or user ID in metadata');
      return;
    }

    // Update transaction status
    const { error: transactionError } = await supabase
      .from('payment_transactions')
      .update({
        stripe_payment_intent_id: session.payment_intent as string,
        status: 'completed',
        payment_method: session.payment_method_types?.[0] || 'card',
        completed_at: new Date().toISOString(),
      })
      .eq('id', transactionId);

    if (transactionError) {
      console.error('Failed to update transaction:', transactionError);
      return;
    }

    // Process based on product type
    if (productType === 'gems') {
      // Add gems to user balance
      const { error: gemsError } = await supabase.rpc('add_gems_to_balance', {
        p_user_id: userId,
        p_gems_amount: gemsAmount,
      });

      if (gemsError) {
        // Fallback: Update gems manually
        const { data: currentUser } = await supabase
          .from('users')
          .select('gems_balance')
          .eq('id', userId)
          .single();

        if (currentUser) {
          await supabase
            .from('users')
            .update({ gems_balance: (currentUser.gems_balance || 0) + gemsAmount })
            .eq('id', userId);
        }
      }
    } else if (productType === 'all_access_ticker' && modelId) {
      // Create purchase record for all-access ticker
      const { error: purchaseError } = await supabase
        .from('purchases')
        .insert({
          user_id: userId,
          transaction_id: transactionId,
          purchase_type: 'all_access_ticker',
          model_id: modelId,
          price_usd: (session.amount_total || 0) / 100, // Convert from cents
          is_active: true,
        });

      if (purchaseError) {
        console.error('Failed to create purchase record:', purchaseError);
      }
    }

    console.log('Payment processed successfully:', transactionId);
  } catch (error) {
    console.error('Error handling checkout completed:', error);
  }
}

async function handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  try {
    // Update transaction by payment intent ID
    const { error } = await supabase
      .from('payment_transactions')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
      })
      .eq('stripe_payment_intent_id', paymentIntent.id);

    if (error) {
      console.error('Failed to update transaction on payment success:', error);
    }
  } catch (error) {
    console.error('Error handling payment succeeded:', error);
  }
}

async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
  try {
    // Update transaction status to failed
    const { error } = await supabase
      .from('payment_transactions')
      .update({
        status: 'failed',
      })
      .eq('stripe_payment_intent_id', paymentIntent.id);

    if (error) {
      console.error('Failed to update transaction on payment failure:', error);
    }
  } catch (error) {
    console.error('Error handling payment failed:', error);
  }
}
