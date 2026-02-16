-- =====================================================
-- 创建管理员用户 SQL
-- =====================================================
-- 
-- 使用方法:
-- 1. 登录 https://supabase.com/dashboard
-- 2. 选择你的项目
-- 3. 点击左侧菜单 "SQL Editor"
-- 4. 点击 "New query"
-- 5. 复制粘贴以下内容（修改邮箱和密码）
-- 6. 点击 "Run"
--
-- =====================================================

-- 插入管理员用户（修改邮箱和密码）
INSERT INTO auth.users (
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  confirmation_token,
  email_change_token_new,
  recovery_token
) VALUES (
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@starfrom.ai',  -- 修改为你想要的邮箱
  crypt('StarFrom2025!', gen_salt('bf')),  -- 修改为你想要的密码
  NOW(),
  NOW(),
  NOW(),
  '',
  '',
  ''
)
ON CONFLICT (email) DO NOTHING;

-- 验证用户是否创建成功
SELECT id, email, created_at 
FROM auth.users 
WHERE email = 'admin@starfrom.ai';
