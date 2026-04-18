import { auth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs'; // force Node.js runtime (not Edge)

export async function GET() {
  const { userId } = await auth();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? '';

  // ── 1. Validate URL format ──────────────────────────────────────────────
  let urlParsed: URL | null = null;
  let urlError: string | null = null;
  try {
    urlParsed = new URL(url);
  } catch (e: any) {
    urlError = e.message;
  }

  // ── 2. Raw fetch to Supabase REST endpoint (no SDK, no auth) ───────────
  // This tells us if there's a basic network/DNS issue before the SDK gets involved.
  let rawFetch: Record<string, unknown> = {};
  if (urlParsed) {
    const testUrl = `${url}/rest/v1/`;
    try {
      const res = await fetch(testUrl, {
        headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` },
        signal: AbortSignal.timeout(8000),
      });
      rawFetch = {
        ok: res.ok,
        status: res.status,
        statusText: res.statusText,
        bodySnippet: (await res.text()).slice(0, 200),
      };
    } catch (e: any) {
      rawFetch = {
        ok: false,
        errorName: e.name,
        errorMessage: e.message,
        errorCause: e.cause ? String(e.cause) : null,
      };
    }
  } else {
    rawFetch = { skipped: 'URL invalid, cannot attempt fetch' };
  }

  // ── 3. SDK client test ──────────────────────────────────────────────────
  let sdkResult: Record<string, unknown> = {};
  try {
    if (!url || !serviceKey) throw new Error('Missing env vars');
    const supabase = createClient(url, serviceKey, {
      auth: { persistSession: false },
    });
    const { data, error } = await supabase
      .from('users')
      .select('id')
      .limit(1);
    sdkResult = {
      ok: !error,
      data,
      error: error
        ? { code: error.code, message: error.message, hint: error.hint, details: error.details }
        : null,
    };
  } catch (e: any) {
    sdkResult = {
      ok: false,
      threwName: e.name,
      threwMessage: e.message,
      threwCause: e.cause ? String(e.cause) : null,
    };
  }

  // ── 4. Confirm clerk_user_id column exists in users via information_schema ─
  let columnCheck: Record<string, unknown> = {};
  try {
    if (url && serviceKey) {
      const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });
      // information_schema.columns is accessible with service role
      const { data, error } = await supabase
        .from('information_schema.columns' as any)
        .select('column_name,data_type')
        .eq('table_schema', 'public')
        .eq('table_name', 'users')
        .order('ordinal_position' as any);
      columnCheck = {
        ok: !error,
        usersColumns: data ?? null,
        clerkUserIdPresent: Array.isArray(data)
          ? data.some((c: any) => c.column_name === 'clerk_user_id')
          : null,
        error: error ? { code: error.code, message: error.message } : null,
      };
    }
  } catch (e: any) {
    columnCheck = { threwMessage: e.message };
  }

  // ── 5. Check payment_transactions table exists ──────────────────────────
  let txTableResult: Record<string, unknown> = {};
  try {
    if (url && serviceKey) {
      const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });
      const { data, error } = await supabase
        .from('payment_transactions')
        .select('id')
        .limit(1);
      txTableResult = {
        ok: !error,
        data,
        error: error
          ? { code: error.code, message: error.message }
          : null,
      };
    }
  } catch (e: any) {
    txTableResult = { threwMessage: e.message };
  }

  return Response.json({
    timestamp: new Date().toISOString(),
    runtime: process.version,

    clerk: {
      ok: !!userId,
      userId: userId ?? null,
    },

    env: {
      NEXT_PUBLIC_SUPABASE_URL: url
        ? `SET — host: ${urlParsed?.host ?? 'INVALID'}, protocol: ${urlParsed?.protocol ?? '?'}`
        : 'MISSING',
      urlValidFormat: urlError ? `INVALID: ${urlError}` : 'OK',
      // Show first 20 chars of key to confirm it's the right key type without leaking it
      SUPABASE_SERVICE_ROLE_KEY: serviceKey
        ? `SET (len=${serviceKey.length}, prefix="${serviceKey.slice(0, 20)}…")`
        : 'MISSING',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: anonKey ? `SET (len=${anonKey.length})` : 'MISSING',
      CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY
        ? `SET (len=${process.env.CLERK_SECRET_KEY.length})`
        : 'MISSING',
    },

    diagnostics: {
      rawFetch,
      sdkUsersTable: sdkResult,
      usersTableColumns: columnCheck,   // clerkUserIdPresent must be true
      sdkPaymentTransactionsTable: txTableResult,
    },
  });
}
