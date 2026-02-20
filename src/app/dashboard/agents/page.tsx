'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Bot, MessageSquare, Edit, Trash2, MoreVertical } from 'lucide-react'
import { toast } from 'sonner'

interface Agent {
  id: string
  name: string
  description: string | null
  icon: string
  is_active: boolean
  model: string
  total_conversations: number
  total_messages: number
  last_used_at: string | null
  created_at: string
}

export default function AgentsPage() {
  const router = useRouter()
  const supabase = createClient()
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)
  const [agentLimit, setAgentLimit] = useState(1)
  const [currentUser, setCurrentUser] = useState<any>(null)

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/auth/login')
        return
      }

      setCurrentUser(user)

      const { data: soloUser } = await supabase
        .from('solo_users')
        .select('agent_limit')
        .eq('user_id', user.id)
        .single()

      setAgentLimit(soloUser?.agent_limit || 1)

      const { data: agentsData } = await supabase
        .from('user_agents')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      setAgents(agentsData || [])
      setLoading(false)
    }

    fetchData()
  }, [router, supabase])

  const handleDeleteAgent = async (agentId: string) => {
    if (!confirm('确定要删除这个 Agent 吗？此操作不可恢复。')) {
      return
    }

    const { error } = await supabase
      .from('user_agents')
      .delete()
      .eq('id', agentId)

    if (error) {
      toast.error('删除失败')
      return
    }

    setAgents(agents.filter(a => a.id !== agentId))
    toast.success('Agent 已删除')
  }

  const handleToggleAgent = async (agentId: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('user_agents')
      .update({ is_active: !currentStatus })
      .eq('id', agentId)

    if (error) {
      toast.error('更新失败')
      return
    }

    setAgents(agents.map(a => 
      a.id === agentId ? { ...a, is_active: !currentStatus } : a
    ))
    toast.success(!currentStatus ? 'Agent 已启用' : 'Agent 已禁用')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400" />
      </div>
    )
  }

  const canCreateMore = agents.length < agentLimit

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Agents</h1>
          <p className="text-slate-400">管理你的 AI 智能体</p>
        </div>

        {canCreateMore ? (
          <Link href="/dashboard/agents/new">
            <Button className="bg-cyan-500 hover:bg-cyan-600">
              <Plus className="w-4 h-4 mr-2" />
              创建 Agent
            </Button>
          </Link>
        ) : (
          <div className="text-right">
            <p className="text-orange-400 text-sm">已达上限</p>
            <Link href="/solo" className="text-cyan-400 text-sm hover:underline">
              升级解锁更多 →
            </Link>
          </div>
        )}
      </div>

      <div className="text-sm text-slate-400">
        已创建 {agents.length} / {agentLimit} 个 Agent
      </div>

      {agents.length === 0 ? (
        <Card className="bg-slate-900/50 border-white/5">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Bot className="w-16 h-16 text-slate-600 mb-4" />
            <h3 className="text-xl font-medium text-white mb-2">还没有 Agent</h3>
            <p className="text-slate-400 mb-6 text-center">
              创建你的第一个 AI 智能体<br />
              开始构建专属的 AI 助手
            </p>
            <Link href="/dashboard/agents/new">
              <Button className="bg-cyan-500 hover:bg-cyan-600">
                <Plus className="w-4 h-4 mr-2" />
                创建第一个 Agent
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {agents.map((agent) => (
            <Card key={agent.id} className="bg-slate-900/50 border-white/5 hover:border-white/10 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{agent.icon || '🤖'}</div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-white truncate">{agent.name}</h3>
                      <span className={`w-2 h-2 rounded-full ${agent.is_active ? 'bg-green-400' : 'bg-slate-500'}`} />
                    </div>
                    
                    {agent.description && (
                      <p className="text-sm text-slate-400 truncate mt-1">{agent.description}</p>
                    )}
                    
                    <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" />
                        {agent.total_conversations} 对话
                      </span>
                      <span>{agent.model}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/5">
                  <Link href={`/dashboard/chat/${agent.id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full border-white/10 text-white hover:bg-white/5">
                      <MessageSquare className="w-3 h-3 mr-1" />
                      对话
                    </Button>
                  </Link>
                  
                  <Link href={`/dashboard/agents/${agent.id}/edit`}>
                    <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </Link>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-slate-400 hover:text-red-400"
                    onClick={() => handleDeleteAgent(agent.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
