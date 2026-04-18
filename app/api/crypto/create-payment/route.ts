// app/api/crypto/create-payment/route.ts
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
import { auth } from '@clerk/nextjs/server';
import { getSupabaseServer } from '@/lib/supabase';
import { nowpaymentsAPI } from '@/lib/nowpayments-api';
import { getProductById } from '@/lib/payment-products';
import { Pool } from 'pg';

export async function POST(req: NextRequest) {
  const tag = '[create-payment]';

  // ─── 1. Env var guard ────────────────────────────────────────────────────
  const requiredEnv = {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
  };
  const missingEnv = Object.entries(requiredEnv)
    .filter(([, v]) => !v)
    .map(([k]) => k);

  if (missingEnv.length > 0) {
    console.error(`${tag} Missing env vars:`, missingEnv);
    return NextResponse.json(
      { error: `Server misconfiguration: missing ${missingEnv.join(', ')}` },
      { status: 500 }
    );
  }

  // ─── 2. Clerk authentication ─────────────────────────────────────────────
  let clerkUserId: string | null = null;
  try {
    const session = await auth();
    clerkUserId = session.userId;
    console.log(`${tag} Clerk auth:`, {
      userId: clerkUserId ?? 'null — user is not signed in',
    });
  } catch (err: any) {
    console.error(`${tag} auth() threw:`, err.message);
    return NextResponse.json(
      { error: `Auth error: ${err.message}` },
      { status: 500 }
    );
  }

  if (!clerkUserId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // ─── 3. Parse + validate request body ────────────────────────────────────
  let body: {
    productType: string;
    productId: string;
    amount: number;
    gemsAmount?: number;
    modelId?: string;
    payCurrency: string;
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { productType, productId, amount, gemsAmount, modelId, payCurrency } = body;

  if (!productType || !productId || !amount || !payCurrency) {
    return NextResponse.json(
      { error: 'Missing required fields: productType, productId, amount, payCurrency' },
      { status: 400 }
    );
  }

  const product = getProductById(productType, productId);
  if (!product) {
    console.error(`${tag} Invalid product:`, { productType, productId });
    return NextResponse.json({ error: 'Invalid product' }, { status: 400 });
  }

  // ─── 4. Supabase: upsert user by clerk_user_id ───────────────────────────
  let supabase: ReturnType<typeof getSupabaseServer>;
  try {
    supabase = getSupabaseServer();
  } catch (err: any) {
    console.error(`${tag} getSupabaseServer threw:`, err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }

  // Direct Postgres connection — bypasses PostgREST and its broken schema cache.
  const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
  let dbUserId: string;
  try {
    const client = await pool.connect();
    try {
      const result = await client.query<{ id: string }>(
        `INSERT INTO public.users (clerk_user_id, username, email, gems_balance, sparks_balance)
         VALUES ($1, 'User', '', 499, 0)
         ON CONFLICT (clerk_user_id) DO UPDATE SET updated_at = NOW()
         RETURNING id`,
        [clerkUserId]
      );
      dbUserId = result.rows[0].id;
      console.log(`${tag} User resolved via direct pg:`, dbUserId);
    } finally {
      client.release();
    }
  } catch (pgErr: any) {
    console.error(`${tag} Direct pg error:`, pgErr.message);
    return NextResponse.json({ error: `DB error: ${pgErr.message}` }, { status: 500 });
  } finally {
    await pool.end();
  }

  // ─── 5. Create payment_transactions record ────────────────────────────────
  const { data: transaction, error: txError } = await supabase
    .from('payment_transactions')
    .insert({
      user_id: dbUserId,
      product_type: productType,
      product_id: productId,
      amount_usd: amount,
      gems_amount: gemsAmount ?? 0,
      sparks_amount: 0,
      model_id: modelId ?? null,
      status: 'pending',
      payment_method: 'crypto',
      metadata: { product_name: product.name, pay_currency: payCurrency },
    })
    .select()
    .single();

  if (txError) {
    console.error(`${tag} DB error creating transaction:`, {
      code: txError.code,
      message: txError.message,
      hint: txError.hint,
    });
    return NextResponse.json(
      { error: `Failed to create transaction (${txError.code}): ${txError.message}` },
      { status: 500 }
    );
  }

  console.log(`${tag} Transaction created:`, transaction.id);

  // ─── 6. Call NOWPayments ──────────────────────────────────────────────────
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  let cryptoPayment: any;
  try {
    cryptoPayment = await nowpaymentsAPI.createPayment({
      price_amount: amount,
      price_currency: 'usd',
      pay_currency: payCurrency,
      order_id: transaction.id,
      order_description: `${product.name} - PulseMate`,
      ipn_callback_url: `${appUrl}/api/crypto/ipn`,
      success_url: `${appUrl}/shop/crypto-success?order_id=${transaction.id}`,
      cancel_url: `${appUrl}/shop`,
    });
    console.log(`${tag} NOWPayments response:`, JSON.stringify(cryptoPayment, null, 2));
  } catch (apiErr: any) {
    console.error(`${tag} NOWPayments error:`, apiErr.message);
    await supabase
      .from('payment_transactions')
      .update({ status: 'failed' })
      .eq('id', transaction.id);
    return NextResponse.json(
      { error: `Payment provider error: ${apiErr.message}` },
      { status: 500 }
    );
  }

  const paymentUrl = cryptoPayment.payment_url || cryptoPayment.invoice_url;
  const paymentId = cryptoPayment.payment_id || cryptoPayment.invoice_id;

  if (!paymentUrl) {
    console.error(`${tag} NOWPayments returned no URL:`, cryptoPayment);
    await supabase
      .from('payment_transactions')
      .update({ status: 'failed' })
      .eq('id', transaction.id);
    return NextResponse.json(
      { error: 'Payment provider did not return a payment URL' },
      { status: 500 }
    );
  }

  // ─── 7. Update transaction with NOWPayments payment ID ───────────────────
  await supabase
    .from('payment_transactions')
    .update({
      stripe_session_id: paymentId,
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

  console.log(`${tag} Done. paymentUrl:`, paymentUrl);

  // ─── 8. Return response ───────────────────────────────────────────────────
  return NextResponse.json({
    success: true,
    paymentUrl,
    paymentId,
    payAddress: cryptoPayment.pay_address,
    payAmount: cryptoPayment.pay_amount,
    payCurrency: cryptoPayment.pay_currency,
    orderId: transaction.id,
  });
}
