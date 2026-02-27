/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { User, CreditCard, Key, Shield, Plus, Trash2, ExternalLink } from 'lucide-react'

interface ApiKey {
  id: string
  name: string
  key_prefix: string
  is_active: boolean | null
  last_used_at: string | null
  created_at: string | null
}

interface UserData {
  id?: string
  email?: string
}

interface UserPlan {
  agent_limit?: number
  storage_limit_gb?: number
  api_calls_limit?: number
}

export default function SettingsPage() {
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([])
  const [userPlan, setUserPlan] = useState<UserPlan | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/auth/login')
        return
      }

      setUser(user)

      const { data: plan } = await supabase
        .from('solo_users')
        .select('*')
        .eq('user_id', user.id)
        .single()

      setUserPlan(plan)

      const { data: keys }: any = await supabase
        .from('api_keys')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      setApiKeys(keys || [])
      setLoading(false)
    }

    fetchData()
  }, [router, supabase])

  const handleCreateApiKey = async () => {
    if (!user) return

    const keyName = prompt('请输入 API Key 名称：')
    if (!keyName) return

    const key = 'sk-' + Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2)
    const prefix = key.substring(0, 12)
    const keyHash = await hashKey(key)

    const { data, error }: any = await supabase
      .from('api_keys')
      .insert({
        user_id: user.id,
        name: keyName,
        key_hash: keyHash,
        prefix: prefix,
        scopes: ['read', 'write'],
        is_active: true,
      } as any)
      .select()
      .single()

    if (error) {
      toast.error('创建失败')
      return
    }

    toast.success(`API Key 创建成功: ${key}`)
    setApiKeys([data, ...apiKeys])
  }

  const hashKey = async (key: string): Promise<string> => {
    const encoder = new TextEncoder()
    const data = encoder.encode(key)
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  }

  const handleDeleteApiKey = async (id: string) => {
    if (!confirm('确定要删除这个 API Key 吗？')) return

    const { error } = await supabase
      .from('api_keys')
      .delete()
      .eq('id', id)

    if (error) {
      toast.error('删除失败')
      return
    }

    setApiKeys(apiKeys.filter(k => k.id !== id))
    toast.success('API Key 已删除')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400" />
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-white">设置</h1>
        <p className="text-slate-400">管理你的账户和 API</p>
      </div>

      <Card className="bg-slate-900/50 border-white/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <User className="w-5 h-5" />
            账户信息
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-2xl text-white font-bold">
              {user?.email?.[0]?.toUpperCase()}
            </div>
            <div>
              <p className="text-white font-medium">{user?.email}</p>
              <p className="text-sm text-slate-400">免费账户</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-900/50 border-white/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <CreditCard className="w-5 h-5" />
            套餐管理
          </CardTitle>
          <CardDescription className="text-slate-400">
            当前套餐信息和使用量
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-white/5 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-white font-medium">当前套餐</p>
                <p className="text-2xl font-bold text-cyan-400">Free Plan</p>
              </div>
              <Button className="bg-cyan-500 hover:bg-cyan-600">
                升级到 Solo
              </Button>
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-slate-400">Agent 额度</p>
                <p className="text-white">{userPlan?.agent_limit || 1} 个</p>
              </div>
              <div>
                <p className="text-slate-400">存储空间</p>
                <p className="text-white">{userPlan?.storage_limit_gb || 0.5} GB</p>
              </div>
              <div>
                <p className="text-slate-400">API 调用</p>
                <p className="text-white">{userPlan?.api_calls_limit || 1000} /月</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-900/50 border-white/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Key className="w-5 h-5" />
            API 密钥
          </CardTitle>
          <CardDescription className="text-slate-400">
            管理你的 API 密钥，用于通过代码访问 AgentOS
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {apiKeys.length === 0 ? (
              <p className="text-slate-400 text-center py-4">还没有 API 密钥</p>
            ) : (
              apiKeys.map((key) => (
                <div key={key.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div>
                    <p className="text-white font-medium">{key.name}</p>
                    <p className="text-sm text-slate-400">{key.key_prefix}... </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${key.is_active ? 'bg-green-400' : 'bg-slate-500'}`} />
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-slate-400 hover:text-red-400"
                      onClick={() => handleDeleteApiKey(key.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>

          <Button 
            onClick={handleCreateApiKey}
            className="mt-4 bg-cyan-500 hover:bg-cyan-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            创建 API 密钥
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-slate-900/50 border-white/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Shield className="w-5 h-5" />
            开发者集成
          </CardTitle>
          <CardDescription className="text-slate-400">
            MCP 配置和其他集成方式
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-white/5 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <p className="text-white font-medium">MCP 配置</p>
              <Button variant="outline" size="sm" className="border-white/10 text-white hover:bg-white/5">
                <ExternalLink className="w-3 h-3 mr-1" />
                查看文档
              </Button>
            </div>
            <p className="text-sm text-slate-400 mb-3">
              在 Claude Desktop 或 Cursor 中使用 MCP 协议连接 AgentOS
            </p>
            <code className="block p-3 bg-black/30 rounded text-xs text-slate-300 overflow-x-auto">
              {`{
  "mcpServers": {
    "starfrom": {
      "command": "npx",
      "args": ["-y", "@starfrom/mcp-server"],
      "env": {
        "STARFROM_API_KEY": "your-api-key"
      }
    }
  }
}`}
            </code>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
