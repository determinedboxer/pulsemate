import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: user } = await supabaseServer
      .from('users')
      .select('gems_balance')
      .eq('clerk_user_id', userId)
      .single();

    if (!user) {
      return NextResponse.json({ gemsBalance: 0 });
    }

    return NextResponse.json({ gemsBalance: user.gems_balance });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { amount } = await request.json();

    const { data: user } = await supabaseServer
      .from('users')
      .select('id, gems_balance')
      .eq('clerk_user_id', userId)
      .single();

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const newBalance = user.gems_balance + amount;

    const { data: updatedUser } = await supabaseServer
      .from('users')
      .update({ gems_balance: newBalance })
      .eq('id', user.id)
      .select()
      .single();

    return NextResponse.json({ gemsBalance: updatedUser.gems_balance });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
