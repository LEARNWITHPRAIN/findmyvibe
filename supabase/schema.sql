-- =========================================================
-- FIND MY VIBE — CSJMU Verified Student Network Database Schema
-- Run this script in the Supabase SQL Editor
-- =========================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Create Hobbies table
CREATE TABLE IF NOT EXISTS public.hobbies (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  category TEXT DEFAULT 'General',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed standard 40 hobbies
INSERT INTO public.hobbies (name, category) VALUES
  ('Music', 'Music & Audio'),
  ('Bollywood', 'Music & Audio'),
  ('Hip-Hop', 'Music & Audio'),
  ('K-Pop', 'Music & Audio'),
  ('Singing', 'Music & Audio'),
  ('Gaming', 'Gaming'),
  ('BGMI', 'Gaming'),
  ('Free Fire', 'Gaming'),
  ('Valorant', 'Gaming'),
  ('Anime', 'Entertainment'),
  ('Movies', 'Entertainment'),
  ('Web Series', 'Entertainment'),
  ('Cricket', 'Sports'),
  ('Football', 'Sports'),
  ('Badminton', 'Sports'),
  ('Basketball', 'Sports'),
  ('Gym', 'Fitness'),
  ('Calisthenics', 'Fitness'),
  ('Running', 'Fitness'),
  ('Cycling', 'Fitness'),
  ('Coding', 'Tech & Business'),
  ('AI', 'Tech & Business'),
  ('Startups', 'Tech & Business'),
  ('Entrepreneurship', 'Tech & Business'),
  ('Photography', 'Creative & Arts'),
  ('Video Editing', 'Creative & Arts'),
  ('Content Creation', 'Creative & Arts'),
  ('Drawing', 'Creative & Arts'),
  ('Dancing', 'Creative & Arts'),
  ('Fashion', 'Creative & Arts'),
  ('Reading', 'Lifestyle & Outdoors'),
  ('Travelling', 'Lifestyle & Outdoors'),
  ('Food', 'Lifestyle & Outdoors'),
  ('Cooking', 'Lifestyle & Outdoors'),
  ('Café Hopping', 'Lifestyle & Outdoors'),
  ('Trekking', 'Lifestyle & Outdoors'),
  ('Self Improvement', 'Mindset & Social'),
  ('Psychology', 'Mindset & Social'),
  ('Making New Friends', 'Mindset & Social'),
  ('Deep Conversations', 'Mindset & Social')
ON CONFLICT (name) DO NOTHING;

-- 2. Create Profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  department TEXT,
  year TEXT,                                  -- '1', '2', '3', '4'
  gender TEXT,                                -- 'Male' | 'Female' | 'Other' | 'Prefer not to say'
  college TEXT DEFAULT 'CSJMU',
  email_verified BOOLEAN DEFAULT FALSE,
  verification_status TEXT DEFAULT 'unverified' CHECK (verification_status IN ('unverified', 'pending', 'verified', 'rejected')),
  id_card_url TEXT,                           -- Path in storage bucket 'id-verifications'
  avatar_url TEXT,
  bio TEXT,
  is_admin BOOLEAN DEFAULT FALSE,
  is_banned BOOLEAN DEFAULT FALSE,
  ban_reason TEXT,
  banned_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Profile Hobbies (Many-to-Many join table)
CREATE TABLE IF NOT EXISTS public.profile_hobbies (
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  hobby_id INT REFERENCES public.hobbies(id) ON DELETE CASCADE,
  PRIMARY KEY (profile_id, hobby_id)
);

-- 4. Create Messages table
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  receiver_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Create Blocked Users table
CREATE TABLE IF NOT EXISTS public.blocked_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blocker_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  blocked_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(blocker_id, blocked_id)
);

-- 6. Create User Reports table
CREATE TABLE IF NOT EXISTS public.user_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  reported_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  details TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved', 'dismissed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexing for fast search and real-time chat queries
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON public.messages(sender_id, receiver_id, created_at);
CREATE INDEX IF NOT EXISTS idx_profile_hobbies_profile ON public.profile_hobbies(profile_id);
CREATE INDEX IF NOT EXISTS idx_profile_hobbies_hobby ON public.profile_hobbies(hobby_id);
CREATE INDEX IF NOT EXISTS idx_profiles_status ON public.profiles(verification_status);
CREATE INDEX IF NOT EXISTS idx_blocked_users_blocker ON public.blocked_users(blocker_id);
CREATE INDEX IF NOT EXISTS idx_blocked_users_blocked ON public.blocked_users(blocked_id);
CREATE INDEX IF NOT EXISTS idx_user_reports_status ON public.user_reports(status);
CREATE INDEX IF NOT EXISTS idx_user_reports_reported ON public.user_reports(reported_id);

-- 7. Row Level Security (RLS) Configuration

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hobbies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_hobbies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blocked_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_reports ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Public profiles can be viewed by authenticated users"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can update all profiles for verification"
  ON public.profiles FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );

-- Hobbies Policies
CREATE POLICY "Anyone can view hobbies"
  ON public.hobbies FOR SELECT
  TO authenticated, anon
  USING (true);

-- Profile Hobbies Policies
CREATE POLICY "Authenticated users can view profile hobbies"
  ON public.profile_hobbies FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage their own hobbies"
  ON public.profile_hobbies FOR ALL
  TO authenticated
  USING (auth.uid() = profile_id)
  WITH CHECK (auth.uid() = profile_id);

-- Messages Policies
CREATE POLICY "Users can view messages they sent or received"
  ON public.messages FOR SELECT
  TO authenticated
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Verified users can send messages"
  ON public.messages FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = sender_id
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.verification_status = 'verified'
    )
    AND NOT EXISTS (
      SELECT 1 FROM public.blocked_users
      WHERE blocked_users.blocker_id = messages.receiver_id 
        AND blocked_users.blocked_id = auth.uid()
    )
  );

-- Blocked Users Policies
CREATE POLICY "Users can view their own block relationships"
  ON public.blocked_users FOR SELECT
  TO authenticated
  USING (auth.uid() = blocker_id OR auth.uid() = blocked_id);

CREATE POLICY "Users can block other users"
  ON public.blocked_users FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = blocker_id);

CREATE POLICY "Users can unblock users they blocked"
  ON public.blocked_users FOR DELETE
  TO authenticated
  USING (auth.uid() = blocker_id);

-- User Reports Policies
CREATE POLICY "Users can submit reports"
  ON public.user_reports FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Users can view their submitted reports or admins can view all reports"
  ON public.user_reports FOR SELECT
  TO authenticated
  USING (
    auth.uid() = reporter_id
    OR ((auth.jwt() ->> 'email') = 'prakharjain2731@gmail.com')
    OR EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can update reports"
  ON public.user_reports FOR UPDATE
  TO authenticated
  USING (
    ((auth.jwt() ->> 'email') = 'prakharjain2731@gmail.com')
    OR EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );

-- Enable Realtime for all interactive tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.blocked_users, public.user_reports, public.profiles;


-- 6. Supabase Storage Bucket for ID Cards
-- Note: Create a private bucket called 'id-verifications' in the Supabase Dashboard Storage section.
-- Storage RLS policies:
INSERT INTO storage.buckets (id, name, public) 
VALUES ('id-verifications', 'id-verifications', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Users can upload their own ID card"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'id-verifications' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can read their own ID card"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'id-verifications' AND
    (
      (storage.foldername(name))[1] = auth.uid()::text
      OR EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid() AND profiles.is_admin = true
      )
    )
  );

-- 7. Trigger: Auto-create profile on auth signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, email_verified, verification_status, college)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    COALESCE(new.email_confirmed_at IS NOT NULL, false),
    'unverified',
    'CSJMU'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Enable Realtime for Messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
