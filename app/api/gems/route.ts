import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabase';

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = getSupabaseServer();
    const { data: user } = await supabase
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

    const supabase = getSupabaseServer();
    const { amount } = await request.json();

    const { data: user } = await supabase
      .from('users')
      .select('id, gems_balance')
      .eq('clerk_user_id', userId)
      .single();

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const newBalance = user.gems_balance + amount;

    const { data: updatedUser } = await supabase
      .from('users')
      .update({ gems_balance: newBalance })
      .eq('id', user.id)
      .select()
      .single();

    return NextResponse.json({ gemsBalance: updatedUser ? updatedUser.gems_balance : newBalance });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
