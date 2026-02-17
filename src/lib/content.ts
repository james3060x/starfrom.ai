/**
 * Website Content Configuration
 * 
 * Edit this file to change website text content
 * After editing, commit and push to deploy changes
 * 
 * Structure:
 * - site: Global site info
 * - nav: Navigation menu
 * - home: Homepage sections
 * - services: Services page
 * - pricing: Pricing page
 * - contact: Contact page
 * - footer: Footer content
 * - modules: Service modules
 * - cases: Case studies
 */

// ==================== GLOBAL ====================
export const siteContent = {
  name: "StarFrom.AI",
  tagline: "AI 智能体定制服务",
  description: "为中小企业打造专属 AI 智能体，模板化交付，3 天上线，让 AI 技术触手可及。",
  copyright: "© 2026 StarFrom AI. All rights reserved."
}

// ==================== NAVIGATION ====================
export const navContent = {
  logo: {
    brand: "StarFrom",
    suffix: ".AI"
  },
  menu: [
    { label: "服务", href: "/services" },
    { label: "定价", href: "/pricing" },
    { label: "案例", href: "/cases" },
    { label: "Demo", href: "/demo" },
    { label: "联系", href: "/contact" }
  ],
  cta: "免费诊断"
}

// ==================== HOME PAGE ====================
export const homeContent = {
  hero: {
    badge: "AI 智能体定制服务",
    version: "v2.0",
    title: "为中小企业",
    titleHighlight: "打造专属 AI",
    subtitle: "模板化交付，3 天上线，仅需市场价 30%",
    subtitleHighlight1: "3 天上线",
    subtitleHighlight2: "30%",
    features: "智能客服 · 知识库问答 · 流程自动化 · 全渠道接入",
    ctaPrimary: "免费 AI 诊断",
    ctaSecondary: "了解服务详情",
    pills: [
      { label: "3天交付", desc: "极速上线" },
      { label: "¥1万起", desc: "超高性价比" },
      { label: "数据不出境", desc: "安全合规" }
    ]
  },
  
  painPoints: {
    label: "痛点解决",
    title: "这些问题是否困扰着您？",
    subtitle: "我们帮助中小企业解决日常运营中的效率瓶颈",
    items: [
      {
        title: "客服回复慢，人力成本高",
        solution: "AI 智能客服",
        description: "80% 常见问题由 AI 自动回复，7×24 小时在线服务，大幅降低人力成本",
        stat: "效率提升 300%"
      },
      {
        title: "知识分散，员工重复提问",
        solution: "RAG 知识库",
        description: "企业知识统一管理，员工随时提问，秒级获取精准答案，知识沉淀复用",
        stat: "查询效率提升 5 倍"
      },
      {
        title: "重复审批，流程拖沓",
        solution: "SOP 自动化",
        description: "标准化审批流程自动化处理，让团队专注于核心工作，不再被琐事困扰",
        stat: "效率提升 80%"
      }
    ]
  },
  
  modules: {
    label: "产品服务",
    title: "模块化 AI 服务",
    subtitle: "从基础底座开始，根据业务需求灵活叠加功能模块",
    baseModule: {
      title: "基础模块",
      subtitle: "每个客户必选的底座方案",
      features: [
        "1个核心 Agent",
        "基础 RAG 知识库",
        "可视化管理后台",
        "国产模型接入",
        "网页嵌入界面",
        "培训 + 售后支持"
      ],
      price: "¥10,000",
      priceNote: "起",
      priceDesc: "一次性费用 · 1-3天交付"
    },
    plugins: [
      { title: "知识库增强", desc: "多数据源接入" },
      { title: "多 Agent 协作", desc: "跨部门协作" },
      { title: "业务系统集成", desc: "对接现有系统" },
      { title: "多渠道接入", desc: "微信/企微/钉钉" }
    ],
    cta: "查看全部模块与定价"
  },
  
  process: {
    label: "交付流程",
    title: "5 步交付，最快 3 天上线",
    subtitle: "标准化交付流程，确保每个项目高质量准时交付",
    steps: [
      { title: "需求诊断", duration: "1 天", desc: "深入了解业务场景，明确 AI 应用场景" },
      { title: "Demo 演示", duration: "1 天", desc: "展示真实效果，确认方案可行性" },
      { title: "签约确认", duration: "", desc: "明确交付内容和周期，签署服务协议" },
      { title: "配置部署", duration: "1-2 天", desc: "知识库导入、Prompt 调优、系统集成" },
      { title: "培训交付", duration: "半天", desc: "使用培训、文档交付、上线支持" }
    ]
  },
  
  cases: {
    label: "成功案例",
    title: "客户成功案例",
    subtitle: "看看其他企业如何通过 AI 智能体提升效率",
    items: [
      {
        title: "电商智能客服",
        industry: "电商",
        size: "10-50人",
        metrics: [
          { label: "效率提升", value: "300%" },
          { label: "满意度", value: "+40%" },
          { label: "成本节省", value: "60%" }
        ]
      },
      {
        title: "财务审批自动化",
        industry: "金融",
        size: "50-200人",
        metrics: [
          { label: "时间缩短", value: "80%" },
          { label: "准确率", value: "99.5%" },
          { label: "处理量", value: "5×" }
        ]
      },
      {
        title: "技术文档问答",
        industry: "科技",
        size: "10-50人",
        metrics: [
          { label: "查询效率", value: "500%" },
          { label: "上手时间", value: "-50%" },
          { label: "开发效率", value: "+25%" }
        ]
      }
    ],
    cta: "查看更多案例"
  },
  
  cta: {
    badge: "限时免费",
    title: "准备好开启",
    titleHighlight: "AI 智能化转型",
    description: "30 分钟免费诊断，0 费用，输出专属 AI 落地方案",
    button: "开始免费诊断"
  }
}

// ==================== SERVICES PAGE ====================
export const servicesContent = {
  hero: {
    title: "服务详情",
    subtitle: "模块化 AI 服务，灵活组合，满足各类企业需求"
  },
  ctaButton: "前往定价器配置方案",
  bottomCta: {
    title: "准备好开始了吗？",
    subtitle: "获取专属 AI 解决方案，30 分钟免费诊断",
    primary: "免费 AI 诊断",
    secondary: "联系我们"
  }
}

// ==================== PRICING PAGE ====================
export const pricingContent = {
  hero: {
    title: "模块化定价器",
    subtitle: "按需选择模块，实时计算价格，获取专属方案"
  },
  sections: {
    base: "基础模块（必选）",
    plugins: "增值模块（按需勾选）",
    subscription: "持续服务（可选 1 档）"
  },
  summary: {
    title: "价格汇总",
    empty: "请选择模块",
    onetime: "一次性费用",
    monthly: "月度费用",
    button: "获取精准报价",
    note: "最终价格根据具体需求评估"
  }
}

// ==================== CONTACT PAGE ====================
export const contactContent = {
  hero: {
    title: "联系我们",
    subtitle: "告诉我们您的需求，我们将在24小时内与您联系"
  },
  info: {
    title: "联系方式",
    email: { label: "邮箱", value: "contact@starfrom.ai" },
    wechat: { label: "微信", value: "starfrom-ai" },
    workHours: { label: "工作时间", value: "周一至周五 9:00-18:00" }
  },
  response: {
    title: "响应时间",
    items: [
      "表单提交：24小时内",
      "微信咨询：2小时内",
      "紧急需求：1小时内"
    ]
  },
  quickDiagnosis: {
    title: "想要快速了解？",
    subtitle: "试试我们的 AI 需求诊断工具",
    button: "免费诊断"
  },
  form: {
    selectedModules: "您已选择的模块：",
    company: { label: "公司名称", placeholder: "请输入公司名称" },
    name: { label: "联系人姓名 *", placeholder: "请输入联系人姓名" },
    phone: { label: "手机号", placeholder: "请输入手机号" },
    wechat: { label: "微信号", placeholder: "请输入微信号" },
    email: { label: "邮箱", placeholder: "请输入邮箱" },
    industry: { label: "行业", placeholder: "选择行业" },
    size: { label: "团队规模", placeholder: "选择团队规模" },
    needs: { label: "需求类型（可多选）" },
    budget: { label: "预算范围", placeholder: "选择预算范围" },
    timeline: { label: "期望上线时间", placeholder: "选择期望上线时间" },
    notes: { label: "补充说明", placeholder: "请描述您的具体需求或问题..." },
    submit: "提交咨询",
    submitting: "提交中..."
  },
  success: {
    title: "已收到您的需求",
    message: "我们将在 24 小时内与您联系",
    urgent: "如需紧急咨询，请添加微信：starfrom-ai"
  }
}

// ==================== FOOTER ====================
export const footerContent = {
  description: "为中小企业打造专属 AI 智能体，模板化交付，3 天上线，让 AI 技术触手可及。",
  links: {
    product: {
      title: "产品",
      items: [
        { label: "服务详情", href: "/services" },
        { label: "定价方案", href: "/pricing" },
        { label: "成功案例", href: "/cases" },
        { label: "在线体验", href: "/demo" }
      ]
    },
    company: {
      title: "公司",
      items: [
        { label: "关于我们", href: "#" },
        { label: "联系方式", href: "/contact" },
        { label: "加入我们", href: "#" },
        { label: "合作伙伴", href: "#" }
      ]
    },
    resources: {
      title: "资源",
      items: [
        { label: "帮助中心", href: "#" },
        { label: "API 文档", href: "#" },
        { label: "开发博客", href: "#" },
        { label: "社区", href: "#" }
      ]
    }
  },
  bottom: {
    privacy: "隐私政策",
    terms: "服务条款",
    compliance: "数据不出境 · 安全合规"
  }
}

// ==================== SERVICE MODULES ====================
export const modulesContent = {
  base: {
    id: "base-01",
    name: "基础模块",
    category: "核心",
    description: "每个客户必选的底座，包含1个核心Agent + RAG知识库 + 可视化管理后台",
    features: [
      "1个核心Agent（客服/知识库/销售助手）",
      "基础RAG知识库（PDF/Word/网页）",
      "Dify/FastGPT可视化管理后台",
      "DeepSeek API国产模型接入",
      "网页嵌入/微信基础对话界面",
      "1次线上培训 + 7天售后支持"
    ],
    priceMin: 10000,
    priceMax: 20000,
    priceUnit: "一次性",
    deliveryDays: "1-3天",
    icon: "🧱"
  },
  
  plugins: [
    {
      id: "plugin-01",
      name: "知识库增强",
      category: "知识库",
      description: "多数据源接入 + 自动同步 + 复杂文档解析",
      features: ["飞书/钉钉/企微文档接入", "自动同步更新", "RAGFlow复杂文档解析（图文混排PDF、合同等）"],
      priceMin: 5000,
      priceMax: 10000,
      priceUnit: "一次性",
      deliveryDays: "半天-1天",
      icon: "📚"
    },
    {
      id: "plugin-02",
      name: "多Agent协作",
      category: "多Agent",
      description: "新增Agent角色 + 跨部门协作编排",
      features: ["新增Agent角色（销售/内容/数据/合规）", "Agent间自动任务流转", "跨部门协作编排"],
      priceMin: 8000,
      priceMax: 15000,
      priceUnit: "/个",
      deliveryDays: "1-2天/个",
      icon: "🤖"
    },
    {
      id: "plugin-03",
      name: "业务系统集成",
      category: "集成",
      description: "对接ERP/CRM/OA等现有系统",
      features: ["对接ERP/CRM/OA/企微/钉钉", "数据双向流通", "API标准化对接"],
      priceMin: 10000,
      priceMax: 30000,
      priceUnit: "/系统",
      deliveryDays: "2-5天/系统",
      icon: "🔗"
    },
    {
      id: "plugin-04",
      name: "数据分析看板",
      category: "数据",
      description: "Agent使用统计 + ROI可视化",
      features: ["使用统计（调用次数、活跃用户）", "热门问题排行", "满意度追踪", "ROI可视化"],
      priceMin: 8000,
      priceMax: 15000,
      priceUnit: "一次性",
      deliveryDays: "1-2天",
      icon: "📊"
    },
    {
      id: "plugin-09",
      name: "多渠道接入",
      category: "渠道",
      description: "微信/企微/钉钉/网页多端接入",
      features: ["微信公众号/小程序", "企微机器人/钉钉机器人", "网页Widget"],
      priceMin: 5000,
      priceMax: 10000,
      priceUnit: "/渠道",
      deliveryDays: "半天-1天/渠道",
      icon: "🌐"
    }
  ],
  
  subscriptions: [
    {
      id: "sub-01",
      name: "基础维护",
      category: "维护",
      description: "知识库月度更新 + Prompt优化 + bug修复",
      features: ["知识库月度更新", "Prompt优化", "bug修复", "邮件/微信响应"],
      priceMin: 2000,
      priceMax: 2000,
      priceUnit: "/月",
      deliveryDays: "持续",
      icon: "🔧"
    },
    {
      id: "sub-02",
      name: "高级运营",
      category: "运营",
      description: "月度报告 + 优化建议 + 优先响应",
      features: ["月度使用报告", "优化建议", "新功能建议", "优先响应（4小时内）"],
      priceMin: 5000,
      priceMax: 5000,
      priceUnit: "/月",
      deliveryDays: "持续",
      icon: "📈"
    },
    {
      id: "sub-03",
      name: "模型保鲜",
      category: "模型",
      description: "跟踪最新模型 + 评估升级 + 执行切换",
      features: ["跟踪最新模型动态", "评估升级价值", "执行模型切换", "性能对比报告"],
      priceMin: 3000,
      priceMax: 3000,
      priceUnit: "/月",
      deliveryDays: "持续",
      icon: "🔄"
    }
  ]
}

// ==================== CASE STUDIES ====================
export const casesContent = [
  {
    id: "case-01",
    title: "电商智能客服",
    industry: "电商",
    companySize: "10-50人",
    challenge: "客服人力成本高，响应速度慢，80%问题是重复咨询",
    solution: "部署智能客服Agent，接入企业微信，RAG知识库导入产品目录和退换货政策",
    results: [
      { metric: "客服效率提升", value: "300%" },
      { metric: "客户满意度提升", value: "40%" },
      { metric: "人力成本节省", value: "60%" }
    ],
    modules: ["base-01", "plugin-09", "plugin-01"]
  },
  {
    id: "case-02",
    title: "财务审批自动化",
    industry: "金融",
    companySize: "50-200人",
    challenge: "审批流程复杂，处理时间长，人工错误率高",
    solution: "部署智能审批Agent，对接OA系统，自动处理标准化审批流程",
    results: [
      { metric: "审批时间缩短", value: "80%" },
      { metric: "准确率", value: "99.5%" },
      { metric: "月处理量提升", value: "5倍" }
    ],
    modules: ["base-01", "plugin-03", "plugin-08"]
  },
  {
    id: "case-03",
    title: "技术文档问答系统",
    industry: "通用",
    companySize: "10-50人",
    challenge: "技术文档分散，查找困难，新员工上手慢",
    solution: "部署RAG知识库问答Agent，导入全部技术文档，支持自然语言检索",
    results: [
      { metric: "文档查询效率提升", value: "500%" },
      { metric: "新员工上手时间缩短", value: "50%" },
      { metric: "开发效率提升", value: "25%" }
    ],
    modules: ["base-01", "plugin-01"]
  }
]

// ==================== FORM OPTIONS ====================
export const optionsContent = {
  industries: ["电商", "教育", "制造", "医疗", "金融", "通用", "其他"],
  companySizes: ["1-10人", "10-50人", "50-200人", "200人以上"],
  needTypes: ["智能客服", "知识库问答", "内容生成", "数据分析", "流程自动化", "系统集成", "私有化部署", "其他"],
  budgetRanges: ["1-3万", "3-10万", "10-30万", "30万以上", "不确定"],
  timelines: ["1周内", "1个月内", "3个月内", "不确定"]
}
