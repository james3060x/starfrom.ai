/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Bot, MessageSquare, Zap, ArrowRight, Plus } from 'lucide-react'

interface DashboardStats {
  agentCount: number
  agentLimit: number
  conversationCount: number
  apiCallsCount: number
  storageUsed: number
  storageLimit: number
}

interface RecentAgent {
  id: string
  name: string
  icon: string
  last_used_at: string | null
}

export default function DashboardPage() {
  const supabase = createClient()
  const [stats, setStats] = useState<DashboardStats>({
    agentCount: 0,
    agentLimit: 1,
    conversationCount: 0,
    apiCallsCount: 0,
    storageUsed: 0,
    storageLimit: 0.5
  })
  const [recentAgents, setRecentAgents] = useState<RecentAgent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) return

      const { data: soloUser }: any = await supabase
        .from('solo_users')
        .select('*')
        .eq('user_id', user.id)
        .single()

      const { data: agents }: any = await supabase
        .from('user_agents')
        .select('*')
        .eq('user_id', user.id)
        .order('last_used_at', { ascending: false })
        .limit(5)

      const { data: conversations } = await supabase
        .from('user_conversations')
        .select('id', { count: 'exact' })
        .eq('user_id', user.id)

      setStats({
        agentCount: agents?.length || 0,
        agentLimit: soloUser?.agent_limit || 1,
        conversationCount: conversations?.length || 0,
        apiCallsCount: soloUser?.total_api_calls || 0,
        storageUsed: soloUser?.total_api_calls ? soloUser.total_api_calls * 0.001 : 0,
        storageLimit: soloUser?.storage_limit_gb || 0.5
      })

      setRecentAgents(agents?.map((a: any) => ({
        id: a.id,
        name: a.name,
        icon: a.icon || '🤖',
        last_used_at: a.last_used_at
      })) || [])

      setLoading(false)
    }

    fetchData()
  }, [supabase])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">欢迎回来！</h1>
        <p className="text-slate-400">管理和监控你的 AI Agents</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-slate-900/50 border-white/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Agents</CardTitle>
            <Bot className="w-4 h-4 text-cyan-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {stats.agentCount} / {stats.agentLimit}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {stats.agentCount >= stats.agentLimit ? '已达上限' : '还可创建'}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-white/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">对话次数</CardTitle>
            <MessageSquare className="w-4 h-4 text-pink-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {stats.conversationCount}
            </div>
            <p className="text-xs text-slate-500 mt-1">历史总计</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-white/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">API 调用</CardTitle>
            <Zap className="w-4 h-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {stats.apiCallsCount.toLocaleString()}
            </div>
            <p className="text-xs text-slate-500 mt-1">本月使用</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-white/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">存储空间</CardTitle>
            <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {stats.storageUsed.toFixed(2)} GB
            </div>
            <p className="text-xs text-slate-500 mt-1">上限 {stats.storageLimit} GB</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="bg-slate-900/50 border-white/5">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-white">最近使用的 Agents</CardTitle>
              <Link
                href="/dashboard/agents"
                className="text-sm text-cyan-400 hover:underline flex items-center gap-1"
              >
                查看全部 <ArrowRight className="w-4 h-4" />
              </Link>
            </CardHeader>
            <CardContent>
              {recentAgents.length === 0 ? (
                <div className="text-center py-8">
                  <Bot className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400 mb-4">还没有创建 Agent</p>
                  <Link
                    href="/dashboard/agents/new"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    创建第一个 Agent
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {recentAgents.map((agent) => (
                    <Link
                      key={agent.id}
                      href={`/dashboard/chat/${agent.id}`}
                      className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      <span className="text-2xl">{agent.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium truncate">{agent.name}</p>
                        <p className="text-xs text-slate-500">
                          {agent.last_used_at
                            ? new Date(agent.last_used_at).toLocaleDateString('zh-CN')
                            : '未使用'}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="bg-slate-900/50 border-white/5">
            <CardHeader>
              <CardTitle className="text-white">快速操作</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link
                href="/dashboard/agents/new"
                className="flex items-center gap-3 p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/20 hover:bg-cyan-500/20 transition-colors"
              >
                <Plus className="w-5 h-5 text-cyan-400" />
                <span className="text-white">创建新 Agent</span>
              </Link>
              
              <Link
                href="/dashboard/knowledge"
                className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
              >
                <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <span className="text-white">管理知识库</span>
              </Link>
              
              <Link
                href="/dashboard/settings"
                className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
              >
                <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
                <span className="text-white">API 设置</span>
              </Link>

              <Link
                href="/demo"
                target="_blank"
                className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
              >
                <MessageSquare className="w-5 h-5 text-pink-400" />
                <span className="text-white">体验 Demo</span>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
