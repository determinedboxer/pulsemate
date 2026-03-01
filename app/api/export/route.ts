// API Route: Export User Data (GDPR Compliance)
import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';
import { currentUser } from '@clerk/nextjs/server';

export async function GET(req: NextRequest) {
  try {
    const user = await currentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user's database ID
    const { data: dbUser } = await supabaseServer
      .from('users')
      .select('*')
      .eq('clerk_user_id', user.id)
      .single();

    if (!dbUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Fetch all user data
    const [
      chatMessages,
      unlockedContent,
      userProgress,
      sparksTransactions,
      kissLevels,
      userStats,
      supportTickets,
      referrals,
      storiesUnlocks,
    ] = await Promise.all([
      supabaseServer.from('chat_messages').select('*').eq('user_id', dbUser.id),
      supabaseServer.from('unlocked_content').select('*').eq('user_id', dbUser.id),
      supabaseServer.from('user_progress').select('*').eq('user_id', dbUser.id),
      supabaseServer.from('sparks_transactions').select('*').eq('user_id', dbUser.id),
      supabaseServer.from('kiss_levels').select('*').eq('user_id', dbUser.id),
      supabaseServer.from('user_stats').select('*').eq('user_id', dbUser.id),
      supabaseServer.from('support_tickets').select('*').eq('user_id', dbUser.id),
      supabaseServer.from('referrals').select('*').eq('referrer_id', dbUser.id),
      supabaseServer.from('stories_unlocks').select('*').eq('user_id', dbUser.id),
    ]);

    // Compile complete data export
    const exportData = {
      exportDate: new Date().toISOString(),
      user: {
        profile: dbUser,
        email: user.emailAddresses[0]?.emailAddress,
        username: user.username,
      },
      chatMessages: chatMessages.data || [],
      unlockedContent: unlockedContent.data || [],
      progress: {
        quests: userProgress.data?.filter(p => p.progress_type === 'quest') || [],
        achievements: userProgress.data?.filter(p => p.progress_type === 'achievement') || [],
        streaks: userProgress.data?.filter(p => p.progress_type === 'streak') || [],
      },
      sparksTransactions: sparksTransactions.data || [],
      kissLevels: kissLevels.data || [],
      stats: userStats.data?.[0] || null,
      supportTickets: supportTickets.data || [],
      referrals: referrals.data || [],
      storiesUnlocks: storiesUnlocks.data || [],
    };

    return NextResponse.json({
      success: true,
      data: exportData,
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="pulsemate-data-${user.id}.json"`,
      },
    });

  } catch (error) {
    console.error('Data export error:', error);
    return NextResponse.json(
      { error: 'Failed to export data' },
      { status: 500 }
    );
  }
}
