import type { Database } from '@/lib/supabase/types'

export type Module = Database['public']['Tables']['service_modules']['Row']
export type ServiceCase = Database['public']['Tables']['service_cases']['Row']
export type Lead = Database['public']['Tables']['service_leads']['Row']
export type DiagnosisResult = Database['public']['Tables']['diagnosis_results']['Row']

export const defaultModules: Module[] = [
  {
    id: 'base-01',
    name: '基础模块',
    type: 'base',
    category: '核心',
    description: '每个客户必选的底座，包含1个核心Agent + RAG知识库 + 可视化管理后台',
    features: ["1个核心Agent（客服/知识库/销售助手）", "基础RAG知识库（PDF/Word/网页）", "Dify/FastGPT可视化管理后台", "DeepSeek API国产模型接入", "网页嵌入/微信基础对话界面", "1次线上培训 + 7天售后支持"],
    price_min: 10000,
    price_max: 20000,
    price_unit: '一次性',
    delivery_days: '1-3天',
    icon: '🧱',
    sort_order: 0,
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'plugin-01',
    name: '知识库增强',
    type: 'plugin',
    category: '知识库',
    description: '多数据源接入 + 自动同步 + 复杂文档解析',
    features: ["飞书/钉钉/企微文档接入", "自动同步更新", "RAGFlow复杂文档解析（图文混排PDF、合同等）"],
    price_min: 5000,
    price_max: 10000,
    price_unit: '一次性',
    delivery_days: '半天-1天',
    icon: '📚',
    sort_order: 1,
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'plugin-02',
    name: '多Agent协作',
    type: 'plugin',
    category: '多Agent',
    description: '新增Agent角色 + 跨部门协作编排',
    features: ["新增Agent角色（销售/内容/数据/合规）", "Agent间自动任务流转", "跨部门协作编排"],
    price_min: 8000,
    price_max: 15000,
    price_unit: '/个',
    delivery_days: '1-2天/个',
    icon: '🤖',
    sort_order: 2,
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'plugin-03',
    name: '业务系统集成',
    type: 'plugin',
    category: '集成',
    description: '对接ERP/CRM/OA等现有系统',
    features: ["对接ERP/CRM/OA/企微/钉钉", "数据双向流通", "API标准化对接"],
    price_min: 10000,
    price_max: 30000,
    price_unit: '/系统',
    delivery_days: '2-5天/系统',
    icon: '🔗',
    sort_order: 3,
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'plugin-04',
    name: '数据分析看板',
    type: 'plugin',
    category: '数据',
    description: 'Agent使用统计 + ROI可视化',
    features: ["使用统计（调用次数、活跃用户）", "热门问题排行", "满意度追踪", "ROI可视化"],
    price_min: 8000,
    price_max: 15000,
    price_unit: '一次性',
    delivery_days: '1-2天',
    icon: '📊',
    sort_order: 4,
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'plugin-05',
    name: '私有化部署',
    type: 'plugin',
    category: '部署',
    description: '本地服务器部署，数据完全隔离',
    features: ["本地服务器部署", "One API模型路由网关", "Docker + K8s容器编排", "硬件选型建议和部署实施"],
    price_min: 100000,
    price_max: 300000,
    price_unit: '一次性',
    delivery_days: '1-2周',
    icon: '🔒',
    sort_order: 5,
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'plugin-06',
    name: '模型升级',
    type: 'plugin',
    category: '模型',
    description: '本地部署模型 + 多模型路由',
    features: ["API切换到本地部署模型（Qwen/DeepSeek）", "多模型路由（任务自动分发）", "模型量化与性能优化"],
    price_min: 30000,
    price_max: 80000,
    price_unit: '一次性',
    delivery_days: '3-5天',
    icon: '🧠',
    sort_order: 6,
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'plugin-07',
    name: '多模态能力',
    type: 'plugin',
    category: '多模态',
    description: '图片理解/生成 + 语音转文字',
    features: ["图片理解（Qwen-VL）", "图片生成（Stable Diffusion/ComfyUI）", "语音转文字（Whisper/FunASR）"],
    price_min: 15000,
    price_max: 30000,
    price_unit: '/能力',
    delivery_days: '2-3天/能力',
    icon: '🎨',
    sort_order: 7,
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'plugin-08',
    name: 'SOP自动化',
    type: 'plugin',
    category: '自动化',
    description: '企业工作流编排成Agent工作流',
    features: ["工作流程编排成Agent工作流", "自动执行审批/生成/分发", "LangGraph状态机管理复杂流转"],
    price_min: 10000,
    price_max: 20000,
    price_unit: '/流程',
    delivery_days: '1-2天/流程',
    icon: '📝',
    sort_order: 8,
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'plugin-09',
    name: '多渠道接入',
    type: 'plugin',
    category: '渠道',
    description: '微信/企微/钉钉/网页多端接入',
    features: ["微信公众号/小程序", "企微机器人/钉钉机器人", "网页Widget"],
    price_min: 5000,
    price_max: 10000,
    price_unit: '/渠道',
    delivery_days: '半天-1天/渠道',
    icon: '🌐',
    sort_order: 9,
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'sub-01',
    name: '基础维护',
    type: 'subscription',
    category: '维护',
    description: '知识库月度更新 + Prompt优化 + bug修复',
    features: ["知识库月度更新", "Prompt优化", "bug修复", "邮件/微信响应"],
    price_min: 2000,
    price_max: 2000,
    price_unit: '/月',
    delivery_days: '持续',
    icon: '🔧',
    sort_order: 10,
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'sub-02',
    name: '高级运营',
    type: 'subscription',
    category: '运营',
    description: '月度报告 + 优化建议 + 优先响应',
    features: ["月度使用报告", "优化建议", "新功能建议", "优先响应（4小时内）"],
    price_min: 5000,
    price_max: 5000,
    price_unit: '/月',
    delivery_days: '持续',
    icon: '📈',
    sort_order: 11,
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'sub-03',
    name: '模型保鲜',
    type: 'subscription',
    category: '模型',
    description: '跟踪最新模型 + 评估升级 + 执行切换',
    features: ["跟踪最新模型动态", "评估升级价值", "执行模型切换", "性能对比报告"],
    price_min: 3000,
    price_max: 3000,
    price_unit: '/月',
    delivery_days: '持续',
    icon: '🔄',
    sort_order: 12,
    is_active: true,
    created_at: new Date().toISOString()
  }
]

export const defaultCases: ServiceCase[] = [
  {
    id: 'case-01',
    title: '电商智能客服',
    industry: '电商',
    company_size: '10-50人',
    challenge: '客服人力成本高，响应速度慢，80%问题是重复咨询',
    solution: '部署智能客服Agent，接入企业微信，RAG知识库导入产品目录和退换货政策',
    results: [{"metric": "客服效率提升", "value": "300%"}, {"metric": "客户满意度提升", "value": "40%"}, {"metric": "人力成本节省", "value": "60%"}],
    modules_used: ["base-01", "plugin-09", "plugin-01"],
    testimonial: null,
    image_url: null,
    is_featured: true,
    sort_order: 0,
    created_at: new Date().toISOString()
  },
  {
    id: 'case-02',
    title: '财务审批自动化',
    industry: '金融',
    company_size: '50-200人',
    challenge: '审批流程复杂，处理时间长，人工错误率高',
    solution: '部署智能审批Agent，对接OA系统，自动处理标准化审批流程',
    results: [{"metric": "审批时间缩短", "value": "80%"}, {"metric": "准确率", "value": "99.5%"}, {"metric": "月处理量提升", "value": "5倍"}],
    modules_used: ["base-01", "plugin-03", "plugin-08"],
    testimonial: null,
    image_url: null,
    is_featured: true,
    sort_order: 1,
    created_at: new Date().toISOString()
  },
  {
    id: 'case-03',
    title: '技术文档问答系统',
    industry: '通用',
    company_size: '10-50人',
    challenge: '技术文档分散，查找困难，新员工上手慢',
    solution: '部署RAG知识库问答Agent，导入全部技术文档，支持自然语言检索',
    results: [{"metric": "文档查询效率提升", "value": "500%"}, {"metric": "新员工上手时间缩短", "value": "50%"}, {"metric": "开发效率提升", "value": "25%"}],
    modules_used: ["base-01", "plugin-01"],
    testimonial: null,
    image_url: null,
    is_featured: true,
    sort_order: 2,
    created_at: new Date().toISOString()
  }
]

export const industries = [
  '电商',
  '教育',
  '制造',
  '医疗',
  '金融',
  '通用',
  '其他'
] as const

export const companySizes = [
  '1-10人',
  '10-50人',
  '50-200人',
  '200人以上'
] as const

export const needTypes = [
  '智能客服',
  '知识库问答',
  '内容生成',
  '数据分析',
  '流程自动化',
  '系统集成',
  '私有化部署',
  '其他'
] as const

export const budgetRanges = [
  '1-3万',
  '3-10万',
  '10-30万',
  '30万以上',
  '不确定'
] as const

export const timelines = [
  '1周内',
  '1个月内',
  '3个月内',
  '不确定'
] as const

export const leadSources = [
  { value: 'hero', label: '首页' },
  { value: 'pricing', label: '定价页' },
  { value: 'case', label: '案例页' },
  { value: 'diagnosis', label: '诊断工具' },
  { value: 'footer', label: '页脚' },
  { value: 'demo', label: 'Demo体验' },
] as const

export const leadStatuses = [
  { value: 'new', label: '新线索', color: 'bg-blue-500' },
  { value: 'contacted', label: '已联系', color: 'bg-yellow-500' },
  { value: 'demo_scheduled', label: '预约演示', color: 'bg-purple-500' },
  { value: 'proposal', label: '方案中', color: 'bg-orange-500' },
  { value: 'signed', label: '已签约', color: 'bg-green-500' },
  { value: 'lost', label: '已流失', color: 'bg-gray-500' },
] as const
