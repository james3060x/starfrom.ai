'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Copy, Trash2, Plus, Eye, EyeOff } from 'lucide-react'

interface ApiKey {
  id: string
  name: string
  prefix: string
  scopes: string[]
  is_active: boolean
  last_used_at: string | null
  created_at: string
  expires_at: string | null
  rate_limit_rpm: number
}

export default function DeveloperPage() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([])
  const [workspaceId, setWorkspaceId] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [showNewKey, setShowNewKey] = useState(false)
  const [newKey, setNewKey] = useState('')
  const [showKeyValue, setShowKeyValue] = useState(false)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [newKeyName, setNewKeyName] = useState('')
  const [newKeyScopes, setNewKeyScopes] = useState({ read: true, write: false })

  useEffect(() => {
    async function loadWorkspaceAndKeys() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) return

      const { data: workspace } = await supabase
        .from('workspaces')
        .select('id')
        .eq('owner_id', user.id)
        .single()

      const ws = workspace as { id: string } | null
      if (ws && ws.id) {
        setWorkspaceId(ws.id)
        await loadApiKeys(ws.id)
      }
      setLoading(false)
    }

    loadWorkspaceAndKeys()
  }, [])

  async function loadApiKeys(wid: string) {
    const response = await fetch(`/api/internal/api-keys?workspace_id=${wid}`)
    const result = await response.json()
    
    if (result.success) {
      setApiKeys(result.data)
    }
  }

  async function createApiKey() {
    if (!newKeyName.trim()) {
      toast.error('请输入密钥名称')
      return
    }

    const scopes = []
    if (newKeyScopes.read) scopes.push('read')
    if (newKeyScopes.write) scopes.push('write')

    const response = await fetch('/api/internal/api-keys', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        workspace_id: workspaceId,
        name: newKeyName,
        scopes
      })
    })

    const result = await response.json()

    if (result.success) {
      setNewKey(result.data.api_key)
      setShowNewKey(true)
      setIsCreateOpen(false)
      toast.success('API密钥创建成功')
      await loadApiKeys(workspaceId)
    } else {
      toast.error(result.error || '创建失败')
    }
  }

  async function deleteApiKey(keyId: string) {
    if (!confirm('确定要删除此API密钥吗？此操作不可撤销。')) return

    const response = await fetch(`/api/internal/api-keys?id=${keyId}&workspace_id=${workspaceId}`, {
      method: 'DELETE'
    })

    if (response.ok) {
      toast.success('API密钥已删除')
      await loadApiKeys(workspaceId)
    } else {
      toast.error('删除失败')
    }
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text)
    toast.success('已复制到剪贴板')
  }

  if (loading) {
    return <div className="text-center py-12">加载中...</div>
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">API密钥管理</h2>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#06b6d4] hover:bg-[#0891b2]">
              <Plus className="w-4 h-4 mr-2" />
              创建新密钥
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>创建API密钥</DialogTitle>
              <DialogDescription>
                创建后请立即复制密钥，密钥只会显示一次。
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="name">密钥名称</Label>
                <Input
                  id="name"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  placeholder="例如：生产环境密钥"
                />
              </div>
              <div>
                <Label>权限范围</Label>
                <div className="space-y-2 mt-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="read"
                      checked={newKeyScopes.read}
                      onCheckedChange={(checked) =>
                        setNewKeyScopes({ ...newKeyScopes, read: checked as boolean })
                      }
                    />
                    <Label htmlFor="read" className="cursor-pointer">读取权限（调用查询接口）</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="write"
                      checked={newKeyScopes.write}
                      onCheckedChange={(checked) =>
                        setNewKeyScopes({ ...newKeyScopes, write: checked as boolean })
                      }
                    />
                    <Label htmlFor="write" className="cursor-pointer">写入权限（修改数据、触发工作流）</Label>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>取消</Button>
              <Button onClick={createApiKey} className="bg-[#06b6d4] hover:bg-[#0891b2]">创建</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {showNewKey && (
        <Card className="mb-6 border-yellow-400 bg-yellow-50">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="font-semibold text-yellow-900 mb-2">请立即复制您的新API密钥！</p>
                <p className="text-sm text-yellow-700 mb-4">密钥只会显示这一次，离开此页面后将无法再次查看。</p>
                <div className="flex items-center gap-2 bg-white p-3 rounded border">
                  <code className="flex-1 font-mono text-sm">
                    {showKeyValue ? newKey : 'sk-' + '•'.repeat(60)}
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowKeyValue(!showKeyValue)}
                  >
                    {showKeyValue ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(newKey)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowNewKey(false)}
                className="text-yellow-700"
              >
                我已保存
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {apiKeys.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-500">暂无API密钥，点击上方按钮创建第一个密钥。</p>
            </CardContent>
          </Card>
        ) : (
          apiKeys.map((key) => (
            <Card key={key.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-900">{key.name}</h3>
                      <span className={`px-2 py-0.5 text-xs rounded ${
                        key.is_active 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {key.is_active ? '启用' : '禁用'}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <code className="font-mono">{key.prefix}...</code>
                      <span>•</span>
                      <span>{key.scopes.join(', ')}</span>
                      <span>•</span>
                      <span>限速: {key.rate_limit_rpm} 请求/分钟</span>
                    </div>
                    <div className="text-xs text-gray-400 mt-2">
                      创建于 {new Date(key.created_at).toLocaleDateString('zh-CN')}
                      {key.last_used_at && (
                        <span className="ml-4">
                          最后使用: {new Date(key.last_used_at).toLocaleString('zh-CN')}
                        </span>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteApiKey(key.id)}
                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>API使用说明</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">认证方式</h4>
            <p className="text-sm text-gray-600 mb-2">在请求头中添加 Authorization:</p>
            <code className="block bg-gray-100 p-3 rounded text-sm font-mono">
              Authorization: Bearer sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
            </code>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">速率限制</h4>
            <p className="text-sm text-gray-600">每个API密钥默认限制为 60 请求/分钟。如需提高限制，请联系支持团队。</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">API端点</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li><code className="bg-gray-100 px-1 rounded">POST /api/v1/agents/{'{agent_id}'}/chat</code> - 与Agent对话</li>
              <li><code className="bg-gray-100 px-1 rounded">GET /api/v1/agents/{'{agent_id}'}/knowledge</code> - 获取知识源列表</li>
              <li><code className="bg-gray-100 px-1 rounded">POST /api/v1/workflows/{'{workflow_id}'}/trigger</code> - 触发工作流</li>
              <li><code className="bg-gray-100 px-1 rounded">GET /api/v1/sessions/{'{session_id}'}/messages</code> - 获取会话消息</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
