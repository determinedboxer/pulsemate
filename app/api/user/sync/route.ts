import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabase';

export async function POST() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = getSupabaseServer();

    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('clerk_user_id', userId)
      .single();

    if (existingUser) {
      return NextResponse.json({ user: existingUser, isNew: false });
    }

    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert({ clerk_user_id: userId, gems_balance: 499, sparks_balance: 0 })
      .select();

    if (insertError) {
      return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
    }

    if (newUser && newUser.length > 0) {
      await supabase.from('user_stats').insert({ user_id: newUser[0].id });
    }

    return NextResponse.json({ user: newUser ? newUser[0] : null, isNew: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
