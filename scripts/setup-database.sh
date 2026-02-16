#!/bin/bash
# StarFrom AI - 数据库初始化脚本
# 使用方法: ./scripts/setup-database.sh

set -e

echo "🚀 StarFrom AI 数据库初始化"
echo ""

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查环境变量
if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ] || [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
    echo -e "${RED}❌ 错误: 缺少环境变量${NC}"
    echo "请设置以下环境变量:"
    echo "  - NEXT_PUBLIC_SUPABASE_URL"
    echo "  - SUPABASE_SERVICE_ROLE_KEY"
    echo ""
    echo "示例:"
    echo "export NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co"
    echo "export SUPABASE_SERVICE_ROLE_KEY=your-service-role-key"
    exit 1
fi

echo -e "${GREEN}✓ 环境变量检查通过${NC}"
echo ""

# 提取项目ID
PROJECT_ID=$(echo $NEXT_PUBLIC_SUPABASE_URL | sed 's/https:\/\///' | sed 's/\.supabase\.co//')
echo "项目ID: $PROJECT_ID"
echo ""

# 检查必要的命令
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ 错误: 未找到 Node.js${NC}"
    echo "请先安装 Node.js: https://nodejs.org/"
    exit 1
fi

echo -e "${GREEN}✓ Node.js 已安装 ($(node --version))${NC}"
echo ""

# 执行SQL迁移
echo -e "${YELLOW}📊 步骤 1/3: 执行数据库迁移...${NC}"
echo ""

node << 'NODE_EOF'
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
    console.error('❌ 错误: 缺少环境变量');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function runMigration() {
    const sqlPath = path.join(__dirname, '..', 'supabase', 'migrations', '001_init.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    console.log('📄 读取 SQL 文件:', sqlPath);
    console.log('');
    
    // 尝试使用 rpc exec_sql
    try {
        const { data, error } = await supabase.rpc('exec_sql', { query: sql });
        
        if (error) {
            console.log('⚠️ exec_sql 失败，尝试备用方法...');
            console.log('错误:', error.message);
            
            // 备用：使用 REST API 直接查询
            const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
                method: 'POST',
                headers: {
                    'apikey': serviceRoleKey,
                    'Authorization': `Bearer ${serviceRoleKey}`,
                    'Content-Type': 'application/json',
                    'Prefer': 'tx=commit'
                },
                body: JSON.stringify({ query: sql })
            });
            
            if (!response.ok) {
                const text = await response.text();
                throw new Error(`API 错误: ${response.status} - ${text}`);
            }
            
            console.log('✓ 迁移执行成功');
        } else {
            console.log('✓ 迁移执行成功');
        }
    } catch (error) {
        console.error('❌ 迁移失败:', error.message);
        console.log('');
        console.log('${YELLOW}提示: 如果自动执行失败，请手动执行以下步骤:${NC}');
        console.log('1. 登录 https://supabase.com/dashboard');
        console.log('2. 选择项目:', supabaseUrl);
        console.log('3. 点击左侧 SQL Editor');
        console.log('4. 新建查询，粘贴 supabase/migrations/001_init.sql 的内容');
        console.log('5. 点击 Run');
        process.exit(1);
    }
}

runMigration();
NODE_EOF

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ 数据库迁移完成${NC}"
else
    echo -e "${RED}❌ 数据库迁移失败${NC}"
    exit 1
fi

echo ""

# 创建管理员用户
echo -e "${YELLOW}👤 步骤 2/3: 创建管理员用户...${NC}"
echo ""

read -p "请输入管理员邮箱 [admin@starfrom.ai]: " admin_email
admin_email=${admin_email:-admin@starfrom.ai}

read -sp "请输入管理员密码 [默认: StarFrom2025!]: " admin_password
echo
admin_password=${admin_password:-StarFrom2025!}

node << NODE_EOF
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
    },
});

async function createAdmin() {
    try {
        const { data, error } = await supabase.auth.admin.createUser({
            email: '$admin_email',
            password: '$admin_password',
            email_confirm: true,
        });

        if (error) {
            if (error.message.includes('already')) {
                console.log('⚠️ 用户已存在，跳过创建');
            } else {
                throw error;
            }
        } else {
            console.log('✓ 管理员用户创建成功');
            console.log('  邮箱:', data.user.email);
            console.log('  ID:', data.user.id);
        }
    } catch (error) {
        console.error('❌ 创建用户失败:', error.message);
        console.log('');
        console.log('备用方法：在 Supabase Dashboard → Authentication → Users 中手动创建用户');
        process.exit(1);
    }
}

createAdmin();
NODE_EOF

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ 管理员用户创建完成${NC}"
else
    echo -e "${RED}❌ 管理员用户创建失败${NC}"
fi

echo ""

# 验证数据库
echo -e "${YELLOW}🔍 步骤 3/3: 验证数据库...${NC}"
echo ""

node << NODE_EOF
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function verify() {
    try {
        // 检查模块表
        const { data: modules, error: modulesError } = await supabase
            .from('service_modules')
            .select('count');
        
        if (modulesError) throw modulesError;
        console.log('✓ service_modules 表正常');
        
        // 检查案例表
        const { data: cases, error: casesError } = await supabase
            .from('service_cases')
            .select('count');
        
        if (casesError) throw casesError;
        console.log('✓ service_cases 表正常');
        
        // 检查线索表
        const { data: leads, error: leadsError } = await supabase
            .from('service_leads')
            .select('count');
        
        if (leadsError) throw leadsError;
        console.log('✓ service_leads 表正常');
        
        // 检查诊断表
        const { data: diagnosis, error: diagnosisError } = await supabase
            .from('diagnosis_results')
            .select('count');
        
        if (diagnosisError) throw diagnosisError;
        console.log('✓ diagnosis_results 表正常');
        
        console.log('');
        console.log('✓ 所有表验证通过');
        
    } catch (error) {
        console.error('❌ 验证失败:', error.message);
        process.exit(1);
    }
}

verify();
NODE_EOF

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}🎉 数据库初始化完成！${NC}"
    echo ""
    echo "管理员登录信息:"
    echo "  邮箱: $admin_email"
    echo "  密码: $admin_password"
    echo ""
    echo "管理后台地址: /admin"
    echo ""
else
    echo ""
    echo -e "${RED}❌ 验证失败${NC}"
    exit 1
fi
