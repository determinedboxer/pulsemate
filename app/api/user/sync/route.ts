import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabase';

export async function POST() {
  const tag = '[user/sync]';

  // ─── Clerk auth ───────────────────────────────────────────────────────────
  let userId: string | null = null;
  try {
    const session = await auth();
    userId = session.userId;
  } catch (err: any) {
    console.error(`${tag} auth() threw:`, err.message);
    return NextResponse.json({ error: `Auth error: ${err.message}` }, { status: 500 });
  }

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // ─── Supabase ─────────────────────────────────────────────────────────────
  let supabase: ReturnType<typeof getSupabaseServer>;
  try {
    supabase = getSupabaseServer();
  } catch (err: any) {
    console.error(`${tag} getSupabaseServer threw:`, err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }

  // Check if user already exists
  const { data: existingUser, error: fetchError } = await supabase
    .from('users')
    .select('*')
    .eq('clerk_user_id', userId)
    .single();

  if (fetchError && fetchError.code !== 'PGRST116') {
    console.error(`${tag} DB error fetching user:`, {
      code: fetchError.code,
      message: fetchError.message,
      hint: fetchError.hint,
    });
    return NextResponse.json(
      { error: `DB error (${fetchError.code}): ${fetchError.message}` },
      { status: 500 }
    );
  }

  if (existingUser) {
    return NextResponse.json({ user: existingUser, isNew: false });
  }

  // Create new user
  const { data: newUsers, error: insertError } = await supabase
    .from('users')
    .insert({ clerk_user_id: userId, gems_balance: 499, sparks_balance: 0 })
    .select();

  if (insertError) {
    console.error(`${tag} DB error creating user:`, {
      code: insertError.code,
      message: insertError.message,
      hint: insertError.hint,
    });
    return NextResponse.json(
      { error: `Failed to create user (${insertError.code}): ${insertError.message}` },
      { status: 500 }
    );
  }

  const newUser = newUsers?.[0] ?? null;

  if (newUser?.id) {
    const { error: statsError } = await supabase
      .from('user_stats')
      .insert({ user_id: newUser.id });

    if (statsError) {
      // Non-fatal — log but don't fail the sync
      console.warn(`${tag} Failed to create user_stats:`, statsError.message);
    }
  }

  return NextResponse.json({ user: newUser, isNew: true });
}
