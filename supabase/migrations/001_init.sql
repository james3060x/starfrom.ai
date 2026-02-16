-- =============================================
-- StarFrom AI - Supabase Database Migration
-- =============================================

-- =============================================
-- 1. Service Modules Table
-- =============================================
CREATE TABLE IF NOT EXISTS service_modules (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('base', 'plugin', 'subscription')),
  category TEXT,
  description TEXT,
  features JSONB DEFAULT '[]'::jsonb,
  price_min INTEGER,
  price_max INTEGER,
  price_unit TEXT,
  delivery_days TEXT,
  icon TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 2. Service Cases Table
-- =============================================
CREATE TABLE IF NOT EXISTS service_cases (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  industry TEXT,
  company_size TEXT,
  challenge TEXT,
  solution TEXT,
  results JSONB DEFAULT '[]'::jsonb,
  modules_used JSONB DEFAULT '[]'::jsonb,
  testimonial TEXT,
  image_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 3. Service Leads Table
-- =============================================
CREATE TABLE IF NOT EXISTS service_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT,
  contact_name TEXT NOT NULL,
  contact_phone TEXT,
  contact_wechat TEXT,
  contact_email TEXT,
  industry TEXT,
  company_size TEXT,
  need_type TEXT,
  selected_modules JSONB DEFAULT '[]'::jsonb,
  budget_range TEXT,
  expected_timeline TEXT,
  notes TEXT,
  source TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'demo_scheduled', 'proposal', 'signed', 'lost')),
  follow_up_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 4. Diagnosis Results Table
-- =============================================
CREATE TABLE IF NOT EXISTS diagnosis_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  answers JSONB NOT NULL DEFAULT '{}'::jsonb,
  recommended_modules JSONB DEFAULT '[]'::jsonb,
  estimated_price_min INTEGER,
  estimated_price_max INTEGER,
  estimated_days TEXT,
  lead_id UUID REFERENCES service_leads(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 5. Enable RLS
-- =============================================
ALTER TABLE service_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE diagnosis_results ENABLE ROW LEVEL SECURITY;

-- =============================================
-- 6. RLS Policies - Public Read
-- =============================================

-- Public can read active modules
CREATE POLICY "Public Read Modules" ON service_modules
  FOR SELECT USING (is_active = true);

-- Public can read all cases
CREATE POLICY "Public Read Cases" ON service_cases
  FOR SELECT USING (true);

-- Public can insert leads
CREATE POLICY "Public Insert Leads" ON service_leads
  FOR INSERT WITH CHECK (true);

-- Public can insert diagnosis
CREATE POLICY "Public Insert Diagnosis" ON diagnosis_results
  FOR INSERT WITH CHECK (true);

-- =============================================
-- 7. RLS Policies - Admin Access
-- =============================================

-- Admin can do anything on modules
CREATE POLICY "Admin All Modules" ON service_modules
  FOR ALL USING (auth.role() = 'authenticated');

-- Admin can do anything on cases
CREATE POLICY "Admin All Cases" ON service_cases
  FOR ALL USING (auth.role() = 'authenticated');

-- Admin can do anything on leads
CREATE POLICY "Admin All Leads" ON service_leads
  FOR ALL USING (auth.role() = 'authenticated');

-- Admin can do anything on diagnosis
CREATE POLICY "Admin All Diagnosis" ON diagnosis_results
  FOR ALL USING (auth.role() = 'authenticated');

-- =============================================
-- 8. Default Service Modules Data
-- =============================================
INSERT INTO service_modules (id, name, type, category, description, features, price_min, price_max, price_unit, delivery_days, icon, sort_order) VALUES
('base-01', '基础模块', 'base', '核心', '每个客户必选的底座，包含1个核心Agent + RAG知识库 + 可视化管理后台', '["1个核心Agent（客服/知识库/销售助手）", "基础RAG知识库（PDF/Word/网页）", "Dify/FastGPT可视化管理后台", "DeepSeek API国产模型接入", "网页嵌入/微信基础对话界面", "1次线上培训 + 7天售后支持"]', 10000, 20000, '一次性', '1-3天', '🧱', 0),
('plugin-01', '知识库增强', 'plugin', '知识库', '多数据源接入 + 自动同步 + 复杂文档解析', '["飞书/钉钉/企微文档接入", "自动同步更新", "RAGFlow复杂文档解析（图文混排PDF、合同等）"]', 5000, 10000, '一次性', '半天-1天', '📚', 1),
('plugin-02', '多Agent协作', 'plugin', '多Agent', '新增Agent角色 + 跨部门协作编排', '["新增Agent角色（销售/内容/数据/合规）", "Agent间自动任务流转", "跨部门协作编排"]', 8000, 15000, '/个', '1-2天/个', '🤖', 2),
('plugin-03', '业务系统集成', 'plugin', '集成', '对接ERP/CRM/OA等现有系统', '["对接ERP/CRM/OA/企微/钉钉", "数据双向流通", "API标准化对接"]', 10000, 30000, '/系统', '2-5天/系统', '🔗', 3),
('plugin-04', '数据分析看板', 'plugin', '数据', 'Agent使用统计 + ROI可视化', '["使用统计（调用次数、活跃用户）", "热门问题排行", "满意度追踪", "ROI可视化"]', 8000, 15000, '一次性', '1-2天', '📊', 4),
('plugin-05', '私有化部署', 'plugin', '部署', '本地服务器部署，数据完全隔离', '["本地服务器部署", "One API模型路由网关", "Docker + K8s容器编排", "硬件选型建议和部署实施"]', 100000, 300000, '一次性', '1-2周', '🔒', 5),
('plugin-06', '模型升级', 'plugin', '模型', '本地部署模型 + 多模型路由', '["API切换到本地部署模型（Qwen/DeepSeek）", "多模型路由（任务自动分发）", "模型量化与性能优化"]', 30000, 80000, '一次性', '3-5天', '🧠', 6),
('plugin-07', '多模态能力', 'plugin', '多模态', '图片理解/生成 + 语音转文字', '["图片理解（Qwen-VL）", "图片生成（Stable Diffusion/ComfyUI）", "语音转文字（Whisper/FunASR）"]', 15000, 30000, '/能力', '2-3天/能力', '🎨', 7),
('plugin-08', 'SOP自动化', 'plugin', '自动化', '企业工作流编排成Agent工作流', '["工作流程编排成Agent工作流", "自动执行审批/生成/分发", "LangGraph状态机管理复杂流转"]', 10000, 20000, '/流程', '1-2天/流程', '📝', 8),
('plugin-09', '多渠道接入', 'plugin', '渠道', '微信/企微/钉钉/网页多端接入', '["微信公众号/小程序", "企微机器人/钉钉机器人", "网页Widget"]', 5000, 10000, '/渠道', '半天-1天/渠道', '🌐', 9),
('sub-01', '基础维护', 'subscription', '维护', '知识库月度更新 + Prompt优化 + bug修复', '["知识库月度更新", "Prompt优化", "bug修复", "邮件/微信响应"]', 2000, 2000, '/月', '持续', '🔧', 10),
('sub-02', '高级运营', 'subscription', '运营', '月度报告 + 优化建议 + 优先响应', '["月度使用报告", "优化建议", "新功能建议", "优先响应（4小时内）"]', 5000, 5000, '/月', '持续', '📈', 11),
('sub-03', '模型保鲜', 'subscription', '模型', '跟踪最新模型 + 评估升级 + 执行切换', '["跟踪最新模型动态", "评估升级价值", "执行模型切换", "性能对比报告"]', 3000, 3000, '/月', '持续', '🔄', 12)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  category = EXCLUDED.category,
  description = EXCLUDED.description,
  features = EXCLUDED.features,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  price_unit = EXCLUDED.price_unit,
  delivery_days = EXCLUDED.delivery_days,
  icon = EXCLUDED.icon,
  sort_order = EXCLUDED.sort_order;

-- =============================================
-- 9. Default Service Cases Data
-- =============================================
INSERT INTO service_cases (id, title, industry, company_size, challenge, solution, results, modules_used, is_featured, sort_order) VALUES
('case-01', '电商智能客服', '电商', '10-50人', '客服人力成本高，响应速度慢，80%问题是重复咨询', '部署智能客服Agent，接入企业微信，RAG知识库导入产品目录和退换货政策', '[{"metric": "客服效率提升", "value": "300%"}, {"metric": "客户满意度提升", "value": "40%"}, {"metric": "人力成本节省", "value": "60%"}]', '["base-01", "plugin-09", "plugin-01"]', true, 0),
('case-02', '财务审批自动化', '金融', '50-200人', '审批流程复杂，处理时间长，人工错误率高', '部署智能审批Agent，对接OA系统，自动处理标准化审批流程', '[{"metric": "审批时间缩短", "value": "80%"}, {"metric": "准确率", "value": "99.5%"}, {"metric": "月处理量提升", "value": "5倍"}]', '["base-01", "plugin-03", "plugin-08"]', true, 1),
('case-03', '技术文档问答系统', '通用', '10-50人', '技术文档分散，查找困难，新员工上手慢', '部署RAG知识库问答Agent，导入全部技术文档，支持自然语言检索', '[{"metric": "文档查询效率提升", "value": "500%"}, {"metric": "新员工上手时间缩短", "value": "50%"}, {"metric": "开发效率提升", "value": "25%"}]', '["base-01", "plugin-01"]', true, 2)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  industry = EXCLUDED.industry,
  company_size = EXCLUDED.company_size,
  challenge = EXCLUDED.challenge,
  solution = EXCLUDED.solution,
  results = EXCLUDED.results,
  modules_used = EXCLUDED.modules_used,
  is_featured = EXCLUDED.is_featured,
  sort_order = EXCLUDED.sort_order;

-- =============================================
-- 10. Create updated_at trigger function
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to leads table
DROP TRIGGER IF EXISTS update_service_leads_updated_at ON service_leads;
CREATE TRIGGER update_service_leads_updated_at
  BEFORE UPDATE ON service_leads
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
