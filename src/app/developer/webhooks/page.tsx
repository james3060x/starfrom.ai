'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
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
import { Plus, Trash2, Webhook } from 'lucide-react'

interface Webhook {
  id: string
  name: string
  url: string
  events: string[]
  is_active: boolean
  created_at: string
}

const AVAILABLE_EVENTS = [
  { id: 'agent.message', label: 'Agent消息' },
  { id: 'workflow.completed', label: '工作流完成' },
  { id: 'workflow.failed', label: '工作流失败' },
  { id: 'session.created', label: '会话创建' },
  { id: 'knowledge.updated', label: '知识库更新' },
]

export default function WebhooksPage() {
  const [webhooks, setWebhooks] = useState<Webhook[]>([])
  const [, setWorkspaceId] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [newWebhook, setNewWebhook] = useState({
    name: '',
    url: '',
    events: [] as string[],
    secret: ''
  })

  useEffect(() => {
    async function loadWorkspaceAndWebhooks() {
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
        await loadWebhooks(ws.id)
      }
      setLoading(false)
    }

    loadWorkspaceAndWebhooks()
  }, [])

  async function loadWebhooks(wid: string) {
    const response = await fetch(`/api/v1/webhooks?workspace_id=${wid}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('temp_api_key') || 'test'}`
      }
    })
    const result = await response.json()
    
    if (result.success) {
      setWebhooks(result.data)
    }
  }

  function toggleEvent(eventId: string) {
    setNewWebhook(prev => ({
      ...prev,
      events: prev.events.includes(eventId)
        ? prev.events.filter(e => e !== eventId)
        : [...prev.events, eventId]
    }))
  }

  async function createWebhook() {
    if (!newWebhook.name.trim() || !newWebhook.url.trim() || newWebhook.events.length === 0) {
      toast.error('请填写完整信息')
      return
    }

    toast.success('Webhook创建成功（演示模式）')
    setIsCreateOpen(false)
    setNewWebhook({ name: '', url: '', events: [], secret: '' })
  }

  async function deleteWebhook(webhookId: string) {
    if (!confirm('确定要删除此Webhook吗？')) return
    console.log('Would delete webhook:', webhookId)
    toast.success('Webhook已删除（演示模式）')
  }

  if (loading) {
    return <div className="text-center py-12">加载中...</div>
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Webhook 管理</h2>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#06b6d4] hover:bg-[#0891b2]">
              <Plus className="w-4 h-4 mr-2" />
              添加Webhook
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>配置Webhook</DialogTitle>
              <DialogDescription>
                接收AgentOS事件的实时推送
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="name">名称</Label>
                <Input
                  id="name"
                  value={newWebhook.name}
                  onChange={(e) => setNewWebhook({ ...newWebhook, name: e.target.value })}
                  placeholder="例如：生产环境通知"
                />
              </div>
              <div>
                <Label htmlFor="url">接收URL</Label>
                <Input
                  id="url"
                  value={newWebhook.url}
                  onChange={(e) => setNewWebhook({ ...newWebhook, url: e.target.value })}
                  placeholder="https://your-app.com/webhook"
                />
              </div>
              <div>
                <Label>订阅事件</Label>
                <div className="space-y-2 mt-2">
                  {AVAILABLE_EVENTS.map(event => (
                    <div key={event.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={event.id}
                        checked={newWebhook.events.includes(event.id)}
                        onCheckedChange={() => toggleEvent(event.id)}
                      />
                      <Label htmlFor={event.id} className="cursor-pointer text-sm">
                        {event.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <Label htmlFor="secret">签名密钥（可选）</Label>
                <Input
                  id="secret"
                  type="password"
                  value={newWebhook.secret}
                  onChange={(e) => setNewWebhook({ ...newWebhook, secret: e.target.value })}
                  placeholder="用于验证Webhook签名"
                />
                <p className="text-xs text-gray-500 mt-1">
                  设置后，我们会使用HMAC-SHA256对请求体签名
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>取消</Button>
              <Button onClick={createWebhook} className="bg-[#06b6d4] hover:bg-[#0891b2]">创建</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <Webhook className="w-8 h-8 text-[#06b6d4] mt-1" />
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">关于Webhook</h3>
              <p className="text-sm text-gray-600 mb-2">
                Webhook允许您在特定事件发生时接收实时通知。我们会向您配置的URL发送HTTP POST请求。
              </p>
              <p className="text-sm text-gray-600">
                每个请求都包含 X-StarFrom-Signature 头部，您可以使用签名密钥验证请求的真实性。
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {webhooks.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-500">暂无Webhook配置，点击上方按钮添加。</p>
            </CardContent>
          </Card>
        ) : (
          webhooks.map((webhook) => (
            <Card key={webhook.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-900">{webhook.name}</h3>
                      <span className={`px-2 py-0.5 text-xs rounded ${
                        webhook.is_active 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {webhook.is_active ? '启用' : '禁用'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{webhook.url}</p>
                    <div className="flex flex-wrap gap-2">
                      {webhook.events.map(event => (
                        <span key={event} className="px-2 py-0.5 text-xs bg-gray-100 rounded">
                          {event}
                        </span>
                      ))}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteWebhook(webhook.id)}
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
    </div>
  )
}
