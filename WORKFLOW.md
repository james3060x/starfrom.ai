# 网站内容更新工作流程

## 步骤

1. **修改文字**: 直接编辑 `content.md` 中的文字内容
2. **保存文件**: 保存后运行 `npm run deploy`（会自动生成 content.ts 并推送到 Git）
3. **重新部署**: 等待 Vercel 自动部署（约 1-2 分钟）
4. **查看效果**: 访问网站查看更新后的效果

## 说明

- 只需要修改 `content.md` 文件
- 不要手动编辑 `src/lib/content.ts`（该文件由脚本自动生成）
- `npm run deploy` 命令会自动：
  - 运行 `parse-content.js` 生成 content.ts
  - 提交所有更改到 Git
  - 推送到 GitHub
  - Vercel 检测到推送后会自动重新部署

## 验证

部署完成后，请访问 https://starfrom-ai.vercel.app/ 查看更新效果。
