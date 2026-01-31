-- FinResolve: Fix RLS Policies
-- Run this in Supabase SQL Editor to fix the 406/409 errors

-- OPTION 1: Disable RLS temporarily (simplest for development/hackathon)
-- Uncomment these lines if you want to disable RLS:
-- ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE spending_entries DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE spending_summaries DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE savings_goals DISABLE ROW LEVEL SECURITY;

-- OPTION 2: Fix the policies (recommended for production)
-- First, drop ALL existing policies on profiles
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can delete own profile" ON profiles;
DROP POLICY IF EXISTS "Allow all access to profiles" ON profiles;

-- Create simple, permissive policies for profiles
-- Allow authenticated users to do anything with their own profile
CREATE POLICY "profiles_select_policy" ON profiles
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "profiles_insert_policy" ON profiles
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "profiles_update_policy" ON profiles
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "profiles_delete_policy" ON profiles
  FOR DELETE TO authenticated
  USING (user_id = auth.uid());

-- Same for spending_summaries
DROP POLICY IF EXISTS "Users can view own spending summaries" ON spending_summaries;
DROP POLICY IF EXISTS "Users can insert own spending summaries" ON spending_summaries;
DROP POLICY IF EXISTS "Users can update own spending summaries" ON spending_summaries;
DROP POLICY IF EXISTS "Users can delete own spending summaries" ON spending_summaries;
DROP POLICY IF EXISTS "Allow all access to spending_summaries" ON spending_summaries;

CREATE POLICY "spending_summaries_all_policy" ON spending_summaries
  FOR ALL TO authenticated
  USING (profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()))
  WITH CHECK (profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

-- Same for savings_goals
DROP POLICY IF EXISTS "Users can view own savings goals" ON savings_goals;
DROP POLICY IF EXISTS "Users can insert own savings goals" ON savings_goals;
DROP POLICY IF EXISTS "Users can update own savings goals" ON savings_goals;
DROP POLICY IF EXISTS "Users can delete own savings goals" ON savings_goals;
DROP POLICY IF EXISTS "Allow all access to savings_goals" ON savings_goals;

CREATE POLICY "savings_goals_all_policy" ON savings_goals
  FOR ALL TO authenticated
  USING (profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()))
  WITH CHECK (profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

-- Same for spending_entries
DROP POLICY IF EXISTS "Users can view own spending entries" ON spending_entries;
DROP POLICY IF EXISTS "Users can insert own spending entries" ON spending_entries;
DROP POLICY IF EXISTS "Users can update own spending entries" ON spending_entries;
DROP POLICY IF EXISTS "Users can delete own spending entries" ON spending_entries;
DROP POLICY IF EXISTS "Allow all access to spending_entries" ON spending_entries;

CREATE POLICY "spending_entries_all_policy" ON spending_entries
  FOR ALL TO authenticated
  USING (profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()))
  WITH CHECK (profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

-- Make sure RLS is enabled
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE spending_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE spending_summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE savings_goals ENABLE ROW LEVEL SECURITY;

-- Clean up duplicate profiles (keep only the one created by AuthContext during signup)
-- This deletes profiles that don't match the one created during signup
DELETE FROM profiles p1
WHERE EXISTS (
  SELECT 1 FROM profiles p2
  WHERE p2.user_id = p1.user_id
  AND p2.id != p1.id
  AND p2.created_at < p1.created_at
);
