-- =============================================
-- StarFrom AgentOS v3.1 Payment System
-- Lemon Squeezy Integration
-- Run this in Supabase SQL Editor
-- =============================================

-- Subscriptions Table (stores Lemon Squeezy subscription data)
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  
  -- Lemon Squeezy IDs
  lemon_squeezy_subscription_id TEXT UNIQUE,
  lemon_squeezy_customer_id TEXT,
  lemon_squeezy_order_id TEXT,
  
  -- Plan info
  plan_id TEXT NOT NULL DEFAULT 'free',
  plan_name TEXT NOT NULL DEFAULT 'Free',
  
  -- Status
  status TEXT NOT NULL DEFAULT 'inactive',
  -- 'inactive' | 'active' | 'past_due' | 'cancelled' | 'unpaid' | 'trialing'
  
  -- Billing
  billing_interval TEXT DEFAULT 'month',
  -- 'month' | 'year'
  price_amount_cents INTEGER DEFAULT 0,
  currency TEXT DEFAULT 'usd',
  
  -- Dates
  trial_ends_at TIMESTAMPTZ,
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  ends_at TIMESTAMPTZ,
  
  -- Payment
  card_brand TEXT,
  card_last_four TEXT,
  
  -- Metadata
  metadata JSONB DEFAULT '{}',
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_lemon_id ON subscriptions(lemon_squeezy_subscription_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);

-- Subscription Plans Table (for plan management)
CREATE TABLE IF NOT EXISTS subscription_plans (
  id TEXT PRIMARY KEY,
  -- 'free' | 'starter' | 'pro' | 'enterprise'
  
  name TEXT NOT NULL,
  description TEXT,
  
  -- Pricing
  monthly_price_cents INTEGER DEFAULT 0,
  yearly_price_cents INTEGER DEFAULT 0,
  
  -- Limits
  agent_limit INTEGER DEFAULT 1,
  conversation_limit INTEGER DEFAULT 100,
  message_limit INTEGER DEFAULT 1000,
  storage_limit_mb INTEGER DEFAULT 100,
  knowledge_base_limit INTEGER DEFAULT 1,
  api_calls_limit INTEGER DEFAULT 1000,
  
  -- Features
  features JSONB DEFAULT '[]',
  -- ['knowledge-base', 'api-access', 'custom-agents', etc.]
  
  -- Lemon Squeezy Variant IDs (set after creating products in Lemon Squeezy)
  monthly_variant_id TEXT,
  yearly_variant_id TEXT,
  
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default plans
INSERT INTO subscription_plans (id, name, description, monthly_price_cents, yearly_price_cents, agent_limit, conversation_limit, message_limit, storage_limit_mb, knowledge_base_limit, api_calls_limit, features, sort_order) VALUES
('free', 'Free', 'Perfect for getting started', 0, 0, 1, 50, 500, 50, 1, 500, '["basic-agents", "chat"]', 0),
('starter', 'Starter', 'For individuals and small projects', 1900, 19000, 3, 200, 2000, 500, 3, 5000, '["basic-agents", "chat", "knowledge-base", "file-upload"]', 1),
('pro', 'Pro', 'For professionals and growing teams', 4900, 49000, 10, 1000, 10000, 2000, 10, 25000, '["basic-agents", "chat", "knowledge-base", "file-upload", "api-access", "priority-support"]', 2)
ON CONFLICT (id) DO NOTHING;

-- Invoices Table (for billing history)
CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES subscriptions(id) ON DELETE SET NULL,
  
  -- Lemon Squeezy
  lemon_squeezy_invoice_id TEXT UNIQUE,
  lemon_squeezy_order_id TEXT,
  
  -- Invoice Details
  invoice_number TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  -- 'pending' | 'paid' | 'failed' | 'voided'
  
  currency TEXT DEFAULT 'usd',
  subtotal_cents INTEGER DEFAULT 0,
  discount_cents INTEGER DEFAULT 0,
  tax_cents INTEGER DEFAULT 0,
  total_cents INTEGER DEFAULT 0,
  
  -- Dates
  paid_at TIMESTAMPTZ,
  due_at TIMESTAMPTZ,
  invoice_date TIMESTAMPTZ,
  
  -- URLs
  invoice_url TEXT,
  receipt_url TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_invoices_user_id ON invoices(user_id);
CREATE INDEX idx_invoices_subscription_id ON invoices(subscription_id);
CREATE INDEX idx_invoices_status ON invoices(status);

-- Payment Methods Table (for saved cards)
CREATE TABLE IF NOT EXISTS payment_methods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Lemon Squeezy
  lemon_squeezy_payment_method_id TEXT UNIQUE,
  
  -- Card Details (stored by Lemon Squeezy, we just store reference)
  card_brand TEXT,
  card_last_four TEXT,
  card_exp_month INTEGER,
  card_exp_year INTEGER,
  
  -- Status
  is_default BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_payment_methods_user_id ON payment_methods(user_id);

-- RLS Policies
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;

-- Subscriptions policies
CREATE POLICY "Users can select their own subscription" 
  ON subscriptions FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own subscription" 
  ON subscriptions FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscription" 
  ON subscriptions FOR UPDATE 
  USING (auth.uid() = user_id);

-- Invoices policies
CREATE POLICY "Users can select their own invoices" 
  ON invoices FOR SELECT 
  USING (auth.uid() = user_id);

-- Payment methods policies
CREATE POLICY "Users can select their own payment methods" 
  ON payment_methods FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own payment methods" 
  ON payment_methods FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own payment methods" 
  ON payment_methods FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own payment methods" 
  ON payment_methods FOR DELETE 
  USING (auth.uid() = user_id);

-- Update updated_at trigger function
CREATE OR REPLACE FUNCTION update_subscription_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_subscription_updated_at();

-- =============================================
-- Migration complete!
-- =============================================
