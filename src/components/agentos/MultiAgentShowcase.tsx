'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  MessageSquare, 
  Database, 
  FileText, 
  Calendar,
  Mail,
  CheckCircle2,
  ArrowRight
} from 'lucide-react'

const agents = [
  {
    id: 'cs',
    name: '客服Agent',
    icon: MessageSquare,
    department: '客服部',
    description: '处理客户咨询、售后问题、退换货',
    status: 'active',
    downstream: ['knowledge', 'scheduler']
  },
  {
    id: 'knowledge',
    name: '知识库Agent',
    icon: Database,
    department: '知识管理部',
    description: '检索企业知识库、产品文档、FAQ',
    status: 'active',
    downstream: ['writer']
  },
  {
    id: 'writer',
    name: '文案Agent',
    icon: FileText,
    department: '市场部',
    description: '生成营销文案、产品描述、邮件模板',
    status: 'standby',
    downstream: ['emailer']
  },
  {
    id: 'scheduler',
    name: '日程Agent',
    icon: Calendar,
    department: '行政部',
    description: '预约会议、安排日程、发送提醒',
    status: 'active',
    downstream: ['emailer']
  },
  {
    id: 'emailer',
    name: '邮件Agent',
    icon: Mail,
    department: '运营部',
    description: '发送邮件、跟进客户、收集反馈',
    status: 'standby',
    downstream: []
  }
]

export function MultiAgentShowcase() {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null)

  return (
    <section className="py-24 relative">
      <div className="container max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="badge-neon mb-4 inline-block">多Agent协作</span>
          <h2 className="font-display text-4xl md:text-5xl text-white mb-4">
            像搭积木一样编排AI工作流
          </h2>
          <p className="text-lg text-white/50 max-w-2xl mx-auto">
            不同部门的Agent可以相互调用，自动串联完成复杂任务
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            {agents.map((agent) => {
              const Icon = agent.icon
              const isSelected = selectedAgent === agent.id
              
              return (
                <Card
                  key={agent.id}
                  className={`p-5 cursor-pointer transition-all duration-300 ${
                    isSelected 
                      ? 'bg-blue-500/10 border-blue-500/30' 
                      : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04]'
                  }`}
                  onClick={() => setSelectedAgent(agent.id)}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      agent.status === 'active' ? 'bg-blue-500/20' : 'bg-white/5'
                    }`}>
                      <Icon className={`w-6 h-6 ${
                        agent.status === 'active' ? 'text-blue-400' : 'text-white/40'
                      }`} />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-white font-semibold">{agent.name}</span>
                        <span className="px-2 py-0.5 rounded-full bg-white/[0.05] text-white/40 text-xs">
                          {agent.department}
                        </span>
                        {agent.status === 'active' && (
                          <span className="w-2 h-2 bg-green-400 rounded-full" />
                        )}
                      </div>
                      <p className="text-white/40 text-sm mt-1">{agent.description}</p>
                    </div>

                    {agent.downstream.length > 0 && (
                      <div className="flex items-center gap-1">
                        <span className="text-white/30 text-xs">→</span>
                        <span className="text-blue-400 text-xs">{agent.downstream.length}个下游</span>
                      </div>
                    )}
                  </div>
                </Card>
              )
            })}
          </div>

          <div className="glass-card p-8">
            <h3 className="text-xl font-semibold text-white mb-6">示例：客户咨询自动处理流程</h3>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-400 text-sm font-bold">1</span>
                </div>
                <div>
                  <div className="text-white font-medium">客服Agent接收问题</div>
                  <p className="text-white/40 text-sm">&ldquo;我想了解你们的产品价格&rdquo;</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-400 text-sm font-bold">2</span>
                </div>
                <div>
                  <div className="text-white font-medium">知识库Agent检索</div>
                  <p className="text-white/40 text-sm">自动查询产品定价文档</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-400 text-sm font-bold">3</span>
                </div>
                <div>
                  <div className="text-white font-medium">文案Agent生成回复</div>
                  <p className="text-white/40 text-sm">根据检索结果生成专业回复</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-400 text-sm font-bold">4</span>
                </div>
                <div>
                  <div className="text-white font-medium">邮件Agent发送跟进</div>
                  <p className="text-white/40 text-sm">自动发送详细产品资料到客户邮箱</p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/[0.06]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                  <span className="text-white/60 text-sm">全流程自动化，无需人工干预</span>
                </div>
                <Button className="glow-btn text-white group" size="sm">
                  开始编排
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
