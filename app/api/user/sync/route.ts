import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';

export async function POST() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: existingUser } = await supabaseServer
      .from('users')
      .select('*')
      .eq('clerk_user_id', userId)
      .single();

    if (existingUser) {
      return NextResponse.json({ user: existingUser, isNew: false });
    }

    const { data: newUser, error: insertError } = await supabaseServer
      .from('users')
      .insert({ clerk_user_id: userId, gems_balance: 499, sparks_balance: 0 })
      .select()
      .single();

    if (insertError) {
      return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
    }

    await supabaseServer.from('user_stats').insert({ user_id: newUser.id });

    return NextResponse.json({ user: newUser, isNew: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
