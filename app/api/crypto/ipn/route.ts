// app/api/crypto/ipn/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';
import { CryptoIPNPayload } from '@/lib/crypto-payment-types';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const IPN_SECRET = process.env.NOWPAYMENTS_IPN_SECRET!;

function verifyIPNSignature(payload: string, signature: string): boolean {
  const hmac = crypto.createHmac('sha512', IPN_SECRET);
  hmac.update(payload);
  const expectedSignature = hmac.digest('hex');
  return expectedSignature === signature;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get('x-nowpayments-sig');

    if (!signature) {
      console.error('Missing IPN signature');
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 400 }
      );
    }

    // Verify signature
    if (!verifyIPNSignature(body, signature)) {
      console.error('Invalid IPN signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 403 }
      );
    }

    const ipnData: CryptoIPNPayload = JSON.parse(body);
    const { payment_id, payment_status, order_id, actually_paid, pay_currency } = ipnData;

    console.log('IPN received:', { payment_id, payment_status, order_id });

    // Get transaction
    const { data: transaction, error: txError } = await supabase
      .from('payment_transactions')
      .select('*')
      .eq('id', order_id)
      .single();

    if (txError) {
      console.error('Transaction not found:', txError);
      return NextResponse.json({ received: true });
    }

    // Update transaction based on payment status
    let newStatus = transaction.status;
    let shouldUpdateBalance = false;

    switch (payment_status) {
      case 'finished':
        newStatus = 'completed';
        shouldUpdateBalance = true;
        break;
      case 'confirmed':
      case 'sending':
        newStatus = 'processing';
        break;
      case 'failed':
      case 'expired':
      case 'refunded':
        newStatus = 'failed';
        break;
      default:
        newStatus = 'pending';
    }

    // Update transaction
    await supabase
      .from('payment_transactions')
      .update({
        status: newStatus,
        completed_at: payment_status === 'finished' ? new Date().toISOString() : transaction.completed_at,
        metadata: {
          ...transaction.metadata,
          payment_status,
          actually_paid,
          pay_currency,
          ipn_received_at: new Date().toISOString(),
        },
      })
      .eq('id', order_id);

    // Process payment if finished
    if (shouldUpdateBalance && transaction.product_type === 'gems') {
      const { data: currentUser } = await supabase
        .from('users')
        .select('gems_balance')
        .eq('id', transaction.user_id)
        .single();

      if (currentUser) {
        await supabase
          .from('users')
          .update({
            gems_balance: (currentUser.gems_balance || 0) + transaction.gems_amount,
          })
          .eq('id', transaction.user_id);
      }
    } else if (shouldUpdateBalance && transaction.product_type === 'all_access_ticker' && transaction.model_id) {
      // Create purchase record
      await supabase
        .from('purchases')
        .insert({
          user_id: transaction.user_id,
          transaction_id: transaction.id,
          purchase_type: 'all_access_ticker',
          model_id: transaction.model_id,
          price_usd: transaction.amount_usd,
          is_active: true,
        });
    }

    console.log('IPN processed successfully:', { order_id, payment_status, newStatus });

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('IPN processing error:', error);
    return NextResponse.json(
      { error: 'IPN processing failed' },
      { status: 500 }
    );
  }
}
