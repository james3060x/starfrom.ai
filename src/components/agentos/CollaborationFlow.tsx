'use client'

import { Card } from '@/components/ui/card'
import { 
  UserCog, 
  Users, 
  User,
  ArrowRight,
  GitBranch,
  MessageSquare,
  CheckCircle2
} from 'lucide-react'

export function CollaborationFlow() {
  return (
    <section className="py-24 relative bg-white/[0.01]">
      <div className="container max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="badge-pink mb-4 inline-block">团队协作</span>
          <h2 className="font-display text-4xl md:text-5xl text-white mb-4">
            三级权限，全员共建
          </h2>
          <p className="text-lg text-white/50 max-w-2xl mx-auto">
            从CEO到普通员工，每个角色都能在AgentOS中创造价值
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="glass-card p-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center mx-auto mb-6">
              <UserCog className="w-8 h-8 text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">管理员</h3>
            <ul className="space-y-2 text-left">
              <li className="flex items-center gap-2 text-white/60 text-sm">
                <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0" />
                Agent全景拓扑管理
              </li>
              <li className="flex items-center gap-2 text-white/60 text-sm">
                <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0" />
                跨部门工作流编排
              </li>
              <li className="flex items-center gap-2 text-white/60 text-sm">
                <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0" />
                成本看板与用量监控
              </li>
              <li className="flex items-center gap-2 text-white/60 text-sm">
                <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0" />
                模型网关与部署配置
              </li>
            </ul>
          </Card>

          <Card className="glass-card p-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-pink-500/10 flex items-center justify-center mx-auto mb-6">
              <Users className="w-8 h-8 text-pink-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">部门经理</h3>
            <ul className="space-y-2 text-left">
              <li className="flex items-center gap-2 text-white/60 text-sm">
                <CheckCircle2 className="w-4 h-4 text-pink-400 flex-shrink-0" />
                部门Agent配置管理
              </li>
              <li className="flex items-center gap-2 text-white/60 text-sm">
                <CheckCircle2 className="w-4 h-4 text-pink-400 flex-shrink-0" />
                员工贡献审核
              </li>
              <li className="flex items-center gap-2 text-white/60 text-sm">
                <CheckCircle2 className="w-4 h-4 text-pink-400 flex-shrink-0" />
                部门使用数据分析
              </li>
              <li className="flex items-center gap-2 text-white/60 text-sm">
                <CheckCircle2 className="w-4 h-4 text-pink-400 flex-shrink-0" />
                本部门成员邀请
              </li>
            </ul>
          </Card>

          <Card className="glass-card p-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-green-500/10 flex items-center justify-center mx-auto mb-6">
              <User className="w-8 h-8 text-green-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">普通员工</h3>
            <ul className="space-y-2 text-left">
              <li className="flex items-center gap-2 text-white/60 text-sm">
                <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                零门槛使用Agent
              </li>
              <li className="flex items-center gap-2 text-white/60 text-sm">
                <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                提交Prompt模板
              </li>
              <li className="flex items-center gap-2 text-white/60 text-sm">
                <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                上传知识文档
              </li>
              <li className="flex items-center gap-2 text-white/60 text-sm">
                <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                接收协作任务
              </li>
            </ul>
          </Card>
        </div>

        <div className="glass-card p-8">
          <h3 className="text-2xl font-semibold text-white mb-8 text-center">团队智慧共建机制</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-white/[0.05] flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-6 h-6 text-blue-400" />
              </div>
              <div className="text-white font-medium mb-2">员工提交</div>
              <p className="text-white/40 text-sm">Prompt / 知识 / 反馈</p>
            </div>

            <div className="flex items-center justify-center">
              <ArrowRight className="w-6 h-6 text-white/20 hidden md:block" />
              <div className="h-8 w-px bg-white/20 md:hidden" />
            </div>

            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-white/[0.05] flex items-center justify-center mx-auto mb-4">
                <GitBranch className="w-6 h-6 text-pink-400" />
              </div>
              <div className="text-white font-medium mb-2">经理审核</div>
              <p className="text-white/40 text-sm">批准 / 拒绝 / 修改</p>
            </div>

            <div className="flex items-center justify-center">
              <ArrowRight className="w-6 h-6 text-white/20 hidden md:block" />
              <div className="h-8 w-px bg-white/20 md:hidden" />
            </div>

            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-white/[0.05] flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-6 h-6 text-green-400" />
              </div>
              <div className="text-white font-medium mb-2">自动应用</div>
              <p className="text-white/40 text-sm">Agent实时学习升级</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
