// Supabase client configuration for PulseMate
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Client-side Supabase client - lazy loaded to avoid SSR issues
let supabaseClient: ReturnType<typeof createClient> | null = null;

export function getSupabaseClient() {
  if (!supabaseClient) {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
  }
  return supabaseClient;
}

// Export for backward compatibility
export const supabase = getSupabaseClient();

// Server-side Supabase client (for API routes)
export const supabaseServer = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Database Types
export interface User {
  id: string;
  clerk_user_id: string;
  username: string | null;
  email: string | null;
  gems_balance: number;
  sparks_balance: number;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  user_id: string;
  model_id: string;
  chat_type: 'main' | 'sex' | 'date';
  message_index: number;
  message_content: string;
  is_user_message: boolean;
  photo_url: string | null;
  timestamp: string;
}

export interface UnlockedContent {
  id: string;
  user_id: string;
  content_type: 'photo' | 'video' | 'sex_chat' | 'date_scenario' | 'story';
  content_id: string;
  model_id: string | null;
  gems_spent: number;
  unlocked_at: string;
}

export interface UserProgress {
  id: string;
  user_id: string;
  progress_type: 'quest' | 'achievement' | 'streak';
  progress_key: string;
  progress_value: number;
  is_claimed: boolean;
  completed_at: string | null;
  claimed_at: string | null;
}

export interface SparksTransaction {
  id: string;
  user_id: string;
  model_id: string;
  sparks_amount: number;
  transaction_type: 'sent' | 'received' | 'converted';
  message_context: string | null;
  created_at: string;
}

export interface KissLevel {
  id: string;
  user_id: string;
  model_id: string;
  kiss_level: number;
  last_kiss_at: string | null;
  total_kisses: number;
}

export interface UserStats {
  id: string;
  user_id: string;
  total_messages_sent: number;
  total_photos_unlocked: number;
  total_gems_spent: number;
  total_sparks_sent: number;
  login_count: number;
  longest_streak: number;
  first_login_date: string;
  last_login_date: string;
}

export interface SupportTicket {
  id: string;
  user_id: string | null;
  ticket_type: 'contact' | 'report';
  subject: string;
  message: string;
  email: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  severity: 'low' | 'medium' | 'high' | null;
  user_agent: string | null;
  created_at: string;
  updated_at: string;
}

export interface Referral {
  id: string;
  referrer_id: string;
  referee_id: string | null;
  referral_code: string;
  gems_earned: number;
  status: 'pending' | 'completed';
  created_at: string;
  completed_at: string | null;
}

export interface StoryUnlock {
  id: string;
  user_id: string;
  model_id: string;
  story_id: string;
  story_version: number;
  unlocked_at: string;
  expires_at: string;
}

// Helper functions for common operations
export async function getOrCreateUser(clerkUserId: string, email: string | null) {
  const client = getSupabaseClient();
  const { data: existingUser } = await client
    .from('users')
    .select('*')
    .eq('clerk_user_id', clerkUserId)
    .single();

  if (existingUser) {
    return existingUser;
  }

  const { data: newUser, error } = await client
    .from('users')
    .insert({
      clerk_user_id: clerkUserId,
      email: email,
      gems_balance: 499,
      sparks_balance: 0,
    } as any)
    .select()
    .single();

  if (error) throw error;

  if (!newUser) throw new Error('Failed to create user');

  // Also create user_stats entry
  await client.from('user_stats').insert({
    user_id: newUser.id,
  } as any);

  return newUser;
}

export async function getUserByClerkId(clerkUserId: string): Promise<User | null> {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from('users')
    .select('*')
    .eq('clerk_user_id', clerkUserId)
    .single();

  if (error) return null;
  return data;
}

export async function updateGemsBalance(userId: string, amount: number) {
  const client = getSupabaseClient();
  const { error } = await client
    .from('users')
    .update({ gems_balance: amount })
    .eq('id', userId);

  if (error) throw error;
}

export async function updateSparksBalance(userId: string, amount: number) {
  const client = getSupabaseClient();
  const { error } = await client
    .from('users')
    .update({ sparks_balance: amount })
    .eq('id', userId);

  if (error) throw error;
}
