-- Add 'ai' to source check constraint and new categories to category check constraint

-- 1. Update spending_entries table
ALTER TABLE spending_entries DROP CONSTRAINT spending_entries_source_check;
ALTER TABLE spending_entries ADD CONSTRAINT spending_entries_source_check 
  CHECK (source IN ('manual', 'upload', 'estimated', 'ai'));

ALTER TABLE spending_entries DROP CONSTRAINT spending_entries_category_check;
ALTER TABLE spending_entries ADD CONSTRAINT spending_entries_category_check 
  CHECK (category IN (
    'food', 'transport', 'utilities', 'data_airtime', 'housing', 'entertainment', 
    'shopping', 'health', 'education', 'savings', 'family', 'debt', 
    'personal_care', 'investment', 'tax', 'salary', 'business', 'gift', 
    'travel', 'insurance', 'subscriptions', 'charity', 'other'
  ));

-- 2. Update spending_summaries table
ALTER TABLE spending_summaries DROP CONSTRAINT spending_summaries_category_check;
ALTER TABLE spending_summaries ADD CONSTRAINT spending_summaries_category_check 
  CHECK (category IN (
    'food', 'transport', 'utilities', 'data_airtime', 'housing', 'entertainment', 
    'shopping', 'health', 'education', 'savings', 'family', 'debt', 
    'personal_care', 'investment', 'tax', 'salary', 'business', 'gift', 
    'travel', 'insurance', 'subscriptions', 'charity', 'other'
  ));

-- 3. Add type column to spending_entries
ALTER TABLE spending_entries ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'expense' CHECK (type IN ('expense', 'income', 'transfer'));

-- 4. Add destination_account_id for transfers
ALTER TABLE spending_entries ADD COLUMN IF NOT EXISTS destination_account_id UUID; -- Storing ID as string/UUID. Not enforcing FK yet strictly if accounts are inside JSON, but ideally should be. 
-- Note: 'accounts' are currently stored in `profiles.accounts` (JSON) or separate table? 
-- Let's check UserFinancialProfile. accounts: Account[]. 
-- AFAIK accounts are just a JSON blob or array in the profile?
-- The schema 'profiles' has 'accounts' column? No. 
-- Wait, let's check `types.ts` -> `accounts: Account[]`. 
-- Let's check `FinancialContext` -> `accounts` seems to be managed in state/local storage or part of profile fetch?
-- Looking at schemas, I don't see an `accounts` table. `profiles` has `income_...`.
-- `accounts` might be missing from the SQL schema I saw earlier! 
-- `UserFinancialProfile` has `accounts`, `budgets`, etc.
-- Let's check how `accounts` are persisted. 
-- If they are just in JSON, then `destination_account_id` is just a UUID string.
