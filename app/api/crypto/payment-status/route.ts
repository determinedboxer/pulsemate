// app/api/crypto/payment-status/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth as clerkAuth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';
import { nowpaymentsAPI } from '@/lib/nowpayments-api';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
  try {
    const { userId: clerkUserId } = await clerkAuth();

    if (!clerkUserId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const searchParams = req.nextUrl.searchParams;
    const orderId = searchParams.get('order_id');
    const paymentId = searchParams.get('payment_id');

    if (!orderId && !paymentId) {
      return NextResponse.json(
        { error: 'order_id or payment_id required' },
        { status: 400 }
      );
    }

    // Get transaction from database
    let query = supabase
      .from('payment_transactions')
      .select('*');

    if (orderId) {
      query = query.eq('id', orderId);
    } else if (paymentId) {
      query = query.eq('stripe_session_id', paymentId); // Crypto payment ID stored here
    }

    const { data: transaction, error: txError } = await query.single();

    if (txError) {
      console.error('Transaction not found:', txError);
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      );
    }

    // Verify user owns this transaction
    const { data: dbUser } = await supabase
      .from('users')
      .select('id')
      .eq('clerk_user_id', clerkUserId)
      .single();

    if (!dbUser || dbUser.id !== transaction.user_id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Get live status from NOWPayments
    const cryptoPaymentId = transaction.stripe_session_id;
    let liveStatus = null;

    if (cryptoPaymentId) {
      try {
        liveStatus = await nowpaymentsAPI.getPaymentStatus(cryptoPaymentId);
      } catch (error) {
        console.error('Failed to fetch live payment status:', error);
      }
    }

    return NextResponse.json({
      orderId: transaction.id,
      paymentId: cryptoPaymentId,
      status: transaction.status,
      productType: transaction.product_type,
      productId: transaction.product_id,
      amount: transaction.amount_usd,
      gemsAmount: transaction.gems_amount,
      modelId: transaction.model_id,
      paymentMethod: transaction.payment_method,
      createdAt: transaction.created_at,
      completedAt: transaction.completed_at,
      metadata: transaction.metadata,
      liveStatus: liveStatus ? {
        paymentStatus: liveStatus.payment_status,
        payAddress: liveStatus.pay_address,
        payAmount: liveStatus.pay_amount,
        actuallyPaid: liveStatus.actually_paid,
        payCurrency: liveStatus.pay_currency,
      } : null,
    });
  } catch (error) {
    console.error('Payment status error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch payment status' },
      { status: 500 }
    );
  }
}
