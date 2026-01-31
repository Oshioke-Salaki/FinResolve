-- FinResolve Auth Policies for Supabase
-- Run this AFTER enabling authentication to secure user data
-- Go to SQL Editor > New Query > Paste this > Run

-- First, drop the old "allow all" policies
DROP POLICY IF EXISTS "Allow all access to profiles" ON profiles;
DROP POLICY IF EXISTS "Allow all access to spending_entries" ON spending_entries;
DROP POLICY IF EXISTS "Allow all access to spending_summaries" ON spending_summaries;
DROP POLICY IF EXISTS "Allow all access to savings_goals" ON savings_goals;

-- Profiles: Users can only see and modify their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own profile" ON profiles
  FOR DELETE USING (auth.uid() = user_id);

-- Spending Entries: Users can only access entries linked to their profile
CREATE POLICY "Users can view own spending entries" ON spending_entries
  FOR SELECT USING (
    profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can insert own spending entries" ON spending_entries
  FOR INSERT WITH CHECK (
    profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can update own spending entries" ON spending_entries
  FOR UPDATE USING (
    profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can delete own spending entries" ON spending_entries
  FOR DELETE USING (
    profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
  );

-- Spending Summaries: Users can only access summaries linked to their profile
CREATE POLICY "Users can view own spending summaries" ON spending_summaries
  FOR SELECT USING (
    profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can insert own spending summaries" ON spending_summaries
  FOR INSERT WITH CHECK (
    profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can update own spending summaries" ON spending_summaries
  FOR UPDATE USING (
    profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can delete own spending summaries" ON spending_summaries
  FOR DELETE USING (
    profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
  );

-- Savings Goals: Users can only access goals linked to their profile
CREATE POLICY "Users can view own savings goals" ON savings_goals
  FOR SELECT USING (
    profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can insert own savings goals" ON savings_goals
  FOR INSERT WITH CHECK (
    profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can update own savings goals" ON savings_goals
  FOR UPDATE USING (
    profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can delete own savings goals" ON savings_goals
  FOR DELETE USING (
    profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
  );
