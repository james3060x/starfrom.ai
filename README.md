# StarFrom AI - 企业级 AI 智能体服务官网

为中小企业打造专属 AI 智能体，模板化交付，3 天上线，仅需市场价 30%。

## 项目结构

```
starfrom-ai/
├── src/
│   ├── app/                    # Next.js App Router 页面
│   │   ├── page.tsx            # 首页
│   │   ├── layout.tsx          # 根布局
│   │   ├── services/           # 服务详情页
│   │   ├── pricing/            # 模块化定价器
│   │   ├── cases/              # 成功案例页
│   │   ├── contact/            # 咨询表单页
│   │   ├── demo/               # Demo Agent 体验
│   │   ├── diagnosis/          # AI 需求诊断工具
│   │   ├── admin/              # 管理后台
│   │   └── api/                # API 路由
│   ├── components/             # React 组件
│   │   ├── ui/                 # shadcn/ui 组件
│   │   ├── layout/             # 布局组件
│   │   ├── home/               # 首页区块组件
│   │   ├── services/           # 服务页组件
│   │   ├── pricing/            # 定价器组件
│   │   ├── cases/              # 案例页组件
│   │   ├── contact/            # 联系表单组件
│   │   ├── diagnosis/          # 诊断工具组件
│   │   └── demo/               # Demo 组件
│   ├── lib/                    # 工具函数和配置
│   │   ├── supabase/           # Supabase 客户端
│   │   ├── store.ts            # Zustand 状态管理
│   │   └── constants.ts        # 常量定义
│   └── styles/                 # 样式文件
├── supabase/
│   └── migrations/             # 数据库迁移文件
└── public/                     # 静态资源
```

## 技术栈

- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS + shadcn/ui
- **数据库**: Supabase (PostgreSQL)
- **状态管理**: Zustand
- **部署**: Vercel

## 页面清单

| 页面 | 路径 | 描述 |
|------|------|------|
| 首页 | `/` | 6 个区块长滚动页面 |
| 服务详情 | `/services` | 模块展示、技术栈、合规说明 |
| 定价器 | `/pricing` | 模块化定价器（核心交互） |
| 案例 | `/cases` | 行业筛选、案例卡片 |
| 联系 | `/contact` | 咨询表单 |
| Demo | `/demo` | 在线体验 AI Agent |
| 诊断 | `/diagnosis` | AI 需求诊断工具 |
| 后台 | `/admin` | 管理仪表盘、线索、模块、案例 |

## 核心功能

### 1. 模块化定价器
- 左侧模块选择区（基础模块、增值模块、持续服务）
- 右侧 sticky 价格汇总栏
- Zustand 状态管理，支持跨页面传递
- 实时计算一次性费用和月度费用

### 2. AI 需求诊断工具
- 5 步问卷向导
- 基于回答的智能推荐算法
- 输出推荐模块组合和价格预估

### 3. Demo Agent 体验
- 3 个场景选择（智能客服、知识库、内容生成）
- 聊天界面支持流式输出
- 10 轮对话限制 + 引导转化

### 4. 管理后台
- 仪表盘统计
- 线索列表查看
- 模块/案例管理

## 数据库表

### service_modules
服务模块表（基础模块、增值模块、持续服务）

### service_cases
成功案例表

### service_leads
客户线索表

### diagnosis_results
AI 诊断结果表

## 环境变量

```bash
NEXT_PUBLIC_SUPABASE_URL=你的Supabase项目URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的Supabase Anon Key
SUPABASE_SERVICE_ROLE_KEY=你的Supabase Service Role Key
DIFY_API_KEY=你的Dify API Key（可选）
DIFY_API_URL=你的Dify API URL（可选）
```

## 部署说明

### 1. Supabase 设置

1. 创建 Supabase 项目
2. 在 SQL Editor 中运行 `supabase/migrations/001_init.sql`
3. 获取项目 URL 和 API Keys

### 2. 本地开发

```bash
npm install
cp .env.local.example .env.local
npm run dev
```

### 3. 构建部署

```bash
npm run build
```

## 设计系统

- **主色**: #1e3a5f (深蓝)
- **强调色**: #06b6d4 (青绿)
- **背景**: 白色、#f8fafc (浅灰)

---

## 功能列表

### ✅ 已完成功能

#### 网站前台页面
| 功能 | 路径 | 描述 |
|------|------|------|
| 首页 | `/` | 6 个区块长滚动页面：Hero、痛点解决、产品服务、交付流程、成功案例、CTA |
| 服务详情 | `/services` | 模块展示、技术栈、合规说明 |
| 模块化定价器 | `/pricing` | 左侧模块选择 + 右侧 sticky 价格汇总栏，实时计算费用 |
| 成功案例 | `/cases` | 行业筛选、案例卡片展示 |
| 联系我们 | `/contact` | 咨询表单，支持从定价器带入已选模块 |
| Demo 体验 | `/demo` | 3 个场景（智能客服、知识库、内容生成），流式输出，10 轮限制 |
| AI 诊断 | `/diagnosis` | 5 步问卷向导，智能推荐模块组合和价格预估 |
| AgentOS | `/agentos` | 企业级多 Agent 协作平台营销页 |

#### 用户 Dashboard（Phase 1 完成）
| 功能 | 路径 | 描述 |
|------|------|------|
| 注册 | `/auth/signup` | 邮箱注册、OAuth（Google/GitHub）、7天试用 |
| 登录 | `/auth/login` | 邮箱登录、OAuth、忘记密码 |
| 认证回调 | `/auth/callback` | 登录后重定向 |
| Dashboard 首页 | `/dashboard` | 统计卡片、最近使用的 Agent、快速操作 |
| Agent 列表 | `/dashboard/agents` | Agent 卡片、创建/编辑/删除、额度限制 |
| 创建 Agent | `/dashboard/agents/new` | 表单：名称、描述、图标、模型配置、提示词模板 |
| 对话界面 | `/dashboard/chat/[id]` | 实时对话、会话列表、消息操作 |
| 知识库 | `/dashboard/knowledge` | 知识库列表、文件管理 |
| 设置 | `/dashboard/settings` | 账户信息、套餐管理、API 密钥、MCP 配置 |

#### 管理后台
| 功能 | 路径 | 描述 |
|------|------|------|
| 仪表盘 | `/admin` | 数据统计总览 |
| 线索管理 | `/admin/leads` | 客户线索列表、状态管理 |
| 模块管理 | `/admin/modules` | 服务模块 CRUD |
| 案例管理 | `/admin/cases` | 成功案例 CRUD |
| 登录 | `/admin/login` | 管理员身份验证 |

#### API 与集成
| 功能 | 路径 | 描述 |
|------|------|------|
| Chat API | `/api/chat` | 与 Agent 对话接口 |
| MCP Server | `/api/mcp` | Model Context Protocol 服务端 |
| Rate Limiting | - | 基于 Upstash Redis 的请求限流 |
| SDK | `@starfrom/agentos-sdk` | JavaScript/TypeScript 客户端库 |

#### 数据库表
- `service_modules` - 服务模块（基础模块 1 个、增值模块 9 个、持续服务 3 个）
- `service_cases` - 成功案例
- `service_leads` - 客户线索
- `diagnosis_results` - AI 诊断结果
- `solo_users` - 用户套餐信息
- `user_agents` - 用户的 Agent
- `user_conversations` - 对话会话
- `chat_messages` - 对话消息
- `knowledge_bases` - 知识库
- `api_keys` - API 密钥

---

### 📋 计划功能

#### Phase 2: 知识库 + 支付
- [ ] **文件上传组件**: 拖拽上传、进度显示、文件处理
- [ ] **文档向量化**: PDF 解析、文本切片、Embedding 生成
- [ ] **RAG 集成**: 知识检索、上下文注入
- [ ] **支付系统**: Lemon Squeezy 集成、订阅管理

#### Phase 3: Open API + MCP 增强
- [ ] **完整 Agent 推理集成**: 连接实际 Agent 推理服务
- [ ] **GraphRAG 知识图谱**: 知识搜索增强
- [ ] **更多 MCP Tools**: 会话管理、文件上传等

#### Phase 4: 企业功能
- [ ] **Workflow 工作流**: 可视化编排界面
- [ ] **多 Agent 协作**: Agent 角色管理、任务自动流转
- [ ] **Webhook 系统**: 事件订阅与回调
- [ ] **团队/工作空间**: 多团队支持，权限分级
- [ ] **用量统计**: API 调用统计，计费明细
- [ ] **Python SDK**

---

© 2026 StarFrom AI. All rights reserved.
