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

© 2026 StarFrom AI. All rights reserved.
