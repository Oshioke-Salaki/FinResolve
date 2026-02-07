-- ============================================================
-- Update Categories Check Constraints
-- Adds: travel, insurance, subscriptions, charity
-- ============================================================

-- 1. Update spending_entries check constraint
ALTER TABLE spending_entries DROP CONSTRAINT spending_entries_category_check;
ALTER TABLE spending_entries ADD CONSTRAINT spending_entries_category_check 
CHECK (category IN (
  'food', 'transport', 'utilities', 'data_airtime', 'housing', 'entertainment', 
  'shopping', 'health', 'education', 'savings', 'family', 'debt', 
  'personal_care', 'investment', 'tax', 'salary', 'business', 'gift', 
  'travel', 'insurance', 'subscriptions', 'charity', 'other'
));

-- 2. Update spending_summaries check constraint
ALTER TABLE spending_summaries DROP CONSTRAINT spending_summaries_category_check;
ALTER TABLE spending_summaries ADD CONSTRAINT spending_summaries_category_check 
CHECK (category IN (
  'food', 'transport', 'utilities', 'data_airtime', 'housing', 'entertainment', 
  'shopping', 'health', 'education', 'savings', 'family', 'debt', 
  'personal_care', 'investment', 'tax', 'salary', 'business', 'gift', 
  'travel', 'insurance', 'subscriptions', 'charity', 'other'
));

-- 3. Update recurring_items check constraint (if it exists)
-- Note: Check if you have a constraint named recurring_items_category_check or similar
-- For now, we assume it might not have one or we need to add it if missing.
-- If you strictly defined it in create table, it exists.
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'recurring_items_category_check') THEN
    ALTER TABLE recurring_items DROP CONSTRAINT recurring_items_category_check;
  END IF;
END $$;

ALTER TABLE recurring_items ADD CONSTRAINT recurring_items_category_check 
CHECK (category IN (
  'food', 'transport', 'utilities', 'data_airtime', 'housing', 'entertainment', 
  'shopping', 'health', 'education', 'savings', 'family', 'debt', 
  'personal_care', 'investment', 'tax', 'salary', 'business', 'gift', 
  'travel', 'insurance', 'subscriptions', 'charity', 'other'
));

-- 4. Update budgets check constraint (if it exists)
-- Assuming similar naming convention
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'budgets_category_check') THEN
    ALTER TABLE budgets DROP CONSTRAINT budgets_category_check;
  END IF;
END $$;

ALTER TABLE budgets ADD CONSTRAINT budgets_category_check 
CHECK (category IN (
  'food', 'transport', 'utilities', 'data_airtime', 'housing', 'entertainment', 
  'shopping', 'health', 'education', 'savings', 'family', 'debt', 
  'personal_care', 'investment', 'tax', 'salary', 'business', 'gift', 
  'travel', 'insurance', 'subscriptions', 'charity', 'other'
));
