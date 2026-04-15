-- PulseMate Database Schema
-- Run this in: Supabase Dashboard > SQL Editor

-- Users table (core - everything depends on this)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_user_id TEXT UNIQUE NOT NULL,
  username TEXT,
  email TEXT,
  gems_balance INTEGER NOT NULL DEFAULT 499,
  sparks_balance INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- User stats
CREATE TABLE IF NOT EXISTS user_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  total_messages_sent INTEGER NOT NULL DEFAULT 0,
  total_photos_unlocked INTEGER NOT NULL DEFAULT 0,
  total_gems_spent INTEGER NOT NULL DEFAULT 0,
  total_sparks_sent INTEGER NOT NULL DEFAULT 0,
  login_count INTEGER NOT NULL DEFAULT 0,
  longest_streak INTEGER NOT NULL DEFAULT 0,
  first_login_date TIMESTAMPTZ,
  last_login_date TIMESTAMPTZ
);

-- Chat messages
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  model_id TEXT NOT NULL,
  chat_type TEXT NOT NULL CHECK (chat_type IN ('main', 'sex', 'date')),
  message_index INTEGER NOT NULL,
  message_content TEXT NOT NULL,
  is_user_message BOOLEAN NOT NULL DEFAULT TRUE,
  photo_url TEXT,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Unlocked content
CREATE TABLE IF NOT EXISTS unlocked_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content_type TEXT NOT NULL CHECK (content_type IN ('photo', 'video', 'sex_chat', 'date_scenario', 'story')),
  content_id TEXT NOT NULL,
  model_id TEXT,
  gems_spent INTEGER NOT NULL DEFAULT 0,
  unlocked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, content_type, content_id)
);

-- User progress (quests, achievements, streaks)
CREATE TABLE IF NOT EXISTS user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  progress_type TEXT NOT NULL CHECK (progress_type IN ('quest', 'achievement', 'streak')),
  progress_key TEXT NOT NULL,
  progress_value INTEGER NOT NULL DEFAULT 0,
  is_claimed BOOLEAN NOT NULL DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  claimed_at TIMESTAMPTZ,
  UNIQUE(user_id, progress_type, progress_key)
);

-- Sparks transactions
CREATE TABLE IF NOT EXISTS sparks_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  model_id TEXT NOT NULL,
  sparks_amount INTEGER NOT NULL,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('sent', 'received', 'converted')),
  message_context TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Kiss levels
CREATE TABLE IF NOT EXISTS kiss_levels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  model_id TEXT NOT NULL,
  kiss_level INTEGER NOT NULL DEFAULT 0,
  last_kiss_at TIMESTAMPTZ,
  total_kisses INTEGER NOT NULL DEFAULT 0,
  UNIQUE(user_id, model_id)
);

-- Support tickets
CREATE TABLE IF NOT EXISTS support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  ticket_type TEXT NOT NULL CHECK (ticket_type IN ('contact', 'report')),
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  email TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  severity TEXT CHECK (severity IN ('low', 'medium', 'high')),
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Referrals
CREATE TABLE IF NOT EXISTS referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  referee_id UUID REFERENCES users(id) ON DELETE SET NULL,
  referral_code TEXT UNIQUE NOT NULL,
  gems_earned INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Stories unlocks
CREATE TABLE IF NOT EXISTS stories_unlocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  model_id TEXT NOT NULL,
  story_id TEXT NOT NULL,
  story_version INTEGER NOT NULL DEFAULT 1,
  unlocked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  UNIQUE(user_id, model_id, story_id)
);

-- Payment transactions
CREATE TABLE IF NOT EXISTS payment_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_type TEXT NOT NULL,
  product_id TEXT NOT NULL,
  amount_usd NUMERIC(10,2) NOT NULL,
  gems_amount INTEGER NOT NULL DEFAULT 0,
  sparks_amount INTEGER NOT NULL DEFAULT 0,
  model_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  payment_method TEXT NOT NULL DEFAULT 'crypto',
  stripe_session_id TEXT,
  metadata JSONB,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Purchases (unlocked models / all-access)
CREATE TABLE IF NOT EXISTS purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  transaction_id UUID REFERENCES payment_transactions(id),
  purchase_type TEXT NOT NULL,
  model_id TEXT,
  price_usd NUMERIC(10,2),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_users_clerk_user_id ON users(clerk_user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_unlocked_content_user_id ON unlocked_content(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_user_id ON payment_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_status ON payment_transactions(status);

-- Auto-update updated_at on users
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS users_updated_at ON users;
CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
