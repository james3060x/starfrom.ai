-- =============================================
-- StarFrom AgentOS v3.0 Database Migration
-- Creates tables for Solo Plan MVP
-- Run this in Supabase SQL Editor
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Solo Users Table (stores plan info for each user)
CREATE TABLE IF NOT EXISTS solo_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  
  -- Plan info
  plan_type TEXT NOT NULL DEFAULT 'free',
  plan_status TEXT NOT NULL DEFAULT 'active',
  
  -- Limits
  agent_limit INTEGER NOT NULL DEFAULT 1,
  storage_limit_gb NUMERIC NOT NULL DEFAULT 0.5,
  api_calls_limit INTEGER NOT NULL DEFAULT 1000,
  
  -- Trial
  trial_ends_at TIMESTAMPTZ,
  
  -- Subscription
  subscription_id TEXT,
  subscription_expires_at TIMESTAMPTZ,
  
  -- Stats
  total_agents INTEGER DEFAULT 0,
  total_conversations INTEGER DEFAULT 0,
  total_api_calls INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_solo_users_user_id ON solo_users(user_id);

-- User Agents Table
CREATE TABLE IF NOT EXISTS user_agents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Basic info
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT DEFAULT '🤖',
  is_active BOOLEAN DEFAULT true,
  
  -- Model config
  model TEXT NOT NULL DEFAULT 'gpt-4o-mini',
  temperature NUMERIC DEFAULT 0.7,
  max_tokens INTEGER DEFAULT 1000,
  
  -- Prompt
  system_prompt TEXT NOT NULL,
  
  -- Knowledge base
  knowledge_base_id UUID,
  
  -- Advanced settings
  enable_web_search BOOLEAN DEFAULT false,
  enable_function_calling BOOLEAN DEFAULT false,
  stop_sequences TEXT[],
  
  -- Stats
  total_conversations INTEGER DEFAULT 0,
  total_messages INTEGER DEFAULT 0,
  last_used_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_user_agents_user_id ON user_agents(user_id);
CREATE INDEX idx_user_agents_is_active ON user_agents(is_active);

-- User Conversations Table
CREATE TABLE IF NOT EXISTS user_conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_id UUID REFERENCES user_agents(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  title TEXT,
  
  -- Stats
  message_count INTEGER DEFAULT 0,
  last_message_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_conversations_agent_id ON user_conversations(agent_id);
CREATE INDEX idx_conversations_user_id ON user_conversations(user_id);

-- Chat Messages Table
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES user_conversations(id) ON DELETE CASCADE,
  
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_messages_session_id ON chat_messages(session_id);
CREATE INDEX idx_messages_created_at ON chat_messages(created_at DESC);

-- Knowledge Bases Table
CREATE TABLE IF NOT EXISTS knowledge_bases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  name TEXT NOT NULL,
  description TEXT,
  
  -- Config
  chunk_size INTEGER DEFAULT 1000,
  chunk_overlap INTEGER DEFAULT 100,
  embedding_model TEXT DEFAULT 'text-embedding-3-small',
  
  -- Stats
  total_files INTEGER DEFAULT 0,
  total_chunks INTEGER DEFAULT 0,
  total_size_bytes BIGINT DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_knowledge_bases_user_id ON knowledge_bases(user_id);

-- Knowledge Files Table
CREATE TABLE IF NOT EXISTS knowledge_files (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  knowledge_base_id UUID REFERENCES knowledge_bases(id) ON DELETE CASCADE,
  
  filename TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size_bytes BIGINT NOT NULL,
  storage_path TEXT NOT NULL,
  
  -- Processing status
  processing_status TEXT DEFAULT 'pending',
  error_message TEXT,
  
  -- Stats
  chunk_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  processed_at TIMESTAMPTZ
);

CREATE INDEX idx_knowledge_files_kb_id ON knowledge_files(knowledge_base_id);

-- API Keys Table
CREATE TABLE IF NOT EXISTS api_keys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  name TEXT NOT NULL,
  key_hash TEXT NOT NULL UNIQUE,
  key_prefix TEXT NOT NULL,
  
  -- Scopes
  scopes TEXT[] DEFAULT ARRAY['read', 'write'],
  
  -- Usage stats
  last_used_at TIMESTAMPTZ,
  total_requests INTEGER DEFAULT 0,
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_api_keys_user_id ON api_keys(user_id);
CREATE INDEX idx_api_keys_key_hash ON api_keys(key_hash);

-- RLS Policies (Row Level Security)

ALTER TABLE solo_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_bases ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

-- Solo Users policies
CREATE POLICY "Users can select their own solo_user" 
  ON solo_users FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own solo_user" 
  ON solo_users FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own solo_user" 
  ON solo_users FOR UPDATE 
  USING (auth.uid() = user_id);

-- User Agents policies
CREATE POLICY "Users can select their own agents" 
  ON user_agents FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own agents" 
  ON user_agents FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own agents" 
  ON user_agents FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own agents" 
  ON user_agents FOR DELETE 
  USING (auth.uid() = user_id);

-- User Conversations policies
CREATE POLICY "Users can select their own conversations" 
  ON user_conversations FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own conversations" 
  ON user_conversations FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own conversations" 
  ON user_conversations FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own conversations" 
  ON user_conversations FOR DELETE 
  USING (auth.uid() = user_id);

-- Chat Messages policies (via conversation)
CREATE POLICY "Users can select messages from their conversations" 
  ON chat_messages FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM user_conversations 
      WHERE id = session_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert messages to their conversations" 
  ON chat_messages FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_conversations 
      WHERE id = session_id AND user_id = auth.uid()
    )
  );

-- Knowledge Bases policies
CREATE POLICY "Users can select their own knowledge bases" 
  ON knowledge_bases FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own knowledge bases" 
  ON knowledge_bases FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own knowledge bases" 
  ON knowledge_bases FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own knowledge bases" 
  ON knowledge_bases FOR DELETE 
  USING (auth.uid() = user_id);

-- Knowledge Files policies (via knowledge base)
CREATE POLICY "Users can select files from their knowledge bases" 
  ON knowledge_files FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM knowledge_bases 
      WHERE id = knowledge_base_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert files to their knowledge bases" 
  ON knowledge_files FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM knowledge_bases 
      WHERE id = knowledge_base_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete files from their knowledge bases" 
  ON knowledge_files FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM knowledge_bases 
      WHERE id = knowledge_base_id AND user_id = auth.uid()
    )
  );

-- API Keys policies
CREATE POLICY "Users can select their own api keys" 
  ON api_keys FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own api keys" 
  ON api_keys FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own api keys" 
  ON api_keys FOR DELETE 
  USING (auth.uid() = user_id);

-- Create storage bucket for knowledge files
INSERT INTO storage.buckets (id, name, public)
VALUES ('knowledge-files', 'knowledge-files', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policy for knowledge files
CREATE POLICY "Users can access their own knowledge files"
  ON storage.objects FOR ALL
  USING (
    bucket_id = 'knowledge-files' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Update updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_solo_users_updated_at ON solo_users;
CREATE TRIGGER update_solo_users_updated_at
  BEFORE UPDATE ON solo_users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS update_user_agents_updated_at ON user_agents;
CREATE TRIGGER update_user_agents_updated_at
  BEFORE UPDATE ON user_agents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS update_user_conversations_updated_at ON user_conversations;
CREATE TRIGGER update_user_conversations_updated_at
  BEFORE UPDATE ON user_conversations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS update_knowledge_bases_updated_at ON knowledge_bases;
CREATE TRIGGER update_knowledge_bases_updated_at
  BEFORE UPDATE ON knowledge_bases
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- =============================================
-- Migration complete!
-- =============================================
