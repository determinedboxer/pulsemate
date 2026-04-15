import { auth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  const { userId } = await auth();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  let connectionResult = null;
  let errorDetails = null;

  try {
    if (!url || !serviceKey) {
      throw new Error(`Missing env vars. URL: ${!!url}, ServiceKey: ${!!serviceKey}`);
    }

    const supabase = createClient(url, serviceKey, {
      auth: { persistSession: false },
      global: {
        headers: { 'X-Client-Info': 'pulse-mate-debug' }
      }
    });

    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);

    connectionResult = {
      success: !error,
      data: data,
      error: error ? {
        code: error.code,
        message: error.message,
        hint: error.hint,
        details: error.details
      } : null
    };

  } catch (e: any) {
    errorDetails = {
      name: e.name,
      message: e.message,
      stack: e.stack ? e.stack.substring(0, 400) : null
    };
  }

  return Response.json({
    timestamp: new Date().toISOString(),
    clerk: {
      ok: !!userId,
      userId: userId || null
    },
    env: {
      NEXT_PUBLIC_SUPABASE_URL: url ? "SET" : "MISSING",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: anonKey ? "SET" : "MISSING",
      SUPABASE_SERVICE_ROLE_KEY: serviceKey ? `SET (len=${serviceKey.length})` : "MISSING"
    },
    supabase: {
      connectionAttempt: errorDetails ? "FAILED" : "OK",
      testQuery: connectionResult,
      rawError: errorDetails
    }
  });
}
