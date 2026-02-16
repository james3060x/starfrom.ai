'use client'

import { MessageSquare, BookOpen, Workflow } from 'lucide-react'

const painPoints = [
  {
    icon: MessageSquare,
    title: '客服回复慢，人力成本高',
    solution: 'AI 智能客服',
    description: '80% 常见问题由 AI 自动回复，7×24 小时在线服务，大幅降低人力成本',
    stat: '效率提升 300%',
  },
  {
    icon: BookOpen,
    title: '知识分散，员工重复提问',
    solution: 'RAG 知识库',
    description: '企业知识统一管理，员工随时提问，秒级获取精准答案，知识沉淀复用',
    stat: '查询效率提升 5 倍',
  },
  {
    icon: Workflow,
    title: '重复审批，流程拖沓',
    solution: 'SOP 自动化',
    description: '标准化审批流程自动化处理，让团队专注于核心工作，不再被琐事困扰',
    stat: '效率提升 80%',
  },
]

export function PainPoints() {
  return (
    <section className="relative py-32">
      <div className="container max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-20">
          <span className="badge-neon mb-6">
            痛点解决
          </span>
          <h2 className="font-display text-4xl md:text-5xl text-white mb-5">
            这些问题是否困扰着您？
          </h2>
          <p className="text-lg text-white/40 max-w-2xl mx-auto font-light">
            我们帮助中小企业解决日常运营中的效率瓶颈
          </p>
        </div>
        
        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {painPoints.map((item, index) => (
            <div
              key={index}
              className="group"
            >
              <div className="glass-card p-8 card-hover h-full flex flex-col">
                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-6 group-hover:bg-blue-500/15 transition-colors">
                  <item.icon className="w-6 h-6 text-blue-400" />
                </div>
                
                {/* Content */}
                <h3 className="text-xl font-semibold text-white mb-3">
                  {item.title}
                </h3>
                
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-white/30">→</span>
                  <span className="text-blue-400 text-sm font-medium">{item.solution}</span>
                </div>
                
                <p className="text-white/50 text-sm leading-relaxed mb-6 flex-grow">
                  {item.description}
                </p>
                
                {/* Stat */}
                <div className="pt-6 border-t border-white/[0.06]">
                  <span className="gold-text text-sm font-semibold">{item.stat}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
