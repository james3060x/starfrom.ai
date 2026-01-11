# 🚀 自动部署指南

## 📋 部署概览

本项目已配置完整的自动化部署流程，使用 GitHub + Vercel 实现 CI/CD。

## 🔧 自动部署设置

### 1. GitHub Actions 配置
- **触发条件**: 推送到 `main` 分支
- **流程**: 
  1. 自动检查代码
  2. 安装依赖
  3. 构建项目
  4. 部署到 Vercel

### 2. Vercel 配置
- **框架**: Vite + React
- **构建命令**: `npm run build`
- **输出目录**: `dist`

## 🎯 环境变量设置

### GitHub Secrets 需要配置：
1. `VERCEL_TOKEN`: Vercel API Token
2. `VERCEL_ORG_ID`: Vercel 组织 ID
3. `VERCEL_PROJECT_ID`: Vercel 项目 ID

### Vercel 环境变量：
1. `GEMINI_API_KEY`: Google Gemini API Key

## 📝 部署步骤

### 首次部署：
1. 连接 GitHub 仓库到 Vercel
2. 配置环境变量
3. 部署完成

### 后续自动部署：
- 任何推送到 `main` 分支的代码都会自动部署
- Pull Request 会创建预览部署

## 🛠️ 本地部署测试

```bash
# 安装 Vercel CLI
npm install -g vercel

# 本地构建测试
npm run build

# 预览构建结果
npm run preview

# 部署到 Vercel
vercel --prod
```

## 📊 部署状态

- ✅ 代码已提交到 GitHub
- ✅ Vercel 配置已创建
- ✅ GitHub Actions 工作流已设置
- ⏳ 等待推送到远程仓库

## 🔍 监控和调试

### 查看部署状态：
1. GitHub Actions 标签页
2. Vercel Dashboard
3. 部署日志

### 常见问题：
- **构建失败**: 检查依赖和代码语法
- **环境变量**: 确保所有必需的变量都已设置
- **路由问题**: 检查 vercel.json 重写规则

## 🎉 自动化收益

- **零停机部署**: Vercel 自动处理
- **预览部署**: 每个 PR 都有独立预览
- **回滚支持**: 一键回滚到之前版本
- **性能监控**: Vercel Analytics 集成
- **CDN 加速**: 全球 CDN 分发