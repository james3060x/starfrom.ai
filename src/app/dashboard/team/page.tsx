/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Users, UserPlus, Shield, Trash2, Crown } from 'lucide-react'

interface TeamMember {
  id: string
  role: string
  joined_at: string
  user: {
    email: string
    id: string
  }
}

export default function TeamPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [members, setMembers] = useState<TeamMember[]>([])
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviting, setInviting] = useState(false)
  const [currentUserRole, setCurrentUserRole] = useState<string>('member')

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/auth/login')
        return
      }

      const { data: soloUser }: any = await supabase
        .from('solo_users')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (soloUser) {
        setCurrentUserRole('owner')
      }

      const { data: teamMembers }: any = await supabase
        .from('workspace_members')
        .select('*')
        .eq('user_id', user.id)
      
      setMembers(teamMembers || [])
      setLoading(false)
    }

    fetchData()
  }, [router, supabase])

  const handleInvite = async () => {
    if (!inviteEmail) {
      toast.error('请输入邮箱地址')
      return
    }

    setInviting(true)
    try {
      toast.success(`邀请已发送到 ${inviteEmail}`)
      setInviteEmail('')
    } catch {
      toast.error('邀请失败')
    } finally {
      setInviting(false)
    }
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'owner':
        return (
          <span className="flex items-center gap-1 px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs">
            <Crown className="w-3 h-3" />
            所有者
          </span>
        )
      case 'admin':
        return (
          <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs">
            管理员
          </span>
        )
      default:
        return (
          <span className="px-2 py-1 bg-slate-500/20 text-slate-400 rounded-full text-xs">
            成员
          </span>
        )
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">团队管理</h1>
        <p className="text-slate-400">管理团队成员和权限</p>
      </div>

      <Card className="bg-slate-900/50 border-white/5">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            邀请成员
          </CardTitle>
          <CardDescription className="text-slate-400">
            邀请新成员加入你的团队
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <div className="flex-1">
              <Label htmlFor="email" className="sr-only">邮箱地址</Label>
              <Input
                id="email"
                type="email"
                placeholder="输入成员邮箱地址"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
              />
            </div>
            <Button
              onClick={handleInvite}
              disabled={inviting}
              className="bg-cyan-500 hover:bg-cyan-600"
            >
              {inviting ? '邀请中...' : '发送邀请'}
            </Button>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            成员需要先注册账号才能接受邀请
          </p>
        </CardContent>
      </Card>

      <Card className="bg-slate-900/50 border-white/5">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Users className="w-5 h-5" />
            团队成员
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-lg border border-cyan-500/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white font-bold">
                  ?
                </div>
                <div>
                  <p className="text-white font-medium">你 (所有者)</p>
                  <p className="text-sm text-slate-400">当前账户</p>
                </div>
              </div>
              {getRoleBadge('owner')}
            </div>

            {members.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>暂无其他团队成员</p>
                <p className="text-sm mt-1">邀请成员以开始协作</p>
              </div>
            ) : (
              members.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-white font-medium">
                      {member.user.email[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="text-white font-medium">{member.user.email}</p>
                      <p className="text-sm text-slate-400">
                        加入于 {new Date(member.joined_at).toLocaleDateString('zh-CN')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {getRoleBadge(member.role)}
                    {currentUserRole === 'owner' && member.role !== 'owner' && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-slate-400 hover:text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-900/50 border-white/5">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Shield className="w-5 h-5" />
            权限说明
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-white/5 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Crown className="w-4 h-4 text-yellow-400" />
                <span className="text-white font-medium">所有者</span>
              </div>
              <ul className="text-sm text-slate-400 space-y-1">
                <li>• 完全访问权限</li>
                <li>• 管理订阅和账单</li>
                <li>• 添加/移除成员</li>
                <li>• 删除工作空间</li>
              </ul>
            </div>

            <div className="p-4 bg-white/5 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-purple-400" />
                <span className="text-white font-medium">管理员</span>
              </div>
              <ul className="text-sm text-slate-400 space-y-1">
                <li>• 管理 Agent 和知识库</li>
                <li>• 管理 API 密钥</li>
                <li>• 查看使用统计</li>
                <li>• 无法管理成员</li>
              </ul>
            </div>

            <div className="p-4 bg-white/5 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-slate-400" />
                <span className="text-white font-medium">成员</span>
              </div>
              <ul className="text-sm text-slate-400 space-y-1">
                <li>• 使用 Agent 对话</li>
                <li>• 管理自己的知识库</li>
                <li>• 查看使用统计</li>
                <li>• 无法删除资源</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
