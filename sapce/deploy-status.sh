#!/bin/bash

echo "🚀 检查部署状态..."

# 检查 Git 状态
echo "📋 Git 状态:"
git status

echo ""
echo "📦 最近的提交:"
git log --oneline -3

echo ""
echo "🔧 检查构建文件..."
if [ -d "dist" ]; then
    echo "✅ 构建目录存在"
    ls -la dist/
else
    echo "❌ 构建目录不存在，运行 npm run build"
fi

echo ""
echo "🌐 检查配置文件..."
if [ -f "vercel.json" ]; then
    echo "✅ Vercel 配置文件存在"
else
    echo "❌ Vercel 配置文件缺失"
fi

if [ -f ".github/workflows/deploy.yml" ]; then
    echo "✅ GitHub Actions 工作流存在"
else
    echo "❌ GitHub Actions 工作流缺失"
fi

echo ""
echo "🔍 下一步操作:"
echo "1. 推送代码到 GitHub: git push origin main"
echo "2. 在 Vercel 中连接项目"
echo "3. 设置环境变量 GEMINI_API_KEY"
echo "4. 测试自动部署"