# StarFrom AI - 部署完成清单

## ✅ 已完成（自动）

1. ✅ Next.js 项目代码完成（10个页面）
2. ✅ Supabase 环境变量配置
3. ✅ 定价页面连接数据库（含静态数据回退）
4. ✅ 联系表单连接数据库
5. ✅ 管理员认证系统
6. ✅ 数据库初始化脚本创建

## ⏸️ 待完成（需要你的操作）

### 1. 执行数据库迁移（2分钟）

**方法A：使用脚本（推荐）**

```bash
# 在你的本地终端运行
export NEXT_PUBLIC_SUPABASE_URL=https://ccesxdggmqrbfgsunsod.supabase.co
export SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjZXN4ZGdnbXFyYmZnc3Vuc29kIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczOTY4NDQ0MiwiZXhwIjoyMDU1MjYwNDQyfQ.U6R0cHVy3tjoB6PrLXltR9UcLi8cOYSUWWvlZCRbOvQ
./scripts/setup-database.sh
```

**方法B：手动执行SQL**

```bash
1. 访问 https://supabase.com/dashboard
2. 选择项目：ccesxdggmqrbfgsunsod
3. 左侧菜单 → SQL Editor → New query
4. 打开文件：supabase/init.sql
5. 复制全部内容粘贴到编辑器
6. 点击 Run
```

### 2. 创建管理员用户（1分钟）

**方法A：使用脚本**
```bash
# 如果上面的脚本运行成功，会自动创建管理员
# 默认邮箱: admin@starfrom.ai
# 默认密码: StarFrom2025!
```

**方法B：手动执行SQL**
```bash
1. 访问 https://supabase.com/dashboard
2. SQL Editor → New query
3. 打开文件：supabase/create-admin.sql
4. 修改第32行的邮箱和第33行的密码
5. 点击 Run
```

### 3. 部署到 Vercel（3分钟）

```bash
# 1. 登录 Vercel
vercel login

# 2. 部署（选择 starfroms-projects 组织）
vercel deploy --prod --scope starfroms-projects

# 3. 部署完成后，访问 Vercel Dashboard 添加环境变量
```

### 4. 添加 Vercel 环境变量（2分钟）

访问 https://vercel.com/dashboard → 你的项目 → Settings → Environment Variables

添加以下变量：

```
NEXT_PUBLIC_SUPABASE_URL = https://ccesxdggmqrbfgsunsod.supabase.co

NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjZXN4ZGdnbXFyYmZnc3Vuc29kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk2ODQ0NDIsImV4cCI6MjA1NTI2MDQ0Mn0.3lrXy5dJHNE6lMAbh8L_z81_wFrwjj2jHClTmGDvboE

SUPABASE_SERVICE_ROLE_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjZXN4ZGdnbXFyYmZnc3Vuc29kIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczOTY4NDQ0MiwiZXhwIjoyMDU1MjYwNDQyfQ.U6R0cHVy3tjoB6PrLXltR9UcLi8cOYSUWWvlZCRbOvQ
```

点击 Save，然后重新部署：
```bash
vercel deploy --prod
```

## 📋 验证清单

部署完成后，验证以下功能：

- [ ] 首页正常显示 (https://your-domain.com)
- [ ] 定价页面模块显示正常 (/pricing)
- [ ] 联系表单可以提交 (/contact)
- [ ] 后台可以登录 (/admin)
- [ ] 后台登录邮箱: admin@starfrom.ai
- [ ] 后台登录密码: StarFrom2025!（如果你没修改）

## 🔧 常见问题

**Q: 数据库迁移失败怎么办？**
A: 使用手动SQL方法，复制 supabase/init.sql 内容到 Supabase SQL Editor 执行。

**Q: 管理员无法登录？**
A: 检查是否在 Supabase Authentication → Users 中创建了用户。

**Q: 表单提交失败？**
A: 检查 Vercel 环境变量是否正确设置，特别是 SUPABASE_SERVICE_ROLE_KEY。

**Q: 定价页面显示空白？**
A: 网站会使用静态数据作为回退，检查浏览器控制台是否有错误。

## 📁 重要文件位置

```
starfrom.ai/
├── supabase/
│   ├── init.sql              # 数据库初始化SQL
│   ├── create-admin.sql      # 创建管理员SQL
│   └── migrations/
│       └── 001_init.sql      # 原始迁移文件
├── scripts/
│   ├── setup-database.sh     # 自动设置脚本
│   ├── create-admin.js       # 创建管理员脚本
│   └── run-migration.js      # 迁移脚本
├── .env.local                # 环境变量（已配置）
└── DEPLOY.md                 # 本文件
```

## 🎉 完成！

所有步骤完成后，你将拥有：
- ✅ 完整的 StarFrom AI 网站
- ✅ 可工作的模块化定价器
- ✅ 可提交的咨询表单
- ✅ 可登录的管理后台
- ✅ 数据库已初始化并填充默认数据

---

**总计时间：约 8 分钟**
