import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = getSupabaseServer();
    const { contentType, contentId, modelId, gemsSpent } = await request.json();

    const { data: user } = await supabase
      .from('users')
      .select('id, gems_balance')
      .eq('clerk_user_id', userId)
      .single();

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.gems_balance < gemsSpent) {
      return NextResponse.json({ error: 'Insufficient gems' }, { status: 400 });
    }

    const { error: unlockError } = await supabase
      .from('unlocked_content')
      .insert({
        user_id: user.id,
        content_type: contentType,
        content_id: contentId,
        model_id: modelId,
        gems_spent: gemsSpent,
      });

    if (unlockError) {
      return NextResponse.json({ error: 'Already unlocked or error' }, { status: 400 });
    }

    const { data: updatedUser } = await supabase
      .from('users')
      .update({ gems_balance: user.gems_balance - gemsSpent })
      .eq('id', user.id)
      .select()
      .single();

    return NextResponse.json({ 
      success: true, 
      gemsBalance: updatedUser ? updatedUser.gems_balance : user.gems_balance - gemsSpent
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
