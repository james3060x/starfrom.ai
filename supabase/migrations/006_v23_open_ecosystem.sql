-- =============================================-- StarFrom AgentOS v2.3 数据库迁移-- 文件：supabase/migrations/006_v23_open_ecosystem.sql-- 前提：已执行 001~005（v1.0 ~ v2.2 迁移脚本）-- =============================================

-- 1. 启用 Apache AGE（图数据库扩展）
CREATE EXTENSION IF NOT EXISTS age;
LOAD 'age';
SET search_path = ag_catalog, "$user", public;

-- 2. MCP Token 管理表
CREATE TABLE IF NOT EXISTS mcp_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  token_hash TEXT NOT NULL UNIQUE,
  allowed_agent_ids JSONB DEFAULT '[]',
  allowed_tools JSONB DEFAULT '[]',
  last_used_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. 开发者 API Key 表
CREATE TABLE IF NOT EXISTS api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  key_hash TEXT NOT NULL UNIQUE,
  key_prefix TEXT NOT NULL,
  scopes JSONB DEFAULT '["read", "write"]',
  rate_limit_rpm INTEGER DEFAULT 60,
  allowed_ips JSONB DEFAULT '[]',
  last_used_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Webhook 配置表
CREATE TABLE IF NOT EXISTS webhooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  secret TEXT NOT NULL,
  events JSONB NOT NULL DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  failure_count INTEGER DEFAULT 0,
  last_triggered_at TIMESTAMPTZ,
  last_response_status INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Webhook 投递日志表
CREATE TABLE IF NOT EXISTS webhook_deliveries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  webhook_id UUID NOT NULL REFERENCES webhooks(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL,
  response_status INTEGER,
  response_body TEXT,
  attempt_count INTEGER DEFAULT 1,
  is_success BOOLEAN DEFAULT false,
  delivered_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. 知识图谱实体索引表（补充 Apache AGE 图数据）
CREATE TABLE IF NOT EXISTS kg_entities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  knowledge_base_id UUID NOT NULL,
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  entity_type TEXT DEFAULT 'concept',
  description TEXT,
  source_doc_ids JSONB DEFAULT '[]',
  embedding VECTOR(1536),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS kg_entities_embedding_idx
ON kg_entities USING ivfflat (embedding vector_cosine_ops);

CREATE INDEX IF NOT EXISTS kg_entities_kb_idx
ON kg_entities (knowledge_base_id);

-- 7. Prompt A/B 实验表
CREATE TABLE IF NOT EXISTS prompt_experiments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'running',
  -- 'draft' | 'running' | 'paused' | 'completed'
  variants JSONB NOT NULL DEFAULT '[]',
  -- [{ id, name, system_prompt, traffic_weight, impressions, satisfied, dissatisfied, avg_turns }]
  winner_variant_id TEXT,
  min_sample_size INTEGER DEFAULT 100,
  confidence_level NUMERIC(4,3) DEFAULT 0.95,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id)
);

-- 8. ROI 配置表
CREATE TABLE IF NOT EXISTS roi_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE UNIQUE,
  avg_human_cost_per_hour NUMERIC(10,2) DEFAULT 50,
  avg_human_minutes_per_query NUMERIC(5,2) DEFAULT 5,
  currency TEXT DEFAULT 'CNY',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. API 调用日志表
CREATE TABLE IF NOT EXISTS api_call_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  api_key_id UUID REFERENCES api_keys(id) ON DELETE SET NULL,
  workspace_id UUID REFERENCES workspaces(id) ON DELETE SET NULL,
  endpoint TEXT NOT NULL,
  method TEXT NOT NULL,
  status_code INTEGER,
  latency_ms INTEGER,
  tokens_used INTEGER DEFAULT 0,
  error_message TEXT,
  called_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. 工作流并行执行记录（扩展 workflow_runs 表）
ALTER TABLE workflow_runs
ADD COLUMN IF NOT EXISTS parallel_branches JSONB DEFAULT '[]';
-- [{ branch_id, node_id, status, started_at, completed_at, output }]

-- 11. Agent 表新增实验字段
ALTER TABLE agents
ADD COLUMN IF NOT EXISTS active_experiment_id UUID REFERENCES prompt_experiments(id),
ADD COLUMN IF NOT EXISTS active_variant_id TEXT;

-- =============================================-- RLS 策略-- =============================================

ALTER TABLE mcp_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE kg_entities ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompt_experiments ENABLE ROW LEVEL SECURITY;
ALTER TABLE roi_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_call_logs ENABLE ROW LEVEL SECURITY;

-- Workspace 成员隔离（统一模式）
DO $$
DECLARE
  tbl TEXT;
BEGIN
  FOREACH tbl IN ARRAY ARRAY[
    'mcp_tokens','api_keys','webhooks','webhook_deliveries',
    'kg_entities','prompt_experiments','roi_configs','api_call_logs'
  ] LOOP
    EXECUTE format('
      CREATE POLICY "workspace_isolation" ON %I
      FOR ALL USING (
        workspace_id IN (
          SELECT workspace_id FROM workspace_members
          WHERE user_id = auth.uid() AND is_active = true
        )
      )', tbl);
  END LOOP;
END $$;

-- Admin only: Webhook 配置
CREATE POLICY "admin_only_webhooks" ON webhooks
  FOR INSERT OR UPDATE OR DELETE
  USING (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );
